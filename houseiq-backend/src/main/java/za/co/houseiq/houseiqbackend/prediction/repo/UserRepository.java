package za.co.houseiq.houseiqbackend.prediction.repo;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import za.co.houseiq.houseiqbackend.prediction.model.User;

public interface UserRepository extends MongoRepository<User, String> {     // Declare MongoDB repo for User entity with ID type string
    Optional<User> findByEmail(String email);                               // derived query, optiona;(empty if none)
}
