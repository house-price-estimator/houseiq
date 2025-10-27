package za.co.houseiq.houseiqbackend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService {
    @Value("${jwt.secret:changeme-in-dev}")
    private String secret;

    @Value("${jwt.ttl.seconds:86400}") // 24h
    private long ttlSeconds;

    private Key key;

    @PostConstruct
    void init() {
        // Secret to HMAC key; for dev we accept shorter secrets
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String issue(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
            .setSubject(subject)
            .addClaims(claims)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plusSeconds(ttlSeconds)))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public io.jsonwebtoken.Claims parse(String jwt) {
        return Jwts.parserBuilder().setSigningKey(key).build()
            .parseClaimsJws(jwt).getBody();
    }
}
