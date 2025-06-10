package com.api.manager.dto;

import com.api.manager.common.StatusObj;
import jakarta.annotation.Nullable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SprintDTO {

    private Long id;

    @NonNull
    private Integer daysInterval;

    @Nullable
    private Long idProject;
    @Nullable
    private String timeExpired;
    @Nullable
    private Long idMeta;

    @Nullable
    private StatusObj status;

    @NonNull
    private Integer priority;

    @NonNull
    @NotBlank
    private String purpose;

    public SprintDTO(long id, @NonNull LocalDateTime timeExpired, @NonNull Integer days, @NonNull Long idProject, @NonNull StatusObj status,
                     @NonNull Integer priority, @NonNull String purpose) {
        this.timeExpired = timeExpired.toString();
        this.daysInterval = days;
        this.idProject = idProject;
        this.priority = priority;
        this.purpose = purpose;
        this.status = status;
        this.id = id;
    }
}


