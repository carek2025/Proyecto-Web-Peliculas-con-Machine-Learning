"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Camera, Lock, Save, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    favoriteMovie: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState("")

  const predefinedAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Garland",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Princess",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Snuggles",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuddles",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty",
  ]

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setProfileData({
        name: parsedUser.name,
        email: parsedUser.email,
        favoriteMovie: parsedUser.favoriteMovie || "",
      })
      setSelectedAvatar(parsedUser.avatar || predefinedAvatars[0])
    }
  }, [])

  const handleProfileUpdate = () => {
    const updatedUser = {
      ...user,
      ...profileData,
      avatar: selectedAvatar,
    }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    alert("Perfil actualizado exitosamente")
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas nuevas no coinciden")
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    // En una aplicación real, verificarías la contraseña actual
    const updatedUser = { ...user }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsChangingPassword(false)
    alert("Contraseña cambiada exitosamente")
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "Débil", color: "text-red-400" }
    if (password.length < 10) return { strength: "Media", color: "text-yellow-400" }
    return { strength: "Fuerte", color: "text-green-400" }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-400">Debes iniciar sesión para editar tu perfil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <User className="mr-3 h-8 w-8 text-blue-500" />
              Editar Perfil
            </h1>
            <p className="text-gray-400">Actualiza tu información personal</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Camera className="mr-2 h-5 w-5" />
                  Foto de Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 border-4 border-red-500/50 mb-4">
                    <AvatarImage src={selectedAvatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-red-500 to-blue-500 text-white text-4xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-xl font-semibold text-white mb-2">{user.name}</h3>
                  <p className="text-gray-400 text-sm">Miembro desde {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Avatares Predefinidos</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {predefinedAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`relative rounded-full overflow-hidden border-2 transition-all ${
                          selectedAvatar === avatar
                            ? "border-red-500 scale-110"
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={avatar || "/placeholder.svg"}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-200">
                      Nombre Completo
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-200">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="favoriteMovie" className="text-gray-200">
                    Película Favorita
                  </Label>
                  <Input
                    id="favoriteMovie"
                    value={profileData.favoriteMovie}
                    onChange={(e) => setProfileData({ ...profileData, favoriteMovie: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                    placeholder="¿Cuál es tu película favorita?"
                  />
                </div>

                <Button onClick={handleProfileUpdate} className="bg-red-600 hover:bg-red-700">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lock className="mr-2 h-5 w-5" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Cambiar Contraseña</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword" className="text-gray-200">
                          Contraseña Actual
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="bg-gray-800 border-gray-600 text-white pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="newPassword" className="text-gray-200">
                          Nueva Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="bg-gray-800 border-gray-600 text-white pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordData.newPassword && (
                          <p className={`text-xs mt-1 ${getPasswordStrength(passwordData.newPassword).color}`}>
                            Fortaleza: {getPasswordStrength(passwordData.newPassword).strength}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-200">
                          Confirmar Nueva Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="bg-gray-800 border-gray-600 text-white pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordData.confirmPassword && (
                          <p
                            className={`text-xs mt-1 ${
                              passwordData.newPassword === passwordData.confirmPassword
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {passwordData.newPassword === passwordData.confirmPassword
                              ? "Las contraseñas coinciden"
                              : "Las contraseñas no coinciden"}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={() => setIsChangingPassword(false)} variant="outline" className="flex-1">
                          Cancelar
                        </Button>
                        <Button
                          onClick={handlePasswordChange}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword
                          }
                        >
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-white mb-2">Consejos de Seguridad</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Usa una contraseña de al menos 8 caracteres</li>
                    <li>• Incluye números y símbolos especiales</li>
                    <li>• No compartas tu contraseña con nadie</li>
                    <li>• Cambia tu contraseña regularmente</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{user.points}</div>
                    <div className="text-sm text-gray-400">Puntos Totales</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {JSON.parse(localStorage.getItem("favorites") || "[]").length}
                    </div>
                    <div className="text-sm text-gray-400">Favoritos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-400">Días Activo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
