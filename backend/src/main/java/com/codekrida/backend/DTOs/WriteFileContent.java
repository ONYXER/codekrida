package com.codekrida.backend.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WriteFileContent {
   private String containerName;
   private String path;
   private String content;
}
