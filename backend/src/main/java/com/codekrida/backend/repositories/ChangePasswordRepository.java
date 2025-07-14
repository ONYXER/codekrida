package com.codekrida.backend.repositories;

import com.codekrida.backend.models.PasswordChangeRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChangePasswordRepository extends MongoRepository<PasswordChangeRequest,String> {
}
