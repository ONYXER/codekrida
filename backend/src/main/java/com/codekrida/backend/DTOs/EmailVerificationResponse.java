package com.codekrida.backend.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailVerificationResponse {
    private boolean isExist;
    private String message;
}
