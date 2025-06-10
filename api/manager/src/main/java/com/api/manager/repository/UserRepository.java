package com.api.manager.repository;

import com.api.manager.entity.UserDb;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserDb, Long> {
    UserDb getUserByLogin(String login);
}
