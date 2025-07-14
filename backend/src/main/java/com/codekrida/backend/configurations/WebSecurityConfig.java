package com.codekrida.backend.configurations;

import com.codekrida.backend.utilities.JWTFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
//@EnableMethodSecurity
public class WebSecurityConfig {
    private final JWTFilter jwtFilter;
    private final LogoutHandler logoutHandler;
    private final AuthenticationProvider authenticationProvider;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request
                        .requestMatchers( "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(((request, response, authException) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))))

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout->
                        logout.logoutUrl("/api/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler(((request, response, authentication) -> SecurityContextHolder.clearContext())))

                .build();

    }

}