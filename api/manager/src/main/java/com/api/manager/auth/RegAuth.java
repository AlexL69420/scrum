package com.api.manager.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegAuth {
    @NotBlank
    @Size(min = 5, max = 250)
    private String login;
    @NotBlank
    @Size(min = 8, max = 550)
    private String password;
    @NotBlank
    @Size(max = 250)
    private String name;
}
