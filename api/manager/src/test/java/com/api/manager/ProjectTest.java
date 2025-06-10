package com.api.manager;

import com.api.manager.auth.service.JwtUserDetailService;
import com.api.manager.common.CryptMeta;
import com.api.manager.common.GrantedRole;
import com.api.manager.common.SharedURLField;
import com.api.manager.entity.ProjectDb;
import com.api.manager.dto.ProjectDTO;
import com.fasterxml.jackson.core.type.TypeReference;
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

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

//project/get_all
//project/create

//{
//    "login":"test3422",
//    "password":12345678,
//    "name":"test423"
//     "id":41
//}
@SpringBootTest
@AutoConfigureMockMvc
public class ProjectTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUserDetailService service;
    @Autowired
    private ObjectMapper objectMapper;

    private final String basePath = "/project/";

    //+
    @Test
    @WithUserDetails("test3422")
    void getAll() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "get_all")).andExpect(status().isOk());
    }

    //+
    @Test
    @WithUserDetails("notAuthorization")
    void getAllIncorrectUserRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "get_all")).andExpect(status().isForbidden()).andDo(print());
    }

    //+
    @Test
    @WithUserDetails("test3422")
    void getAllChekResult() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get(basePath + "get_all")).andExpect(status().isOk()).andReturn();
        String content = result.getResponse().getContentAsString();
        List<ProjectDb> myObjects = objectMapper.readValue(content, new TypeReference<>() {
        });
        for (ProjectDb db : myObjects) {
            assertEquals(47L, db.getCreator().getId(), "Incorrect ProjectDB");
            assertEquals(41L, db.getCreator().getId(), "Incorrect ProjectDB");
        }
    }

    //+
    //Test create
    @Test
    @WithUserDetails("hophay")
    void createProjectEmptyParam() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        String jsObj = objectMapper.writeValueAsString(projectDTO);
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).
                content(jsObj)).andExpect(status().isBadRequest()).andReturn();
    }

    //+
    @Test
    @WithUserDetails("hophay")
    void createProjectIncorrectParamName() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("");
        String jsObj = objectMapper.writeValueAsString(projectDTO);
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).
                content(jsObj)).andExpect(status().isBadRequest()).andReturn();
    }

    //+
    @Test
    @WithUserDetails("hophay")
    void createProjectIncorrectParamCreator() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setCreator(null);
        String jsObj = objectMapper.writeValueAsString(projectDTO);
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).
                content(jsObj)).andExpect(status().isBadRequest()).andReturn();
    }

    //+
    @Test
    @WithUserDetails("test3422")
    void createProjectGenerate() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("TestProject");
        for (int i = 0; i < 10; i++) {
            String jsObj = objectMapper.writeValueAsString(projectDTO);
            mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).
                    content(jsObj)).andExpect(status().isOk());
        }
    }

    //+
    //Test save id=14
    @Test
    @WithUserDetails("test3422")
    void emptyNameSaveProject() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        String jsObj = objectMapper.writeValueAsString(projectDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "14/update").contentType(MediaType.APPLICATION_JSON).
                content(jsObj)).andExpect(status().isBadRequest()).andDo(print());
    }

    //+
    @Test
    @WithUserDetails("test3422")
    void inCorrectIdSaveProject() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("InvalidTest3422");
        String jsObj = objectMapper.writeValueAsString(projectDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "10000000000000/update").contentType(MediaType.APPLICATION_JSON).
                content(jsObj)).andExpect(status().isForbidden()).andDo(print());
    }

    //-
    @Test
    @WithUserDetails("hophay")
    void notAuthUserOnProjectSave() throws Exception {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("InvalidHopHay");
        String jsObj = objectMapper.writeValueAsString(projectDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "13/update").contentType(MediaType.APPLICATION_JSON).
                content(jsObj)).andExpect(status().isForbidden()).andDo(print());
    }

    @Test
    @WithUserDetails("hophay")
    @SneakyThrows
    void invalidJsonDataCreateSend() {
        String json = "{\n" +
                "  \"id\": 0,\n" +
                "  \"name\": \"string\",\n" +
                "  \"creator\": null,\n" +
                "  \"metaDB\": null\n" +
                "}";
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).
                content(json)).andExpect(status().isOk()).andDo(print());

        String json2 = "{\n" +
                "  \"id\": 0,\n" +
                "  \"names2\": \"string\",\n" +
                "  \"creator\": null,\n" +
                "  \"metaDB\": null\n" +
                "}";
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "create").contentType(MediaType.APPLICATION_JSON).
                content(json2)).andExpect(status().isBadRequest()).andDo(print());
    }

    @Test
    @WithUserDetails("hophay")
    @SneakyThrows
    void notFoundProjectWithId() {
        //error: if not found project -> forribben
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("test");
        projectDTO.setId(-1L);
        String js = objectMapper.writeValueAsString(projectDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + projectDTO.getId() + "/update").contentType(MediaType.APPLICATION_JSON).
                content(js)).andExpect(status().isForbidden()).andDo(print());
    }

    //id 13 project
    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void notIdProjectUpdate() {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("test");
        String js = objectMapper.writeValueAsString(projectDTO);
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "-" + "/update").contentType(MediaType.APPLICATION_JSON).
                content(js)).andExpect(status().isBadRequest()).andDo(print());
    }

    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getProject() {

        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "16" + "/get")).andExpect(status().isOk()).andDo(print());

    }

    @Test
    @WithUserDetails("test3422")
    @SneakyThrows
    void getProjectWithNotIdAndNoAccess() {

        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "-1" + "/get")).andExpect(status().isForbidden()).andDo(print());
        mockMvc.perform(MockMvcRequestBuilders.get(basePath + "20" + "/get")).andExpect(status().isForbidden()).andDo(print());

    }

    @Test
    @WithUserDetails("hophay")
    @SneakyThrows
    void projectDeleteNotAccess() {

        mockMvc.perform(MockMvcRequestBuilders.delete(basePath + "16" + "/delete")).andExpect(status().isForbidden()).andDo(print());

    }

    @Test
    @WithUserDetails("hophay")
    @SneakyThrows
    void projectDelete() {

        mockMvc.perform(MockMvcRequestBuilders.delete(basePath + "18" + "/delete")).andExpect(status().isOk()).andDo(print());

    }

    @Test
    @SneakyThrows
    void generateUrlShare() {
        Assertions.assertDoesNotThrow(() -> {
            Map<String, String> map = new HashMap<>();
            map.put(SharedURLField.ROLE.name(), GrantedRole.SUB_SUPER_USER.name());
            map.put(SharedURLField.PROJECT_ID.name(), "13");

            String res = CryptMeta.encryptMap(map);
            System.out.println("decode:" + CryptMeta.decryptMap(res).toString());
            ;
            System.out.println(res);
            System.out.println(CryptMeta.decryptMap(res));
            map.clear();
            map.put("ROLE", GrantedRole.SUB_SUPER_USER.name());
            map.put(SharedURLField.PROJECT_ID.name(), "");
            res = CryptMeta.encryptMap(map);
            System.out.println(res);
            System.out.println(CryptMeta.decryptMap(res));
            map.clear();
            map.put("ROLE", GrantedRole.SUB_SUPER_USER.name());
            map.put("", "");
            res = CryptMeta.encryptMap(map);
            System.out.println(res);
            System.out.println(CryptMeta.decryptMap(res));


        });

    }

    @Test
    @SneakyThrows
    @WithUserDetails("hophay")
    void assignToProject() {
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "/assign?token=3d04790adcce0bc814787f02cb50e2d2d4d372f2910c12df3ff2fee6e585ed7b3dac730a9d604a310057b0d1e7213460")).andExpect(status().isConflict()).andDo(print());
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void assignToProjectOk() {
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "/assign?token=3d04790adcce0bc814787f02cb50e2d2d4d372f2910c12dfз9ш()*3ff2fee6e585ed7b3dac730a9d604a310057b0d1e7213460")).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void assignToProjectInvalid() {
        mockMvc.perform(MockMvcRequestBuilders.post(basePath + "/assign?token=3d04790adcce0bc814787f02cb50e2d2d4d372f2910c12df3ff2fee6e585ed7b3dac730a9d604a310057b0d1e7213460жыдлупдлзщзщ")).andExpect(status().isBadRequest()).andDo(print());
    }
    @Test
    @SneakyThrows
    @WithUserDetails("test3422")
    void  analityc(){
        mockMvc.perform(MockMvcRequestBuilders.get("/analytics/217" + "/get")).andExpect(status().isOk()).andDo(print());

    }


}

