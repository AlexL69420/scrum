package com.api.manager.service;

import com.api.manager.common.Mapping;
import com.api.manager.dto.HiredEmployeeDTO;
import com.api.manager.dto.RoleDTO;
import com.api.manager.dto.TaskDTO;
import com.api.manager.dto.TeamDTO;
import com.api.manager.entity.*;
import com.api.manager.repository.*;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final HiredEmployeeRepository hiredEmployeeRepository;

    private final RoleRepository roleRepository;
    private final SprintRepository sprintRepository;
    private final TaskBoardRepository taskBoardRepository;

    TeamService(TaskBoardRepository taskBoardRepository, SprintRepository sprintRepository, TeamRepository teamRepository, HiredEmployeeRepository hiredEmployeeRepository, RoleRepository roleRepository) {
        this.teamRepository = teamRepository;
        this.hiredEmployeeRepository = hiredEmployeeRepository;
        this.roleRepository = roleRepository;
        this.sprintRepository = sprintRepository;
        this.taskBoardRepository = taskBoardRepository;
    }

    public List<TeamDTO> getAllTeamOnProject(@NonNull Long projectId) {
        List<SprintDb> sprintDbs = sprintRepository.findSprintDbByIdProject(projectId);
        List<TaskDb> taskDbs = taskBoardRepository.findBySprintDbIn(sprintDbs);
        return teamRepository.getAllByTaskDbIn(taskDbs).stream()
                .map(teamDb -> Mapping.toTeamDTO(
                        teamDb,
                        hiredEmployeeRepository.getAllByTeamDb(teamDb).stream()
                                .map(Mapping::toHiredEmployeeDTO)
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public TeamDTO getTeamOnTask(@NonNull Long idTask) {
        TeamDb teamDb = teamRepository.getTeamDbByTaskDb(new TaskDb(idTask)).orElseThrow();
        List<HiredEmployeeDTO> employeeDTOS = hiredEmployeeRepository.getAllByTeamDb(teamDb).stream().map(
                Mapping::toHiredEmployeeDTO
        ).toList();
        return Mapping.toTeamDTO(teamDb, employeeDTOS);
    }


}
