package com.api.manager.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HiredEmployeeDTO {
    @Nullable
    private Long idTeam;
    @Nullable
    private Long id;
    @Nullable
    private String nameUser;
    @NonNull
    private String nameEmployee;
    @NonNull
    private Long idRole;
}
