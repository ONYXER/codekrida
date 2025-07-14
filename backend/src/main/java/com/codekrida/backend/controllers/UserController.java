package com.codekrida.backend.controllers;

import com.codekrida.backend.services.DockerService;
import com.codekrida.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class UserController {
private final DockerService dockerService;
    private final UserService userService;
    @GetMapping
   public ResponseEntity<?> getDetails(){
        return userService.getDetails();
    }
    @GetMapping("/example")
    public String parse(@CookieValue("jwt") String token){
        return token;
    }

    @PostMapping("fileContent")
    public String getFileContent(@RequestBody Map<String,String> data){
        try {
            return dockerService.readFileFromContainer(data.get("containerName"),data.get("path"));
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
    @PostMapping("writeContent")
    public void writeFileContent(@RequestBody Map<String,String> data){
        try {
             dockerService.writeFileToContainer(data.get("containerName"),data.get("path"),data.get("content"));
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
