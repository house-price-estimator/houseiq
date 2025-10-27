package za.co.houseiq.houseiqbackend.prediction.repo;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import za.co.houseiq.houseiqbackend.prediction.model.Prediction;

public interface PredictionRepository extends MongoRepository<Prediction, String> {

    // Derived query, spring Data parsed the name into
    // Filter: ownerId == ?0, Sort: createdAt Desc, Limit: taken from pageable
    // Return type: List<Prediction>

    List<Prediction> findByOwnerIdOrderByCreatedAtDesc(String ownerId, Pageable pageable);
}
