package com.api.manager.entity;

import com.api.manager.common.StatusObj;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@Entity
@Table(name = "Task")
public class TaskDb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    @ManyToOne
    @JoinColumn(name = "id_sprint", nullable = false)
    private SprintDb sprintDb;
    @NonNull
    @Enumerated(EnumType.STRING)
    private StatusObj status;
    @NonNull
    @NotBlank
    private String detail;


    public TaskDb(@NonNull SprintDb sprintDb, @NonNull StatusObj statusObj,@NonNull String detail) {
        this.sprintDb=sprintDb;
        this.status=statusObj;
        this.detail=detail;
    }
    public TaskDb(){}
    public  TaskDb(@NonNull Long idTask){
        this.id=idTask;
    }
}
