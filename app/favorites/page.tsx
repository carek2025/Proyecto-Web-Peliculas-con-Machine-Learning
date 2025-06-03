"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Trash2, Download, ArrowLeft } from "lucide-react"
import { movies } from "@/lib/data"
import Link from "next/link"

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null)
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<{ [key: number]: any[] }>({})

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const favMovies = movies.filter((movie) => favorites.includes(movie.id))
    setFavoriteMovies(favMovies)

    // Generate recommendations for each favorite
    const recs: { [key: number]: any[] } = {}
    favMovies.forEach((movie) => {
      const similar = movies
        .filter((m) => m.id !== movie.id && m.genres.some((genre) => movie.genres.includes(genre)))
        .slice(0, 4)
      recs[movie.id] = similar
    })
    setRecommendations(recs)
  }, [])

  const removeFavorite = (movieId: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const newFavorites = favorites.filter((id: number) => id !== movieId)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  const exportFavorites = () => {
    const favoritesText = favoriteMovies
      .map((movie) => `${movie.title} (${movie.year}) - ${movie.genres.join(", ")}`)
      .join("\n")

    const blob = new Blob([favoritesText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mis-peliculas-favoritas.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-400">Debes iniciar sesión para ver tus favoritos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Heart className="mr-3 h-8 w-8 text-red-500" />
                Mis Favoritos
              </h1>
              <p className="text-gray-400">{favoriteMovies.length} películas guardadas</p>
            </div>
          </div>

          {favoriteMovies.length > 0 && (
            <Button onClick={exportFavorites} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Exportar Lista
            </Button>
          )}
        </div>

        {favoriteMovies.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No tienes favoritos aún</h2>
            <p className="text-gray-500 mb-6">Explora películas y agrega las que más te gusten</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/">Explorar Películas</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {favoriteMovies.map((movie) => (
              <Card key={movie.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <img
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{movie.title}</h3>
                          <p className="text-gray-400 mb-2">
                            {movie.year} • {movie.duration} • {movie.genres.join(", ")}
                          </p>
                          <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={i < Math.floor(movie.rating) ? "text-yellow-400" : "text-gray-600"}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-white">{movie.rating}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => removeFavorite(movie.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-gray-300 mb-6 line-clamp-3">{movie.description}</p>

                      <div className="flex items-center space-x-4 mb-6">
                        <Button asChild className="bg-red-600 hover:bg-red-700">
                          <Link href={`/movie/${movie.id}`}>Ver Película</Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href={`/movie/${movie.id}`}>Más Información</Link>
                        </Button>
                      </div>

                      {/* Recommendations */}
                      {recommendations[movie.id] && recommendations[movie.id].length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Películas Similares</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recommendations[movie.id].map((rec) => (
                              <Link key={rec.id} href={`/movie/${rec.id}`} className="group cursor-pointer">
                                <img
                                  src={rec.image || "/placeholder.svg"}
                                  alt={rec.title}
                                  className="w-full h-32 object-cover rounded group-hover:scale-105 transition-transform"
                                />
                                <h5 className="text-sm font-medium text-white mt-2 line-clamp-1">{rec.title}</h5>
                                <p className="text-xs text-gray-400">{rec.genres.join(", ")}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
