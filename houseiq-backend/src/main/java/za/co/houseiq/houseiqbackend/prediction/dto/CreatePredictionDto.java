package za.co.houseiq.houseiqbackend.prediction.dto;

import java.time.Instant;
import java.util.Map;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreatePredictionDto {
    private String id;
    private Map<String, Object> features;
    private double predicted_price;
    private String model_version;
    private Map<String, Double> explanations;
    private Instant createdAt;
    private Instant updatedAt;
    private int version;
}
