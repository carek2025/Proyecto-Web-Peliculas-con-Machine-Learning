"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Newspaper,
  Calendar,
  Clock,
  Star,
  Bell,
  BellOff,
  ArrowLeft,
  Play,
  Heart,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import Link from "next/link"
import { movies } from "@/lib/data"
import { storeItems } from "@/lib/store-data"

interface NewsArticle {
  id: number
  title: string
  content: string
  summary: string
  image: string
  category: "upcoming" | "reviews" | "industry" | "trailers"
  publishedAt: string
  author: string
  tags: string[]
  relatedMovies?: number[]
  featured: boolean
}

interface UserNotification {
  id: number
  userId: number
  type: "new_release" | "recommendation" | "news"
  title: string
  message: string
  movieId?: number
  newsId?: number
  read: boolean
  createdAt: string
}

export default function NewsPage() {
  const [user, setUser] = useState<any>(null)
  const [news, setNews] = useState<NewsArticle[]>([])
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarkedNews, setBookmarkedNews] = useState<number[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    newReleases: true,
    recommendations: true,
    news: true,
  })

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    // Initialize news articles
    const sampleNews: NewsArticle[] = [
      {
        id: 1,
        title: "Los Estrenos Más Esperados de 2024",
        content:
          "Este año promete ser increíble para el cine con una variedad de géneros que satisfarán a todos los gustos. Desde secuelas muy esperadas hasta nuevas franquicias, aquí tienes todo lo que necesitas saber sobre los próximos lanzamientos.",
        summary: "Descubre las películas más esperadas que llegarán a los cines este año",
        image: "/placeholder.svg?height=400&width=600",
        category: "upcoming",
        publishedAt: new Date().toISOString(),
        author: "Redacción Ilegalmovie",
        tags: ["estrenos", "2024", "cine"],
        relatedMovies: [1, 2, 3],
        featured: true,
      },
      {
        id: 2,
        title: "Análisis: El Impacto del Streaming en el Cine",
        content:
          "Las plataformas de streaming han revolucionado la forma en que consumimos contenido audiovisual. En este análisis profundo, exploramos cómo esta transformación está afectando a la industria cinematográfica tradicional.",
        summary: "Un análisis profundo sobre cómo el streaming está cambiando el cine",
        image: "/placeholder.svg?height=400&width=600",
        category: "industry",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        author: "María González",
        tags: ["streaming", "industria", "análisis"],
        featured: false,
      },
      {
        id: 3,
        title: "Nuevos Trailers: Lo Que Viene Este Mes",
        content:
          "Hemos recopilado los trailers más emocionantes que se han lanzado recientemente. Desde blockbusters hasta películas independientes, aquí tienes un vistazo a lo que puedes esperar en las próximas semanas.",
        summary: "Los trailers más emocionantes del mes que no puedes perderte",
        image: "/placeholder.svg?height=400&width=600",
        category: "trailers",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        author: "Carlos Ruiz",
        tags: ["trailers", "estrenos", "avances"],
        relatedMovies: [4, 5, 6],
        featured: false,
      },
      {
        id: 4,
        title: "Reseña: Las Mejores Películas del Mes",
        content:
          "Nuestro equipo de críticos ha seleccionado las mejores películas que se han estrenado este mes. Desde dramas emotivos hasta comedias divertidas, aquí tienes nuestras recomendaciones.",
        summary: "Las películas mejor valoradas por nuestros críticos este mes",
        image: "/placeholder.svg?height=400&width=600",
        category: "reviews",
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        author: "Ana Martín",
        tags: ["reseñas", "críticas", "recomendaciones"],
        relatedMovies: [7, 8, 9],
        featured: true,
      },
    ]

    setNews(sampleNews)
    localStorage.setItem("newsArticles", JSON.stringify(sampleNews))

    // Load user preferences
    const savedBookmarks = localStorage.getItem(`bookmarks_${userData ? JSON.parse(userData).id : "guest"}`)
    if (savedBookmarks) {
      setBookmarkedNews(JSON.parse(savedBookmarks))
    }

    const savedNotificationSettings = localStorage.getItem(
      `notificationSettings_${userData ? JSON.parse(userData).id : "guest"}`,
    )
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }

    // Generate personalized notifications
    if (userData) {
      generatePersonalizedNotifications(JSON.parse(userData))
    }

    // Apply active theme
    applyActiveTheme()
  }, [])

  const applyActiveTheme = () => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      const inventory = parsedUser.inventory || {}

      if (inventory.activeTheme) {
        const theme = storeItems.find((item) => item.id === inventory.activeTheme)
        if (theme && theme.data) {
          const root = document.documentElement
          root.style.setProperty("--theme-primary", theme.data.primaryColor)
          root.style.setProperty("--theme-secondary", theme.data.secondaryColor)
          root.style.setProperty("--theme-accent", theme.data.accentColor)
          root.style.setProperty("--theme-bg", theme.data.backgroundColor)
          root.className = root.className.replace(/theme-\w+/g, "")
          root.classList.add(`theme-${theme.data.name}`)
        }
      }
    }
  }

  const generatePersonalizedNotifications = (userData: any) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const favoriteMovies = movies.filter((movie) => favorites.includes(movie.id))

    const newNotifications: UserNotification[] = []

    // Generate recommendations based on favorite genres
    if (favoriteMovies.length > 0) {
      const favoriteGenres = [...new Set(favoriteMovies.flatMap((movie) => movie.genres))]

      favoriteGenres.forEach((genre) => {
        const relatedMovies = movies
          .filter((movie) => movie.genres.includes(genre) && !favorites.includes(movie.id))
          .slice(0, 2)

        relatedMovies.forEach((movie) => {
          newNotifications.push({
            id: Date.now() + Math.random(),
            userId: userData.id,
            type: "recommendation",
            title: "Nueva Recomendación",
            message: `Basado en tus gustos de ${genre}, te recomendamos "${movie.title}"`,
            movieId: movie.id,
            read: false,
            createdAt: new Date().toISOString(),
          })
        })
      })
    }

    // Generate new release notifications
    const recentMovies = movies
      .filter((movie) => new Date(movie.year).getFullYear() === new Date().getFullYear())
      .slice(0, 3)

    recentMovies.forEach((movie) => {
      newNotifications.push({
        id: Date.now() + Math.random(),
        userId: userData.id,
        type: "new_release",
        title: "Nuevo Estreno",
        message: `"${movie.title}" ya está disponible`,
        movieId: movie.id,
        read: false,
        createdAt: new Date().toISOString(),
      })
    })

    // Generate news notifications
    news.slice(0, 2).forEach((article) => {
      newNotifications.push({
        id: Date.now() + Math.random(),
        userId: userData.id,
        type: "news",
        title: "Nuevas Noticias",
        message: article.title,
        newsId: article.id,
        read: false,
        createdAt: new Date().toISOString(),
      })
    })

    setNotifications(newNotifications)
    localStorage.setItem(`notifications_${userData.id}`, JSON.stringify(newNotifications))
  }

  const toggleBookmark = (newsId: number) => {
    if (!user) {
      alert("Debes iniciar sesión para guardar noticias")
      return
    }

    const isBookmarked = bookmarkedNews.includes(newsId)
    let updatedBookmarks

    if (isBookmarked) {
      updatedBookmarks = bookmarkedNews.filter((id) => id !== newsId)
    } else {
      updatedBookmarks = [...bookmarkedNews, newsId]
    }

    setBookmarkedNews(updatedBookmarks)
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks))
  }

  const markNotificationAsRead = (notificationId: number) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif,
    )
    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications))
  }

  const updateNotificationSettings = (setting: string, value: boolean) => {
    const updatedSettings = { ...notificationSettings, [setting]: value }
    setNotificationSettings(updatedSettings)
    localStorage.setItem(`notificationSettings_${user?.id}`, JSON.stringify(updatedSettings))
  }

  const getFilteredNews = () => {
    if (selectedCategory === "all") return news
    if (selectedCategory === "bookmarked") return news.filter((article) => bookmarkedNews.includes(article.id))
    return news.filter((article) => article.category === selectedCategory)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "upcoming":
        return <Calendar className="h-4 w-4" />
      case "reviews":
        return <Star className="h-4 w-4" />
      case "industry":
        return <Newspaper className="h-4 w-4" />
      case "trailers":
        return <Play className="h-4 w-4" />
      default:
        return <Newspaper className="h-4 w-4" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "upcoming":
        return "Próximos Estrenos"
      case "reviews":
        return "Reseñas"
      case "industry":
        return "Industria"
      case "trailers":
        return "Trailers"
      default:
        return "Todas"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Newspaper className="mr-3 h-8 w-8 text-blue-500" />
              Noticias de Cine
            </h1>
            <p className="text-gray-400">Mantente al día con las últimas noticias del mundo del cine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
              <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Estrenos
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600">
                  <Star className="h-4 w-4 mr-1" />
                  Reseñas
                </TabsTrigger>
                <TabsTrigger value="industry" className="data-[state=active]:bg-blue-600">
                  <Newspaper className="h-4 w-4 mr-1" />
                  Industria
                </TabsTrigger>
                <TabsTrigger value="trailers" className="data-[state=active]:bg-blue-600">
                  <Play className="h-4 w-4 mr-1" />
                  Trailers
                </TabsTrigger>
                <TabsTrigger value="bookmarked" className="data-[state=active]:bg-blue-600">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Guardadas
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                {/* Featured News */}
                {selectedCategory === "all" && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Noticias Destacadas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {news
                        .filter((article) => article.featured)
                        .map((article) => (
                          <Card key={article.id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                            <div className="aspect-video bg-gray-700/50">
                              <img
                                src={article.image || "/placeholder.svg"}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                                }}
                              />
                            </div>
                            <CardContent className="p-6">
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge className="bg-blue-600">
                                  {getCategoryIcon(article.category)}
                                  <span className="ml-1">{getCategoryName(article.category)}</span>
                                </Badge>
                                <span className="text-sm text-gray-400">Destacada</span>
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                              <p className="text-gray-300 mb-4">{article.summary}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleBookmark(article.id)}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    {bookmarkedNews.includes(article.id) ? (
                                      <BookmarkCheck className="h-4 w-4" />
                                    ) : (
                                      <Bookmark className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        Leer más
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="text-white text-xl">{article.title}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <img
                                          src={article.image || "/placeholder.svg"}
                                          alt={article.title}
                                          className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                          <span>{article.author}</span>
                                          <span>•</span>
                                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                          <Badge className="bg-blue-600">{getCategoryName(article.category)}</Badge>
                                        </div>
                                        <div className="prose prose-invert max-w-none">
                                          <p className="text-gray-300 leading-relaxed">{article.content}</p>
                                        </div>
                                        {article.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag, index) => (
                                              <Badge key={index} variant="secondary" className="text-xs">
                                                #{tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                        {article.relatedMovies && (
                                          <div>
                                            <h4 className="text-lg font-semibold text-white mb-3">
                                              Películas Relacionadas
                                            </h4>
                                            <div className="grid grid-cols-3 gap-4">
                                              {article.relatedMovies.map((movieId) => {
                                                const movie = movies.find((m) => m.id === movieId)
                                                if (!movie) return null
                                                return (
                                                  <Link
                                                    key={movie.id}
                                                    href={`/movie/${movie.id}`}
                                                    className="block bg-gray-800/50 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                                                  >
                                                    <img
                                                      src={movie.image || "/placeholder.svg"}
                                                      alt={movie.title}
                                                      className="w-full h-32 object-cover"
                                                    />
                                                    <div className="p-2">
                                                      <h5 className="font-semibold text-white text-sm line-clamp-1">
                                                        {movie.title}
                                                      </h5>
                                                      <p className="text-xs text-gray-400">{movie.year}</p>
                                                    </div>
                                                  </Link>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                                          <Button variant="outline" className="border-gray-600">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Me gusta
                                          </Button>
                                          <Button variant="outline" className="border-gray-600">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Compartir
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() => toggleBookmark(article.id)}
                                            className="border-gray-600"
                                          >
                                            {bookmarkedNews.includes(article.id) ? (
                                              <>
                                                <BookmarkCheck className="h-4 w-4 mr-2" />
                                                Guardado
                                              </>
                                            ) : (
                                              <>
                                                <Bookmark className="h-4 w-4 mr-2" />
                                                Guardar
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* All News */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {selectedCategory === "all"
                      ? "Todas las Noticias"
                      : selectedCategory === "bookmarked"
                        ? "Noticias Guardadas"
                        : getCategoryName(selectedCategory)}
                  </h2>
                  <div className="space-y-6">
                    {getFilteredNews().map((article) => (
                      <Card key={article.id} className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                              <img
                                src={article.image || "/placeholder.svg"}
                                alt={article.title}
                                className="w-full h-32 md:h-24 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                                }}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className="bg-blue-600">
                                  {getCategoryIcon(article.category)}
                                  <span className="ml-1">{getCategoryName(article.category)}</span>
                                </Badge>
                                {article.featured && <Badge variant="secondary">Destacada</Badge>}
                              </div>
                              <h3 className="text-lg font-bold text-white mb-2">{article.title}</h3>
                              <p className="text-gray-300 mb-3 line-clamp-2">{article.summary}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleBookmark(article.id)}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    {bookmarkedNews.includes(article.id) ? (
                                      <BookmarkCheck className="h-4 w-4" />
                                    ) : (
                                      <Bookmark className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline" className="border-gray-600">
                                        Leer más
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="text-white text-xl">{article.title}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <img
                                          src={article.image || "/placeholder.svg"}
                                          alt={article.title}
                                          className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                          <span>{article.author}</span>
                                          <span>•</span>
                                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                          <Badge className="bg-blue-600">{getCategoryName(article.category)}</Badge>
                                        </div>
                                        <div className="prose prose-invert max-w-none">
                                          <p className="text-gray-300 leading-relaxed">{article.content}</p>
                                        </div>
                                        {article.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag, index) => (
                                              <Badge key={index} variant="secondary" className="text-xs">
                                                #{tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                        {article.relatedMovies && (
                                          <div>
                                            <h4 className="text-lg font-semibold text-white mb-3">
                                              Películas Relacionadas
                                            </h4>
                                            <div className="grid grid-cols-3 gap-4">
                                              {article.relatedMovies.map((movieId) => {
                                                const movie = movies.find((m) => m.id === movieId)
                                                if (!movie) return null
                                                return (
                                                  <Link
                                                    key={movie.id}
                                                    href={`/movie/${movie.id}`}
                                                    className="block bg-gray-800/50 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                                                  >
                                                    <img
                                                      src={movie.image || "/placeholder.svg"}
                                                      alt={movie.title}
                                                      className="w-full h-32 object-cover"
                                                    />
                                                    <div className="p-2">
                                                      <h5 className="font-semibold text-white text-sm line-clamp-1">
                                                        {movie.title}
                                                      </h5>
                                                      <p className="text-xs text-gray-400">{movie.year}</p>
                                                    </div>
                                                  </Link>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                                          <Button variant="outline" className="border-gray-600">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Me gusta
                                          </Button>
                                          <Button variant="outline" className="border-gray-600">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Compartir
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() => toggleBookmark(article.id)}
                                            className="border-gray-600"
                                          >
                                            {bookmarkedNews.includes(article.id) ? (
                                              <>
                                                <BookmarkCheck className="h-4 w-4 mr-2" />
                                                Guardado
                                              </>
                                            ) : (
                                              <>
                                                <Bookmark className="h-4 w-4 mr-2" />
                                                Guardar
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {getFilteredNews().length === 0 && (
                    <div className="text-center py-12">
                      <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-semibold text-gray-400 mb-2">No hay noticias en esta categoría</h2>
                      <p className="text-gray-500">Prueba con otra categoría o vuelve más tarde</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notifications */}
            {user && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Configuración de Notificaciones</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Nuevos estrenos</span>
                            <Button
                              size="sm"
                              variant={notificationSettings.newReleases ? "default" : "outline"}
                              onClick={() =>
                                updateNotificationSettings("newReleases", !notificationSettings.newReleases)
                              }
                            >
                              {notificationSettings.newReleases ? (
                                <Bell className="h-4 w-4" />
                              ) : (
                                <BellOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Recomendaciones</span>
                            <Button
                              size="sm"
                              variant={notificationSettings.recommendations ? "default" : "outline"}
                              onClick={() =>
                                updateNotificationSettings("recommendations", !notificationSettings.recommendations)
                              }
                            >
                              {notificationSettings.recommendations ? (
                                <Bell className="h-4 w-4" />
                              ) : (
                                <BellOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Noticias</span>
                            <Button
                              size="sm"
                              variant={notificationSettings.news ? "default" : "outline"}
                              onClick={() => updateNotificationSettings("news", !notificationSettings.news)}
                            >
                              {notificationSettings.news ? (
                                <Bell className="h-4 w-4" />
                              ) : (
                                <BellOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read ? "bg-gray-700/30" : "bg-blue-600/20 border border-blue-600/30"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                      <p className="text-gray-300 text-xs">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No hay notificaciones nuevas</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Estadísticas</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total noticias</span>
                  <span className="text-white font-semibold">{news.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Guardadas</span>
                  <span className="text-white font-semibold">{bookmarkedNews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Esta semana</span>
                  <span className="text-white font-semibold">
                    {
                      news.filter(
                        (article) => new Date(article.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      ).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Tags Populares</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(news.flatMap((article) => article.tags))].slice(0, 10).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs cursor-pointer hover:bg-blue-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
