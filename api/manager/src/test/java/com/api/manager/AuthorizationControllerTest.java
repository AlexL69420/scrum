package com.api.manager;


import com.api.manager.auth.RegAuth;
import com.api.manager.auth.jwt.JwtUtil;
import com.api.manager.auth.service.JwtUserDetailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static com.api.manager.common.UtilTestClass.userAuthDefaultValidT;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;


/*
*
* @Test
    public void testSigIn_invalidEmail() throws Exception {
        // Arrange
        RegAuth invalidUserAuth = new RegAuth();
        invalidUserAuth.setEmail("invalid-email"); // Неправильный email
        invalidUserAuth.setPassword("password");
        String userJson = objectMapper.writeValueAsString(invalidUserAuth); //Преобразуем в JSON

        // Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.post("/sign") //URL вашего endpoint
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(MockMvcResultMatchers.status().isBadRequest()) //Ожидаем 400
                 // Проверяем, что в ответе есть информация об ошибке
                 // Убедитесь, что возвращаете правильную структуру ошибок
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").exists())  //Проверяем наличие поля с ошибкой
                .andDo(print());
        //Mockito.verify(userAuthService, Mockito.never()).save(Mockito.any()); //Метод save не должен быть вызван
    }

*
* */


@SpringBootTest
@AutoConfigureMockMvc
public class AuthorizationControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private JwtUserDetailService jwtUserDetailService;



    //validate

    void request(RegAuth regAuth, ResultMatcher statusRequest, String endPointAuth) throws Exception {
        String jsObj = objectMapper.writeValueAsString(regAuth);

        String basePath = "/auth/";
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + endPointAuth).contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(statusRequest).andExpect(MockMvcResultMatchers.jsonPath("$.detail").exists()).
                andDo(print());
    }

    @Test
    void testInvalidNameEmpty() throws Exception {
        RegAuth regAuth = userAuthDefaultValidT();
        String empty = String.format("%60s", "");
        regAuth.setName(empty);
        request(regAuth, MockMvcResultMatchers.status().isBadRequest(), "sign");
    }


    @Test
    void testInvalidPassword() throws Exception {
        int desiredLength = 1000000000;
        RegAuth regAuth = userAuthDefaultValidT();
        regAuth.setPassword(null);
        request(regAuth, MockMvcResultMatchers.status().isBadRequest(), "sign");
    }





}
