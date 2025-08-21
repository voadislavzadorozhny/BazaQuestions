package com.example.bazaquestion.controller;

import com.example.bazaquestion.dto.ApiResponse;
import com.example.bazaquestion.dto.UserResponse;
import com.example.bazaquestion.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuestions(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            response.put("user", UserResponse.fromUser(user));
            response.put("questions", "Список вопросов будет здесь");
            response.put("message", "Добро пожаловать в базу вопросов по Java и Spring!");
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user-info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserInfo(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            response.put("user", UserResponse.fromUser(user));
            response.put("isAdmin", user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN")));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
} 