package com.codekrida.backend.repositories;

import com.codekrida.backend.models.RegistrationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegiRequestRepository extends MongoRepository<RegistrationRequest,String> {
}
