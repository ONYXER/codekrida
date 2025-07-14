package com.codekrida.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class RegistrationRequest {
    private String email;
    private String name;
    private String password;


}
