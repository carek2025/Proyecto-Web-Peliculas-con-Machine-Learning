"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Edit, Trash2, Search, ArrowLeft } from "lucide-react"
import { movies } from "@/lib/data"
import Link from "next/link"

export default function MyCommentsPage() {
  const [user, setUser] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [filteredComments, setFilteredComments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingComment, setEditingComment] = useState<any>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load all comments and filter by user
    const allComments: any[] = []
    movies.forEach((movie) => {
      const movieComments = JSON.parse(localStorage.getItem(`comments_${movie.id}`) || "[]")
      movieComments.forEach((comment: any) => {
        if (userData && comment.userId === JSON.parse(userData).id) {
          allComments.push({
            ...comment,
            movieTitle: movie.title,
            movieImage: movie.image,
          })
        }
      })
    })

    allComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setComments(allComments)
    setFilteredComments(allComments)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = comments.filter(
        (comment) =>
          comment.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredComments(filtered)
    } else {
      setFilteredComments(comments)
    }
  }, [searchQuery, comments])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "hace un momento"
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} horas`
    return `hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  const handleEditComment = (comment: any) => {
    setEditingComment(comment)
    setEditText(comment.text)
  }

  const saveEditedComment = () => {
    if (!editingComment) return

    // Update comment in localStorage
    const movieComments = JSON.parse(localStorage.getItem(`comments_${editingComment.movieId}`) || "[]")
    const updatedComments = movieComments.map((comment: any) =>
      comment.id === editingComment.id ? { ...comment, text: editText } : comment,
    )
    localStorage.setItem(`comments_${editingComment.movieId}`, JSON.stringify(updatedComments))

    // Update local state
    const updatedLocalComments = comments.map((comment) =>
      comment.id === editingComment.id ? { ...comment, text: editText } : comment,
    )
    setComments(updatedLocalComments)
    setEditingComment(null)
    setEditText("")
  }

  const deleteComment = (commentToDelete: any) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return

    // Remove from localStorage
    const movieComments = JSON.parse(localStorage.getItem(`comments_${commentToDelete.movieId}`) || "[]")
    const updatedComments = movieComments.filter((comment: any) => comment.id !== commentToDelete.id)
    localStorage.setItem(`comments_${commentToDelete.movieId}`, JSON.stringify(updatedComments))

    // Update local state
    const updatedLocalComments = comments.filter((comment) => comment.id !== commentToDelete.id)
    setComments(updatedLocalComments)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-400">Debes iniciar sesión para ver tus comentarios</p>
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
              <MessageSquare className="mr-3 h-8 w-8 text-blue-500" />
              Mis Comentarios
            </h1>
            <p className="text-gray-400">{comments.length} comentarios realizados</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar en mis comentarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              {comments.length === 0 ? "No has hecho comentarios aún" : "No se encontraron comentarios"}
            </h2>
            <p className="text-gray-500 mb-6">
              {comments.length === 0
                ? "Explora películas y comparte tus opiniones"
                : "Intenta con otros términos de búsqueda"}
            </p>
            {comments.length === 0 && (
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/">Explorar Películas</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={comment.movieImage || "/placeholder.svg"}
                      alt={comment.movieTitle}
                      className="w-16 h-20 object-cover rounded"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/movie/${comment.movieId}`}
                          className="text-lg font-semibold text-white hover:text-red-400 transition-colors"
                        >
                          {comment.movieTitle}
                        </Link>
                        <span className="text-sm text-gray-400">{formatDate(comment.date)}</span>
                      </div>

                      <p className="text-gray-300 mb-4 leading-relaxed">{comment.text}</p>

                      <div className="flex items-center space-x-2">
                        <Dialog
                          open={editingComment?.id === comment.id}
                          onOpenChange={(open) => !open && setEditingComment(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => handleEditComment(comment)}
                              size="sm"
                              variant="outline"
                              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Editar Comentario</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value.slice(0, 500))}
                                className="bg-gray-800 border-gray-600 text-white"
                                rows={4}
                                placeholder="Edita tu comentario..."
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">{editText.length}/500 caracteres</span>
                                <div className="space-x-2">
                                  <Button onClick={() => setEditingComment(null)} variant="outline" size="sm">
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={saveEditedComment}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Guardar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => deleteComment(comment)}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Comment Dialog */}
    </div>
  )
}
