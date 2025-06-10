package com.api.manager.controller;

import com.api.manager.common.SecurityUtils;
import com.api.manager.dto.ProjectDTO;
import com.api.manager.dto.RoleDTO;
import com.api.manager.dto.UserDTO;
import com.api.manager.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@Tag(name = "UserController", description = "Контреллер отвечает за обработку пользователя пользователя. Требуется аутентификациия")
public class UserController {
    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/get")
    @ResponseBody
    @Tag(name = "/get", description = "Доступен только аутентифицированому пользователю. Получение user без логина, пароля" + "\n" +
            "возвращает: HttpStatus.INTERNAL_SERVER_ERROR -если проблема с сервером")
    UserDTO getAll() {
        return userService.get(SecurityUtils.getCurrentUserDetail());
    }

    @GetMapping("/get_role/{project_id}")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUserOrUser(#projectId)")
    @Tag(name = "/get_role", description = "Получение РОЛИ на проекте. SUPER_USER(Product Owner),SUB_SUPER_USER(SCRUM),USER (РАЗРАБ)" + "\n" +
            "возвращает:HttpStatus.FORBIDDEN - если пользователя нет на проекте/проект отсутствует ")
    RoleDTO getRoleOnProject(@PathVariable("project_id") long projectId) {
        return userService.getRoleUserOnProject(SecurityUtils.getCurrentUserDetail(), projectId);
    }

}
