package com.api.manager;

import com.api.manager.auth.service.JwtUserDetailService;
import com.api.manager.common.StatusObj;
import com.api.manager.dto.SprintDTO;
import com.api.manager.entity.SprintDb;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SprintBoardTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUserDetailService service;
    @Autowired
    private ObjectMapper objectMapper;

    private final String basePath = "/sprint_board/217/";

    private SprintDTO validCreate() {
        SprintDTO sprintDTO = new SprintDTO();
        sprintDTO.setDaysInterval(3);
        sprintDTO.setPurpose("Recomende rgmekr prkel;erkmh ");
        sprintDTO.setPriority(1);
        sprintDTO.setStatus(StatusObj.TO_DO);
        return sprintDTO;
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void createIsOk() {

        String jsObj = objectMapper.writeValueAsString(validCreate());
        for (int i = 0; i < 100; i++) {
            mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                    andExpect(status().isOk()).andDo(print());
        }
    }


    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void createIsBadRequest() {
        SprintDTO sprintDTO = validCreate();
        sprintDTO.setDaysInterval(0);
        String jsObj = objectMapper.writeValueAsString(sprintDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(status().isBadRequest()).andDo(print());
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void createIsBadRequestEmpty() {
        SprintDTO sprintDTO = validCreate();
        String jsObj = objectMapper.writeValueAsString(sprintDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(status().isBadRequest()).andDo(print());
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void getAll() {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/sprint_board/217/" + "get_all")).andExpect(status().isOk()).andDo(print()).andReturn();
        String jsonResponse = mvcResult.getResponse().getContentAsString();
        List<SprintDb> list = Arrays.asList(objectMapper.readValue(jsonResponse, SprintDb[].class));
        Assertions.assertDoesNotThrow(()->{
            list.stream().filter(s->s.getStatus()==StatusObj.COMPLETE).findFirst().orElseThrow();
        },"Not COMPLETED");
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void notAuthority() {
        mockMvc.perform(MockMvcRequestBuilders.get("/sprint_board/1/" + "get_all")).andExpect(status().isForbidden()).andDo(print());

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void delete() {
        mockMvc.perform(MockMvcRequestBuilders.delete("/sprint_board/217/delete?id=312")).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void deleteNotFound() {
        mockMvc.perform(MockMvcRequestBuilders.delete("/sprint_board/217/delete?id=10000")).andExpect(status().isNotFound()).andDo(print());
    }


}
