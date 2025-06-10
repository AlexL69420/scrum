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
@Table(name = "team")
public class TeamDb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    @NotBlank
    private String name;

    @NonNull
    @OneToOne
    @JoinColumn(name = "id_task", nullable = false)
    private TaskDb taskDb;

    public TeamDb(@NonNull TaskDb taskDb, @NonNull String name) {
        this.taskDb = taskDb;
        this.name = name;
    }
    public  TeamDb(@NonNull Long id){
        this.id=id;
    }
    public  TeamDb(){};

}
