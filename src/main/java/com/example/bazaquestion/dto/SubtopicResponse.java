package com.example.bazaquestion.dto;

import com.example.bazaquestion.model.Subtopic;
import io.jsonwebtoken.lang.Collections;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class SubtopicResponse {
    private Long id;
    private String name;
    private List<QuestionResponse> questions;

    public static SubtopicResponse fromSubtopic(Subtopic subtopic) {
        SubtopicResponse response = new SubtopicResponse();
        response.setId(subtopic.getId());
        response.setName(subtopic.getName());
        response.setQuestions(Collections.isEmpty(subtopic.getQuestions()) ? new ArrayList<>() : subtopic.getQuestions().stream()
                .map(QuestionResponse::fromQuestion)
                .collect(Collectors.toList()));
        return response;
    }
} 