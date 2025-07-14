package com.codekrida.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileRequest {
    private String containerName;
    private String path;
    private String newPath;
}
