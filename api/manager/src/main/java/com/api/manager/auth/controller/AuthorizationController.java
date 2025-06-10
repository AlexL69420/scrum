package com.api.manager.auth.controller;

import com.api.manager.auth.JwtAuthReq;
import com.api.manager.auth.RegAuth;
import com.api.manager.auth.jwt.JwtUtil;
import com.api.manager.auth.service.JwtUserDetailService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.hibernate5.SpringSessionContext;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

//http://localhost:8081/api/v1/swagger-ui/index.html#/
@RestController
@RequestMapping("/auth")
@Tag(name = "AuthorizationController", description = "Контреллер отвечает за авторизацию, аутентификацию и регистрацию пользователя")
public class AuthorizationController {

    private final JwtUserDetailService jwtUserDetailService;
    private final AuthenticationProvider authenticationProvider;
    private final JwtUtil jwtUtil;

    AuthorizationController(JwtUserDetailService jwtUserDetailService, AuthenticationProvider authenticationProvider,
                            JwtUtil jwtUtil) {
        this.jwtUserDetailService = jwtUserDetailService;
        this.authenticationProvider = authenticationProvider;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/sign")
    @Tag(name = "sign", description = "Отправка учетных данных (пароль, имя и логин) в body" +
            " Правило вилидации:указаны")
    public ResponseEntity<?> sigIn(@Valid @RequestBody RegAuth regAuth) {
        jwtUserDetailService.save(regAuth);

        return ResponseEntity.ok("Регистрация успешна");
    }

    @PostMapping("/authenticate")
    @Tag(name = "authenticate", description = "Отправка учетных данных в body в результате высылаеться сам токен в header с заголовком" +
            " 'Authorization'. " + "Правила валидации указаны"+"\n Токен получить из заголовка Authorization"+"\nКаждый запрос должен иметь в заголовке Authorization этот же токен.")
    public ResponseEntity<?> generateToken(@Valid @RequestBody JwtAuthReq jwtAuthReq) {
        authenticate(jwtAuthReq);

        UserDetails userDetail = jwtUserDetailService.loadUserByUsername(jwtAuthReq.getLogin());
        String token = jwtUtil.generateToken(userDetail);

        return ResponseEntity.ok()
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .cacheControl(CacheControl.noStore().mustRevalidate())
                .body("\"The token is generated\"");
    }

    private void authenticate(JwtAuthReq regAuth) {
        Objects.requireNonNull(regAuth.getLogin());
        Objects.requireNonNull(regAuth.getPassword());
        authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(regAuth.getLogin(), regAuth.getPassword()));

    }
}
