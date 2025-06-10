package com.api.manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
public class UserDb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Size(max = 250)
    private String name;
    @Null
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
    @Size(max = 150)
    private String email;
    @NotBlank
    @Size(min = 5, max = 250)
    private String login;
    @NotBlank
    @Size(min = 8, max = 550)
    private String password;

    public UserDb(Long id) {
        this.id = id;
    }
}
