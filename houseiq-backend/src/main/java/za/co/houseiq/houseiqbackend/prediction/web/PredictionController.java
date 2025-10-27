package za.co.houseiq.houseiqbackend.prediction.web;

import java.util.List;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.houseiq.houseiqbackend.prediction.dto.CreatePredictionDto;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictRequestDto;
import za.co.houseiq.houseiqbackend.prediction.model.Prediction;
import za.co.houseiq.houseiqbackend.prediction.service.PredictionService;
import org.springframework.security.core.Authentication;

@RestController                 // marks this as a REST controller, return values are written as JSON
@RequestMapping("/api/predictions") // base path for all endpoints in this controller
@RequiredArgsConstructor            // Lombok generates a constructor for final fields
public class PredictionController {
    private final PredictionService service;        // injected service used by endpoints

    // TEMP until JWT (M4): use a fixed owner id
    private static final String OWNER = "dev-user";     // hardcoded owner id used as placeholder until JWT

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatePredictionDto create(Authentication auth, @Valid @RequestBody PredictRequestDto req) {
        String ownerId = (String) auth.getPrincipal(); // from JWT subject
        return service.createPrediction(ownerId, req);
    }

    @GetMapping
    public List<Prediction> list(Authentication auth,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "20") int size) {
        String ownerId = (String) auth.getPrincipal();
        return service.list(ownerId, page, size);
    }

    @GetMapping("/{id}")
    public Prediction get(Authentication auth, @PathVariable String id) {
        String ownerId = (String) auth.getPrincipal();
        return service.get(ownerId, id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable String id) {
        String ownerId = (String) auth.getPrincipal();
        service.delete(ownerId, id);
    }
}
