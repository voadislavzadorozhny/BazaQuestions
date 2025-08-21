package com.example.bazaquestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    @NotBlank(message = "Логин не может быть пустым")
    private String username;
    
    @NotBlank(message = "Пароль не может быть пустым")
    private String password;
} 