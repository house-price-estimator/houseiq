package za.co.houseiq.houseiqbackend.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import za.co.houseiq.houseiqbackend.auth.dto.AuthResponse;
import za.co.houseiq.houseiqbackend.auth.dto.LoginRequest;
import za.co.houseiq.houseiqbackend.auth.dto.RegisterRequest;
import za.co.houseiq.houseiqbackend.config.JwtService;
import za.co.houseiq.houseiqbackend.prediction.model.User;
import za.co.houseiq.houseiqbackend.prediction.repo.UserRepository;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwt;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        if (users.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User u = users.save(User.builder()
            .email(req.getEmail())
            .passwordHash(encoder.encode(req.getPassword()))
            .name(req.getName())
            .role("USER")
            .build());

        String token = jwt.issue(u.getId(), java.util.Map.of(
            "email", u.getEmail(),
            "name", u.getName(),
            "role", u.getRole()
        ));
        return toAuthResponse(token, u);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        // will throw if bad creds
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User u = users.findByEmail(req.getEmail()).orElseThrow();
        String token = jwt.issue(u.getId(), java.util.Map.of(
            "email", u.getEmail(),
            "name", u.getName(),
            "role", u.getRole()
        ));
        return toAuthResponse(token, u);
    }

    private AuthResponse toAuthResponse(String token, User u) {
        var view = new AuthResponse.UserView();
        view.setId(u.getId());
        view.setEmail(u.getEmail());
        view.setName(u.getName());
        view.setRole(u.getRole());
        var resp = new AuthResponse();
        resp.setToken(token);
        resp.setUser(view);
        return resp;
    }
}
