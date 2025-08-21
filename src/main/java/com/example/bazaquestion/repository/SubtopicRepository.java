package com.example.bazaquestion.repository;

import com.example.bazaquestion.model.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {
    
    List<Subtopic> findByTopicId(Long topicId);
    
    Optional<Subtopic> findByNameAndTopicId(String name, Long topicId);
    
    boolean existsByNameAndTopicId(String name, Long topicId);
} 