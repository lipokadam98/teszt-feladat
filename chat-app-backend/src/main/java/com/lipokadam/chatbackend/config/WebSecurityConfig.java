package com.lipokadam.chatbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class WebSecurityConfig {
    private static final String[] WHITE_LIST_URLS = {
            "/register",
            "/hello",
            "/createchatroom*",
            "/verifyRegistration*",
            "/resendVerifyToken*",
            "/resetPassword",
            "/savePassword*",
            "/changePassword"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        System.out.println("Security filter happening");
        httpSecurity.csrf().disable().authorizeRequests().anyRequest().permitAll();
        return httpSecurity.build();
    }

}
