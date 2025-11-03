package za.co.houseiq.houseiqbackend.config;

import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Field;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();
        // reflectively set secret and ttlSeconds
        Field secret = JwtService.class.getDeclaredField("secret");
        secret.setAccessible(true);
        secret.set(jwtService, "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
        Field ttl = JwtService.class.getDeclaredField("ttlSeconds");
        ttl.setAccessible(true);
        ttl.set(jwtService, 3600L);
        jwtService.init();
    }

    @Test
    void issueAndParseRoundTrip() {
        String token = jwtService.issue("user-123", Map.of("role", "USER"));
        assertNotNull(token);

        var claims = jwtService.parse(token);
        assertEquals("user-123", claims.getSubject());
        assertEquals("USER", claims.get("role"));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
    }
}


