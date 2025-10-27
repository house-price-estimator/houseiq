package za.co.houseiq.houseiqbackend.prediction.service;

import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import za.co.houseiq.houseiqbackend.prediction.dto.CreatePredictionDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictResponseDto;
import za.co.houseiq.houseiqbackend.prediction.model.Prediction;
import za.co.houseiq.houseiqbackend.prediction.repo.PredictionRepository;

@Service                                    // create a spring service (build features, call ml, persist, return dto
@RequiredArgsConstructor
public class PredictionService {
    private final PredictionRepository repo;    // inject repository
    private final MlClient mlClient;            // inject HTTP client

    public CreatePredictionDto createPrediction(String ownerId, PredictRequestDto req) {
        Map<String,Object> features = Map.of(               // map of input features to getters of DTO
            "bedrooms", req.getBedrooms(),
            "bathrooms", req.getBathrooms(),
            "area_sqm", req.getArea_sqm(),
            "age_years", req.getAge_years(),
            "location_index", req.getLocation_index()
        );

        PredictResponseDto ml = mlClient.predict(features);     // calls ml service and stored prediction

        Instant now = Instant.now();                            // construct a prediction entity
        Prediction p = Prediction.builder()
            .ownerId(ownerId)                                   // set all values for MongoDB
            .features(features)
            .predictedPrice(ml.getPredicted_price())
            .modelVersion(ml.getModel_version())
            .createdAt(now)
            .updatedAt(now)
            .version(1)
            .build();

        p = repo.save(p);                                       // persist to MongoDB. return saved instance

        return CreatePredictionDto.builder()                    // build and return DTO containing the persisted record's data
            .id(p.getId())
            .features(p.getFeatures())
            .predicted_price(p.getPredictedPrice())
            .model_version(p.getModelVersion())
            .createdAt(p.getCreatedAt())
            .updatedAt(p.getUpdatedAt())
            .version(p.getVersion())
            .build();
    }

    // query mongoDB for a page of predictions for ownerId, sorted by createdAt descending
    public java.util.List<Prediction> list(String ownerId, int page, int size) {
        return repo.findByOwnerIdOrderByCreatedAtDesc(ownerId, PageRequest.of(page, size));
    }

    //load a prediction by id and return it only if its ownerId matches the caller
    public java.util.Optional<Prediction> get(String ownerId, String id) {
        return repo.findById(id).filter(p -> p.getOwnerId().equals(ownerId));
    }

    // find by id, check ownership, and delete only when the owner matches
    public void delete(String ownerId, String id) {
        repo.findById(id).filter(p -> p.getOwnerId().equals(ownerId)).ifPresent(repo::delete);
    }
}
