package za.co.houseiq.houseiqbackend.prediction.service;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import za.co.houseiq.houseiqbackend.config.MlClientProperties;
import za.co.houseiq.houseiqbackend.prediction.dto.PredictResponseDto;

@Component                      // spring bean
@RequiredArgsConstructor        //
public class MlClient {
    private final WebClient webClient;      // inject web client
    private final MlClientProperties props; //

    /**
     * Calls FastAPI /predict with nested {"features": {...}} payload.
     */
    public PredictResponseDto predict(Map<String, Object> features) {           // predict endpoint calling
        var payload = Map.of("features", features);                             // build request body
        return webClient.post()                                                 // create a post request
            .uri(props.getBaseUrl() + "/predict")                               // url of where the post is sent
            .contentType(MediaType.APPLICATION_JSON)                            // tell client the body is JSON
            .body(BodyInserters.fromValue(payload))                             // take the payload Map and serialize to JSON for the request body.
            .retrieve()                                                         // send the request and prepare to read the response.
            .bodyToMono(PredictResponseDto.class)                               // deserialize response JSON into PredictResponseDto (as a reactive Mono).
            .onErrorResume(err -> Mono.error(new RuntimeException("ML service error: " + err.getMessage(), err))) // if error occurs, wrap in clearer body
            .block();                                                           // wait for the Mono to finish and return the actual PredictResponseDto (normal Java object).
    }
}
