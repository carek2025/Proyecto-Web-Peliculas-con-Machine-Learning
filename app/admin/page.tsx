"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Film,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  Save,
  X,
} from "lucide-react"
import { movies, categories, adminUser } from "@/lib/data"
import type { Movie } from "@/lib/types"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [moviesList, setMoviesList] = useState<Movie[]>(movies)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddingMovie, setIsAddingMovie] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    title: "",
    description: "",
    image: "",
    year: new Date().getFullYear(),
    duration: "",
    rating: 0,
    genres: [],
    cast: [],
    director: "",
    trailer: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Verificar si es admin
      if (parsedUser.email !== adminUser.email) {
        window.location.href = "/"
        return
      }
      setUser(parsedUser)
    } else {
      window.location.href = "/login"
    }
  }, [])

  useEffect(() => {
    let filtered = moviesList

    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) => genre.toLowerCase() === selectedCategory.toLowerCase()),
      )
    }

    setFilteredMovies(filtered)
  }, [searchQuery, selectedCategory, moviesList])

  const handleAddMovie = () => {
    if (!newMovie.title || !newMovie.description) {
      alert("Por favor completa al menos el título y la descripción")
      return
    }

    const movie: Movie = {
      id: Math.max(...moviesList.map((m) => m.id)) + 1,
      title: newMovie.title!,
      description: newMovie.description!,
      image: newMovie.image || "/placeholder.svg?height=600&width=400",
      year: newMovie.year!,
      duration: newMovie.duration!,
      rating: newMovie.rating!,
      genres: newMovie.genres!,
      cast: newMovie.cast!,
      director: newMovie.director!,
      trailer: newMovie.trailer,
    }

    setMoviesList([...moviesList, movie])
    setNewMovie({
      title: "",
      description: "",
      image: "",
      year: new Date().getFullYear(),
      duration: "",
      rating: 0,
      genres: [],
      cast: [],
      director: "",
      trailer: "",
    })
    setIsAddingMovie(false)
    alert("Película agregada exitosamente")
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
    setNewMovie(movie)
  }

  const handleUpdateMovie = () => {
    if (!editingMovie) return

    const updatedMovies = moviesList.map((movie) => (movie.id === editingMovie.id ? { ...(newMovie as Movie) } : movie))
    setMoviesList(updatedMovies)
    setEditingMovie(null)
    setNewMovie({
      title: "",
      description: "",
      image: "",
      year: new Date().getFullYear(),
      duration: "",
      rating: 0,
      genres: [],
      cast: [],
      director: "",
      trailer: "",
    })
    alert("Película actualizada exitosamente")
  }

  const handleDeleteMovie = (movieId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta película?")) {
      setMoviesList(moviesList.filter((movie) => movie.id !== movieId))
      alert("Película eliminada exitosamente")
    }
  }

  const addGenre = (genre: string) => {
    if (genre && !newMovie.genres?.includes(genre)) {
      setNewMovie({
        ...newMovie,
        genres: [...(newMovie.genres || []), genre],
      })
    }
  }

  const removeGenre = (genre: string) => {
    setNewMovie({
      ...newMovie,
      genres: newMovie.genres?.filter((g) => g !== genre) || [],
    })
  }

  const addCastMember = (member: string) => {
    if (member && !newMovie.cast?.includes(member)) {
      setNewMovie({
        ...newMovie,
        cast: [...(newMovie.cast || []), member],
      })
    }
  }

  const removeCastMember = (member: string) => {
    setNewMovie({
      ...newMovie,
      cast: newMovie.cast?.filter((c) => c !== member) || [],
    })
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-3 h-8 w-8 text-red-500" />
              Panel de Administración
            </h1>
            <p className="text-gray-400">Gestiona películas y contenido del sitio</p>
          </div>

          <Dialog open={isAddingMovie} onOpenChange={setIsAddingMovie}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Película
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingMovie ? "Editar Película" : "Agregar Nueva Película"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-200">
                      Título *
                    </Label>
                    <Input
                      id="title"
                      value={newMovie.title}
                      onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Título de la película"
                    />
                  </div>

                  <div>
                    <Label htmlFor="director" className="text-gray-200">
                      Director *
                    </Label>
                    <Input
                      id="director"
                      value={newMovie.director}
                      onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Nombre del director"
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
                        value={newMovie.year}
                        onChange={(e) => setNewMovie({ ...newMovie, year: Number.parseInt(e.target.value) })}
                        className="bg-gray-800 border-gray-600 text-white"
                        min="1900"
                        max="2030"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-gray-200">
                        Duración *
                      </Label>
                      <Input
                        id="duration"
                        value={newMovie.duration}
                        onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="ej: 2h 30min"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rating" className="text-gray-200">
                      Calificación (1-5) *
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({ ...newMovie, rating: Number.parseFloat(e.target.value) })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image" className="text-gray-200">
                      URL de Imagen
                    </Label>
                    <Input
                      id="image"
                      value={newMovie.image}
                      onChange={(e) => setNewMovie({ ...newMovie, image: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://image.tmdb.org/t/p/w500/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="trailer" className="text-gray-200">
                      URL del Trailer (YouTube)
                    </Label>
                    <Input
                      id="trailer"
                      value={newMovie.trailer}
                      onChange={(e) => setNewMovie({ ...newMovie, trailer: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
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
                      value={newMovie.description}
                      onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white h-32"
                      placeholder="Descripción de la película..."
                    />
                  </div>

                  <div>
                    <Label className="text-gray-200">Géneros</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newMovie.genres?.map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-red-600 text-white">
                          {genre}
                          <button onClick={() => removeGenre(genre)} className="ml-1 hover:text-red-200">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={addGenre}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
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
                      {newMovie.cast?.map((member) => (
                        <Badge key={member} variant="secondary" className="bg-blue-600 text-white">
                          {member}
                          <button onClick={() => removeCastMember(member)} className="ml-1 hover:text-blue-200">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nombre del actor"
                        className="bg-gray-800 border-gray-600 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
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

              <div className="flex space-x-2 mt-6">
                <Button
                  onClick={() => {
                    setIsAddingMovie(false)
                    setEditingMovie(null)
                    setNewMovie({
                      title: "",
                      description: "",
                      image: "",
                      year: new Date().getFullYear(),
                      duration: "",
                      rating: 0,
                      genres: [],
                      cast: [],
                      director: "",
                      trailer: "",
                    })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={editingMovie ? handleUpdateMovie : handleAddMovie}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingMovie ? "Actualizar" : "Agregar"} Película
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Film className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{moviesList.length}</div>
              <div className="text-sm text-gray-400">Total Películas</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-sm text-gray-400">Usuarios Registrados</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Comentarios Totales</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {(moviesList.reduce((acc, movie) => acc + movie.rating, 0) / moviesList.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Calificación Promedio</div>
            </CardContent>
          </Card>
        </div>

        {/* Movies Management */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Gestión de Películas</CardTitle>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar películas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-16 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{movie.title}</h3>
                    <p className="text-sm text-gray-400">
                      {movie.director} • {movie.year} • {movie.duration}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(movie.rating) ? "text-yellow-400" : "text-gray-600"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">{movie.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        handleEditMovie(movie)
                        setIsAddingMovie(true)
                      }}
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteMovie(movie.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className="text-center py-8">
                <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No se encontraron películas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Credentials Info */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-300 font-semibold mb-2">Credenciales de Administrador:</h3>
          <p className="text-blue-200 text-sm">Email: admin@ilegalmovie.com</p>
          <p className="text-blue-200 text-sm">Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
