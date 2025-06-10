package com.api.manager.dto;

import jakarta.annotation.Nullable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamDTO {
    @Nullable
    private Long id;
    @NonNull
    @NotBlank
    private String name;
    @Nullable
    private Long idTask;
    @NonNull
    @NotEmpty
    private List<HiredEmployeeDTO> hiredEmployeeDTOList;
}
