package com.example.bazaquestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionRequest {
    
    @NotBlank(message = "Вопрос не может быть пустым")
    private String question;
    
    @NotBlank(message = "Быстрый ответ не может быть пустым")
    private String quickAnswer;
    
    @NotBlank(message = "Подробный ответ не может быть пустым")
    private String detailedAnswer;
    
    @NotBlank(message = "Пример кода не может быть пустым")
    private String codeExample;
    
    private Long subtopicId;
} 