package com.codekrida.backend.services;


import com.codekrida.backend.DTOs.FileRequest;
import com.codekrida.backend.DTOs.WriteFileContent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileService implements FileServices {

    private final DockerService dockerService;



    @Override
    public ResponseEntity<?> createFile(FileRequest request) {
        try {
            dockerService.createFile(request.getContainerName(),request.getPath());
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Override
    public ResponseEntity<?> deleteFile(FileRequest request) {
        try {
            dockerService.deleteFile(request.getContainerName(),request.getPath());
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Override
    public ResponseEntity<?> createFolder(FileRequest request) {
        try {
            dockerService.createFolder(request.getContainerName(),request.getPath());
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Override
    public ResponseEntity<?> deleteFolder(FileRequest request) {
        try {
            dockerService.removeFolder(request.getContainerName(),request.getPath());
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Override
    public ResponseEntity<?> renameOrMoveFileOrFolder(FileRequest request) {
        try {
            dockerService.moveORRenameFileOrFolder(request.getContainerName(),request.getPath(),request.getNewPath());
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Override
    public String readFileContentFromContainer(String containerName, String path) {
        try {
            return dockerService.readFileFromContainer(containerName,path);
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return "";
        }
    }

    @Override
    public ResponseEntity<?> writeFileContentToContainer(WriteFileContent content) {
        try {
            dockerService.writeFileToContainer(content.getContainerName(),content.getPath(),content.getContent());
            return ResponseEntity.ok().build();
        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<List<Map<String,String>>> getFolderStructure( String path){

        try {
            List<Map<String,String>>    folderStructure = dockerService.getDirectoryStructure(path);
            return ResponseEntity.ok(folderStructure);

        }catch (Exception e){
            System.out.println(e.fillInStackTrace().toString());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
