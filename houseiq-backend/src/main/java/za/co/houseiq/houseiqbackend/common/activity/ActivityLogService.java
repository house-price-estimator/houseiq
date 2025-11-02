package za.co.houseiq.houseiqbackend.common.activity;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository repo;

    public void record(String ownerId, String action, Map<String, Object> details) {
        ActivityLog log = ActivityLog.builder()
            .ownerId(ownerId)
            .action(action)
            .details(details)
            .createdAt(Instant.now())
            .build();
        repo.save(log);
    }

    public List<ActivityLog> list(String ownerId, int page, int size) {
        return repo.findByOwnerIdOrderByCreatedAtDesc(ownerId, PageRequest.of(page, size));
    }
}


