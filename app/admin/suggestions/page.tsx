"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Clock, Film, ArrowLeft, Eye } from "lucide-react"
import { movies } from "@/lib/data"
import type { MovieSuggestion, Movie } from "@/lib/types"
import Link from "next/link"

export default function AdminSuggestionsPage() {
  const [user, setUser] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([])
  const [selectedTab, setSelectedTab] = useState("pending")

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.isAdmin) {
        window.location.href = "/"
        return
      }
      setUser(parsedUser)
    }

    // Load suggestions
    const savedSuggestions = JSON.parse(localStorage.getItem("movieSuggestions") || "[]")
    setSuggestions(savedSuggestions)
  }, [])

  const approveSuggestion = (suggestion: MovieSuggestion) => {
    // Add movie to main movies list
    const newMovie: Movie = {
      id: Math.max(...movies.map((m) => m.id)) + 1,
      title: suggestion.title,
      description: suggestion.description,
      image: suggestion.image,
      year: suggestion.year,
      duration: suggestion.duration,
      rating: 4.0, // Default rating
      genres: suggestion.genres,
      cast: suggestion.cast,
      director: suggestion.director,
      trailer: suggestion.trailer,
    }

    // Update suggestion status
    const updatedSuggestions = suggestions.map((s) =>
      s.id === suggestion.id
        ? { ...s, status: "approved" as const, reviewedAt: new Date().toISOString(), reviewedBy: user.id }
        : s,
    )
    setSuggestions(updatedSuggestions)
    localStorage.setItem("movieSuggestions", JSON.stringify(updatedSuggestions))

    // Add movie to movies list (in a real app, this would be handled server-side)
    const currentMovies = JSON.parse(localStorage.getItem("adminMovies") || "[]")
    currentMovies.push(newMovie)
    localStorage.setItem("adminMovies", JSON.stringify(currentMovies))

    // Reward user with points
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === suggestion.userId) {
        return { ...u, points: u.points + 10 }
      }
      return u
    })
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    // Add notification for user
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const notification = {
      id: Date.now(),
      userId: suggestion.userId,
      type: "suggestion_approved",
      title: "¡Sugerencia aprobada!",
      message: `Tu sugerencia "${suggestion.title}" ha sido aprobada. Has recibido 10 puntos.`,
      read: false,
      createdAt: new Date().toISOString(),
      data: { suggestionId: suggestion.id, pointsEarned: 10 },
    }
    notifications.unshift(notification)
    localStorage.setItem("notifications", JSON.stringify(notifications))

    alert(`Sugerencia "${suggestion.title}" aprobada exitosamente`)
  }

  const rejectSuggestion = (suggestion: MovieSuggestion) => {
    const updatedSuggestions = suggestions.map((s) =>
      s.id === suggestion.id
        ? { ...s, status: "rejected" as const, reviewedAt: new Date().toISOString(), reviewedBy: user.id }
        : s,
    )
    setSuggestions(updatedSuggestions)
    localStorage.setItem("movieSuggestions", JSON.stringify(updatedSuggestions))

    // Add notification for user
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const notification = {
      id: Date.now(),
      userId: suggestion.userId,
      type: "suggestion_rejected",
      title: "Sugerencia rechazada",
      message: `Tu sugerencia "${suggestion.title}" ha sido rechazada.`,
      read: false,
      createdAt: new Date().toISOString(),
      data: { suggestionId: suggestion.id },
    }
    notifications.unshift(notification)
    localStorage.setItem("notifications", JSON.stringify(notifications))

    alert(`Sugerencia "${suggestion.title}" rechazada`)
  }

  const getFilteredSuggestions = (status: string) => {
    if (status === "all") return suggestions
    return suggestions.filter((s) => s.status === status)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-600">
            <X className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        )
      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Film className="mr-3 h-8 w-8 text-purple-500" />
              Sugerencias de Películas
            </h1>
            <p className="text-gray-400">Revisa y gestiona las sugerencias de los usuarios</p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600">
              Pendientes ({getFilteredSuggestions("pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-purple-600">
              Aprobadas ({getFilteredSuggestions("approved").length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-purple-600">
              Rechazadas ({getFilteredSuggestions("rejected").length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              Todas ({suggestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {getFilteredSuggestions(selectedTab).length === 0 ? (
              <div className="text-center py-12">
                <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No hay sugerencias en esta categoría</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getFilteredSuggestions(selectedTab).map((suggestion) => (
                  <Card key={suggestion.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                          <img
                            src={suggestion.image || "/placeholder.svg"}
                            alt={suggestion.title}
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">{suggestion.title}</h3>
                              <p className="text-gray-400 mb-2">
                                Sugerida por: <span className="text-blue-400">{suggestion.userName}</span>
                              </p>
                              <p className="text-gray-400 mb-2">
                                {suggestion.director} • {suggestion.year} • {suggestion.duration}
                              </p>
                              <p className="text-gray-400 mb-4">
                                Enviada: {new Date(suggestion.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(suggestion.status)}
                          </div>

                          <p className="text-gray-300 mb-4 line-clamp-3">{suggestion.description}</p>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Géneros:</h4>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.genres.map((genre) => (
                                <Badge key={genre} variant="secondary" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-white mb-2">Reparto:</h4>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.cast.map((actor) => (
                                <Badge key={actor} variant="outline" className="text-xs">
                                  {actor}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalles
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white">{suggestion.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-400">Director:</span>
                                      <span className="text-white ml-2">{suggestion.director}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Año:</span>
                                      <span className="text-white ml-2">{suggestion.year}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Duración:</span>
                                      <span className="text-white ml-2">{suggestion.duration}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Estado:</span>
                                      <span className="ml-2">{getStatusBadge(suggestion.status)}</span>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-white font-semibold mb-2">Descripción:</h4>
                                    <p className="text-gray-300">{suggestion.description}</p>
                                  </div>

                                  {suggestion.trailer && (
                                    <div>
                                      <h4 className="text-white font-semibold mb-2">Trailer:</h4>
                                      <div className="aspect-video rounded-lg overflow-hidden">
                                        <iframe
                                          src={suggestion.trailer}
                                          title={`${suggestion.title} Trailer`}
                                          className="w-full h-full"
                                          allowFullScreen
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {suggestion.status === "pending" && (
                              <>
                                <Button
                                  onClick={() => approveSuggestion(suggestion)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Aprobar
                                </Button>
                                <Button
                                  onClick={() => rejectSuggestion(suggestion)}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Rechazar
                                </Button>
                              </>
                            )}

                            {suggestion.status !== "pending" && suggestion.reviewedAt && (
                              <p className="text-sm text-gray-400">
                                Revisada: {new Date(suggestion.reviewedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
