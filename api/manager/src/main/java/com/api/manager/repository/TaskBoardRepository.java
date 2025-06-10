package com.api.manager.repository;

import com.api.manager.entity.SprintDb;
import com.api.manager.entity.TaskDb;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskBoardRepository extends JpaRepository<TaskDb, Long> {
    List<TaskDb> getAllBySprintDb(@NonNull SprintDb sprintDb);

    List<TaskDb> findBySprintDbIn(List<SprintDb> sprints);
}

