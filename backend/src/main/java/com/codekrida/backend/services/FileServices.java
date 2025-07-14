package com.codekrida.backend.services;

import com.codekrida.backend.DTOs.FileRequest;
import com.codekrida.backend.DTOs.WriteFileContent;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface FileServices {

    ResponseEntity<?> createFile(FileRequest request);
    ResponseEntity<?> deleteFile(FileRequest request);
    ResponseEntity<?> createFolder(FileRequest request);
    ResponseEntity<?> deleteFolder(FileRequest request);
    ResponseEntity<?> renameOrMoveFileOrFolder(FileRequest request);
    String readFileContentFromContainer(String containerName,String path);
    ResponseEntity<?> writeFileContentToContainer(WriteFileContent content);
    ResponseEntity<List<Map<String,String>>> getFolderStructure(String path);
}
