package za.co.houseiq.houseiqbackend.prediction.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class PredictResponseDto {
    private double predicted_price;
    private String model_version;
}
