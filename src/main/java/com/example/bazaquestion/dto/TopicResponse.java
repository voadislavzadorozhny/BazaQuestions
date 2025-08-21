package com.example.bazaquestion.dto;

import com.example.bazaquestion.model.Topic;
import io.jsonwebtoken.lang.Collections;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TopicResponse {
    private Long id;
    private String name;
    private String icon;
    private List<SubtopicResponse> subtopics;

    public static TopicResponse fromTopic(Topic topic) {
        TopicResponse response = new TopicResponse();
        response.setId(topic.getId());
        response.setName(topic.getName());
        response.setIcon(topic.getIcon());
        response.setSubtopics(Collections.isEmpty(topic.getSubtopics()) ? new ArrayList<>() : topic.getSubtopics().stream()
                .map(SubtopicResponse::fromSubtopic)
                .collect(Collectors.toList()));
        return response;
    }
} 