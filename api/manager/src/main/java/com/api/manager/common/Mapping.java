package com.api.manager.common;

import com.api.manager.dto.*;
import com.api.manager.entity.*;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;

import java.util.List;

public class Mapping {


    public static ProjectDTO toProjectDto(@NotNull ProjectDb projectDb) {
        return new ProjectDTO(projectDb.getId(), projectDb.getName(), toUserDto(projectDb.getCreator()), null);
    }

    public static UserDTO toUserDto(@NotNull UserDb userDb) {
        return new UserDTO(userDb.getId(), userDb.getName(), userDb.getEmail());
    }

    public static RoleDTO toRoleDTO(@NotNull RoleDb roleDb) {
        return new RoleDTO(roleDb.getId(), toUserDto(roleDb.getUserDb()), roleDb.getGranted());
    }

    public static SprintDTO toSprintDTO(@NotNull SprintDb sprintDb) {
        return new SprintDTO(sprintDb.getId(), sprintDb.getTimeExpired(), sprintDb.getDays(), sprintDb.getIdProject(), sprintDb.getStatus(),
                sprintDb.getPriority(), sprintDb.getPurpose());
    }

    public static DetailTaskDTO toDetailTaskDTO(@NotNull TaskDb taskDb, @NonNull TeamDTO teamDTO) {

        return new DetailTaskDTO(taskDb.getId(), taskDb.getSprintDb().getId(), taskDb.getStatus(), taskDb.getDetail(), teamDTO
        );
    }

    public static TeamDTO toTeamDTO(@NonNull TeamDb teamDb, @NonNull List<HiredEmployeeDTO> employeeDTOS) {

        return new TeamDTO(teamDb.getId(), teamDb.getName(), teamDb.getTaskDb().getId(), employeeDTOS);
    }

    public static HiredEmployeeDTO toHiredEmployeeDTO(@NonNull HiredEmployeeDB employeeDB) {

        return new HiredEmployeeDTO(employeeDB.getTeamDb().getId(), employeeDB.getId(), employeeDB.getNameUser(),
                employeeDB.getName(), employeeDB.getRoleDb().getId());
    }

    public static TaskDTO toTaskDTO(@NotNull TaskDb taskDb) {
        return new TaskDTO(taskDb.getId(), taskDb.getSprintDb().getId(), taskDb.getStatus(), taskDb.getDetail());
    }

   /* public static DetailTaskDTO toTaskDTO(@NotNull TaskDb taskDb) {
        return new DetailTaskDTO(taskDb.getId(), taskDb.getIdSprint(), taskDb.getStatus(), taskDb.getDetail());
    }*/

}
