package com.codekrida.backend.utilities;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.naming.AuthenticationException;
import java.io.IOException;

@Component
public class CustomAuthenticationFailure implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException exception) throws IOException, ServletException {
          if(exception instanceof UsernameNotFoundException){
              response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"invalid username");
          } else if(exception instanceof BadCredentialsException){
              response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"invalid password");
          }else{
              response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Authentication failed");
          }
    }
}
