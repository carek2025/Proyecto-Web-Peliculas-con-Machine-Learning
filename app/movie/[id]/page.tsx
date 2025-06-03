"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Play, ThumbsUp, Flag, ArrowLeft, Check } from "lucide-react"
import { movies, getSimilarMovies } from "@/lib/data"
import type { Movie, Comment, MovieReaction } from "@/lib/types"
import Link from "next/link"
import { EmotePicker } from "@/components/emote-picker"
import { storeItems } from "@/lib/store-data"
import { defaultAvatars } from "@/lib/store-data"

export default function MoviePage() {
  const params = useParams()
  const movieId = Number.parseInt(params.id as string)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [user, setUser] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [canComment, setCanComment] = useState(true)
  const [commentCooldown, setCommentCooldown] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [trailerWatched, setTrailerWatched] = useState(false)
  const [reactions, setReactions] = useState<MovieReaction[]>([])
  const [userInventory, setUserInventory] = useState<any>({
    themes: [],
    emotes: [],
    avatars: [],
    others: [],
  })

  useEffect(() => {
    const foundMovie = movies.find((m) => m.id === movieId)
    setMovie(foundMovie || null)

    if (foundMovie) {
      // Get similar movies
      const similar = getSimilarMovies(foundMovie, movies, 6)
      setSimilarMovies(similar)
    }

    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load user inventory
      const inventory = parsedUser.inventory || {
        themes: [],
        emotes: [],
        avatars: [],
        others: [],
      }
      setUserInventory(inventory)
    }

    // Load comments from localStorage
    const savedComments = localStorage.getItem(`comments_${movieId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    // Load reactions from localStorage
    const savedReactions = localStorage.getItem(`reactions_${movieId}`)
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions))
    }

    // Check if movie is in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.includes(movieId))

    // Check if trailer was watched
    const watchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")
    const wasWatched = watchHistory.some((item: any) => item.movieId === movieId)
    setTrailerWatched(wasWatched)

    // Apply active theme if exists
    applyActiveTheme()
  }, [movieId])

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

  const toggleFavorite = () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos")
      return
    }

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== movieId)
    } else {
      newFavorites = [...favorites, movieId]
      // Add point for favorite
      const updatedUser = { ...user, points: user.points + 1 }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleRating = (rating: number) => {
    if (!user) {
      alert("Debes iniciar sesión para calificar")
      return
    }
    setUserRating(rating)
  }

  const handleCommentSubmit = () => {
    if (!user) {
      alert("Debes iniciar sesión para comentar")
      return
    }

    if (!comment.trim() || !canComment) return

    const newComment: Comment = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || defaultAvatars[0],
      text: comment,
      date: new Date().toISOString(),
      likes: 0,
      movieId: movieId,
      reactions: [],
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(updatedComments))

    // Add point for comment
    const updatedUser = { ...user, points: user.points + 1 }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    setComment("")
    setCanComment(false)
    setCommentCooldown(10)

    // Cooldown timer
    const timer = setInterval(() => {
      setCommentCooldown((prev) => {
        if (prev <= 1) {
          setCanComment(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTrailerWatch = () => {
    if (!user) return

    if (!trailerWatched) {
      // Mark as watched
      setTrailerWatched(true)

      // Add to watch history
      const watchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")
      const newWatchItem = {
        movieId,
        watchedAt: new Date().toISOString(),
        completed: true,
      }

      const updatedHistory = [newWatchItem, ...watchHistory.filter((item: any) => item.movieId !== movieId)]
      localStorage.setItem("watchHistory", JSON.stringify(updatedHistory))

      // Add points for watching
      const updatedUser = { ...user, points: user.points + 2 }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    setShowLightbox(true)
  }

  const addReactionToMovie = (emoji: string) => {
    if (!user) {
      alert("Debes iniciar sesión para reaccionar")
      return
    }

    const existingReaction = reactions.find((r) => r.userId === user.id && r.emoji === emoji)

    if (existingReaction) {
      // Remove reaction
      const updatedReactions = reactions.filter((r) => !(r.userId === user.id && r.emoji === emoji))
      setReactions(updatedReactions)
      localStorage.setItem(`reactions_${movieId}`, JSON.stringify(updatedReactions))
    } else {
      // Add reaction
      const newReaction: MovieReaction = {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        emoji,
        createdAt: new Date().toISOString(),
      }

      const updatedReactions = [...reactions, newReaction]
      setReactions(updatedReactions)
      localStorage.setItem(`reactions_${movieId}`, JSON.stringify(updatedReactions))
    }
  }

  const addReactionToComment = (commentId: number, emoji: string) => {
    if (!user) {
      alert("Debes iniciar sesión para reaccionar")
      return
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const existingReaction = comment.reactions?.find((r) => r.userId === user.id && r.emoji === emoji)

        if (existingReaction) {
          // Remove reaction
          return {
            ...comment,
            reactions: comment.reactions?.filter((r) => !(r.userId === user.id && r.emoji === emoji)) || [],
          }
        } else {
          // Add reaction
          const newReaction = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            emoji,
            createdAt: new Date().toISOString(),
          }

          return {
            ...comment,
            reactions: [...(comment.reactions || []), newReaction],
          }
        }
      }
      return comment
    })

    setComments(updatedComments)
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(updatedComments))
  }

  const getReactionCount = (emoji: string) => {
    return reactions.filter((r) => r.emoji === emoji).length
  }

  const hasUserReacted = (emoji: string) => {
    return reactions.some((r) => r.userId === user?.id && r.emoji === emoji)
  }

  const getCommentReactionCount = (comment: Comment, emoji: string) => {
    return comment.reactions?.filter((r) => r.emoji === emoji).length || 0
  }

  const hasUserReactedToComment = (comment: Comment, emoji: string) => {
    return comment.reactions?.some((r) => r.userId === user?.id && r.emoji === emoji) || false
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-400">Película no encontrada</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Movie Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full rounded-lg shadow-2xl" />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <p className="text-gray-400 text-lg">
                {movie.year} • {movie.duration} • {movie.genres.join(", ")}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`cursor-pointer text-2xl ${
                      i < Math.floor(movie.rating) ? "text-yellow-400" : "text-gray-600"
                    }`}
                    onClick={() => handleRating(i + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xl text-gray-300">{movie.rating}/5</span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={handleTrailerWatch} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg">
                <Play className="mr-2 h-5 w-5" />
                {trailerWatched ? "Ver Trailer (Visto)" : "Ver Trailer"}
                {trailerWatched && <Check className="ml-2 h-4 w-4" />}
              </Button>

              <Button
                onClick={toggleFavorite}
                variant={isFavorite ? "default" : "outline"}
                className={`px-6 py-3 text-lg ${
                  isFavorite
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white"
                }`}
              >
                <Heart className={`mr-2 h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
              </Button>
            </div>

            {/* Movie Reactions */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Reacciones a la película</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {["😍", "🔥", "👍", "😂", "😢", "😱", "🤔", "❤️"].map((emoji) => (
                  <Button
                    key={emoji}
                    variant={hasUserReacted(emoji) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addReactionToMovie(emoji)}
                    className={`${
                      hasUserReacted(emoji) ? "bg-blue-600 hover:bg-blue-700" : "border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {emoji} {getReactionCount(emoji) > 0 && getReactionCount(emoji)}
                  </Button>
                ))}
              </div>

              {user && (
                <EmotePicker
                  onEmoteSelect={(emoji) => addReactionToMovie(emoji)}
                  userInventory={userInventory}
                  trigger={
                    <Button variant="outline" size="sm" className="border-gray-600">
                      Más emotes...
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Similar Movies Slider */}
        {similarMovies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Películas Similares</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {similarMovies.map((similarMovie) => (
                <Link
                  key={similarMovie.id}
                  href={`/movie/${similarMovie.id}`}
                  className="flex-shrink-0 w-48 bg-gray-800/50 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={similarMovie.image || "/placeholder.svg"}
                    alt={similarMovie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1">{similarMovie.title}</h4>
                    <p className="text-gray-400 text-xs">{similarMovie.year}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < Math.floor(similarMovie.rating) ? "text-yellow-400" : "text-gray-600"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-400">{similarMovie.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-6">Comentarios</h2>

          {user ? (
            <div className="mb-8 bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar || defaultAvatars[0]} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Escribe tu comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white mb-4"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <EmotePicker
                        onEmoteSelect={(emoji) => setComment((prev) => prev + emoji)}
                        userInventory={userInventory}
                        trigger={
                          <Button variant="outline" size="sm" className="border-gray-600">
                            😀 Emotes
                          </Button>
                        }
                      />
                    </div>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim() || !canComment}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {canComment ? "Comentar" : `Espera ${commentCooldown}s`}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 bg-gray-800/50 rounded-lg p-6 text-center">
              <p className="text-gray-400 mb-4">Inicia sesión para comentar</p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800/30 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.userAvatar || defaultAvatars[0]} />
                    <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white">{comment.userName}</h4>
                      <span className="text-gray-400 text-sm">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{comment.text}</p>

                    {/* Comment Reactions */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {["👍", "❤️", "😂", "😮", "😢", "😡"].map((emoji) => (
                        <Button
                          key={emoji}
                          variant={hasUserReactedToComment(comment, emoji) ? "default" : "outline"}
                          size="sm"
                          onClick={() => addReactionToComment(comment.id, emoji)}
                          className={`text-xs ${
                            hasUserReactedToComment(comment, emoji)
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          {emoji}{" "}
                          {getCommentReactionCount(comment, emoji) > 0 && getCommentReactionCount(comment, emoji)}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <button className="flex items-center space-x-1 hover:text-white">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-white">
                        <Flag className="h-4 w-4" />
                        <span>Reportar</span>
                      </button>
                      {user && (
                        <EmotePicker
                          onEmoteSelect={(emoji) => addReactionToComment(comment.id, emoji)}
                          userInventory={userInventory}
                          trigger={<button className="hover:text-white">Reaccionar</button>}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No hay comentarios aún. ¡Sé el primero en comentar!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Lightbox */}
      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogContent className="max-w-4xl bg-black border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">{movie.title} - Trailer</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            {movie.trailerUrl ? (
              <iframe
                src={movie.trailerUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={`${movie.title} Trailer`}
              />
            ) : (
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Trailer no disponible</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
