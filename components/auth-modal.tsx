"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => void
  onRegister?: (username: string, email: string, password: string, confirmPassword: string) => void
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(loginData.username, loginData.password)
    setLoginData({ username: "", password: "" })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (onRegister) {
      onRegister(registerData.username, registerData.email, registerData.password, registerData.confirmPassword)
    }
    setRegisterData({ username: "", email: "", password: "", confirmPassword: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Авторизация</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">Логин</Label>
                <Input
                  id="login-username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="admin"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username">Логин</Label>
                <Input
                  id="register-username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                <Input
                  id="register-confirm"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Зарегистрироваться
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
