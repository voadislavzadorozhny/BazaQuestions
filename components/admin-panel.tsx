"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Settings, Edit, Trash2 } from "lucide-react"

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  topics: string[]
  interviewData: any
  onAddTopic: (topic: string, icon: string) => void
  onAddSubtopic: (topic: string, subtopic: string) => void
  onAddQuestion: (topic: string, subtopic: string, question: any) => void
  onUpdateQuestion: (topic: string, subtopic: string, oldQuestion: string, newQuestion: any) => void
  onDeleteQuestion: (topic: string, subtopic: string, question: string) => void
  editingQuestion?: {
    topic: string
    subtopic: string
    question: any
  } | null
}

export function AdminPanel({
  isOpen,
  onClose,
  topics,
  interviewData,
  onAddTopic,
  onAddSubtopic,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  editingQuestion: externalEditingQuestion,
}: AdminPanelProps) {
  const [newTopic, setNewTopic] = useState({ name: "", icon: "" })
  const [newSubtopic, setNewSubtopic] = useState({ topic: "", name: "" })
  const [newQuestion, setNewQuestion] = useState({
    topic: "",
    subtopic: "",
    question: "",
    quickAnswer: "",
    detailedAnswer: "",
    codeExample: "",
  })

  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [editQuestion, setEditQuestion] = useState({
    topic: "",
    subtopic: "",
    question: "",
    quickAnswer: "",
    detailedAnswer: "",
    codeExample: "",
  })

  useEffect(() => {
    if (externalEditingQuestion) {
      setEditingQuestion({
        topic: externalEditingQuestion.topic,
        subtopic: externalEditingQuestion.subtopic,
        originalQuestion: externalEditingQuestion.question.question,
      })
      setEditQuestion({
        topic: externalEditingQuestion.topic,
        subtopic: externalEditingQuestion.subtopic,
        question: externalEditingQuestion.question.question,
        quickAnswer: externalEditingQuestion.question.quickAnswer,
        detailedAnswer: externalEditingQuestion.question.detailedAnswer,
        codeExample: externalEditingQuestion.question.codeExample,
      })
    }
  }, [externalEditingQuestion])

  const getSubtopicsForTopic = (topicName: string) => {
    const topic = interviewData[topicName]
    return topic ? Object.keys(topic.subtopics) : []
  }

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTopic.name && newTopic.icon) {
      onAddTopic(newTopic.name, newTopic.icon)
      setNewTopic({ name: "", icon: "" })
    }
  }

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSubtopic.topic && newSubtopic.name) {
      onAddSubtopic(newSubtopic.topic, newSubtopic.name)
      setNewSubtopic({ topic: "", name: "" })
    }
  }

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (newQuestion.topic && newQuestion.subtopic && newQuestion.question) {
      onAddQuestion(newQuestion.topic, newQuestion.subtopic, {
        question: newQuestion.question,
        quickAnswer: newQuestion.quickAnswer,
        detailedAnswer: newQuestion.detailedAnswer,
        codeExample: newQuestion.codeExample,
      })
      setNewQuestion({
        topic: "",
        subtopic: "",
        question: "",
        quickAnswer: "",
        detailedAnswer: "",
        codeExample: "",
      })
    }
  }

  const startEditQuestion = (topic: string, subtopic: string, questionData: any) => {
    setEditingQuestion({ topic, subtopic, originalQuestion: questionData.question })
    setEditQuestion({
      topic,
      subtopic,
      question: questionData.question,
      quickAnswer: questionData.quickAnswer,
      detailedAnswer: questionData.detailedAnswer,
      codeExample: questionData.codeExample,
    })
  }

  const handleUpdateQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingQuestion && editQuestion.question) {
      onUpdateQuestion(editingQuestion.topic, editingQuestion.subtopic, editingQuestion.originalQuestion, {
        question: editQuestion.question,
        quickAnswer: editQuestion.quickAnswer,
        detailedAnswer: editQuestion.detailedAnswer,
        codeExample: editQuestion.codeExample,
      })
      setEditingQuestion(null)
      setEditQuestion({
        topic: "",
        subtopic: "",
        question: "",
        quickAnswer: "",
        detailedAnswer: "",
        codeExample: "",
      })
    }
  }

  const handleDeleteQuestion = (topic: string, subtopic: string, question: string) => {
    if (confirm("Вы уверены, что хотите удалить этот вопрос?")) {
      onDeleteQuestion(topic, subtopic, question)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Админ-панель
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={editingQuestion ? "manage" : "topic"} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="topic">Добавить тему</TabsTrigger>
            <TabsTrigger value="subtopic">Добавить подтему</TabsTrigger>
            <TabsTrigger value="question">Добавить вопрос</TabsTrigger>
            <TabsTrigger value="manage">Управление</TabsTrigger>
          </TabsList>

          <TabsContent value="topic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Новая основная тема
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTopic} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic-name">Название темы</Label>
                    <Input
                      id="topic-name"
                      value={newTopic.name}
                      onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                      placeholder="Например: Java Core"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-icon">Иконка (эмодзи)</Label>
                    <Input
                      id="topic-icon"
                      value={newTopic.icon}
                      onChange={(e) => setNewTopic({ ...newTopic, icon: e.target.value })}
                      placeholder="☕"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Добавить тему
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subtopic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Новая подтема
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSubtopic} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtopic-topic">Основная тема</Label>
                    <Select
                      value={newSubtopic.topic}
                      onValueChange={(value) => setNewSubtopic({ ...newSubtopic, topic: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тему" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtopic-name">Название подтемы</Label>
                    <Input
                      id="subtopic-name"
                      value={newSubtopic.name}
                      onChange={(e) => setNewSubtopic({ ...newSubtopic, name: e.target.value })}
                      placeholder="Например: Collections"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Добавить подтему
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="question" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Новый вопрос
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-topic">Основная тема</Label>
                      <Select
                        value={newQuestion.topic}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, topic: value, subtopic: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тему" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="question-subtopic">Подтема</Label>
                      <Select
                        value={newQuestion.subtopic}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, subtopic: value })}
                        disabled={!newQuestion.topic}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите подтему" />
                        </SelectTrigger>
                        <SelectContent>
                          {newQuestion.topic &&
                            getSubtopicsForTopic(newQuestion.topic).map((subtopic) => (
                              <SelectItem key={subtopic} value={subtopic}>
                                {subtopic}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-text">Вопрос</Label>
                    <Input
                      id="question-text"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      placeholder="Что такое ArrayList?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-quick">Краткий ответ</Label>
                    <Textarea
                      id="question-quick"
                      value={newQuestion.quickAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, quickAnswer: e.target.value })}
                      placeholder="Краткое объяснение..."
                      rows={2}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-detailed">Подробный ответ</Label>
                    <Textarea
                      id="question-detailed"
                      value={newQuestion.detailedAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, detailedAnswer: e.target.value })}
                      placeholder="Подробное объяснение..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-code">Пример кода</Label>
                    <Textarea
                      id="question-code"
                      value={newQuestion.codeExample}
                      onChange={(e) => setNewQuestion({ ...newQuestion, codeExample: e.target.value })}
                      placeholder="// Пример кода..."
                      rows={4}
                      className="font-mono text-sm"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Добавить вопрос
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            {editingQuestion ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Редактировать вопрос
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateQuestion} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Тема: {editingQuestion.topic}</Label>
                      <Label>Подтема: {editingQuestion.subtopic}</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-question-text">Вопрос</Label>
                      <Input
                        id="edit-question-text"
                        value={editQuestion.question}
                        onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-question-quick">Краткий ответ</Label>
                      <Textarea
                        id="edit-question-quick"
                        value={editQuestion.quickAnswer}
                        onChange={(e) => setEditQuestion({ ...editQuestion, quickAnswer: e.target.value })}
                        rows={2}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-question-detailed">Подробный ответ</Label>
                      <Textarea
                        id="edit-question-detailed"
                        value={editQuestion.detailedAnswer}
                        onChange={(e) => setEditQuestion({ ...editQuestion, detailedAnswer: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-question-code">Пример кода</Label>
                      <Textarea
                        id="edit-question-code"
                        value={editQuestion.codeExample}
                        onChange={(e) => setEditQuestion({ ...editQuestion, codeExample: e.target.value })}
                        rows={4}
                        className="font-mono text-sm"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Сохранить изменения
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingQuestion(null)}
                        className="flex-1"
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Управление вопросами</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topics.map((topic) => (
                    <div key={topic} className="space-y-2">
                      <h4 className="font-semibold text-sm">{topic}</h4>
                      {interviewData[topic] &&
                        Object.keys(interviewData[topic].subtopics).map((subtopic) => (
                          <div key={subtopic} className="ml-4 space-y-1">
                            <h5 className="font-medium text-xs text-muted-foreground">{subtopic}</h5>
                            {Array.isArray(interviewData[topic].subtopics[subtopic]) &&
                              interviewData[topic].subtopics[subtopic].map((questionData: any, index: number) => (
                                <div
                                  key={index}
                                  className="ml-4 flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
                                >
                                  <span className="flex-1 truncate">{questionData.question}</span>
                                  <div className="flex gap-1 ml-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startEditQuestion(topic, subtopic, questionData)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteQuestion(topic, subtopic, questionData.question)}
                                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
