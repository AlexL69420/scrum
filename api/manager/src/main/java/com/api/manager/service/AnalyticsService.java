package com.api.manager.service;

import com.api.manager.common.Mapping;
import com.api.manager.common.StatusObj;
import com.api.manager.dto.AnalyticsDTO;
import com.api.manager.dto.SprintDTO;
import com.api.manager.entity.SprintDb;
import com.api.manager.entity.TaskDb;
import com.api.manager.repository.SprintRepository;
import com.api.manager.repository.TaskBoardRepository;
import com.api.manager.repository.TeamRepository;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

//all refactoring
@Service
public class AnalyticsService {

    private final SprintRepository sprintRepository;
    private final TaskBoardRepository taskBoardRepository;

    AnalyticsService(SprintRepository sprintRepository, TaskBoardRepository taskBoardRepository,
                     TeamRepository teamRepository) {
        this.sprintRepository = sprintRepository;
        this.taskBoardRepository = taskBoardRepository;
    }

    public AnalyticsDTO getAnalytics(@NonNull Long projectId) {
        AnalyticsDTO analyticsDTO = new AnalyticsDTO();

        // Получаем спринты проекта
        List<SprintDb> sprintDbs = getAll(projectId);

        // Получаем задачи для этих спринтов
        List<TaskDb> taskDbs = taskBoardRepository.findBySprintDbIn(sprintDbs);

        // Считаем общее количество задач
        int totalTasks = taskDbs.size();
        analyticsDTO.setCountTask(totalTasks);

        // Считаем количество задач в статусе TO_DO и COMPLETE
        long toDoTasks = taskDbs.stream().filter(taskDb -> taskDb.getStatus() == StatusObj.TO_DO).count();
        long completedTasks = taskDbs.stream().filter(taskDb -> taskDb.getStatus() == StatusObj.COMPLETE).count();

        analyticsDTO.setCountTaskInToDo((int) toDoTasks);
        analyticsDTO.setCountTaskCompleted((int) completedTasks);

        // Считаем процент завершенных спринтов
        double perCompletedSprint = (double) sprintDbs.stream()
                .filter(s -> s.getStatus() == StatusObj.COMPLETE)
                .count() / sprintDbs.size() * 100;

        // Форматируем процент
        String sprintCompletedPer = (sprintDbs.isEmpty()) ? "0%" : String.format("%.2f%%", perCompletedSprint);

        analyticsDTO.setSprintCompletedPer(sprintCompletedPer);

        return analyticsDTO;
    }

    private boolean hasTimeExpired(LocalDateTime dateTime) {
        return dateTime.isBefore(LocalDateTime.now());
    }
//rafactoring
    private List<SprintDb> getAll(long idProject) {
        return sprintRepository.findSprintDbByIdProject(idProject).stream().peek(s -> {
            List<TaskDb> taskDbs=taskBoardRepository.getAllBySprintDb(s);
            boolean isCompleted = !taskDbs.isEmpty()&&taskDbs.stream().allMatch(taskDb -> taskDb.getStatus() == StatusObj.COMPLETE);
            if (isCompleted) {
                s.setStatus(StatusObj.COMPLETE);
            }
            if (hasTimeExpired(s.getTimeExpired())) {
                s.setStatus(StatusObj.EXPIRED);
            }
        }).toList();
    }

}

