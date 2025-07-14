package com.codekrida.backend.DTOs;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChangePasswordRequest {
    private String email;
    private String password;
}
