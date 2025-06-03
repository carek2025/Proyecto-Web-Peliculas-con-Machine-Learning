"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Film, Plus, X, ArrowLeft, Send } from "lucide-react"
import { categories } from "@/lib/data"
import type { MovieSuggestion } from "@/lib/types"
import Link from "next/link"

export default function SuggestMoviePage() {
  const [user, setUser] = useState<any>(null)
  const [suggestion, setSuggestion] = useState<Partial<MovieSuggestion>>({
    title: "",
    description: "",
    image: "",
    year: new Date().getFullYear(),
    duration: "",
    genres: [],
    cast: [],
    director: "",
    trailer: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const addGenre = (genre: string) => {
    if (genre && !suggestion.genres?.includes(genre)) {
      setSuggestion({
        ...suggestion,
        genres: [...(suggestion.genres || []), genre],
      })
    }
  }

  const removeGenre = (genre: string) => {
    setSuggestion({
      ...suggestion,
      genres: suggestion.genres?.filter((g) => g !== genre) || [],
    })
  }

  const addCastMember = (member: string) => {
    if (member && !suggestion.cast?.includes(member)) {
      setSuggestion({
        ...suggestion,
        cast: [...(suggestion.cast || []), member],
      })
    }
  }

  const removeCastMember = (member: string) => {
    setSuggestion({
      ...suggestion,
      cast: suggestion.cast?.filter((c) => c !== member) || [],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Debes iniciar sesión para sugerir películas")
      return
    }

    if (!suggestion.title || !suggestion.description || !suggestion.director) {
      alert("Por favor completa los campos obligatorios")
      return
    }

    setIsSubmitting(true)

    const newSuggestion: MovieSuggestion = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      title: suggestion.title!,
      description: suggestion.description!,
      image: suggestion.image || "/placeholder.svg?height=600&width=400",
      year: suggestion.year!,
      duration: suggestion.duration!,
      genres: suggestion.genres!,
      cast: suggestion.cast!,
      director: suggestion.director!,
      trailer: suggestion.trailer,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    // Save suggestion
    const suggestions = JSON.parse(localStorage.getItem("movieSuggestions") || "[]")
    suggestions.push(newSuggestion)
    localStorage.setItem("movieSuggestions", JSON.stringify(suggestions))

    // Add notification for user
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const notification = {
      id: Date.now(),
      userId: user.id,
      type: "suggestion_submitted",
      title: "Sugerencia enviada",
      message: `Tu sugerencia "${suggestion.title}" ha sido enviada para revisión`,
      read: false,
      createdAt: new Date().toISOString(),
      data: { suggestionId: newSuggestion.id },
    }
    notifications.unshift(notification)
    localStorage.setItem("notifications", JSON.stringify(notifications))

    setIsSubmitting(false)
    alert("¡Sugerencia enviada exitosamente! Será revisada por los administradores.")

    // Reset form
    setSuggestion({
      title: "",
      description: "",
      image: "",
      year: new Date().getFullYear(),
      duration: "",
      genres: [],
      cast: [],
      director: "",
      trailer: "",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-4">Debes iniciar sesión para sugerir películas</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Film className="mr-3 h-8 w-8 text-purple-500" />
              Sugerir Película
            </h1>
            <p className="text-gray-400">Comparte tus películas favoritas con la comunidad</p>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Información de la Película</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-200">
                      Título *
                    </Label>
                    <Input
                      id="title"
                      value={suggestion.title}
                      onChange={(e) => setSuggestion({ ...suggestion, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Título de la película"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="director" className="text-gray-200">
                      Director *
                    </Label>
                    <Input
                      id="director"
                      value={suggestion.director}
                      onChange={(e) => setSuggestion({ ...suggestion, director: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Nombre del director"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year" className="text-gray-200">
                        Año *
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={suggestion.year}
                        onChange={(e) => setSuggestion({ ...suggestion, year: Number.parseInt(e.target.value) })}
                        className="bg-gray-700 border-gray-600 text-white"
                        min="1900"
                        max="2030"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-gray-200">
                        Duración *
                      </Label>
                      <Input
                        id="duration"
                        value={suggestion.duration}
                        onChange={(e) => setSuggestion({ ...suggestion, duration: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="ej: 2h 30min"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image" className="text-gray-200">
                      URL de Imagen
                    </Label>
                    <Input
                      id="image"
                      value={suggestion.image}
                      onChange={(e) => setSuggestion({ ...suggestion, image: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://image.tmdb.org/t/p/w500/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="trailer" className="text-gray-200">
                      URL del Trailer (YouTube)
                    </Label>
                    <Input
                      id="trailer"
                      value={suggestion.trailer}
                      onChange={(e) => setSuggestion({ ...suggestion, trailer: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description" className="text-gray-200">
                      Descripción *
                    </Label>
                    <Textarea
                      id="description"
                      value={suggestion.description}
                      onChange={(e) => setSuggestion({ ...suggestion, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-32"
                      placeholder="Descripción de la película..."
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-200">Géneros</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {suggestion.genres?.map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-purple-600 text-white">
                          {genre}
                          <button
                            type="button"
                            onClick={() => removeGenre(genre)}
                            className="ml-1 hover:text-purple-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={addGenre}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Seleccionar género" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-200">Reparto</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {suggestion.cast?.map((member) => (
                        <Badge key={member} variant="secondary" className="bg-blue-600 text-white">
                          {member}
                          <button
                            type="button"
                            onClick={() => removeCastMember(member)}
                            className="ml-1 hover:text-blue-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nombre del actor"
                        className="bg-gray-700 border-gray-600 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCastMember((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addCastMember(input.value)
                          input.value = ""
                        }}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Sugerencia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
