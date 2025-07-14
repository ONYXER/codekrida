package com.codekrida.backend.services;

import com.codekrida.backend.DTOs.AuthDetails;
import com.codekrida.backend.models.User;
import com.codekrida.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository  userRepository;

    public ResponseEntity<?> getDetails(){

try{
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if(auth != null){
        User user = (User)auth.getPrincipal();
        new DockerService().startContainer(user.getEmail());
        var details = AuthDetails
                .builder()
                .name(user.getName())
                .containerName(user.getWorkspaceName())
                .email(user.getUsername())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(details);
    }
} catch (Exception e) {
    throw new RuntimeException(e);
}
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }

}
