# Тестирование BazaQuestion

## Быстрый старт

### 1. Запуск системы

```bash
# 1. Запуск базы данных
docker-compose up -d

# 2. Запуск бэкенда (в корневой папке)
./mvnw spring-boot:run

# 3. Запуск фронтенда (в папке FronEnd)
cd FronEnd
npm run dev
```

### 2. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html

## Тестирование функциональности

### 1. Регистрация и вход

1. Откройте http://localhost:3000
2. Нажмите "Регистрация"
3. Заполните форму:
   - Логин: `testuser`
   - Email: `test@example.com`
   - Пароль: `password123`
   - Подтверждение пароля: `password123`
4. Нажмите "Зарегистрироваться"
5. Войдите в систему с созданными данными

### 2. Просмотр вопросов

1. После входа вы увидите список тем
2. Выберите тему (например, "Java Core")
3. Выберите подтему (например, "Collections")
4. Просмотрите вопросы и ответы
5. Используйте поиск для быстрого нахождения нужной информации

### 3. Админ-функции

**Автоматически созданный админ:**
- Логин: `admin`
- Пароль: `admin123`

1. Войдите как админ
2. В правом верхнем углу нажмите на имя пользователя
3. Выберите "Админ-панель"
4. Протестируйте функции:
   - Создание новой темы
   - Добавление подтемы
   - Создание вопроса
   - Редактирование вопроса
   - Удаление вопроса

### 4. Поиск

1. Используйте глобальный поиск в верхней части страницы
2. Поиск работает по:
   - Названиям тем
   - Названиям подтем
   - Тексту вопросов

## Тестирование API через Swagger

### 1. Откройте Swagger UI

Перейдите на http://localhost:8080/swagger-ui/index.html

### 2. Тестирование аутентификации

1. Найдите раздел "Auth Controller"
2. Протестируйте endpoints:
   - `POST /api/auth/register` - регистрация
   - `POST /api/auth/login` - вход
   - `GET /api/auth/check-auth` - проверка аутентификации

### 3. Тестирование вопросов

1. Найдите раздел "Question Rest Controller"
2. Протестируйте endpoints:
   - `GET /api/questions/topics` - получение тем
   - `GET /api/questions/search` - поиск вопросов

### 4. Тестирование админ-функций

1. Сначала войдите в систему через `/api/auth/login`
2. Протестируйте админ-endpoints:
   - `POST /api/questions/topics` - создание темы
   - `POST /api/questions/subtopics` - создание подтемы
   - `POST /api/questions` - создание вопроса

## Тестирование через curl

### Регистрация пользователя

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Вход в систему

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Получение тем

```bash
curl -X GET http://localhost:8080/api/questions/topics \
  -b cookies.txt
```

### Создание темы (требует роль ADMIN)

```bash
curl -X POST "http://localhost:8080/api/questions/topics?name=New%20Topic&icon=🚀" \
  -b cookies.txt
```

## Проверка базы данных

### Подключение к PostgreSQL

```bash
# Через Docker
docker exec -it bazaquestion-postgres-1 psql -U postgres -d bazaquestion

# Или через psql (если установлен)
psql -h localhost -p 5432 -U postgres -d bazaquestion
```

### Полезные SQL запросы

```sql
-- Просмотр пользователей
SELECT username, email, role, enabled FROM users;

-- Просмотр тем
SELECT id, name, icon FROM topics;

-- Просмотр подтем
SELECT s.id, s.name, t.name as topic_name 
FROM subtopics s 
JOIN topics t ON s.topic_id = t.id;

-- Просмотр вопросов
SELECT q.id, q.question, s.name as subtopic, t.name as topic
FROM questions q
JOIN subtopics s ON q.subtopic_id = s.id
JOIN topics t ON s.topic_id = t.id;
```

## Устранение неполадок

### Проблемы с базой данных

```bash
# Остановка и удаление контейнера
docker-compose down

# Удаление volume с данными
docker volume rm bazaquestion_postgres_data

# Перезапуск
docker-compose up -d
```

### Проблемы с бэкендом

```bash
# Очистка и пересборка
./mvnw clean compile

# Запуск с отладкой
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Ddebug=true"
```

### Проблемы с фронтендом

```bash
# Очистка кэша
cd FronEnd
rm -rf .next
npm run dev
```

## Проверка работоспособности

### Критерии успешного тестирования

✅ **Аутентификация**
- Регистрация нового пользователя
- Вход в систему
- Выход из системы
- Проверка ролей (USER/ADMIN)

✅ **Просмотр контента**
- Отображение тем и подтем
- Просмотр вопросов с ответами
- Работа поиска

✅ **Админ-функции**
- Создание новых тем
- Добавление подтем
- Создание и редактирование вопросов
- Удаление вопросов

✅ **API**
- Все endpoints отвечают корректно
- Swagger UI доступен и работает
- CORS настроен правильно

✅ **Интеграция**
- Фронтенд получает данные с бэкенда
- Изменения сохраняются в базе данных
- Уведомления работают корректно 