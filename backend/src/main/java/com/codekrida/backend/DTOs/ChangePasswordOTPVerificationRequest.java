package com.codekrida.backend.DTOs;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ChangePasswordOTPVerificationRequest {
    private String email;
    private String otp;
}
