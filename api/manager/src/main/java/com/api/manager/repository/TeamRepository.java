package com.api.manager.repository;

import com.api.manager.entity.TaskDb;
import com.api.manager.entity.TeamDb;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<TeamDb, Long> {
    Optional<TeamDb> getTeamDbByTaskDb(@NonNull TaskDb taskDb);
    List<TeamDb> getAllByTaskDbIn(@NonNull List<TaskDb> tasks);
}
