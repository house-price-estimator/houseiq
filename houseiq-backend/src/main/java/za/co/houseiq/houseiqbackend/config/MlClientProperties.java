package za.co.houseiq.houseiqbackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data                                                               // Lombok auto init
@Configuration                                                      // Makes bean for future injection
@ConfigurationProperties(prefix = "ml")                          // bind all properties that start with 'ml'
public class MlClientProperties {                                   // automatically set baseUrl from application.yml
    /** Base URL of the FastAPI ML service, e.g. http://ml:8000 */
    private String baseUrl;                                         // holds ML service base URL
}
