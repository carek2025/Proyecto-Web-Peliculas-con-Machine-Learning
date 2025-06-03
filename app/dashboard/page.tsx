"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Trophy, Clock, Heart, MessageSquare, Star, Gift, Camera, Film, Package } from "lucide-react"
import { movies } from "@/lib/data"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({ name: "", email: "" })

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setProfileData({ name: parsedUser.name, email: parsedUser.email })

      // Generate mock watch history
      const mockHistory = movies.slice(0, 5).map((movie, index) => ({
        ...movie,
        watchedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
      }))
      setWatchHistory(mockHistory)

      // Generate mock weekly activity
      const mockActivity = Array.from({ length: 7 }, (_, i) => ({
        day: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i],
        views: Math.floor(Math.random() * 5),
        comments: Math.floor(Math.random() * 3),
        favorites: Math.floor(Math.random() * 2),
      }))
      setWeeklyActivity(mockActivity)
    }
  }, [])

  const handleProfileUpdate = () => {
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setIsEditingProfile(false)
  }

  const redeemReward = (cost: number, reward: string) => {
    if (user.points >= cost) {
      const updatedUser = { ...user, points: user.points - cost }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      alert(`¡Has canjeado: ${reward}!`)
    } else {
      alert("No tienes suficientes puntos")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-400">Debes iniciar sesión para ver tu panel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Usuario</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <User className="mr-2 h-5 w-5" />
                  Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-red-500/50">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-red-500 to-blue-500 text-white text-2xl">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-semibold mt-4 text-white">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500">Miembro desde {formatDate(user.joinDate)}</p>
                </div>

                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Editar Perfil</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Editar Perfil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-200">
                          Nombre
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-200">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <Button onClick={handleProfileUpdate} className="w-full bg-red-600 hover:bg-red-700">
                        Guardar Cambios
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Points Section */}
            <Card className="bg-gray-800/50 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Puntos: {user.points}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-300">
                  <p>• 1 punto por comentario (máx. 5/día)</p>
                  <p>• 1 punto por favorito</p>
                  <p>• 2 puntos por película completada</p>
                  <p>• 5 puntos por invitar amigos</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Recompensas</h4>
                  <Button
                    onClick={() => redeemReward(50, "Tema Oscuro Premium")}
                    disabled={user.points < 50}
                    className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Tema Premium (50 pts)
                  </Button>
                  <Button
                    onClick={() => redeemReward(100, "Insignia Especial")}
                    disabled={user.points < 100}
                    className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Insignia Especial (100 pts)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Watch History */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Clock className="mr-2 h-5 w-5" />
                  Historial de Visualización
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchHistory.map((movie) => (
                    <div key={movie.id} className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg">
                      <img
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{movie.title}</h4>
                        <p className="text-sm text-gray-400">Visto el {formatDate(movie.watchedAt)}</p>
                      </div>
                      <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                        <Link href={`/movie/${movie.id}`}>Ver de nuevo</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Actividad Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyActivity.map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 text-sm text-gray-400">{day.day}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">Visualizaciones: {day.views}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">Comentarios: {day.comments}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-300">Favoritos: {day.favorites}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Favoritos</h3>
                  <p className="text-sm text-gray-400 mb-4">Ver películas favoritas</p>
                  <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                    <Link href="/favorites">Ver Favoritos</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Comentarios</h3>
                  <p className="text-sm text-gray-400 mb-4">Gestionar comentarios</p>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/my-comments">Ver Comentarios</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Perfil</h3>
                  <p className="text-sm text-gray-400 mb-4">Editar información</p>
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Film className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Sugerir Película</h3>
                  <p className="text-sm text-gray-400 mb-4">Sugiere una nueva película</p>
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/suggest-movie">Sugerir</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Inventario</h3>
                  <p className="text-sm text-gray-400 mb-4">Gestiona tus artículos</p>
                  <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/inventory">Ver Inventario</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
