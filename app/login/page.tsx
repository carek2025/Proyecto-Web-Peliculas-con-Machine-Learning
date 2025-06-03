"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Check if user is blocked
    if (isBlocked) {
      setError("Demasiados intentos fallidos. Intenta de nuevo en 5 minutos.")
      setIsLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Find user
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      // Successful login
      localStorage.setItem("currentUser", JSON.stringify(user))
      setSuccess("¡Inicio de sesión exitoso! Redirigiendo...")
      setLoginAttempts(0)

      // Add login notification
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      const notification = {
        id: Date.now(),
        userId: user.id,
        type: "login",
        title: "Inicio de sesión exitoso",
        message: `Bienvenido de vuelta, ${user.name}!`,
        read: false,
        createdAt: new Date().toISOString(),
      }
      notifications.unshift(notification)
      localStorage.setItem("notifications", JSON.stringify(notifications))

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } else {
      // Failed login
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)

      if (newAttempts >= 3) {
        setIsBlocked(true)
        setError("Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente por 5 minutos.")

        // Unblock after 5 minutes
        setTimeout(
          () => {
            setIsBlocked(false)
            setLoginAttempts(0)
          },
          5 * 60 * 1000,
        )
      } else {
        setError(`Credenciales incorrectas. Intentos restantes: ${3 - newAttempts}`)
      }
    }

    setIsLoading(false)
  }

  const handleForgotPassword = () => {
    // Redirect to recovery page
    window.location.href = "/recover-account"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
            <p className="text-gray-400">Accede a tu cuenta de Ilegalmovie</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-white">Bienvenido de vuelta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <Alert className="border-red-600 bg-red-600/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-600 bg-green-600/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        required
                        disabled={isLoading || isBlocked}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        required
                        disabled={isLoading || isBlocked}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        disabled={isLoading || isBlocked}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                      Recordarme
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading || isBlocked}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                {loginAttempts > 0 && loginAttempts < 3 && (
                  <div className="text-center">
                    <p className="text-sm text-yellow-400">Intentos fallidos: {loginAttempts}/3</p>
                  </div>
                )}

                {isBlocked && (
                  <div className="text-center">
                    <p className="text-sm text-red-400">Cuenta bloqueada temporalmente</p>
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" className="text-red-400 hover:text-red-300 font-medium">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Credenciales de prueba:</h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>
                    <strong>Admin:</strong> admin@ilegalmovie.com / admin123
                  </p>
                  <p>
                    <strong>Usuario:</strong> user@test.com / user123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
