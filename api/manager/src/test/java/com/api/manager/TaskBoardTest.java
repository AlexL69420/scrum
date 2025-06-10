package com.api.manager;

import com.api.manager.auth.service.JwtUserDetailService;
import com.api.manager.common.StatusObj;
import com.api.manager.dto.DetailTaskDTO;
import com.api.manager.dto.HiredEmployeeDTO;
import com.api.manager.dto.TeamDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TaskBoardTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUserDetailService service;
    @Autowired
    private ObjectMapper objectMapper;

    private final String basePath = "/task_board/217/";

    DetailTaskDTO valid() {
        DetailTaskDTO detailTaskDTO = new DetailTaskDTO();
        detailTaskDTO.setDetail("prhmeplkmreklerplk lkplekhl;, ;lre,l,");
        HiredEmployeeDTO hiredEmployeeDTO = new HiredEmployeeDTO();
        hiredEmployeeDTO.setNameEmployee("Designer");
        hiredEmployeeDTO.setIdRole(212L);
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setName("buka");
        List<HiredEmployeeDTO> hiredEmployeeDTOS = new ArrayList<>();
        hiredEmployeeDTOS.add(hiredEmployeeDTO);
        teamDTO.setHiredEmployeeDTOList(hiredEmployeeDTOS);
        detailTaskDTO.setTeamDTO(teamDTO);
        return detailTaskDTO;
    }


    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void createOk() {
        for (int i = 0; i < 50; i++) {

            String jsObj = objectMapper.writeValueAsString(valid());

            mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create?id_sprint=816").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                    andExpect(status().isOk()).andDo(print());
        }

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void repeatEmployee() {
        DetailTaskDTO detailTaskDTO = valid();
        HiredEmployeeDTO hiredEmployeeDTO = new HiredEmployeeDTO();
        hiredEmployeeDTO.setNameEmployee("Designer");
        hiredEmployeeDTO.setIdRole(212L);
        detailTaskDTO.getTeamDTO().getHiredEmployeeDTOList().add(hiredEmployeeDTO);
        String jsObj = objectMapper.writeValueAsString(detailTaskDTO);

        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create?id_sprint=314").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(status().isBadRequest()).andDo(print());

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void notAvailable() {
        DetailTaskDTO detailTaskDTO = valid();
        HiredEmployeeDTO hiredEmployeeDTO = new HiredEmployeeDTO();
        hiredEmployeeDTO.setNameEmployee("Designer");
        hiredEmployeeDTO.setIdRole(1000000000L);
        detailTaskDTO.getTeamDTO().getHiredEmployeeDTOList().add(hiredEmployeeDTO);
        String jsObj = objectMapper.writeValueAsString(detailTaskDTO);

        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create?id_sprint=314").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(status().isBadRequest()).andDo(print());

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void getTasksOnSprintOk() {
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "/get_task_sprint?id_sprint=314")).andExpect(status().isOk()).andDo(print());

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void getTasksOnSprintNotAuthority() {
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "/get_task_sprint?id_sprint=520")).andExpect(status().isOk()).andDo(print());

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void getTasksCommandUserIsOk() {
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "/get_task_command")).andExpect(status().isOk()).andDo(print());

    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void getTasksCommandUserIsForbbiden() {
        mockMvc.perform(MockMvcRequestBuilders.get("/task_board/216" + "/get_task_command")).andExpect(status().isForbidden()).andDo(print());

    }
    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void  setStatusOn(){

        mockMvc.perform(MockMvcRequestBuilders.put("/task_board/217" + "/set_status?id_task=129").contentType(MediaType.APPLICATION_JSON).content(StatusObj.COMPLETE.name())).andExpect(status().isOk()).andDo(print());

    }

/*
    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void createForbidden() {
        String jsObj = objectMapper.writeValueAsString(valid());
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create?id_sprint=100000000").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(status().isForbidden()).andDo(print());
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void createForbiddenProject() {
        String jsObj = objectMapper.writeValueAsString(valid());

        mockMvc.perform(MockMvcRequestBuilders.post("/task_board/121/" + "create?id_sprint=10").contentType(MediaType.APPLICATION_JSON).content(jsObj)).
                andExpect(status().isForbidden()).andDo(print());

    }

 */
}
