package za.co.houseiq.houseiqbackend.api;

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
import za.co.houseiq.houseiqbackend.auth.dto.RegisterRequest;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.service.MlClient;
import za.co.houseiq.houseiqbackend.prediction.repo.PredictionRepository;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class ApiResilienceUnavailableIntegrationTest {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer(DockerImageName.parse("mongo:7"));

    @DynamicPropertySource
    static void mongoProps(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getConnectionString);
        registry.add("spring.data.mongodb.database", () -> "houseiq_it_unavail");
    }

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;
    @Autowired PredictionRepository predictions;

    @BeforeEach
    void clean() { predictions.deleteAll(); }

    @TestConfiguration
    static class UnavailStub {
        @Bean
        @Primary
        MlClient mlClientStub() {
            var mock = org.mockito.Mockito.mock(MlClient.class);
            org.mockito.Mockito.when(mock.predict(org.mockito.ArgumentMatchers.anyMap()))
                .thenThrow(new RuntimeException("ML service error: connection refused"));
            return mock;
        }
    }

    @Test
    void t14_ml_unavailable_no_db_write() throws Exception {
        String token = registerAndGetToken("t14@example.com", "Secret1!", "T14");
        PredictRequestDto req = PredictRequestDto.builder().bedrooms(3).bathrooms(2).area_sqm(120.5).age_years(8).location_index(4).build();
        mvc.perform(post("/api/predictions").header("Authorization", bearer(token)).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString("ML service error")));
        org.junit.jupiter.api.Assertions.assertEquals(0, predictions.count());
    }

    private String registerAndGetToken(String email, String password, String name) throws Exception {
        RegisterRequest reg = new RegisterRequest(); reg.setEmail(email); reg.setPassword(password); reg.setName(name);
        String resp = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsString(reg)))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return om.readTree(resp).get("token").asText();
    }
    private String bearer(String token) { return "Bearer " + token; }
}


