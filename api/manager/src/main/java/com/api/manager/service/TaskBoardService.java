package com.api.manager.service;

import com.api.manager.auth.UserDetailImpl;
import com.api.manager.common.Mapping;
import com.api.manager.common.StatusObj;
import com.api.manager.dto.DetailTaskDTO;
import com.api.manager.dto.HiredEmployeeDTO;
import com.api.manager.dto.TaskDTO;
import com.api.manager.dto.TeamDTO;
import com.api.manager.entity.*;
import com.api.manager.exception_handler_contoller.NotSavedResource;
import com.api.manager.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class TaskBoardService {
    private final TaskBoardRepository taskBoardRepository;
    private final RoleRepository roleRepository;
    private final TeamRepository teamRepository;
    private final HiredEmployeeRepository hiredEmployeeRepository;

    TaskBoardService(TaskBoardRepository taskBoardRepository, TeamRepository teamRepository, RoleRepository roleRepository,
                     HiredEmployeeRepository hiredEmployeeRepository) {
        this.taskBoardRepository = taskBoardRepository;
        this.roleRepository = roleRepository;
        this.teamRepository = teamRepository;
        this.hiredEmployeeRepository = hiredEmployeeRepository;
    }

    private void validateEmployees(List<HiredEmployeeDTO> employeeDTOList, Long idProject) {
        boolean allRolesValid = employeeDTOList.stream()
                .allMatch(employeeDTO -> roleRepository.existsByIdAndProjectDb(
                        employeeDTO.getIdRole(),
                        new ProjectDb(idProject)
                ));

        if (!allRolesValid) {
            log.error("NOT VALID:" + idProject);
            throw new NotSavedResource("Not Available", new Throwable());
        }
    }

    private TaskDb createTask(Long idSpring, String detail) {
        return taskBoardRepository.save(new TaskDb(new SprintDb(idSpring), StatusObj.TO_DO, detail));
    }

    private TeamDb createTeam(TaskDb taskDb, String teamName) {
        return teamRepository.save(new TeamDb(taskDb, teamName));
    }

    private List<HiredEmployeeDB> createHiredEmployees(Stream<HiredEmployeeDTO> employeeDTOList, TeamDb teamDb) {
        try {
            return hiredEmployeeRepository.saveAll(
                    employeeDTOList.map(employeeDTO -> new HiredEmployeeDB(
                                    new RoleDb(employeeDTO.getIdRole()),
                                    new TeamDb(teamDb.getId()),
                                    employeeDTO.getNameEmployee(),
                                    Objects.requireNonNull(employeeDTO.getNameUser())
                            ))
                            .toList()
            );
        } catch (Exception e) {
            log.error("CREATE EMPLOYEE:" + e.getMessage());
            throw new NotSavedResource("Invalid data:" + e.getMessage(), e);
        }
    }

    @Transactional
    public DetailTaskDTO create(@NonNull DetailTaskDTO detailTaskDTO, @NonNull Long idSpring, @NonNull Long idProject) {
        log.info("ROLE EMPLOYEE:" + detailTaskDTO.getTeamDTO().toString());
        validateEmployees(detailTaskDTO.getTeamDTO().getHiredEmployeeDTOList(), idProject);
        TaskDb taskDb = createTask(idSpring, detailTaskDTO.getDetail());
        TeamDb teamDb = createTeam(taskDb, detailTaskDTO.getTeamDTO().getName());
        List<HiredEmployeeDB> employeeDBS = createHiredEmployees(detailTaskDTO.getTeamDTO().getHiredEmployeeDTOList()
                .stream().peek(s -> s.setNameUser(roleRepository.findById(s.getIdRole()).orElseThrow().getUserDb().getName())), teamDb);
        return Mapping.toDetailTaskDTO(taskDb, Mapping.toTeamDTO(teamDb, employeeDBS.stream().map(Mapping::toHiredEmployeeDTO).toList()));
    }

    public List<TaskDTO> getTasksOnSprint(@NonNull Long idSprint) {
        SprintDb sprintDb = new SprintDb(idSprint);

        return taskBoardRepository.getAllBySprintDb(sprintDb).stream()
                .map(this::getMapTaskToTaskDTO)
                .collect(Collectors.toList());
    }

    private TaskDTO getMapTaskToTaskDTO(TaskDb taskBoardDb) {

        TeamDb teamDb = teamRepository.getTeamDbByTaskDb(taskBoardDb)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + taskBoardDb.getId()));
        TeamDTO teamDTO = getToTeamDTO(teamDb);
        return Mapping.toTaskDTO(taskBoardDb);
    }

    private TeamDTO getToTeamDTO(TeamDb teamDb) {
        List<HiredEmployeeDTO> hiredEmployeeDTOs = hiredEmployeeRepository.getAllByTeamDb(teamDb).stream()
                .map(Mapping::toHiredEmployeeDTO)
                .collect(Collectors.toList());

        return Mapping.toTeamDTO(teamDb, hiredEmployeeDTOs);
    }


    public List<TaskDTO> getTaskCommandProject(@NonNull UserDetailImpl userDetail, @NonNull Long idProject) {
        return roleRepository.findByUserDbAndProjectDb(new UserDb(userDetail.getId()), new ProjectDb(idProject))
                .map(roleDb -> hiredEmployeeRepository.getAllByRoleDb(roleDb).stream()
                        .map(hiredEmployee -> hiredEmployee.getTeamDb().getId())
                        .map(teamId -> teamRepository.findById(teamId).orElseThrow())
                        .map(TeamDb::getTaskDb)
                        .map(TaskDb::getId)
                        .map(taskBoardRepository::findById)
                        .map(s -> Mapping.toTaskDTO(s.orElseThrow()))
                        .toList())
                .orElse(Collections.emptyList());
    }

    public TaskDTO setStatusTask(@NonNull String statusObj, @NonNull Long idTask) {
        log.info("STATUS:"+statusObj);
        try {
            StatusObj.valueOf(statusObj);

        } catch (Exception e) {
            throw new NotSavedResource("Illegral Status", e);
        }
        TaskDb taskDb = taskBoardRepository.findById(idTask).orElseThrow();
        taskDb.setStatus(StatusObj.valueOf(statusObj));
        taskDb = taskBoardRepository.save(taskDb);
        return Mapping.toTaskDTO(taskDb);
    }
  /*  public List<DetailTaskDTO> getAll(@NonNull Long idSpring, @NonNull UserDetailImpl userDetail, @NonNull Long idProject) {

    }*/
}


