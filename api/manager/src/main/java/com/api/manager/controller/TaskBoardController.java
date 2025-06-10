package com.api.manager.controller;

import com.api.manager.common.SecurityUtils;
import com.api.manager.common.StatusObj;
import com.api.manager.dto.DetailTaskDTO;
import com.api.manager.dto.TaskDTO;
import com.api.manager.service.TaskBoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task_board/{project_id}")
@Tag(name = "TaskBoardController", description = "Контреллер отвечает за обработку ЗАДАЧ. Требуется аутентификациия")
public class TaskBoardController {
    private final TaskBoardService taskBoardService;

    TaskBoardController(TaskBoardService taskBoardService) {
        this.taskBoardService = taskBoardService;
    }

    @PostMapping("/create")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.isAccessSprintOnProjectAndSuperOrSubUser(#projectId,#idSprint)")
    @Tag(name = "/create", description = "Доступен пользователям с ролями SUPER_USER,SUB_SUPER_USER. Создать задачу!.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа,BadRequest - если нанимаемы работник уже есть в команде/ " +
            "При неккоретных параметрах в body")
    DetailTaskDTO create(@PathVariable("project_id") Long projectId, @RequestBody @Valid DetailTaskDTO detailTaskDTO,
                         @RequestParam(value = "id_sprint") Long idSprint) {
        return taskBoardService.create(detailTaskDTO, idSprint, projectId);
    }

    @GetMapping("/get_task_sprint")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.isAccessSprintOnProjectAndSuperOrSubUser(#projectId,#idSprint)")
    @Tag(name = "/get_task_sprint", description = "Доступен пользователям с ролями SUPER_USER,SUB_SUPER_USER. Получить список задач сринта.\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа")
    List<TaskDTO> getAllTaskOnSprint(@PathVariable("project_id") Long projectId, @RequestParam(value = "id_sprint") Long idSprint) {
        return taskBoardService.getTasksOnSprint(idSprint);
    }

    @GetMapping("/get_task_command")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasUserOnProject(#projectId)")
    @Tag(name = "/get_all", description = "Доступен пользователям с ролями USER. Получить список всех задач команды, в который он учавствует .\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа")
    List<TaskDTO> getAllTaskUserRole(@PathVariable("project_id") Long projectId) {
        return taskBoardService.getTaskCommandProject(SecurityUtils.getCurrentUserDetail(), projectId);
    }

    @PutMapping("/set_status")
    @ResponseBody
    @PreAuthorize("@inspectGrantedRole.hasUserOnTask(#projectId,#idTask)")
    @Tag(name = "/get_all", description = "Доступен пользователям с ролями USER. Изменить статус выполнения задачи .\n" +
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа" +
            " Доступный статус:  TO_DO,\n" +
            "    COMPLETE, EXPIRED")
    TaskDTO setStatus(@PathVariable("project_id") Long projectId, @RequestParam(value = "id_task") Long idTask, @RequestParam("status") String statusObj) {
        return taskBoardService.setStatusTask(statusObj, idTask);
    }
}
   /* @GetMapping("/get_all")
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
            "возвращает: HttpStatus.FORBIDDEN -если нет доступа")
    void delete(@PathVariable("project_id") Long projectId, @RequestParam(value = "id") Long idSprint) {
        sprintBoardService.delete(idSprint);
    }


}

*/
