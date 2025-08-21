"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, ChevronDown, ChevronRight, Code, BookOpen, HelpCircle, UserIcon, LogOut, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AuthModal } from "@/components/auth-modal"
import { AdminPanel } from "@/components/admin-panel"
import { apiClient, type Topic, type Subtopic, type Question } from "@/lib/api"

type InterviewQuestion = {
  id?: number
  question: string
  quickAnswer: string
  detailedAnswer: string
  codeExample: string
}

type TopicData = {
  id: number
  icon: string
  subtopics: Record<string, InterviewQuestion[]>
}

type InterviewData = Record<string, TopicData>

const mockInterviewData: InterviewData = {
  "Java Core": {
    id: 1,
    icon: "☕",
    subtopics: {
      Collections: [
        {
          id: 1,
          question: "Что такое ArrayList и как он работает?",
          quickAnswer: "ArrayList - это динамический массив, который может изменять размер во время выполнения.",
          detailedAnswer:
            "ArrayList - это реализация интерфейса List в Java, основанная на массиве. Он автоматически увеличивает свой размер при добавлении элементов.",
          codeExample: `List<String> list = new ArrayList<>();
list.add("Hello");
list.add("World");`,
        },
      ],
    },
  },
}

export default function InterviewPrepApp() {
  const [globalSearch, setGlobalSearch] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null)
  const [subtopicSearch, setSubtopicSearch] = useState("")
  const [questionSearch, setQuestionSearch] = useState("")
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set())
  const [expandedCode, setExpandedCode] = useState<Set<string>>(new Set())
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [interviewDataState, setInterviewDataState] = useState<InterviewData>({})
  const [editingQuestion, setEditingQuestion] = useState<{
    topic: string
    subtopic: string
    question: InterviewQuestion
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [topics, setTopics] = useState<Topic[]>([])
  const [isApiAvailable, setIsApiAvailable] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      apiClient.setToken(savedToken)
    }
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAllTopics()
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      if (response.success) {
        setIsApiAvailable(true)
        setTopics(response.data)

        const convertedData: InterviewData = {}
        response.data.forEach((topic: Topic) => {
          const subtopics: Record<string, InterviewQuestion[]> = {}
          topic.subtopics.forEach((subtopic: Subtopic) => {
            subtopics[subtopic.name] = subtopic.questions.map((q: Question) => ({
              id: q.id,
              question: q.question,
              quickAnswer: q.quickAnswer,
              detailedAnswer: q.detailedAnswer,
              codeExample: q.codeExample,
            }))
          })

          convertedData[topic.name] = {
            id: topic.id,
            icon: topic.icon,
            subtopics,
          }
        })

        setInterviewDataState(convertedData)
      }
    } catch (error) {
      console.log("[v0] API недоступен, используем моковые данные")
      setIsApiAvailable(false)
      setInterviewDataState(mockInterviewData)
      setTopics([
        {
          id: 1,
          name: "Java Core",
          icon: "☕",
          subtopics: [
            {
              id: 1,
              name: "Collections",
              questions: [],
            },
          ],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (username: string, password: string) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Попробуйте позже.")
      return
    }

    try {
      const response = await apiClient.login({ username, password })
      if (response.success) {
        setUser(
          response.data.user || {
            username,
            authorities: response.data.authorities || [],
            token: response.data.token,
          },
        )
        setShowAuthModal(false)
      } else {
        alert(response.message || "Ошибка входа")
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleRegister = async (username: string, email: string, password: string, confirmPassword: string) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Попробуйте позже.")
      return
    }

    try {
      const response = await apiClient.register({ username, email, password, confirmPassword })
      if (response.success) {
        alert("Регистрация успешна! Теперь войдите в систему.")
      } else {
        alert(response.message || "Ошибка регистрации")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      setUser(null)
    }
    apiClient.clearToken()
  }

  const handleAddTopic = async (topicName: string, icon: string) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Функция создания тем временно недоступна.")
      return
    }

    try {
      const response = await apiClient.createTopic(topicName, icon)
      if (response.success) {
        await loadInitialData()
      } else {
        alert(response.message || "Ошибка создания темы")
      }
    } catch (error) {
      console.error("Failed to create topic:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleAddSubtopic = async (topicName: string, subtopicName: string) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Функция создания подтем временно недоступна.")
      return
    }

    try {
      const topicData = interviewDataState[topicName]
      if (!topicData) return

      const response = await apiClient.createSubtopic(subtopicName, topicData.id)
      if (response.success) {
        await loadInitialData()
      } else {
        alert(response.message || "Ошибка создания подтемы")
      }
    } catch (error) {
      console.error("Failed to create subtopic:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleAddQuestion = async (topicName: string, subtopicName: string, question: any) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Функция создания вопросов временно недоступна.")
      return
    }

    try {
      const topic = topics.find((t) => t.name === topicName)
      const subtopic = topic?.subtopics.find((s) => s.name === subtopicName)

      if (!subtopic) {
        alert("Подтема не найдена")
        return
      }

      const response = await apiClient.createQuestion({
        question: question.question,
        quickAnswer: question.quickAnswer,
        detailedAnswer: question.detailedAnswer,
        codeExample: question.codeExample,
        subtopicId: subtopic.id,
      })

      if (response.success) {
        await loadInitialData()
      } else {
        alert(response.message || "Ошибка создания вопроса")
      }
    } catch (error) {
      console.error("Failed to create question:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleUpdateQuestion = async (
    topicName: string,
    subtopicName: string,
    oldQuestion: string,
    newQuestion: any,
  ) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Функция редактирования вопросов временно недоступна.")
      return
    }

    try {
      const topicData = interviewDataState[topicName]
      const questions = topicData?.subtopics[subtopicName]
      const questionToUpdate = questions?.find((q) => q.question === oldQuestion)

      if (!questionToUpdate?.id) {
        alert("Вопрос не найден")
        return
      }

      const topic = topics.find((t) => t.name === topicName)
      const subtopic = topic?.subtopics.find((s) => s.name === subtopicName)

      if (!subtopic) {
        alert("Подтема не найдена")
        return
      }

      const response = await apiClient.updateQuestion(questionToUpdate.id, {
        question: newQuestion.question,
        quickAnswer: newQuestion.quickAnswer,
        detailedAnswer: newQuestion.detailedAnswer,
        codeExample: newQuestion.codeExample,
        subtopicId: subtopic.id,
      })

      if (response.success) {
        await loadInitialData()
      } else {
        alert(response.message || "Ошибка обновления вопроса")
      }
    } catch (error) {
      console.error("Failed to update question:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleDeleteQuestion = async (topicName: string, subtopicName: string, questionToDelete: string) => {
    if (!isApiAvailable) {
      alert("API сервер недоступен. Функция удаления вопросов временно недоступна.")
      return
    }

    try {
      const topicData = interviewDataState[topicName]
      const questions = topicData?.subtopics[subtopicName]
      const question = questions?.find((q) => q.question === questionToDelete)

      if (!question?.id) {
        alert("Вопрос не найден")
        return
      }

      const response = await apiClient.deleteQuestion(question.id)
      if (response.success) {
        await loadInitialData()
      } else {
        alert(response.message || "Ошибка удаления вопроса")
      }
    } catch (error) {
      console.error("Failed to delete question:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleEditQuestion = (topic: string, subtopic: string, question: InterviewQuestion) => {
    setEditingQuestion({ topic, subtopic, question })
    setShowAdminPanel(true)
  }

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const toggleDetail = (questionId: string) => {
    const newExpanded = new Set(expandedDetails)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedDetails(newExpanded)
  }

  const toggleCode = (questionId: string) => {
    const newExpanded = new Set(expandedCode)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedCode(newExpanded)
  }

  const filteredTopics = useMemo(() => {
    const topicNames = Object.keys(interviewDataState)
    if (!globalSearch.trim()) return topicNames
    return topicNames.filter((topic) => topic.toLowerCase().includes(globalSearch.toLowerCase()))
  }, [globalSearch, interviewDataState])

  const filteredSubtopics = useMemo(() => {
    if (!selectedTopic) return []
    const topicData = interviewDataState[selectedTopic]
    if (!topicData) return []

    const subtopics = Object.keys(topicData.subtopics)
    if (!subtopicSearch.trim()) return subtopics

    return subtopics.filter((subtopic) => subtopic.toLowerCase().includes(subtopicSearch.toLowerCase()))
  }, [selectedTopic, subtopicSearch, interviewDataState])

  const filteredQuestions = useMemo(() => {
    if (!selectedTopic || !selectedSubtopic) return []

    const topicData = interviewDataState[selectedTopic]
    if (!topicData) return []

    const questions = topicData.subtopics[selectedSubtopic]
    if (!questions) return []

    if (!questionSearch.trim()) return questions

    return questions.filter((q) => q.question.toLowerCase().includes(questionSearch.toLowerCase()))
  }, [selectedTopic, selectedSubtopic, questionSearch, interviewDataState])

  const getSearchResults = () => {
    if (!globalSearch.trim()) return []

    const results: Array<{
      type: "topic" | "subtopic" | "question"
      topic: string
      subtopic?: string
      question?: string
      display: string
    }> = []

    Object.entries(interviewDataState).forEach(([topic, topicData]) => {
      if (topic.toLowerCase().includes(globalSearch.toLowerCase())) {
        results.push({
          type: "topic",
          topic,
          display: `${topicData.icon} ${topic}`,
        })
      }

      Object.keys(topicData.subtopics).forEach((subtopic) => {
        if (subtopic.toLowerCase().includes(globalSearch.toLowerCase())) {
          results.push({
            type: "subtopic",
            topic,
            subtopic,
            display: `→ ${subtopic} в ${topic}`,
          })
        }
      })

      Object.entries(topicData.subtopics).forEach(([subtopic, questions]) => {
        const matchingQuestions = questions
          .filter((q) => q.question.toLowerCase().includes(globalSearch.toLowerCase()))
          .slice(0, 3)

        matchingQuestions.forEach((q) => {
          results.push({
            type: "question",
            topic,
            subtopic,
            question: q.question,
            display: `❓ ${q.question.slice(0, 50)}...`,
          })
        })
      })
    })

    return results.slice(0, 10)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка данных...</p>
          <p className="text-xs text-muted-foreground mt-2">
            {isApiAvailable ? "Подключение к серверу..." : "Загрузка локальных данных..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">🎯 Подготовка к Техническим Собеседованиям</h1>
              {!isApiAvailable && (
                <Badge variant="secondary" className="text-xs">
                  Офлайн режим
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <UserIcon className="h-4 w-4" />
                      {user.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.authorities?.includes("ADMIN") && (
                      <DropdownMenuItem onClick={() => setShowAdminPanel(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Админ-панель
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)} disabled={!isApiAvailable}>
                    Войти
                  </Button>
                  <Button variant="default" size="sm" onClick={() => setShowAuthModal(true)} disabled={!isApiAvailable}>
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Быстрый поиск по темам, подтемам или вопросам..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-10 h-10"
            />
            {globalSearch.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {getSearchResults().map((result, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 hover:bg-muted rounded text-sm"
                    onClick={() => {
                      if (result.type === "topic") {
                        setSelectedTopic(result.topic)
                        setSelectedSubtopic(null)
                      } else if (result.type === "subtopic") {
                        setSelectedTopic(result.topic)
                        setSelectedSubtopic(result.subtopic!)
                      } else if (result.type === "question") {
                        setSelectedTopic(result.topic)
                        setSelectedSubtopic(result.subtopic!)
                        setQuestionSearch(result.question!)
                      }
                      setGlobalSearch("")
                    }}
                  >
                    {result.display}
                  </button>
                ))}
                {getSearchResults().length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">Ничего не найдено</div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  Основные Темы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {filteredTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-8 text-sm"
                    onClick={() => {
                      setSelectedTopic(topic)
                      setSelectedSubtopic(null)
                      setSubtopicSearch("")
                      setQuestionSearch("")
                    }}
                  >
                    <span className="mr-2 text-xs">{interviewDataState[topic].icon}</span>
                    {topic}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!selectedTopic ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Выберите тему для изучения</h3>
                  <p className="text-muted-foreground text-sm">Выберите одну из тем слева или используйте поиск выше</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span>{interviewDataState[selectedTopic].icon}</span>
                      {selectedTopic}
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Поиск подтем..."
                        value={subtopicSearch}
                        onChange={(e) => setSubtopicSearch(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredSubtopics.map((subtopic) => {
                        const questionCount = interviewDataState[selectedTopic]?.subtopics[subtopic]?.length || 0
                        return (
                          <Button
                            key={subtopic}
                            variant={selectedSubtopic === subtopic ? "default" : "outline"}
                            size="sm"
                            className="justify-between h-8 text-xs"
                            onClick={() => {
                              setSelectedSubtopic(subtopic)
                              setQuestionSearch("")
                            }}
                          >
                            <span className="truncate">{subtopic}</span>
                            <Badge variant="secondary" className="ml-1 text-xs px-1">
                              {questionCount}
                            </Badge>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {selectedSubtopic && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <HelpCircle className="h-4 w-4" />
                        Вопросы: {selectedSubtopic}
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Поиск вопросов..."
                          value={questionSearch}
                          onChange={(e) => setQuestionSearch(e.target.value)}
                          className="pl-10 h-9"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredQuestions.map((question, index) => {
                        const questionId = `${selectedTopic}-${selectedSubtopic}-${index}`
                        return (
                          <Card key={questionId} className="border-l-primary border-l-[5px] py-2">
                            <Collapsible
                              open={expandedQuestions.has(questionId)}
                              onOpenChange={() => toggleQuestion(questionId)}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-0.5 px-3">
                                  <CardTitle className="flex items-center justify-between text-sm font-medium leading-tight">
                                    <span className="text-left leading-tight">{question.question}</span>
                                    <div className="flex items-center gap-1">
                                      {user?.authorities?.includes("ADMIN") && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-5 w-5 p-0 hover:bg-primary/20"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditQuestion(selectedTopic, selectedSubtopic, question)
                                          }}
                                        >
                                          <Settings className="h-3 w-3" />
                                        </Button>
                                      )}
                                      {expandedQuestions.has(questionId) ? (
                                        <ChevronDown className="h-3 w-3 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 flex-shrink-0" />
                                      )}
                                    </div>
                                  </CardTitle>
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="space-y-1 px-3 pb-2">
                                  <div className="p-2 bg-primary/10 rounded-md">
                                    <h4 className="font-semibold text-primary mb-1 text-xs">Быстрый ответ:</h4>
                                    <p className="text-xs leading-relaxed">{question.quickAnswer}</p>
                                  </div>

                                  <div className="flex gap-1">
                                    <Collapsible
                                      open={expandedDetails.has(questionId)}
                                      onOpenChange={() => toggleDetail(questionId)}
                                      className="flex-1"
                                    >
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full justify-between h-6 text-xs bg-transparent px-2"
                                        >
                                          <span className="flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            Подробно
                                          </span>
                                          {expandedDetails.has(questionId) ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="mt-1 p-2 bg-muted rounded-md">
                                          <p className="text-xs leading-relaxed">{question.detailedAnswer}</p>
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>

                                    <Collapsible
                                      open={expandedCode.has(questionId)}
                                      onOpenChange={() => toggleCode(questionId)}
                                      className="flex-1"
                                    >
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full justify-between h-6 text-xs bg-transparent px-2"
                                        >
                                          <span className="flex items-center gap-1">
                                            <Code className="h-3 w-3" />
                                            Код
                                          </span>
                                          {expandedCode.has(questionId) ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="mt-1">
                                          <pre className="bg-card border rounded-md p-2 text-xs overflow-x-auto">
                                            <code>{question.codeExample}</code>
                                          </pre>
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </div>
                                </CardContent>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {user?.authorities?.includes("ADMIN") && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => {
            setShowAdminPanel(false)
            setEditingQuestion(null)
          }}
          topics={Object.keys(interviewDataState)}
          interviewData={interviewDataState}
          onAddTopic={handleAddTopic}
          onAddSubtopic={handleAddSubtopic}
          onAddQuestion={handleAddQuestion}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          editingQuestion={editingQuestion}
        />
      )}
    </div>
  )
}
