package za.co.houseiq.houseiqbackend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import za.co.houseiq.houseiqbackend.prediction.model.User;
import za.co.houseiq.houseiqbackend.prediction.repo.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository users;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = users.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(
            u.getEmail(), u.getPasswordHash(),
            List.of(new SimpleGrantedAuthority("ROLE_" + (u.getRole() == null ? "USER" : u.getRole())))
        );
    }
}
