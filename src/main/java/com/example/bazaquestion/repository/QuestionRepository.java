package com.example.bazaquestion.repository;

import com.example.bazaquestion.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findBySubtopicId(Long subtopicId);
    
    @Query("SELECT q FROM Question q WHERE " +
           "LOWER(q.question) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.quickAnswer) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.detailedAnswer) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Question> searchQuestions(@Param("search") String search);
    
    @Query("SELECT q FROM Question q WHERE q.subtopic.topic.id = :topicId")
    List<Question> findByTopicId(@Param("topicId") Long topicId);
} 