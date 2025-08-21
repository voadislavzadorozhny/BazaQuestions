package com.example.bazaquestion.controller;

import com.example.bazaquestion.dto.*;
import com.example.bazaquestion.model.Question;
import com.example.bazaquestion.model.Subtopic;
import com.example.bazaquestion.model.Topic;
import com.example.bazaquestion.model.User;
import com.example.bazaquestion.service.QuestionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionRestController {

    private final QuestionService questionService;

    @GetMapping("/topics")
    public ApiResponse<List<TopicResponse>> getAllTopics() {
        List<Topic> topics = questionService.getAllTopics();
        List<TopicResponse> topicResponses = topics.stream()
                .map(TopicResponse::fromTopic)
                .collect(Collectors.toList());
        
        return ApiResponse.success(topicResponses);
    }

    @GetMapping("/topics/{topicId}")
    public ApiResponse<TopicResponse> getTopicById(@PathVariable Long topicId) {
        return questionService.getTopicById(topicId)
                .map(topic -> ApiResponse.success(TopicResponse.fromTopic(topic)))
                .orElse(ApiResponse.error("Тема не найдена"));
    }

    @GetMapping("/topics/{topicId}/subtopics")
    public ApiResponse<List<SubtopicResponse>> getSubtopicsByTopic(@PathVariable Long topicId) {
        List<Subtopic> subtopics = questionService.getSubtopicsByTopicId(topicId);
        List<SubtopicResponse> subtopicResponses = subtopics.stream()
                .map(SubtopicResponse::fromSubtopic)
                .collect(Collectors.toList());
        
        return ApiResponse.success(subtopicResponses);
    }

    @GetMapping("/subtopics/{subtopicId}/questions")
    public ApiResponse<List<QuestionResponse>> getQuestionsBySubtopic(@PathVariable Long subtopicId) {
        List<Question> questions = questionService.getQuestionsBySubtopicId(subtopicId);
        List<QuestionResponse> questionResponses = questions.stream()
                .map(QuestionResponse::fromQuestion)
                .collect(Collectors.toList());
        
        return ApiResponse.success(questionResponses);
    }

    @GetMapping("/search")
    public ApiResponse<List<QuestionResponse>> searchQuestions(@RequestParam String q) {
        List<Question> questions = questionService.searchQuestions(q);
        List<QuestionResponse> questionResponses = questions.stream()
                .map(QuestionResponse::fromQuestion)
                .collect(Collectors.toList());
        
        return ApiResponse.success(questionResponses);
    }

    @PostMapping("/topics")
    public ApiResponse<TopicResponse> createTopic(
            @RequestParam String name,
            @RequestParam String icon,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("Требуется аутентификация");
        }
        
        User user = (User) authentication.getPrincipal();
        if (!user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            return ApiResponse.error("Требуются права администратора");
        }
        
        try {
            Topic topic = questionService.createTopic(name, icon);
            return ApiResponse.success("Тема успешно создана", TopicResponse.fromTopic(topic));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/subtopics")
    public ApiResponse<SubtopicResponse> createSubtopic(
            @RequestParam String name,
            @RequestParam Long topicId,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("Требуется аутентификация");
        }
        
        User user = (User) authentication.getPrincipal();
        if (!user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            return ApiResponse.error("Требуются права администратора");
        }
        
        try {
            Subtopic subtopic = questionService.createSubtopic(name, topicId);
            return ApiResponse.success("Подтема успешно создана", SubtopicResponse.fromSubtopic(subtopic));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping
    public ApiResponse<QuestionResponse> createQuestion(
            @Valid @RequestBody QuestionRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("Требуется аутентификация");
        }
        
        User user = (User) authentication.getPrincipal();
        if (!user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            return ApiResponse.error("Требуются права администратора");
        }
        
        try {
            Question question = questionService.createQuestion(request, user);
            return ApiResponse.success("Вопрос успешно создан", QuestionResponse.fromQuestion(question));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{questionId}")
    public ApiResponse<QuestionResponse> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("Требуется аутентификация");
        }
        
        User user = (User) authentication.getPrincipal();
        if (!user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            return ApiResponse.error("Требуются права администратора");
        }
        
        try {
            Question question = questionService.updateQuestion(questionId, request);
            return ApiResponse.success("Вопрос успешно обновлен", QuestionResponse.fromQuestion(question));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{questionId}")
    public ApiResponse<Void> deleteQuestion(
            @PathVariable Long questionId,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("Требуется аутентификация");
        }
        
        User user = (User) authentication.getPrincipal();
        if (!user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            return ApiResponse.error("Требуются права администратора");
        }
        
        try {
            questionService.deleteQuestion(questionId);
            return ApiResponse.success("Вопрос успешно удален", null);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ApiResponse<java.util.Map<String, Object>> getAllData() {
        List<Topic> topics = questionService.getAllTopics();
        List<TopicResponse> topicResponses = topics.stream()
                .map(TopicResponse::fromTopic)
                .collect(Collectors.toList());
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("topics", topicResponses);
        
        return ApiResponse.success(response);
    }
} 