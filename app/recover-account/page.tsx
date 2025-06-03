"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, User, Lock, ArrowLeft, CheckCircle, AlertCircle, Key, Shield } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RecoverAccountPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Request, 2: Verify, 3: Reset
  const [recoveryMethod, setRecoveryMethod] = useState("email")

  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Find user by email or username
    const user = users.find((u: any) => (recoveryMethod === "email" ? u.email === email : u.name === username))

    if (user) {
      // Generate verification code (in real app, this would be sent via email/SMS)
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      localStorage.setItem("recoveryCode", code)
      localStorage.setItem("recoveryUserId", user.id.toString())

      setSuccess(
        `Código de verificación enviado ${recoveryMethod === "email" ? "a tu email" : "por SMS"}. Código: ${code}`,
      )
      setStep(2)
    } else {
      setError(recoveryMethod === "email" ? "Email no encontrado" : "Usuario no encontrado")
    }

    setIsLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const savedCode = localStorage.getItem("recoveryCode")

    if (verificationCode === savedCode) {
      setSuccess("Código verificado correctamente")
      setStep(3)
    } else {
      setError("Código de verificación incorrecto")
    }

    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update user password
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userId = localStorage.getItem("recoveryUserId")

    const updatedUsers = users.map((user: any) =>
      user.id.toString() === userId ? { ...user, password: newPassword } : user,
    )

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.removeItem("recoveryCode")
    localStorage.removeItem("recoveryUserId")

    setSuccess("Contraseña restablecida exitosamente. Redirigiendo al login...")

    setTimeout(() => {
      window.location.href = "/login"
    }, 2000)

    setIsLoading(false)
  }

  const resendCode = async () => {
    setError("")
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate new verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    localStorage.setItem("recoveryCode", code)

    setSuccess(`Nuevo código enviado: ${code}`)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/login" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al login
            </Link>
            <h1 className="text-3xl font-bold mb-2">Recuperar Cuenta</h1>
            <p className="text-gray-400">Restablece el acceso a tu cuenta</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-white flex items-center justify-center">
                <Shield className="mr-2 h-5 w-5" />
                Recuperación de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="border-red-600 bg-red-600/10 mb-6">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-600 bg-green-600/10 mb-6">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">{success}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Request Recovery */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-white mb-2">Solicitar Recuperación</h2>
                    <p className="text-sm text-gray-400">Elige cómo quieres recuperar tu cuenta</p>
                  </div>

                  <Tabs value={recoveryMethod} onValueChange={setRecoveryMethod}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                      <TabsTrigger value="email" className="data-[state=active]:bg-red-600">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="username" className="data-[state=active]:bg-red-600">
                        <User className="h-4 w-4 mr-2" />
                        Usuario
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                      <form onSubmit={handleRequestRecovery} className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Dirección de Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="tu@email.com"
                              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Te enviaremos un código de verificación a este email
                          </p>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Enviando..." : "Enviar Código"}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="username">
                      <form onSubmit={handleRequestRecovery} className="space-y-4">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre de Usuario
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="tu_usuario"
                              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Te enviaremos un código de verificación por SMS</p>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Enviando..." : "Enviar Código"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Step 2: Verify Code */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-white mb-2">Verificar Código</h2>
                    <p className="text-sm text-gray-400">Ingresa el código de 6 dígitos que recibiste</p>
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                        Código de Verificación
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="code"
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-center text-lg tracking-widest"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={isLoading || verificationCode.length !== 6}
                    >
                      {isLoading ? "Verificando..." : "Verificar Código"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendCode}
                        className="text-sm text-red-400 hover:text-red-300"
                        disabled={isLoading}
                      >
                        ¿No recibiste el código? Reenviar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-white mb-2">Nueva Contraseña</h2>
                    <p className="text-sm text-gray-400">Crea una nueva contraseña segura</p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nueva contraseña"
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmar contraseña"
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Requisitos de contraseña:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li className={newPassword.length >= 6 ? "text-green-400" : ""}>• Al menos 6 caracteres</li>
                        <li className={newPassword === confirmPassword && newPassword ? "text-green-400" : ""}>
                          • Las contraseñas deben coincidir
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6}
                    >
                      {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
                    </Button>
                  </form>
                </div>
              )}

              {/* Progress Indicator */}
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-red-600" : "bg-gray-600"}`} />
                  <div className={`w-8 h-1 ${step >= 2 ? "bg-red-600" : "bg-gray-600"}`} />
                  <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-red-600" : "bg-gray-600"}`} />
                  <div className={`w-8 h-1 ${step >= 3 ? "bg-red-600" : "bg-gray-600"}`} />
                  <div className={`w-3 h-3 rounded-full ${step >= 3 ? "bg-red-600" : "bg-gray-600"}`} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Solicitar</span>
                  <span>Verificar</span>
                  <span>Restablecer</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  ¿Recordaste tu contraseña?{" "}
                  <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
