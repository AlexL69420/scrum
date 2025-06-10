package com.api.manager.controller;

import com.api.manager.common.GrantedRole;
import com.api.manager.common.SecurityUtils;
import com.api.manager.dto.ProjectDTO;
import com.api.manager.dto.RoleDTO;
import com.api.manager.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//auth/authenticate
//project/get_all
//project/create
//eyJhbGciOiJIUzUxMiJ9.eyJJRCI6NDEsInN1YiI6InRlc3QzNDIyIiwiaWF0IjoxNzQ0NjI2MTgyLCJleHAiOjE3NDQ2NDQxODJ9.0RQQ4ypzoa2F61YWvdUvTEQEmdD8p_KxEeYoDydnoVZBVBIVOupFxzlzGqct1Xghc3jU16o7eQDW6wXRZ17o-Q
//{
//    "login":"test3422",
//    "password":12345678,
//    "name":"test423"
//}
@RestController
@RequestMapping("/project")
@Tag(name = "ProjectController", description = "Контреллер отвечает за работу с проектами конкретного пользователя пользователя. Требуется аутентификациия")
public class ProjectController {
    private final ProjectService projectService;

    ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/get_all")
    @ResponseBody
    @Tag(name = "/get_all", description = "Доступен всем пользователям. Получение списка проектов, в которых пользователь записан." + "\n" +
            "возвращает: HttpStatus.INTERNAL_SERVER_ERROR -если проблема с сервером")
    List<ProjectDTO> getAll() {
        return projectService.getAll(SecurityUtils.getCurrentUserDetail());
    }

    @PostMapping("/create")
    @ResponseBody
    @Tag(name = "/create", description = "Доступен всем пользователям. Создать проект. Обязательно имя проекта.\n" +
            "возвращает: HttpStatus.INTERNAL_SERVER_ERROR -если проблема с сервером,HttpStatus.BAD_REQUEST - при некорректных данных")
    ProjectDTO create(@RequestBody @Valid ProjectDTO projectDTO) {
        return projectService.create(projectDTO, SecurityUtils.getCurrentUserDetail());
    }

    @GetMapping("{project_id}/get_user_role")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUser(#projectId)")
    @Tag(name = "/get_user_role", description = "Доступен пользователям с ролями SUPER_USER,SUB_SUPER_USER. Получить список user-role на самом проекте.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа")
    List<RoleDTO> getUserRole(@PathVariable("project_id") Long projectId) {
        return projectService.getUsersRoleOnProject(projectId);
    }

    @PostMapping("/{project_id}/update")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUser(#projectId)")
    @Tag(name = "/update", description = "Доступен пользователю с ролью Product Owner (SuperUser). Изменить проект.\n" +
            "Обязательно id проекта и имя, возвращает: HttpStatus.INTERNAL_SERVER_ERROR -если проблема с сервером,HttpStatus.BAD_REQUEST - при некорректных данных\n" +
            "HttpStatus.FORBIDDEN - если доступ с этой ролью запрещен")
    ProjectDTO save(@PathVariable("project_id") Long projectId, @RequestBody @Valid ProjectDTO projectDTO) {
        return projectService.save(projectDTO, projectId);
    }

    @GetMapping("/{project_id}/get")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUserOrUser(#projectId)")
    @Tag(name = "/get", description = "Доступен пользователю с любой ролью.Получить проект.\n" +
            "возвращает: HttpStatus.INTERNAL_SERVER_ERROR -если проблема с сервером,\n" +
            "HttpStatus.FORBIDDEN - если пользователь не имеет доступ к данному проекту/проект отсутствует")
    ProjectDTO getProject(@PathVariable("project_id") Long projectId) {
        return projectService.get(projectId);
    }

    @DeleteMapping("/{project_id}/delete")
    @PreAuthorize("@inspectGrantedRole.hasSuperUser(#projectId)")
    @Tag(name = "/delete", description = "Доступен пользователю с  ProductOwner(ProductOwner любой).Удалить проект.\n" +
            "возвращает: HttpStatus.INTERNAL_SERVER_ERROR -если проблема с сервером,\n" +
            "HttpStatus.FORBIDDEN - если пользователь не имеет доступ к данному проекту/проект отсутствует")
    void deleteProject(@PathVariable("project_id") Long projectId) {
        projectService.delete(projectId);
    }

    @GetMapping("/{project_id}/shared")
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUser(#projectId)")
    @ResponseBody
    @Tag(name = "/shared", description = "Доступен пользователю с ролью ProductOwner/Scrum мастер любой).Поделиться.\n" +
            "возвращает:" + "HttpStatus.FORBIDDEN - если пользователь не имеет доступ к данному проекту/проект отсутствует/неверные параметры\n" +
            "в body:  /share?token=." + "У тебя конечная точка /share пользователь переходит по ссылку твой адрес +/share?token=.\n" +
            "Даллее если у тебя есть токен делаешь запрос на /assign, если его нет то получаешь. " +
            "role параметр имеет значения USER|SUB_SUPER_USER|SUPER_USER: USER (Разрабаб) " +
            "SUB_SUPER_USER(SCRUM) " + " SUPER_USER(Product Owner)")
    String getSharedUrl(@PathVariable("project_id") Long projectId, @RequestParam(value = "role") GrantedRole requiredRole) {
        return "/share?token=" + projectService.getUrlShared(requiredRole, projectId);
    }//http://localhost:5173/share?token=wit0wite0itw0tiew

    //->Uk9MRT1VU0VSL1BST0pFQ1RfSUQ9MTUwLw==
    @PostMapping("/assign")
    @ResponseBody
    @Tag(name = "/assign", description = "Доступен пользователю с ролью любой). Назначить на проект.\n" +
            "возвращает:" + " HttpStatus.NOT_FOUND - если некоректные токен" + " HttpStatus.CONFLICT - если пользователь уже есть на проекте " +
            "В body: id проекта. Потом можеть перенаправить на сам проект и получить проект/taskBoard и тд")
    long assignToProject(@RequestParam(value = "token") String token) {
        return projectService.assignToProject(token, SecurityUtils.getCurrentUserDetail());
    }
}
