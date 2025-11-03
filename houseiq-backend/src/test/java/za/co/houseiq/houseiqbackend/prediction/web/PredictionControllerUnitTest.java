package za.co.houseiq.houseiqbackend.prediction.web;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import za.co.houseiq.houseiqbackend.prediction.dto.CreatePredictionDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.model.Prediction;
import za.co.houseiq.houseiqbackend.prediction.service.PredictionService;

class PredictionControllerUnitTest {

    private PredictionService service;
    private PredictionController controller;

    @BeforeEach
    void setUp() {
        service = mock(PredictionService.class);
        controller = new PredictionController(service);
    }

    private Authentication auth(String principal) {
        Authentication a = mock(Authentication.class);
        when(a.getPrincipal()).thenReturn(principal);
        return a;
    }

    @Test
    void create_delegatesToService() {
        PredictRequestDto req = new PredictRequestDto();
        CreatePredictionDto dto = CreatePredictionDto.builder().id("p1").build();
        when(service.createPrediction(eq("user-1"), any())).thenReturn(dto);

        var result = controller.create(auth("user-1"), req);
        assertEquals("p1", result.getId());
        verify(service).createPrediction(eq("user-1"), eq(req));
    }

    @Test
    void list_delegatesToService() {
        when(service.list("user-1", 0, 20)).thenReturn(List.of());
        var res = controller.list(auth("user-1"), 0, 20);
        assertNotNull(res);
        verify(service).list("user-1", 0, 20);
    }

    @Test
    void get_returnsEntityOrThrows() {
        Prediction p = Prediction.builder().id("p1").ownerId("user-1").features(Map.of()).build();
        when(service.get("user-1", "p1")).thenReturn(Optional.of(p));
        var res = controller.get(auth("user-1"), "p1");
        assertEquals("p1", res.getId());

        when(service.get("user-1", "missing")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> controller.get(auth("user-1"), "missing"));
    }

    @Test
    void delete_delegatesToService() {
        controller.delete(auth("user-1"), "p1");
        verify(service).delete("user-1", "p1");
    }
}


