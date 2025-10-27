// ApiError.java
package za.co.houseiq.houseiqbackend.common;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor  // generate getters, setters, toString, equals, hashCode, constructor with both fields
public class ApiError {             //
    private String code;            // error code
    private String message;         // error message
}
