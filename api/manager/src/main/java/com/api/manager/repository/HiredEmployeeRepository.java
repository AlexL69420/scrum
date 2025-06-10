package com.api.manager.repository;

import com.api.manager.entity.HiredEmployeeDB;
import com.api.manager.entity.RoleDb;
import com.api.manager.entity.TeamDb;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HiredEmployeeRepository extends JpaRepository<HiredEmployeeDB, Long> {
    List<HiredEmployeeDB> getAllByTeamDb(@NonNull TeamDb teamDb);

    List<HiredEmployeeDB> getAllByRoleDb(@NonNull RoleDb roleDb);

    boolean existsByRoleDbAndTeamDb(@NonNull RoleDb roleDb, @NonNull TeamDb teamDb);

    List<HiredEmployeeDB> getAllByTeamDbIn(@NonNull List<TeamDb> teamDbs);
}
