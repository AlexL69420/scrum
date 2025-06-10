package com.api.manager.repository;

import com.api.manager.entity.ProjectDb;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectDb, Long> {
}
