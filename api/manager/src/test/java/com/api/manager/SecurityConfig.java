package com.api.manager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/*@Configuration
@Profile("test")
public class SecurityConfig {
    @Bean
    public SecurityFilterChain csrfFilterChain(HttpSecurity http) throws Exception {
System.out.print("ggggg");
        http
                .csrf(AbstractHttpConfigurer::disable); // Отключаем CSRF (рекомендуемый способ)

        return http.build();
    }
}*/
