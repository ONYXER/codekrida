package com.codekrida.backend.repositories;

import com.codekrida.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<User,String> {
   Optional<User> findByEmail(String email);
   @Query(collation = "{'locale':'en','strength':2}")
   Optional<User> findByEmailIgnoreCase(String email);
}
