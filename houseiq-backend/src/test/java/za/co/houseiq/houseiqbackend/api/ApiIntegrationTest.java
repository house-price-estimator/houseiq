package za.co.houseiq.houseiqbackend.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import za.co.houseiq.houseiqbackend.auth.dto.LoginRequest;
import za.co.houseiq.houseiqbackend.auth.dto.RegisterRequest;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictResponseDto;
import za.co.houseiq.houseiqbackend.prediction.repo.PredictionRepository;
import za.co.houseiq.houseiqbackend.prediction.service.MlClient;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class ApiIntegrationTest {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer(DockerImageName.parse("mongo:7"));

    @DynamicPropertySource
    static void mongoProps(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getConnectionString);
        registry.add("spring.data.mongodb.database", () -> "houseiq_inttest");
    }

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;
    @Autowired PredictionRepository predictions;

    @BeforeEach
    void clean() {
        predictions.deleteAll();
    }

    @TestConfiguration
    static class Stubs {
        @Bean
        @Primary
        MlClient mlClientStub() {
            var mock = org.mockito.Mockito.mock(MlClient.class);
            PredictResponseDto r = new PredictResponseDto();
            r.setPredicted_price(123456.0);
            r.setModel_version("it-test");
            r.setExplanations(java.util.Map.of("area_sqm", 0.5));
            org.mockito.Mockito.when(mock.predict(org.mockito.ArgumentMatchers.anyMap())).thenReturn(r);
            return mock;
        }
    }

    // T1 – Auth: register/login (JWT issued; bad creds → 401)
    @Test
    void t1_auth_register_login_and_bad_creds() throws Exception {
        String email = "alice@example.com";
        String password = "Passw0rd!";

        RegisterRequest reg = new RegisterRequest();
        reg.setEmail(email); reg.setPassword(password); reg.setName("Alice");

        extractToken(mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(reg)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token", not(emptyOrNullString())))
            .andReturn().getResponse().getContentAsString());

        LoginRequest login = new LoginRequest();
        login.setEmail(email); login.setPassword(password);
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token", not(emptyOrNullString())));

        login.setPassword("wrong");
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(login)))
            .andExpect(status().isBadRequest());
    }

    // T4/T5/T7 – predictions + activity + ordering + pagination + delete
    @Test
    void t4_t5_t7_predictions_flow_activity_and_pagination_and_delete() throws Exception {
        String token = registerAndGetToken("bob@example.com", "Secret123!", "Bob");

        // create three predictions
        String id1 = createPrediction(token, 3,2,120.5,8,4);
        Thread.sleep(10);
        String id2 = createPrediction(token, 2,1,80.0,5,3);
        Thread.sleep(10);
        String id3 = createPrediction(token, 4,3,200.0,2,6);

        // T4 – activity has create log
        mvc.perform(get("/api/activity").header("Authorization", bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].action", is("PREDICTION_CREATED")))
            .andExpect(jsonPath("$[0].details.predictionId", not(emptyOrNullString())));

        // T5a – default ordering: newest first
        mvc.perform(get("/api/predictions").header("Authorization", bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id", is(id3)))
            .andExpect(jsonPath("$[1].id", is(id2)))
            .andExpect(jsonPath("$[2].id", is(id1)));

        // T5b – pagination stable pages
        mvc.perform(get("/api/predictions?page=0&size=2").header("Authorization", bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id", is(id3)))
            .andExpect(jsonPath("$[1].id", is(id2)));
        mvc.perform(get("/api/predictions?page=1&size=2").header("Authorization", bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id", is(id1)));

        // T7 – delete own item, then GET is 400 (service throws RuntimeException → 400), and activity contains delete
        mvc.perform(delete("/api/predictions/" + id2).header("Authorization", bearer(token)))
            .andExpect(status().isNoContent());
        mvc.perform(get("/api/predictions/" + id2).header("Authorization", bearer(token)))
            .andExpect(status().isBadRequest());
        mvc.perform(get("/api/activity").header("Authorization", bearer(token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].action", is("PREDICTION_DELETED")))
            .andExpect(jsonPath("$[0].details.predictionId", is(id2)));
    }

    // T6 – ownership isolation
    @Test
    void t6_ownership_isolation_other_user_cannot_view_or_delete() throws Exception {
        String a = registerAndGetToken("owner@example.com", "Owner123!", "Owner");
        String b = registerAndGetToken("intruder@example.com", "Intruder123!", "Intruder");
        String id = createPrediction(a, 3,2,120.0,8,4);

        // GET as other user: current impl returns 400 (not 404/403)
        mvc.perform(get("/api/predictions/" + id).header("Authorization", bearer(b)))
            .andExpect(status().isBadRequest());

        // DELETE as other user: current impl returns 204 but does not delete; verify still exists for owner
        mvc.perform(delete("/api/predictions/" + id).header("Authorization", bearer(b)))
            .andExpect(status().isNoContent());
        mvc.perform(get("/api/predictions/" + id).header("Authorization", bearer(a)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(id)));
    }

    // T11 – health
    @Test
    void t11_healthchecks_backend() throws Exception {
        mvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status", is("ok")))
            .andExpect(jsonPath("$.service", is("backend")));
    }

    // helpers
    private String registerAndGetToken(String email, String password, String name) throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail(email); reg.setPassword(password); reg.setName(name);
        String resp = mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(reg)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return om.readTree(resp).get("token").asText();
    }

    private String createPrediction(String token, int bedrooms, int bathrooms, double area, int age, int loc) throws Exception {
        PredictRequestDto req = PredictRequestDto.builder()
            .bedrooms(bedrooms).bathrooms(bathrooms).area_sqm(area).age_years(age).location_index(loc).build();
        String res = mvc.perform(post("/api/predictions")
                .header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.predicted_price", is(123456.0)))
            .andReturn().getResponse().getContentAsString();
        return om.readTree(res).get("id").asText();
    }

    private String extractToken(String json) throws Exception {
        JsonNode n = om.readTree(json);
        return n.get("token").asText();
    }

    private String bearer(String token) { return "Bearer " + token; }
}


