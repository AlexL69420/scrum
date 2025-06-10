package com.api.manager.entity;

import com.api.manager.common.StatusObj;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Sprint")
@NoArgsConstructor
public class SprintDb {//LocalDateTime
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private LocalDateTime timeExpired;
    @NonNull
    private Integer days;
    @NonNull
    private Long idProject;
    @Null
    private Long idMeta;

    @NonNull
    @Enumerated(EnumType.STRING)
    private StatusObj status;

    @NonNull
    private Integer priority;

    @NonNull
    private String purpose;

    public SprintDb(@NonNull LocalDateTime timeExpired, @NonNull Integer days, @NonNull Long idProject, @NonNull StatusObj status,
                    @NonNull Integer priority, @NonNull String purpose) {
        this.timeExpired = timeExpired;
        this.days = days;
        this.idProject = idProject;
        this.priority = priority;
        this.purpose = purpose;
        this.status = status;
    }

    public SprintDb(@NonNull Long idSprint) {
        this.id = idSprint;
    }

}
