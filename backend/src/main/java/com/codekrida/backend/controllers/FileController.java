package com.codekrida.backend.controllers;

import com.codekrida.backend.DTOs.FileRequest;
import com.codekrida.backend.DTOs.WriteFileContent;
import com.codekrida.backend.services.FileService;
import com.codekrida.backend.services.FileServices;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
//@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class FileController {

    private final FileServices fileService;

    @PostMapping("/createFile")
    public ResponseEntity<?> createFile(@RequestBody FileRequest request){
          return fileService.createFile(request);

    }
    @CrossOrigin
    @PostMapping("/createFolder")
    public ResponseEntity<?> createFolder(@RequestBody FileRequest request){
        return  fileService.createFolder(request);
    }

    @CrossOrigin
    @PutMapping("/renameOrMove")
    public ResponseEntity<?> renameOrMove(@RequestBody FileRequest request){
        return fileService.renameOrMoveFileOrFolder(request);
    }
    @DeleteMapping("/deleteFile")
    public ResponseEntity<?> deleteFile(@RequestBody FileRequest request){
        return fileService.deleteFile(request);}

    @CrossOrigin
    @DeleteMapping("/deleteFolder")
    public ResponseEntity<?> deleteFolder(@RequestBody FileRequest request){
        return fileService.deleteFolder(request);
    }
     @CrossOrigin
    @GetMapping("/getContent")
    public String getContent(@RequestParam String containerName, @RequestParam String path){
        return fileService.readFileContentFromContainer(containerName,path);
    }
    @CrossOrigin
    @PutMapping("/writeContent")
    public ResponseEntity<?> writeContent(@RequestBody WriteFileContent content){
       return fileService.writeFileContentToContainer(content);
    }
    @CrossOrigin
    @GetMapping("fileStructure")
    public ResponseEntity<List<Map<String,String>>> getFileStructure(@RequestParam String path){

                return fileService.getFolderStructure(path);
        }
}
