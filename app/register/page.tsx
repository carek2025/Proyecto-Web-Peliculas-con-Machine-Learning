"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Eye, EyeOff, Loader2, Check, X, Sparkles } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    favoriteMovie: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "weak", color: "text-red-400" }
    if (password.length < 10) return { strength: "medium", color: "text-yellow-400" }
    return { strength: "strong", color: "text-green-400" }
  }

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const user = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      avatar: "",
      points: 10, // Initial points
      joinDate: new Date().toISOString().split("T")[0],
      favorites: [],
      comments: [],
      watchHistory: [],
      favoriteMovie: formData.favoriteMovie,
    }

    localStorage.setItem("currentUser", JSON.stringify(user))
    setShowSuccess(true)

    setTimeout(() => {
      window.location.href = "/"
    }, 3000)

    setIsLoading(false)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border-gray-700 text-center">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Sparkles className="h-16 w-16 text-yellow-400 mx-auto animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a Ilegalmovie!</h2>
            <p className="text-gray-300 mb-4">Tu cuenta ha sido creada exitosamente.</p>
            <p className="text-sm text-blue-300">Has recibido 10 puntos iniciales 🎉</p>
            <p className="text-xs text-gray-400 mt-2">Redirigiendo en unos segundos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/placeholder.svg?height=1080&width=1920)" }}
      />

      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border-gray-700 relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Film className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">
              Ilegalmovie
            </span>
          </div>
          <CardTitle className="text-2xl text-white">Crear Cuenta</CardTitle>
          <CardDescription className="text-gray-400">Únete a la mejor plataforma de películas</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white focus:border-red-500"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Correo electrónico
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white focus:border-red-500 pr-10"
                  placeholder="tu@email.com"
                  required
                />
                {formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validateEmail(formData.email) ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white focus:border-red-500 pr-10"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <p className={`text-xs ${getPasswordStrength(formData.password).color}`}>
                  Fortaleza: {getPasswordStrength(formData.password).strength}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white focus:border-red-500 pr-10"
                  placeholder="Confirma tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs ${passwordsMatch ? "text-green-400" : "text-red-400"}`}>
                  {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="favoriteMovie" className="text-gray-200">
                Película favorita (opcional)
              </Label>
              <Input
                id="favoriteMovie"
                type="text"
                value={formData.favoriteMovie}
                onChange={(e) => setFormData({ ...formData, favoriteMovie: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white focus:border-red-500"
                placeholder="Para personalizar recomendaciones"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-semibold py-3"
              disabled={isLoading || !validateEmail(formData.email) || !passwordsMatch}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
