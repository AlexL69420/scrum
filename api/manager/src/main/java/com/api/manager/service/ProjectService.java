package com.api.manager.service;

import com.api.manager.auth.UserDetailImpl;
import com.api.manager.common.CryptMeta;
import com.api.manager.common.GrantedRole;
import com.api.manager.common.Mapping;
import com.api.manager.common.SharedURLField;
import com.api.manager.dto.RoleDTO;
import com.api.manager.exception_handler_contoller.NotSavedResource;
import com.api.manager.exception_handler_contoller.NotSavedStoreUserException;
import com.api.manager.entity.ProjectDb;
import com.api.manager.entity.RoleDb;
import com.api.manager.entity.UserDb;
import com.api.manager.dto.ProjectDTO;
import com.api.manager.repository.MetaRepository;
import com.api.manager.repository.ProjectRepository;
import com.api.manager.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.InternalException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;


@Service
@Slf4j
public class ProjectService {
    //refactoring SingleResponseAbility
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;

    private final MetaRepository metaRepository;
    private long idProject;

    ProjectService(ProjectRepository projectRepository, RoleRepository roleRepository, MetaRepository repository) {
        this.projectRepository = projectRepository;
        this.roleRepository = roleRepository;
        this.metaRepository = repository;
    }


    public List<ProjectDTO> getAll(@NonNull UserDetailImpl userDetail) {
        try {
            return roleRepository.getAllByUserDb(new UserDb(userDetail.getId())).stream()
                    .map(r -> {
                        ProjectDTO projectDto = Mapping.toProjectDto(r.getProjectDb());
                        metaRepository.findById(r.getId())
                                .ifPresentOrElse(projectDto::setMetaEntity,
                                        () -> log.info("MetaEntity not found for role id: {}", r.getId()));
                        return projectDto;
                    })
                    .toList();
        } catch (Exception ex) {
            log.error("Error while fetching project roles: {}", ex.getMessage());

            throw new InternalException("Failed to fetch project roles", ex);
        }
    }

    public ProjectDTO get(long idProject) {
        try {
            ProjectDTO projectDTO = Mapping.toProjectDto(projectRepository.findById(idProject).orElseThrow());
            metaRepository.findById(idProject).ifPresentOrElse(projectDTO::setMetaEntity, () -> log.info("Not meta project"));
            return projectDTO;
        } catch (Exception e) {
            if (e instanceof NoSuchElementException) {
                throw new NoSuchElementException("Not Found Project");
            }
            throw new InternalException("Failed get Project", e);
        }
    }

    //refactoring method
    @Transactional
    public ProjectDTO create(@NonNull ProjectDTO projectDTO, @NonNull UserDetailImpl userDetail) {
        try {
            UserDb userDb = new UserDb(userDetail.getId());
            userDb.setName(userDetail.getName());
            ProjectDb projectDb = projectRepository.save(new ProjectDb(projectDTO.getName(), userDb));
            RoleDb roleDb = new RoleDb(userDb, GrantedRole.SUPER_USER, projectDb);
            roleRepository.save(roleDb);
            return Mapping.toProjectDto(projectDb);
        } catch (Exception ex) {
            throw new InternalException("Failed create project", ex);
        }
    }

    @Transactional
    public void delete(long idProject) {
        try {
            if (projectRepository.existsById(idProject)) {
                projectRepository.deleteById(idProject);
                return;
            }
            throw new NoSuchElementException("Project not Found");
        } catch (Exception e) {
            throw new InternalException("Couldn't delete project", e);
        }
    }

    //refactoring method
    @Transactional
    public ProjectDTO save(@NonNull ProjectDTO projectDTO, long idProject) {
        try {
            ProjectDb projectDb = projectRepository.findById(idProject).orElseThrow();
            projectDb.setName(projectDTO.getName());
            projectDb = projectRepository.save(projectDb);
            return Mapping.toProjectDto(projectDb);
        } catch (Exception ex) {
            if (ex instanceof NoSuchElementException) {
                throw new NotSavedResource(ex.getMessage(), ex);
            }
            throw new InternalException("Failed save project", ex);
        }
    }

    public String getUrlShared(@NonNull GrantedRole requiredRole, long idProject) {
        if (!projectRepository.existsById(idProject)) {
            throw new NoSuchElementException("Project not Found");
        }
        return CryptMeta.encryptMap((Map.of(SharedURLField.ROLE.name(), requiredRole.name(), SharedURLField.PROJECT_ID.name(),
                String.valueOf(idProject))));
    }
    public List<RoleDTO> getUsersRoleOnProject(@NonNull Long idProject) {
        return roleRepository.getAllByProjectDb(new ProjectDb(idProject)).stream().map(Mapping::toRoleDTO).toList();
    }
    //refactoring
    public long assignToProject(@NonNull String token, @NonNull UserDetailImpl userDetail) {

        Optional<Map<String, String>> param = CryptMeta.decryptMap(token);
        if (param.isEmpty()) {
            throw new NoSuchElementException("Incorrect param");
        }

        Function<Map<String, String>, Optional<Map.Entry<GrantedRole, Long>>> extract = m -> {
            if (m.size() != 2) {
                return Optional.empty();
            }
            try {
                return Optional.of(new AbstractMap.SimpleEntry<>(GrantedRole.valueOf(m.get(SharedURLField.ROLE.name())),
                        Long.parseLong(m.get(SharedURLField.PROJECT_ID.name()))));
            } catch (Exception e) {
                return Optional.empty();
            }
        };
        Map.Entry<GrantedRole, Long> values = extract.apply(param.get()).orElseThrow();
        UserDb userDb = new UserDb(userDetail.getId());
        ProjectDb projectDb = new ProjectDb(values.getValue());
        if (roleRepository.existsByUserDbAndProjectDb(userDb, projectDb)) {
            throw new NotSavedStoreUserException("There is already such a user on the project.", new Throwable());
        }
        try {
            roleRepository.save(new RoleDb(userDb, values.getKey(), projectDb));
            return projectDb.getId();
        } catch (Exception e) {
            throw new InternalException("Failed save role user.", e);
        }


    }

}
