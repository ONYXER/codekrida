package com.codekrida.backend.utilities;

import com.codekrida.backend.DTOs.WriteFileContent;
import com.codekrida.backend.services.DockerService;
import com.codekrida.backend.services.FileServices;
import com.codekrida.backend.services.JwtService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.MultipartStream;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class CodeEditorHandler extends TextWebSocketHandler {
  private final FileServices fileService;

    private final JwtService jwtService;

    @Override public void afterConnectionEstablished(@NonNull  WebSocketSession session){
      try {

            String path = getQueryParam(session,"path");
            String containerName = getQueryParam(session,"containerName");
            String content = fileService.readFileContentFromContainer(containerName,path);
            session.sendMessage(new TextMessage(content));

           }catch (Exception e){
            try {
                session.sendMessage(new TextMessage("enable to read content!"));
            }catch (IOException ex){
                System.out.println(ex.fillInStackTrace().toString());
            }
      }
    }
@Override
public void handleTextMessage(@NonNull  WebSocketSession session, @NonNull  TextMessage message){
      try{
          String path = getQueryParam(session,"path");
          String containerName = getQueryParam(session,"containerName");

          var  content = WriteFileContent
                  .builder()
                  .content(message.getPayload())
                  .containerName(containerName)
                  .path(path)
                  .build();
          fileService.writeFileContentToContainer(content);
      }catch (Exception e){
          System.out.println(e.fillInStackTrace().toString());
      }
}

private String getQueryParam(WebSocketSession session,String param) throws URISyntaxException {
    URI uri = session.getUri();
    assert uri != null;
    String[] pairs = uri.getQuery().split("&");
    for(String pair : pairs){
        String[] kv = pair.split("=");
        if(kv.length == 2 && kv[0].equals(param)){
            return URLDecoder.decode(kv[1],StandardCharsets.UTF_8);
        }
    }
    throw new IllegalArgumentException("Missing parameter: "+param);

}

}
