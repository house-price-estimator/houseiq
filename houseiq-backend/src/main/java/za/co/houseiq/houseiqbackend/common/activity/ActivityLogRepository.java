package za.co.houseiq.houseiqbackend.common.activity;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByOwnerIdOrderByCreatedAtDesc(String ownerId, Pageable pageable);
}


