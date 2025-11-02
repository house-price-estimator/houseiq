package za.co.houseiq.houseiqbackend.common.activity;

import java.time.Instant;
import java.util.Map;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("activity_logs")
@CompoundIndex(name = "owner_created_idx", def = "{ 'ownerId': 1, 'createdAt': -1 }")
public class ActivityLog {
    @Id
    private String id;

    private String ownerId;
    private String action;
    private Map<String, Object> details;

    private Instant createdAt;
}


