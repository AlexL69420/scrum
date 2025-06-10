package com.api.manager;

import com.api.manager.auth.jwt.JwtAuthenticationEntryPoint;
import com.api.manager.auth.jwt.JwtReqFilter;
import com.api.manager.auth.service.JwtUserDetailService;
import lombok.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebConfig {


    private final JwtUserDetailService jwtUserDetailsService;

    private final JwtReqFilter jwtRequestFilter;
    private final JwtAuthenticationEntryPoint entryPoint;

    //Auth
    WebConfig(JwtUserDetailService jwtUserDetailService, JwtReqFilter jwtRequestFilter, JwtAuthenticationEntryPoint entryPoint) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.entryPoint = entryPoint;
        this.jwtUserDetailsService = jwtUserDetailService;
    }

    //Auth
    @Bean
    public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(jwtUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }


    @Bean
    SecurityFilterChain config(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable).cors(AbstractHttpConfigurer::disable).authorizeHttpRequests(auth -> auth.requestMatchers("/auth/*")
                .permitAll().requestMatchers(HttpMethod.OPTIONS, "/**").permitAll().requestMatchers(
                        "/v3/api-docs/**"
                ).permitAll().requestMatchers("/swagger-ui/**").permitAll().anyRequest().authenticated()
        ).exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint)).sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).addFilterBefore(
                jwtRequestFilter, UsernamePasswordAuthenticationFilter.class
        );

        return httpSecurity.build();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {


        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // Замените
        configuration.addAllowedMethod("*");

        configuration.addAllowedHeader("*");// Разрешенные заголовки
        configuration.setExposedHeaders(List.of("Authorization")); // Добавьте
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Применить ко всем эндпоинтам
        return new CorsFilter(source);

       /* UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);*/
    }


}

