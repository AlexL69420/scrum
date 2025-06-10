package com.api.manager.dto;

import com.api.manager.common.StatusObj;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailTaskDTO {
    @Nullable
    private Long id;
    @Nullable
    private Long idSprint;
    @Nullable
    private StatusObj status;
    @NonNull
    @NotBlank
    private String detail;
    @NonNull
    private TeamDTO teamDTO;

}
