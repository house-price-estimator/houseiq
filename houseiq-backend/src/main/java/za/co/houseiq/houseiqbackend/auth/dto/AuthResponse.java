package za.co.houseiq.houseiqbackend.auth.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private UserView user;

    @Data
    public static class UserView {
        private String id;
        private String email;
        private String name;
        private String role;
    }
}
