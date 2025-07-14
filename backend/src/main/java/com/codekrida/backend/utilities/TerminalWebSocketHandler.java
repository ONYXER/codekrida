package com.codekrida.backend.utilities;

import com.codekrida.backend.services.DockerService;
import com.codekrida.backend.services.JwtService;
import jakarta.servlet.http.Cookie;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class TerminalWebSocketHandler extends TextWebSocketHandler {
    private Process process;
    private OutputStream out;  // used to sent frontend terminal message to the container terminal
                  // used to send message to the frontend terminal
    private  final JwtService jwtService;
    private final DockerService dockerService;


    @Override
    public  void afterConnectionEstablished( @NonNull  WebSocketSession session){
      try {
          String jwt = TerminalWebSocketHandler.extractJwtFromWebSocketSession(session);
          if(jwt != null){
              String email = jwtService.extractUsername(jwt);
              if(email != null){

                  process = dockerService.execTerminal(email);
                  InputStream in = process.getInputStream();
                  out = process.getOutputStream();




                  new Thread(()->{
                      try{
                          byte[] buffer = new byte[1024];
                          int len;
                          while((len = in.read(buffer)) != -1){
                              String msg = new String(buffer,0,len);
                              session.sendMessage(new TextMessage(msg));

                          }

                      }

                      catch (Exception e) {
                          System.out.println("websocket read thread error"+e.getMessage());
                      }
                  }).start();

              }

          }
      } catch (Exception e) {
          System.out.println(e.getMessage());
          System.out.println(e.getCause().toString());
      }
    }
    @Override protected  void handleTextMessage(
            @NonNull  WebSocketSession session,
            @NonNull TextMessage message)  {
              try {
                  String command = message.getPayload();
                  out.write(command.getBytes(StandardCharsets.UTF_8));
                  out.flush();

              }catch (Exception e){
                  System.out.println(e.getMessage());
                  try {
                      session.close();
                  }catch (IOException ex){
                   process.destroy();
                  }
              }
    }
    @Override public void afterConnectionClosed(
            @NonNull WebSocketSession session,
            @NonNull  CloseStatus status
    ){
        if(process != null){
            process.destroy();
        }
    }

    public static String extractJwtFromWebSocketSession(WebSocketSession session){
        List<String> cookies = session.getHandshakeHeaders().get("cookie");
        if(cookies == null || cookies.isEmpty() ) return null;
        for(String cookieHeader : cookies){
            String[] cookiePair = cookieHeader.split(";");
             for(String cookie:cookiePair){
                 String[] parts = cookie.split("=");
                 if(parts.length == 2 && parts[0].equals("jwt")){
                     return parts[1];
                 }
             }
        }
        return null;
    }
}
