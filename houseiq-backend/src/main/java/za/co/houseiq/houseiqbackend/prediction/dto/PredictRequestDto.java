package za.co.houseiq.houseiqbackend.prediction.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PredictRequestDto {
    @Min(1) @Max(7) private int bedrooms;
    @Min(1) @Max(5) private int bathrooms;
    @Positive @Max(1000) private double area_sqm;
    @Min(0) @Max(120) private int age_years;
    @Min(0) @Max(10) private int location_index;
}
