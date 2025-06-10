package com.api.manager.entity;

import com.api.manager.common.GrantedRole;
import com.api.manager.common.GrantedRoleConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Data
@Table(name = "role")
@NoArgsConstructor
public class RoleDb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private UserDb userDb;

    @NonNull
    @Convert(converter = GrantedRoleConverter.class)
    private GrantedRole granted;

    @ManyToOne
    @JoinColumn(name = "id_project", nullable = false)
    private ProjectDb projectDb;

    public RoleDb(UserDb userDb, @NonNull GrantedRole granted, ProjectDb projectDb) {
        this.userDb = userDb;
        this.granted = granted;
        this.projectDb = projectDb;

    }

    public RoleDb(@NonNull Long id) {
        this.id = id;
    }

}
