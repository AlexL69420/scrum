package com.api.manager.controller;

import com.api.manager.common.SecurityUtils;
import com.api.manager.dto.TaskDTO;
import com.api.manager.dto.TeamDTO;
import com.api.manager.service.TeamService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team/{project_id}")
@Tag(name = "TeamController", description = "Контреллер отвечает за обработку команд. Требуется аутентификациия")
public class TeamController {
    private final TeamService teamService;

    TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/get_all")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUserOrUser(#projectId)")
    @Tag(name = "/get_all", description = "Доступен пользователям с ролями SUPER_USER|SUB_SUPER_USER. Получить список всех команд и в каждой команде нанятые работники.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа")
    List<TeamDTO> getAllTeamOnProject(@PathVariable("project_id") Long projectId) {
        return teamService.getAllTeamOnProject(projectId);
    }

    @GetMapping("/get_user_team")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasUserOnTask(#projectId,#idTask)")
    @Tag(name = "/get_user_team", description = "Доступен пользователям с ролями USER. Получить команду на задаче и всех работников на ней\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа")
    TeamDTO getUserTeamOnTask(@PathVariable("project_id") Long projectId, @RequestParam(value = "id_task") Long idTask) {
        return teamService.getTeamOnTask(idTask);
    }


}
