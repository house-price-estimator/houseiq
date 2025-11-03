package za.co.houseiq.houseiqbackend.api;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import za.co.houseiq.houseiqbackend.auth.dto.RegisterRequest;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictResponseDto;
import za.co.houseiq.houseiqbackend.prediction.service.MlClient;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class ApiExplainabilityWithExplIntegrationTest {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer(DockerImageName.parse("mongo:7"));

    @DynamicPropertySource
    static void mongoProps(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getConnectionString);
        registry.add("spring.data.mongodb.database", () -> "houseiq_it_expl_with");
    }

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    @TestConfiguration
    static class WithExplStubCfg {
        @Bean
        @Primary
        MlClient mlClientStub() {
            PredictResponseDto r = new PredictResponseDto();
            r.setPredicted_price(111.0);
            r.setModel_version("with-expl");
            r.setExplanations(java.util.Map.of("area_sqm", 0.7, "bedrooms", 0.2, "bathrooms", 0.1));
            var mock = org.mockito.Mockito.mock(MlClient.class);
            org.mockito.Mockito.when(mock.predict(org.mockito.ArgumentMatchers.anyMap())).thenReturn(r);
            return mock;
        }
    }

    @Test
    void t9_with_explanations_included() throws Exception {
        String token = registerAndGetToken("explw@example.com", "Secret1!", "ExplW");
        PredictRequestDto req = PredictRequestDto.builder().bedrooms(3).bathrooms(2).area_sqm(120.5).age_years(8).location_index(4).build();
        mvc.perform(post("/api/predictions").header("Authorization", bearer(token)).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.predicted_price", is(111.0)))
            .andExpect(jsonPath("$.model_version", is("with-expl")))
            .andExpect(jsonPath("$.explanations.area_sqm", is(0.7)));
    }

    private String registerAndGetToken(String email, String password, String name) throws Exception {
        RegisterRequest reg = new RegisterRequest(); reg.setEmail(email); reg.setPassword(password); reg.setName(name);
        String resp = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsString(reg)))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return om.readTree(resp).get("token").asText();
    }
    private String bearer(String token) { return "Bearer " + token; }
}


