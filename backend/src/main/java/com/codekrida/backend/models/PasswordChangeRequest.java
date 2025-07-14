package com.codekrida.backend.models;

import com.mongodb.lang.NonNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "passwordChangeRequests")
@Data
@Builder
public class PasswordChangeRequest {
    @Id
    private String email;
    @NonNull
    private String password;
    @NonNull
    private String otp;

    @Indexed(expireAfter = "0s")
    private Instant expiredAt;
}
