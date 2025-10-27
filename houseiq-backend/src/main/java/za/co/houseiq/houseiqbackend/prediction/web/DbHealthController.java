// src/main/java/.../web/DbHealthController.java
package za.co.houseiq.houseiqbackend.prediction.web;

import com.mongodb.client.MongoClient;
import org.bson.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DbHealthController {
    private final MongoClient client;
    public DbHealthController(MongoClient client) { this.client = client; }

    @GetMapping("/api/db/ping")
    public Document ping() {
        // Uses the default database from your URI
        return client.getDatabase(System.getProperty("spring.data.mongodb.database", "admin"))
            .runCommand(new Document("ping", 1));
    }
}
