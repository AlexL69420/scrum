package com.api.manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@Data
@Entity
@Table(name = "hired_employee")
public class HiredEmployeeDB {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "id_role", nullable = false)
    private RoleDb roleDb;

    @NonNull
    @OneToOne
    @JoinColumn(name = "id_team", nullable = false)
    private  TeamDb teamDb;

    @NonNull
    @NotBlank
    private String name;

    @NonNull
    @NotBlank
    private String nameUser;
    public  HiredEmployeeDB(){}

    public  HiredEmployeeDB(@NonNull RoleDb roleDb, @NonNull TeamDb teamDb, @NonNull String nameEmployee, @NonNull String nameUser) {
        this.roleDb=roleDb;
        this.teamDb=teamDb;
        this.name=nameEmployee;
        this.nameUser=nameUser;
    }
}
