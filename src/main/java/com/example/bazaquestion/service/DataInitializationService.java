package com.example.bazaquestion.service;

import com.example.bazaquestion.model.Question;
import com.example.bazaquestion.model.Subtopic;
import com.example.bazaquestion.model.Topic;
import com.example.bazaquestion.model.User;
import com.example.bazaquestion.repository.QuestionRepository;
import com.example.bazaquestion.repository.SubtopicRepository;
import com.example.bazaquestion.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final QuestionRepository questionRepository;
    private final AuthService authService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Сначала создаем админа, если его нет
        if (authService.getAllUsers().isEmpty()) {
            authService.createDefaultAdminUser();
        }
        
        if (topicRepository.count() == 0) {
            log.info("Инициализация начальных данных...");
            initializeData();
            log.info("Начальные данные успешно инициализированы");
        }
    }

    private void initializeData() {
        // Создаем темы
        Topic javaCore = createTopic("Java Core", "☕");
        Topic springCore = createTopic("Spring Core", "🌱");
        Topic kafka = createTopic("Kafka", "📨");
        Topic postgresql = createTopic("PostgreSQL", "🐘");
        Topic grpc = createTopic("gRPC", "🔗");

        // Java Core подтемы
        Subtopic collections = createSubtopic("Collections", javaCore);
        Subtopic streams = createSubtopic("Streams", javaCore);
        Subtopic interfaces = createSubtopic("Interfaces", javaCore);

        // Spring Core подтемы
        Subtopic dependencyInjection = createSubtopic("Dependency Injection", springCore);
        Subtopic beanLifecycle = createSubtopic("Bean Lifecycle", springCore);

        // Kafka подтемы
        Subtopic kafkaBasics = createSubtopic("Basics", kafka);

        // PostgreSQL подтемы
        Subtopic postgresqlIndexes = createSubtopic("Indexes", postgresql);

        // gRPC подтемы
        Subtopic grpcProtocolBuffers = createSubtopic("Protocol Buffers", grpc);

        // Создаем вопросы
        createJavaCoreQuestions(collections, streams, interfaces);
        createSpringCoreQuestions(dependencyInjection, beanLifecycle);
        createKafkaQuestions(kafkaBasics);
        createPostgreSQLQuestions(postgresqlIndexes);
        createGRPCQuestions(grpcProtocolBuffers);
    }

    private Topic createTopic(String name, String icon) {
        Topic topic = new Topic();
        topic.setName(name);
        topic.setIcon(icon);
        return topicRepository.save(topic);
    }

    private Subtopic createSubtopic(String name, Topic topic) {
        Subtopic subtopic = new Subtopic();
        subtopic.setName(name);
        subtopic.setTopic(topic);
        return subtopicRepository.save(subtopic);
    }

    private void createJavaCoreQuestions(Subtopic collections, Subtopic streams, Subtopic interfaces) {
        // Collections вопросы
        createQuestion(collections, 
            "Что такое ArrayList и как он работает?",
            "ArrayList - это динамический массив, который может изменять размер во время выполнения.",
            "ArrayList - это реализация интерфейса List в Java, основанная на массиве. Он автоматически увеличивает свой размер при добавлении элементов. Внутренне использует массив Object[] для хранения элементов. При достижении лимита создается новый массив размером в 1.5 раза больше предыдущего.",
            "List<String> list = new ArrayList<>();\nlist.add(\"Hello\");\nlist.add(\"World\");\nSystem.out.println(list.get(0)); // Hello"
        );

        createQuestion(collections,
            "В чем разница между ArrayList и LinkedList?",
            "ArrayList использует массив, LinkedList - двусвязный список.",
            "ArrayList обеспечивает быстрый доступ по индексу O(1), но медленные вставки/удаления в середине O(n). LinkedList обеспечивает быстрые вставки/удаления O(1), но медленный доступ по индексу O(n).",
            "// ArrayList - быстрый доступ\nList<String> arrayList = new ArrayList<>();\nString item = arrayList.get(100); // O(1)\n\n// LinkedList - быстрые вставки\nList<String> linkedList = new LinkedList<>();\nlinkedList.add(0, \"First\"); // O(1)"
        );

        // Streams вопросы
        createQuestion(streams,
            "Что такое Stream API в Java?",
            "Stream API - это функциональный подход к обработке коллекций данных.",
            "Stream API позволяет обрабатывать коллекции в декларативном стиле, используя функциональные операции как map, filter, reduce. Streams ленивые - промежуточные операции не выполняются до вызова терминальной операции.",
            "List<String> names = Arrays.asList(\"John\", \"Jane\", \"Jack\");\nList<String> result = names.stream()\n    .filter(name -> name.startsWith(\"J\"))\n    .map(String::toUpperCase)\n    .collect(Collectors.toList());"
        );

        // Interfaces вопросы
        createQuestion(interfaces,
            "Что такое интерфейс в Java?",
            "Интерфейс - это контракт, определяющий методы, которые должен реализовать класс.",
            "Интерфейс в Java - это абстрактный тип, который определяет набор методов без их реализации. Класс может реализовывать множество интерфейсов. С Java 8 интерфейсы могут содержать default и static методы.",
            "interface Drawable {\n    void draw();\n    \n    default void print() {\n        System.out.println(\"Printing...\");\n    }\n}\n\nclass Circle implements Drawable {\n    public void draw() {\n        System.out.println(\"Drawing circle\");\n    }\n}"
        );
    }

    private void createSpringCoreQuestions(Subtopic dependencyInjection, Subtopic beanLifecycle) {
        createQuestion(dependencyInjection,
            "Что такое Dependency Injection?",
            "DI - это паттерн, при котором зависимости объекта предоставляются извне.",
            "Dependency Injection - это техника, при которой объект получает свои зависимости от внешнего источника, а не создает их самостоятельно. Это улучшает тестируемость и слабую связанность компонентов.",
            "@Service\npublic class UserService {\n    private final UserRepository userRepository;\n    \n    public UserService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n}"
        );

        createQuestion(beanLifecycle,
            "Каков жизненный цикл Spring Bean?",
            "Bean проходит этапы: создание, инициализация, использование, уничтожение.",
            "Жизненный цикл Spring Bean включает: 1) Создание экземпляра, 2) Установка свойств, 3) BeanNameAware, 4) BeanFactoryAware, 5) ApplicationContextAware, 6) BeanPostProcessor.postProcessBeforeInitialization, 7) @PostConstruct, 8) InitializingBean.afterPropertiesSet, 9) init-method, 10) BeanPostProcessor.postProcessAfterInitialization.",
            "@Component\npublic class MyBean {\n    @PostConstruct\n    public void init() {\n        System.out.println(\"Bean initialized\");\n    }\n    \n    @PreDestroy\n    public void cleanup() {\n        System.out.println(\"Bean destroyed\");\n    }\n}"
        );
    }

    private void createKafkaQuestions(Subtopic kafkaBasics) {
        createQuestion(kafkaBasics,
            "Что такое Apache Kafka?",
            "Kafka - это распределенная платформа для потоковой обработки данных.",
            "Apache Kafka - это высокопроизводительная система обмена сообщениями, которая может обрабатывать миллионы сообщений в секунду. Она использует модель publish-subscribe и обеспечивает горизонтальное масштабирование.",
            "// Producer\nProperties props = new Properties();\nprops.put(\"bootstrap.servers\", \"localhost:9092\");\nprops.put(\"key.serializer\", \"org.apache.kafka.common.serialization.StringSerializer\");\nprops.put(\"value.serializer\", \"org.apache.kafka.common.serialization.StringSerializer\");\n\nProducer<String, String> producer = new KafkaProducer<>(props);\nproducer.send(new ProducerRecord<>(\"my-topic\", \"key\", \"value\"));"
        );
    }

    private void createPostgreSQLQuestions(Subtopic postgresqlIndexes) {
        createQuestion(postgresqlIndexes,
            "Что такое индексы в PostgreSQL?",
            "Индексы - это структуры данных для ускорения поиска в таблицах.",
            "Индексы в PostgreSQL - это отдельные структуры данных, которые содержат указатели на строки в таблице. Они значительно ускоряют операции SELECT, но замедляют INSERT/UPDATE/DELETE.",
            "-- Создание индекса\nCREATE INDEX idx_user_email ON users(email);\n\n-- Уникальный индекс\nCREATE UNIQUE INDEX idx_user_username ON users(username);\n\n-- Составной индекс\nCREATE INDEX idx_user_name_age ON users(first_name, age);"
        );
    }

    private void createGRPCQuestions(Subtopic grpcProtocolBuffers) {
        createQuestion(grpcProtocolBuffers,
            "Что такое Protocol Buffers?",
            "Protocol Buffers - это язык для сериализации структурированных данных.",
            "Protocol Buffers (protobuf) - это независимый от языка и платформы механизм сериализации структурированных данных. Он более компактный и быстрый чем JSON или XML.",
            "syntax = \"proto3\";\n\nmessage User {\n  int32 id = 1;\n  string name = 2;\n  string email = 3;\n  repeated string roles = 4;\n}"
        );
    }

    private void createQuestion(Subtopic subtopic, String question, String quickAnswer, String detailedAnswer, String codeExample) {
        Question q = new Question();
        q.setQuestion(question);
        q.setQuickAnswer(quickAnswer);
        q.setDetailedAnswer(detailedAnswer);
        q.setCodeExample(codeExample);
        q.setSubtopic(subtopic);
        
        // Используем первого пользователя как создателя (если есть)
        List<User> users = authService.getAllUsers();
        if (!users.isEmpty()) {
            q.setCreatedBy(users.get(0));
        }
        
        questionRepository.save(q);
    }
} 