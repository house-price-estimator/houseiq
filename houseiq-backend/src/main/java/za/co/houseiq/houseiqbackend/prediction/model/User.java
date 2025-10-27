package za.co.houseiq.houseiqbackend.prediction.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document("users")                                      // users collection
public class User {
    @Id                                                 // id of collection
    private String id;

    @Indexed(unique = true)                             // unique index on email
    private String email;

    private String passwordHash;                        // hashed password
    private String name;                                // user name
    private String role;                                // USER / ADMIN
}
