package com.api.manager.controller;

import com.api.manager.common.GrantedRole;
import com.api.manager.common.SecurityUtils;
import com.api.manager.dto.ProjectDTO;
import com.api.manager.dto.SprintDTO;
import com.api.manager.service.SprintBoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sprint_board/{project_id}")
@Tag(name = "SprintBoardController", description = "Контреллер отвечает за обработку SPRINT. Требуется аутентификациия")
public class SprintBoardController {
    private final SprintBoardService sprintBoardService;

    SprintBoardController(SprintBoardService sprintBoardService) {
        this.sprintBoardService = sprintBoardService;
    }

    @PostMapping("/create")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUser(#projectId)")
    @Tag(name = "/create", description = "Доступен пользователям с ролями SUPER_USER,SUB_SUPER_USER. Создать спринт, не задачу!.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа,HttpStatus.BAD_REQUEST - при некорректных данных")
    SprintDTO create(@PathVariable("project_id") Long projectId, @RequestBody @Valid SprintDTO sprintDTO) {
        return sprintBoardService.create(sprintDTO, projectId);
    }

    @GetMapping("/get_all")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUser(#projectId)")
    @Tag(name = "/get_all", description = "Доступен пользователям с ролями SUPER_USER,SUB_SUPER_USER.Получить список спринтов, не задачу!.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа,HttpStatus.BAD_REQUEST - при некорректных данных\n" +
            "Статусы которые имеет спринт ->   TO_DO,\n" +
            "    COMPLETE,\n" +
            "    EXPIRED - это просроченый спринт время выполнения истекло")
    List<SprintDTO> getAll(@PathVariable("project_id") Long projectId) {
        return sprintBoardService.getAll(projectId);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUser(#projectId)")
    @Tag(name = "/delete", description = "Доступен пользователям с ролями SUPER_USER,SUB_SUPER_USER.Удалить спринт.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа, HttpStatus.NOT_FOUND если спринг не найден")
    void delete(@PathVariable("project_id") Long projectId, @RequestParam(value = "id") Long idSprint) {
        sprintBoardService.delete(idSprint);
    }


}

