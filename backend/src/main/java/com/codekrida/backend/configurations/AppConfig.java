package com.codekrida.backend.configurations;

import com.codekrida.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    private final UserRepository userRepository;
    @Bean
    public UserDetailsService userDetailsService(){
        return username -> userRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService()
        ) ;
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
//        return configuration.getAuthenticationManager();
//    }



    /*
    for enabling UserNotFoundException
     */
    @Bean
    public AuthenticationManager authManger(HttpSecurity http,DaoAuthenticationProvider provider) throws Exception{
        return http
                .getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(provider)
                .build();
    }

}
