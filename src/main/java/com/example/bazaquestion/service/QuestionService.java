package com.example.bazaquestion.service;

import com.example.bazaquestion.dto.QuestionRequest;
import com.example.bazaquestion.model.Question;
import com.example.bazaquestion.model.Subtopic;
import com.example.bazaquestion.model.Topic;
import com.example.bazaquestion.model.User;
import com.example.bazaquestion.repository.QuestionRepository;
import com.example.bazaquestion.repository.SubtopicRepository;
import com.example.bazaquestion.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Optional<Topic> getTopicById(Long id) {
        return topicRepository.findById(id);
    }

    public Optional<Topic> getTopicByName(String name) {
        return topicRepository.findByName(name);
    }

    public List<Subtopic> getSubtopicsByTopicId(Long topicId) {
        return subtopicRepository.findByTopicId(topicId);
    }

    public List<Question> getQuestionsBySubtopicId(Long subtopicId) {
        return questionRepository.findBySubtopicId(subtopicId);
    }

    public List<Question> searchQuestions(String searchTerm) {
        return questionRepository.searchQuestions(searchTerm);
    }

    @Transactional
    public Topic createTopic(String name, String icon) {
        if (topicRepository.existsByName(name)) {
            throw new IllegalArgumentException("Тема с таким названием уже существует");
        }
        
        Topic topic = new Topic();
        topic.setName(name);
        topic.setIcon(icon);
        return topicRepository.save(topic);
    }

    @Transactional
    public Subtopic createSubtopic(String name, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Тема не найдена"));
        
        if (subtopicRepository.existsByNameAndTopicId(name, topicId)) {
            throw new IllegalArgumentException("Подтема с таким названием уже существует в данной теме");
        }
        
        Subtopic subtopic = new Subtopic();
        subtopic.setName(name);
        subtopic.setTopic(topic);
        return subtopicRepository.save(subtopic);
    }

    @Transactional
    public Question createQuestion(QuestionRequest request, User createdBy) {
        Subtopic subtopic = subtopicRepository.findById(request.getSubtopicId())
                .orElseThrow(() -> new IllegalArgumentException("Подтема не найдена"));
        
        Question question = new Question();
        question.setQuestion(request.getQuestion());
        question.setQuickAnswer(request.getQuickAnswer());
        question.setDetailedAnswer(request.getDetailedAnswer());
        question.setCodeExample(request.getCodeExample());
        question.setSubtopic(subtopic);
        question.setCreatedBy(createdBy);
        
        return questionRepository.save(question);
    }

    @Transactional
    public Question updateQuestion(Long questionId, QuestionRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Вопрос не найден"));
        
        question.setQuestion(request.getQuestion());
        question.setQuickAnswer(request.getQuickAnswer());
        question.setDetailedAnswer(request.getDetailedAnswer());
        question.setCodeExample(request.getCodeExample());
        
        return questionRepository.save(question);
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new IllegalArgumentException("Вопрос не найден");
        }
        questionRepository.deleteById(questionId);
    }
} 