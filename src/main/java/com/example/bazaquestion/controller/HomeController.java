package com.example.bazaquestion.controller;

import com.example.bazaquestion.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ApiResponse<Map<String, Object>> home() {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "BazaQuestion API работает!");
        data.put("version", "1.0");
        data.put("endpoints", Map.of(
            "auth", "/api/auth/**",
            "questions", "/api/questions/**",
            "swagger", "/swagger-ui/index.html"
        ));
        
        return new ApiResponse<>(true, "API доступен", data);
    }
} 