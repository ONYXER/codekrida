package com.codekrida.backend.controllers;

import com.codekrida.backend.DTOs.*;
import com.codekrida.backend.models.User;
import com.codekrida.backend.services.AuthService;
import com.codekrida.backend.services.DockerService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    private final AuthService authService;
    private final DockerService dockerService;

    @PostMapping("/createContainer")
    public String createContainer( @RequestBody Map<String,String> data){
       try {
           return dockerService.createContainer(data.get("email"));
       }catch (Exception e){
           System.out.println(e.getMessage());
       }
       return null;
    }
    @PostMapping("/startContainer")
    public ResponseEntity<?> startContainer( @RequestBody Map<String,String> data){
        try {
           dockerService.startContainer(data.get("email"));
           return ResponseEntity.status(HttpStatus.OK).body("container is started");
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @PostMapping("/stopContainer")
    public ResponseEntity<?> stopContainer( @RequestBody Map<String,String> data){
        try {
            dockerService.stopContainer(data.get("email"));
            return ResponseEntity.status(HttpStatus.OK).body("container is stoped");
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    //    email verification
    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestBody EmailVerificationRequest request){
        return authService.verifyEmail(request);
    }

//    sent OTP
    @PostMapping("registrationRequest")
    public ResponseEntity<RegistrationRequestResponse> sendOTP(@RequestBody RegistrationRequest request){
        return authService.registrationRequest(request);
    }

//    register after verify OTP
    @PostMapping("confirmRegistration")
    public ResponseEntity<?> verifyOTP(@RequestBody OTPVerificationRequest request){
        return authService.confirmRegistration(request);
    }
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,HttpServletResponse response){
        return authService.login(request,response);
    }

    @GetMapping("/getAll")
    public List<User> getAll(){
        return authService.getAll();
    }

    @PostMapping("changePasswordRequest")
    public ResponseEntity<?> changePasswordRequest(@RequestBody  ChangePasswordRequest request){
        return  authService.changePasswordRequest(request);
    }
    @PostMapping("changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordOTPVerificationRequest request){
        return authService.changePassword(request);
    }
}
