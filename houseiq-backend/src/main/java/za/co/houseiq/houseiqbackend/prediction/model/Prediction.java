package za.co.houseiq.houseiqbackend.prediction.model;

import java.time.Instant;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document("predictions")                                                                   // map class to prediction collection
@CompoundIndex(name = "owner_created_idx", def = "{ 'ownerId': 1, 'createdAt': -1 }")       // Creates a compound index on ownerId (ascending) and createdAt (descending).
@Data @Builder @NoArgsConstructor @AllArgsConstructor                                   // Lombok, getters/setters, equals,hashCode,toString, Builder - fluent builder API,
public class Prediction {
    @Id                               // mongodb id
    private String id;                // if left null, spring data will generate one

    private String ownerId;            // who issued the prediction (JWT subject)

    private Map<String, Object> features;       // store input as a map (BSON)
    private double predictedPrice;              // model output
    private String modelVersion;                // model version that produced output

    private Instant createdAt;                  // Timestamps
    private Instant updatedAt;
    private int version;                        // custom version field
}
