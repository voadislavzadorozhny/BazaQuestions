package com.example.bazaquestion.controller;

import com.example.bazaquestion.dto.*;
import com.example.bazaquestion.model.User;
import com.example.bazaquestion.service.AuthService;
import com.example.bazaquestion.util.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ApiResponse<UserResponse> registerUser(@Valid @RequestBody RegistrationRequest request,
                                                 BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ошибка валидации");
            return ApiResponse.error(errorMessage);
        }

        try {
            User user;
            if (authService.isFirstUser()) {
                user = authService.createAdminUser(request);
                return ApiResponse.success("Администратор успешно зарегистрирован", UserResponse.fromUser(user));
            } else {
                user = authService.registerUser(request);
                return ApiResponse.success("Пользователь успешно зарегистрирован", UserResponse.fromUser(user));
            }
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", UserResponse.fromUser(user));
            responseData.put("token", token);

            return ApiResponse.success("Успешный вход в систему", responseData);
        } catch (Exception e) {
            return ApiResponse.error("Неверный логин или пароль");
        }
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        SecurityContextHolder.clearContext();
        return ApiResponse.success("Успешный выход из системы", null);
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
            !"anonymousUser".equals(authentication.getName())) {
            User user = (User) authentication.getPrincipal();
            return ApiResponse.success(UserResponse.fromUser(user));
        }
        return ApiResponse.error("Пользователь не аутентифицирован");
    }

    @GetMapping("/check-auth")
    public ApiResponse<Map<String, Object>> checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (authentication != null && authentication.isAuthenticated() && 
            !"anonymousUser".equals(authentication.getName())) {
            User user = (User) authentication.getPrincipal();
            response.put("authenticated", true);
            response.put("user", UserResponse.fromUser(user));
            return ApiResponse.success(response);
        } else {
            response.put("authenticated", false);
            return ApiResponse.success(response);
        }
    }
} 