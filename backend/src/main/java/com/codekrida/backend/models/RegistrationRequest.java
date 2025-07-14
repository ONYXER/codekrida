package com.codekrida.backend.models;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Date;

@Document(collection = "RegistrationRequest")
@Builder
@Data
public class RegistrationRequest {
    @Id
    private String email;
    @NonNull
    private String name;
    @NonNull
    private String password;
    @NonNull
    private String otp;
    private boolean isVerified;
    @Indexed(expireAfter = "0s")
    private Instant expiredAt;

}
