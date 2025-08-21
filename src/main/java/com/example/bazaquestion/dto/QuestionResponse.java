package com.example.bazaquestion.dto;

import com.example.bazaquestion.model.Question;
import lombok.Data;

@Data
public class QuestionResponse {
    private Long id;
    private String question;
    private String quickAnswer;
    private String detailedAnswer;
    private String codeExample;
    private String topicName;
    private String subtopicName;
    private String createdBy;

    public static QuestionResponse fromQuestion(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setQuestion(question.getQuestion());
        response.setQuickAnswer(question.getQuickAnswer());
        response.setDetailedAnswer(question.getDetailedAnswer());
        response.setCodeExample(question.getCodeExample());
        response.setTopicName(question.getSubtopic().getTopic().getName());
        response.setSubtopicName(question.getSubtopic().getName());
        response.setCreatedBy(question.getCreatedBy().getUsername());
        return response;
    }
} 