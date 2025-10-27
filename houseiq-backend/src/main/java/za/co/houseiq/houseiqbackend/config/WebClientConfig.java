package za.co.houseiq.houseiqbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration                                              // create bean for injection
public class WebClientConfig {
    @Bean                                                   // registers a singleton WebClient for injection
    public WebClient webClient() {
        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))   // uses Reactor Netty as HTTP engine
            .exchangeStrategies(ExchangeStrategies.builder()                        // configures codecs and memory limits for encoding and decoding
                .codecs(c -> c.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))    // cap in-memory to 2mb for JSON responses
                .build())
            .build();
    }
}
