package com.api.manager.dto;

import com.api.manager.common.GrantedRole;
import com.api.manager.common.GrantedRoleConverter;
import com.api.manager.entity.UserDb;
import jakarta.annotation.Nullable;
import jakarta.persistence.Convert;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    @Nullable
    private Long id;
    @NonNull
    private UserDTO user;
    @NonNull
    private GrantedRole granted;
}
