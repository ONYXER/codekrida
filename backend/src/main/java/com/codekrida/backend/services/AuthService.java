package com.codekrida.backend.services;

import com.codekrida.backend.DTOs.*;
import com.codekrida.backend.models.PasswordChangeRequest;
import com.codekrida.backend.models.User;
import com.codekrida.backend.repositories.ChangePasswordRepository;
import com.codekrida.backend.repositories.RegiRequestRepository;
import com.codekrida.backend.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RegiRequestRepository requestRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ChangePasswordRepository changePasswordRepository;
    private final DockerService dockerService;

    public ResponseEntity<?> verifyEmail(EmailVerificationRequest request) {

        try {
            if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
                EmailVerificationResponse response = EmailVerificationResponse
                        .builder()
                        .isExist(true)
                        .message("email already registered")
                        .build();
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                EmailVerificationResponse response = EmailVerificationResponse
                        .builder()
                        .isExist(false)
                        .message("Email is available for Registration")
                        .build();
                return ResponseEntity.status(HttpStatus.OK).body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }


    //    send otp
    public ResponseEntity<RegistrationRequestResponse> registrationRequest(RegistrationRequest request) {

        try {

            String otp = String.format("%06d", new Random().nextInt(1_000_000));
            var registrationRequest = com.codekrida.backend.models.RegistrationRequest.builder()
                    .email(request.getEmail())
                    .otp(otp)
                    .name(request.getName())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .isVerified(false)
                    .expiredAt(Instant.now().plus(Duration.ofMinutes(10)))
                    .build();
            mailService.send(request.getEmail(), otp, request.getName());
            requestRepository.save(registrationRequest);

            return ResponseEntity.ok(new RegistrationRequestResponse("otp is sent to " + request.getEmail() + " for verification"));
        } catch (Exception e) {


            return new ResponseEntity<>(new RegistrationRequestResponse("Error! to sending OTP"), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    //
    public ResponseEntity<?> confirmRegistration(OTPVerificationRequest request) {
        try {
            com.codekrida.backend.models.RegistrationRequest registrationRequest = requestRepository.findById(request.getEmail()).orElse(null);
            if(registrationRequest == null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            else if(!registrationRequest.getOtp().equals(request.getOtp()))
            {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
              String workspaceName = dockerService.createContainer(request.getEmail());
                var user = User
                        .builder()
                        .password(registrationRequest.getPassword())
                        .name(registrationRequest.getName())
                        .email(registrationRequest.getEmail())
                        .registeredAt(new Date(System.currentTimeMillis()))
                        .workspaceName(workspaceName)
                        .build();
                requestRepository.delete(registrationRequest);
                userRepository.save(user);
//                String jwt = jwtService.generateToken(user);
//                ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
//                        .httpOnly(true)
//                        .secure(true)
//                        .path("/")
//                        .maxAge(Duration.ofHours(1))
//                        .sameSite("None")
//                        .build();
//                response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                return ResponseEntity.ok("success");


        } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }



    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public ResponseEntity<?> login(LoginRequest request, HttpServletResponse response) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()
                    )
            );
            var user = (UserDetails) auth.getPrincipal();
            String jwt = jwtService.generateToken(user);

//        setToken in HttpOnly cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(Duration.ofHours(1))
                    .sameSite("None")
                    .build();
            response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.status(HttpStatus.OK).body("authenticated");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("email");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("password");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("authentication failed");
        }
    }

    //    change password Request
    public ResponseEntity<?> changePasswordRequest(ChangePasswordRequest request) {
        try {
            String otp = String.format("%06d", new Random().nextInt(1_000_000));

            var requestModel = PasswordChangeRequest
                    .builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .expiredAt(Instant.now().plus(Duration.ofMinutes(10)))
                    .otp(otp)
                    .build();
            mailService.send(request.getEmail(), otp, "User");
            changePasswordRepository.save(requestModel);
            return ResponseEntity.status(HttpStatus.OK).body(true);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //    change password
    public ResponseEntity<?> changePassword(ChangePasswordOTPVerificationRequest request) {
        try {
            PasswordChangeRequest requestModel = changePasswordRepository.findById(request.getEmail()).orElse(null);
            if (requestModel != null && requestModel.getOtp().equals(request.getOtp())) {
                User user = userRepository.findByEmail(request.getEmail()).orElse(null);
                if (user != null) {
                    user.setPassword(passwordEncoder.encode(requestModel.getPassword()));
                    userRepository.save(user);
                    return ResponseEntity.status(HttpStatus.OK).build();
                }
                changePasswordRepository.delete(requestModel);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

