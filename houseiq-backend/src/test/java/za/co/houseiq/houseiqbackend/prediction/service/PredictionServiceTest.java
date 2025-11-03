package za.co.houseiq.houseiqbackend.prediction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
 
import org.springframework.data.domain.PageRequest;
import za.co.houseiq.houseiqbackend.common.activity.ActivityLogService;
import za.co.houseiq.houseiqbackend.prediction.dto.CreatePredictionDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictResponseDto;
import za.co.houseiq.houseiqbackend.prediction.model.Prediction;
import za.co.houseiq.houseiqbackend.prediction.repo.PredictionRepository;

class PredictionServiceTest {

    private PredictionRepository repo;
    private MlClient mlClient;
    private ActivityLogService activityLogService;
    private PredictionService service;

    @BeforeEach
    void setUp() {
        repo = mock(PredictionRepository.class);
        mlClient = mock(MlClient.class);
        activityLogService = mock(ActivityLogService.class);
        service = new PredictionService(repo, mlClient, activityLogService);
    }

    @Test
    void createPrediction_savesAndReturnsDto() {
        PredictRequestDto req = new PredictRequestDto();
        req.setBedrooms(3);
        req.setBathrooms(2);
        req.setArea_sqm(120.5);
        req.setAge_years(8);
        req.setLocation_index(4);

        PredictResponseDto ml = new PredictResponseDto();
        ml.setPredicted_price(250000.0);
        ml.setModel_version("v1");
        ml.setExplanations(Map.of("area_sqm", 0.6));
        when(mlClient.predict(any())).thenReturn(ml);

        Prediction saved = Prediction.builder()
            .id("abc123")
            .ownerId("user-1")
            .features(Map.of())
            .predictedPrice(250000.0)
            .modelVersion("v1")
            .explanations(Map.of("area_sqm", 0.6))
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .version(1)
            .build();
        when(repo.save(any(Prediction.class))).thenReturn(saved);

        CreatePredictionDto dto = service.createPrediction("user-1", req);

        assertEquals("abc123", dto.getId());
        assertEquals(250000.0, dto.getPredicted_price());
        assertEquals("v1", dto.getModel_version());

        verify(mlClient).predict(anyMap());
        verify(repo).save(any(Prediction.class));
        verify(activityLogService).record(eq("user-1"), eq("PREDICTION_CREATED"), anyMap());
    }

    @Test
    void list_delegatesToRepo_andLogs() {
        when(repo.findByOwnerIdOrderByCreatedAtDesc(eq("user-1"), any(PageRequest.class)))
            .thenReturn(List.of());

        List<Prediction> result = service.list("user-1", 0, 10);
        assertNotNull(result);
        verify(repo).findByOwnerIdOrderByCreatedAtDesc(eq("user-1"), any(PageRequest.class));
        verify(activityLogService).record(eq("user-1"), eq("PREDICTION_LISTED"), anyMap());
    }

    @Test
    void get_filtersByOwner_andLogsWhenPresent() {
        Prediction p = Prediction.builder().id("x").ownerId("user-1").build();
        when(repo.findById("x")).thenReturn(Optional.of(p));

        Optional<Prediction> res = service.get("user-1", "x");
        assertTrue(res.isPresent());
        verify(activityLogService).record(eq("user-1"), eq("PREDICTION_VIEWED"), anyMap());

        Optional<Prediction> res2 = service.get("other", "x");
        assertTrue(res2.isEmpty());
    }

    @Test
    void delete_onlyDeletesWhenOwnerMatches_andLogs() {
        Prediction p = Prediction.builder().id("x").ownerId("user-1").build();
        when(repo.findById("x")).thenReturn(Optional.of(p));

        service.delete("user-1", "x");
        verify(repo).delete(p);
        verify(activityLogService).record(eq("user-1"), eq("PREDICTION_DELETED"), anyMap());

        reset(repo, activityLogService);
        when(repo.findById("x")).thenReturn(Optional.of(p));
        service.delete("other", "x");
        verify(repo, never()).delete(any());
        verify(activityLogService, never()).record(eq("other"), eq("PREDICTION_DELETED"), anyMap());
    }
}


