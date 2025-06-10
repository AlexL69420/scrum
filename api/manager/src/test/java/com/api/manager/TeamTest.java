package com.api.manager;

import com.api.manager.auth.service.JwtUserDetailService;
import com.api.manager.service.TeamService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TeamTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUserDetailService service;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private TeamService teamService;
    private final String basePath = "/team/216";

    @Test
    @WithUserDetails("test3422")
    void getAllUserRoleOnProject() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "/get_user_role")).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithUserDetails("test3422")
    void getAllNotAuthority() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/1/" + "get_user_role")).andExpect(status().isForbidden()).andDo(print());
    }

    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getAllTeamOk() {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/217/" + "get_all")).andExpect(status().isOk()).andDo(print());
    }
    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getAllTeamFobbiden() {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/12/" + "get_all")).andExpect(status().isForbidden()).andDo(print());
    }

    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getAllTeamPass() {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/234/" + "get_all")).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getTeamOnTask() {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/217/" + "/get_user_team?id_task=129")).andExpect(status().isOk()).andDo(print());
    }
    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getTeamOnTaskNotAuthority() {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/217/" + "/get_user_team?id_task=1")).andExpect(status().isForbidden()).andDo(print());
    }
    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getTeamOnTaskNotAuthority2() {
        mockMvc.perform(MockMvcRequestBuilders.get("/team/234/" + "/get_user_team?id_task=50")).andExpect(status().isForbidden()).andDo(print());
    }


}
