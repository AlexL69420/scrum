package com.api.manager.repository;

import com.api.manager.entity.SprintDb;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository extends JpaRepository<SprintDb, Long> {
    List<SprintDb> findSprintDbByIdProject(@NonNull Long idProject);

    boolean existsByIdAndIdProject(@NonNull Long id, @NonNull Long idProject);
}
