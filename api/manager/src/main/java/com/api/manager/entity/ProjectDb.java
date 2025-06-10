package com.api.manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "project")
@NoArgsConstructor
public class ProjectDb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 350)
    private String name;

    @ManyToOne
    @JoinColumn(name = "id_creator", nullable = false)
    private UserDb creator;

    public ProjectDb(String name, UserDb userDb) {
        this.creator = userDb;
        this.name = name;
    }

    public ProjectDb(Long id) {
        this.id = id;
    }
}
