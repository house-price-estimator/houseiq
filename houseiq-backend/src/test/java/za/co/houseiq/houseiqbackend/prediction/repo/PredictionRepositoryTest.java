package za.co.houseiq.houseiqbackend.prediction.repo;

import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import za.co.houseiq.houseiqbackend.prediction.model.Prediction;

@DataMongoTest
@Testcontainers
class PredictionRepositoryTest {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer(DockerImageName.parse("mongo:7"));

    @DynamicPropertySource
    static void mongoProps(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getConnectionString);
        registry.add("spring.data.mongodb.database", () -> "houseiq_test");
    }

    @Autowired
    PredictionRepository repo;

    @Test
    void findByOwnerIdOrderByCreatedAtDesc_works() {
        repo.deleteAll();

        Instant t1 = Instant.parse("2024-01-01T00:00:00Z");
        Instant t3 = Instant.parse("2024-01-03T00:00:00Z");

        Prediction a = Prediction.builder()
            .ownerId("u1")
            .features(Map.of("bedrooms", 3))
            .predictedPrice(100)
            .modelVersion("v1")
            .explanations(Map.of())
            .createdAt(t1)
            .updatedAt(t1)
            .version(1)
            .build();
        Prediction b = Prediction.builder()
            .ownerId("u1")
            .features(Map.of("bedrooms", 4))
            .predictedPrice(200)
            .modelVersion("v1")
            .explanations(Map.of())
            .createdAt(t3)
            .updatedAt(t3)
            .version(1)
            .build();
        Prediction c = Prediction.builder()
            .ownerId("u2")
            .features(Map.of("bedrooms", 2))
            .predictedPrice(150)
            .modelVersion("v1")
            .explanations(Map.of())
            .createdAt(t3)
            .updatedAt(t3)
            .version(1)
            .build();

        repo.saveAll(List.of(a, b, c));

        var page = repo.findByOwnerIdOrderByCreatedAtDesc("u1", PageRequest.of(0, 10));
        assertEquals(2, page.size());
        assertEquals(200, page.get(0).getPredictedPrice());
        assertEquals(100, page.get(1).getPredictedPrice());
    }
}


