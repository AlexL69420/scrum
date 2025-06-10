package com.api.manager.service;

import com.api.manager.common.Mapping;
import com.api.manager.common.StatusObj;
import com.api.manager.dto.SprintDTO;
import com.api.manager.entity.SprintDb;
import com.api.manager.entity.TaskDb;
import com.api.manager.exception_handler_contoller.NotSavedResource;
import com.api.manager.repository.SprintRepository;
import com.api.manager.repository.TaskBoardRepository;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SprintBoardService {
    private final SprintRepository sprintRepository;
    private final TaskBoardRepository taskBoardRepository;

    SprintBoardService(TaskBoardRepository taskBoardRepository, SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
        this.taskBoardRepository = taskBoardRepository;
    }

    private LocalDateTime getTimeExpired(Integer interval) {
        return LocalDateTime.now().plusDays(interval);
    }

    private boolean hasTimeExpired(LocalDateTime dateTime) {
        return dateTime.isBefore(LocalDateTime.now());
    }

    public SprintDTO create(@NonNull SprintDTO sprintDTO, long idProject) {
        if (sprintDTO.getDaysInterval() <= 0) {
            throw new NotSavedResource("day <= 0", new Throwable());
        }
        SprintDb sprintDb = new SprintDb(getTimeExpired(sprintDTO.getDaysInterval()),
                sprintDTO.getDaysInterval(), idProject, StatusObj.TO_DO, sprintDTO.getPriority(), sprintDTO.getPurpose());
        return Mapping.toSprintDTO(sprintRepository.save(sprintDb));
    }

    public List<SprintDTO> getAll(long idProject) {
        return sprintRepository.findSprintDbByIdProject(idProject).stream().map(s -> {
            SprintDTO sprintDTO = Mapping.toSprintDTO(s);
            List<TaskDb> taskDbs=taskBoardRepository.getAllBySprintDb(s);
            boolean isCompleted = !taskDbs.isEmpty()&&taskDbs.stream().allMatch(taskDb -> taskDb.getStatus() == StatusObj.COMPLETE);
            if (isCompleted) {
                sprintDTO.setStatus(StatusObj.COMPLETE);
            }
            if (hasTimeExpired(s.getTimeExpired())) {
                sprintDTO.setStatus(StatusObj.EXPIRED);
            }
            return sprintDTO;
        }).toList();
    }

    @Transactional
    public void delete(long idSprint) {
        SprintDb sprintDb = new SprintDb();
        sprintDb.setId(idSprint);
        if (!sprintRepository.existsById(idSprint)) {
            throw new NoSuchElementException("Sprint not found");
        }
        sprintRepository.delete(sprintDb);
    }
}
