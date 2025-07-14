package com.codekrida.backend.configurations;


import com.codekrida.backend.utilities.CodeEditorHandler;
import com.codekrida.backend.utilities.TerminalWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@RequiredArgsConstructor
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final TerminalWebSocketHandler terminalWebSocketHandler;
    private final CodeEditorHandler codeEditorHandler;
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
     registry
             .addHandler( terminalWebSocketHandler,"/ws/terminal")
             .setAllowedOrigins("*");
     registry.addHandler(codeEditorHandler,"/ws/codeEditor")
             .setAllowedOrigins("*");
    }
}
