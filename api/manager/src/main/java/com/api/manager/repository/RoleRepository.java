package com.api.manager.repository;

import com.api.manager.common.GrantedRole;
import com.api.manager.entity.ProjectDb;
import com.api.manager.entity.RoleDb;
import com.api.manager.entity.UserDb;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleDb, Long> {
    List<RoleDb> getAllByUserDb(@NonNull UserDb userDb);

    Boolean existsByGrantedAndUserDbAndProjectDb(@NonNull GrantedRole granted, @NonNull UserDb userDb, @NonNull ProjectDb projectDb);

    Boolean existsByUserDbAndProjectDb(@NonNull UserDb userDb, @NonNull ProjectDb projectDb);

    Boolean existsByIdAndProjectDb(Long id, ProjectDb projectDb);

    Optional<RoleDb> findByUserDbAndProjectDb(UserDb userDb, ProjectDb projectDb);

    List<RoleDb> getAllByProjectDb(ProjectDb projectDb);
}
