// GlobalExceptionHandler.java
package za.co.houseiq.houseiqbackend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice                           // global advice for all RestControllers, methods with @ExceptinoHandler will intercept exceptions and build responses
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)        // catches bean validation errors (@valid on request DTO)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getAllErrors().stream()  // collects all validation errors
            .findFirst().map(e -> e.getDefaultMessage()).orElse("Validation error"); // pick the first error and use defalt message or a fallback text
        return ResponseEntity.badRequest().body(new ApiError("VALIDATION_ERROR", msg)); // return
    }

    @ExceptionHandler(RuntimeException.class)                       // catches generic runtime errors
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex) {    //
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)                // HTTP 400
            .body(new ApiError("BAD_REQUEST", ex.getMessage()));            // message
    }
}
