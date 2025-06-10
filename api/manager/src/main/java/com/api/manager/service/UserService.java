package com.api.manager.service;

import com.api.manager.auth.UserDetailImpl;
import com.api.manager.common.Mapping;
import com.api.manager.dto.RoleDTO;
import com.api.manager.dto.UserDTO;
import com.api.manager.entity.ProjectDb;
import com.api.manager.entity.RoleDb;
import com.api.manager.entity.UserDb;
import com.api.manager.exception_handler_contoller.NotGetObjException;
import com.api.manager.repository.RoleRepository;
import com.api.manager.repository.UserRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.Role;
import org.apache.logging.log4j.util.InternalException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public UserDTO get(@NonNull UserDetailImpl userDetail) {
        return userRepository.findById(userDetail.getId())
                .map(Mapping::toUserDto)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public RoleDTO getRoleUserOnProject(@NonNull UserDetailImpl userDetail, long idProject) {
       return roleRepository.findByUserDbAndProjectDb(new UserDb(userDetail.getId()), new ProjectDb(idProject)).map(Mapping::toRoleDTO)
                .orElseThrow(()->new NoSuchElementException("Role on project not found"));
    }
}
