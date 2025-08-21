const API_BASE_URL = "http://localhost:8080"

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface User {
  id: number
  username: string
  email: string
  role: string
  authorities: string[]
}

export interface Topic {
  id: number
  name: string
  icon: string
  subtopics: Subtopic[]
}

export interface Subtopic {
  id: number
  name: string
  questions: Question[]
}

export interface Question {
  id: number
  question: string
  quickAnswer: string
  detailedAnswer: string
  codeExample: string
  topicName: string
  subtopicName: string
  createdBy: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegistrationRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface QuestionRequest {
  question: string
  quickAnswer: string
  detailedAnswer: string
  codeExample: string
  subtopicId: number
}

class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token")
    }
    return this.token
  }

  clearToken() {
    this.token = null
    localStorage.removeItem("auth_token")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Добавляем токен для всех запросов кроме публичных
    const publicEndpoints = ["/api/auth/login", "/api/auth/register"]
    const isPublicEndpoint = publicEndpoints.some((publicEndpoint) => endpoint.startsWith(publicEndpoint))

    if (!isPublicEndpoint && this.getToken()) {
      headers["Authorization"] = `Bearer ${this.getToken()}`
    }

    const response = await fetch(url, {
      credentials: "include",
      headers,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<any>> {
    const response = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async register(userData: RegistrationRequest): Promise<ApiResponse<User>> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request("/api/auth/me")
  }

  async checkAuth(): Promise<ApiResponse<any>> {
    return this.request("/api/auth/check-auth")
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request("/api/auth/logout", {
      method: "POST",
    })

    this.clearToken()

    return response
  }

  // Topics endpoints
  async getAllTopics(): Promise<ApiResponse<Topic[]>> {
    return this.request("/api/questions/topics")
  }

  async createTopic(name: string, icon: string): Promise<ApiResponse<Topic>> {
    return this.request(`/api/questions/topics?name=${encodeURIComponent(name)}&icon=${encodeURIComponent(icon)}`, {
      method: "POST",
    })
  }

  async getTopicById(topicId: number): Promise<ApiResponse<Topic>> {
    return this.request(`/api/questions/topics/${topicId}`)
  }

  // Subtopics endpoints
  async getSubtopicsByTopic(topicId: number): Promise<ApiResponse<Subtopic[]>> {
    return this.request(`/api/questions/topics/${topicId}/subtopics`)
  }

  async createSubtopic(name: string, topicId: number): Promise<ApiResponse<Subtopic>> {
    return this.request(`/api/questions/subtopics?name=${encodeURIComponent(name)}&topicId=${topicId}`, {
      method: "POST",
    })
  }

  // Questions endpoints
  async getQuestionsBySubtopic(subtopicId: number): Promise<ApiResponse<Question[]>> {
    return this.request(`/api/questions/subtopics/${subtopicId}/questions`)
  }

  async createQuestion(questionData: QuestionRequest): Promise<ApiResponse<Question>> {
    return this.request("/api/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    })
  }

  async updateQuestion(questionId: number, questionData: QuestionRequest): Promise<ApiResponse<Question>> {
    return this.request(`/api/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(questionData),
    })
  }

  async deleteQuestion(questionId: number): Promise<ApiResponse<void>> {
    return this.request(`/api/questions/${questionId}`, {
      method: "DELETE",
    })
  }

  async searchQuestions(query: string): Promise<ApiResponse<Question[]>> {
    return this.request(`/api/questions/search?q=${encodeURIComponent(query)}`)
  }

  async getAllData(): Promise<ApiResponse<any>> {
    return this.request("/api/questions/all")
  }
}

export const apiClient = new ApiClient()
