"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  MessageSquare,
  Vote,
  TrendingUp,
  Plus,
  MessageCircle,
  Share2,
  Flag,
  UserPlus,
  UserMinus,
  Crown,
  Star,
  ArrowLeft,
  ThumbsUp,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { EmotePicker } from "@/components/emote-picker"
import { defaultAvatars } from "@/lib/store-data"

interface CommunityPost {
  id: number
  userId: number
  userName: string
  userAvatar: string
  userBadge?: string
  title: string
  content: string
  type: "discussion" | "poll" | "announcement"
  createdAt: string
  likes: number
  comments: number
  views: number
  tags: string[]
  pollOptions?: { id: number; text: string; votes: number }[]
  userVote?: number
  reactions: { userId: number; emoji: string }[]
}

interface CommunityComment {
  id: number
  postId: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  createdAt: string
  likes: number
  reactions: { userId: number; emoji: string }[]
}

interface UserFollow {
  followerId: number
  followingId: number
  createdAt: string
}

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [follows, setFollows] = useState<UserFollow[]>([])
  const [selectedTab, setSelectedTab] = useState("feed")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostType, setNewPostType] = useState<"discussion" | "poll" | "announcement">("discussion")
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""])
  const [userInventory, setUserInventory] = useState<any>({
    themes: [],
    emotes: [],
    avatars: [],
    others: [],
  })

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      const inventory = parsedUser.inventory || {
        themes: [],
        emotes: [],
        avatars: [],
        others: [],
      }
      setUserInventory(inventory)
    }

    // Load community data
    const savedPosts = localStorage.getItem("communityPosts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Initialize with sample posts
      const samplePosts: CommunityPost[] = [
        {
          id: 1,
          userId: 1,
          userName: "Admin",
          userAvatar: defaultAvatars[0],
          userBadge: "admin",
          title: "¡Bienvenidos a la Comunidad de Ilegalmovie!",
          content:
            "Este es el espacio para que todos los usuarios puedan conversar, hacer preguntas, compartir recomendaciones y participar en votaciones. ¡Esperamos que disfruten esta nueva funcionalidad!",
          type: "announcement",
          createdAt: new Date().toISOString(),
          likes: 15,
          comments: 3,
          views: 45,
          tags: ["bienvenida", "comunidad"],
          reactions: [],
        },
        {
          id: 2,
          userId: 2,
          userName: "CineFilm",
          userAvatar: defaultAvatars[1],
          userBadge: "vip",
          title: "¿Cuál es vuestra película favorita de 2024?",
          content:
            "Quiero conocer las opiniones de la comunidad sobre las mejores películas que han salido este año. ¡Compartan sus favoritas!",
          type: "discussion",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likes: 8,
          comments: 12,
          views: 67,
          tags: ["películas", "2024", "favoritas"],
          reactions: [],
        },
        {
          id: 3,
          userId: 3,
          userName: "MovieLover",
          userAvatar: defaultAvatars[2],
          title: "¿Qué género prefieres para ver en fin de semana?",
          content: "Votemos por el género favorito para maratonear en fin de semana",
          type: "poll",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          likes: 12,
          comments: 5,
          views: 89,
          tags: ["encuesta", "géneros"],
          pollOptions: [
            { id: 1, text: "Acción", votes: 15 },
            { id: 2, text: "Comedia", votes: 8 },
            { id: 3, text: "Drama", votes: 12 },
            { id: 4, text: "Terror", votes: 6 },
          ],
          reactions: [],
        },
      ]
      setPosts(samplePosts)
      localStorage.setItem("communityPosts", JSON.stringify(samplePosts))
    }

    const savedComments = localStorage.getItem("communityComments")
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    const savedFollows = localStorage.getItem("userFollows")
    if (savedFollows) {
      setFollows(JSON.parse(savedFollows))
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

  const createPost = () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) {
      alert("Completa todos los campos")
      return
    }

    const newPost: CommunityPost = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || defaultAvatars[0],
      userBadge: user.badge,
      title: newPostTitle,
      content: newPostContent,
      type: newPostType,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      tags: [],
      reactions: [],
    }

    if (newPostType === "poll" && pollOptions.filter((opt) => opt.trim()).length >= 2) {
      newPost.pollOptions = pollOptions
        .filter((opt) => opt.trim())
        .map((opt, index) => ({ id: index + 1, text: opt, votes: 0 }))
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))

    // Add points for creating post
    const updatedUser = { ...user, points: user.points + 5 }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Reset form
    setNewPostTitle("")
    setNewPostContent("")
    setNewPostType("discussion")
    setPollOptions(["", ""])

    alert("¡Post creado exitosamente!")
  }

  const likePost = (postId: number) => {
    if (!user) return

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))
  }

  const addReactionToPost = (postId: number, emoji: string) => {
    if (!user) return

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find((r) => r.userId === user.id && r.emoji === emoji)

        if (existingReaction) {
          return {
            ...post,
            reactions: post.reactions.filter((r) => !(r.userId === user.id && r.emoji === emoji)),
          }
        } else {
          return {
            ...post,
            reactions: [...post.reactions, { userId: user.id, emoji }],
          }
        }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))
  }

  const voteInPoll = (postId: number, optionId: number) => {
    if (!user) return

    const updatedPosts = posts.map((post) => {
      if (post.id === postId && post.pollOptions) {
        const updatedOptions = post.pollOptions.map((option) => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 }
          }
          return option
        })

        return { ...post, pollOptions: updatedOptions, userVote: optionId }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))
  }

  const followUser = (userId: number) => {
    if (!user || userId === user.id) return

    const existingFollow = follows.find((f) => f.followerId === user.id && f.followingId === userId)

    if (existingFollow) {
      // Unfollow
      const updatedFollows = follows.filter((f) => !(f.followerId === user.id && f.followingId === userId))
      setFollows(updatedFollows)
      localStorage.setItem("userFollows", JSON.stringify(updatedFollows))
    } else {
      // Follow
      const newFollow: UserFollow = {
        followerId: user.id,
        followingId: userId,
        createdAt: new Date().toISOString(),
      }

      const updatedFollows = [...follows, newFollow]
      setFollows(updatedFollows)
      localStorage.setItem("userFollows", JSON.stringify(updatedFollows))
    }
  }

  const isFollowing = (userId: number) => {
    return follows.some((f) => f.followerId === user?.id && f.followingId === userId)
  }

  const getPostReactionCount = (post: CommunityPost, emoji: string) => {
    return post.reactions.filter((r) => r.emoji === emoji).length
  }

  const hasUserReactedToPost = (post: CommunityPost, emoji: string) => {
    return post.reactions.some((r) => r.userId === user?.id && r.emoji === emoji)
  }

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "admin":
        return "bg-red-600"
      case "vip":
        return "bg-yellow-600"
      case "pro":
        return "bg-purple-600"
      case "elite":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "admin":
        return <Crown className="h-3 w-3" />
      case "vip":
        return <Star className="h-3 w-3" />
      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-4">Debes iniciar sesión para acceder a la comunidad</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Users className="mr-3 h-8 w-8 text-blue-500" />
              Comunidad
            </h1>
            <p className="text-gray-400">Conecta con otros usuarios, comparte y participa</p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="feed" className="data-[state=active]:bg-blue-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendencias
            </TabsTrigger>
            <TabsTrigger value="polls" className="data-[state=active]:bg-blue-600">
              <Vote className="h-4 w-4 mr-2" />
              Encuestas
            </TabsTrigger>
            <TabsTrigger value="following" className="data-[state=active]:bg-blue-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Siguiendo
            </TabsTrigger>
          </TabsList>

          {/* Create Post Section */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Crear Publicación</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Publicación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">Crear Nueva Publicación</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de publicación</label>
                        <Select value={newPostType} onValueChange={(value: any) => setNewPostType(value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="discussion">Discusión</SelectItem>
                            <SelectItem value="poll">Encuesta</SelectItem>
                            <SelectItem value="announcement">Anuncio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                        <Input
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          placeholder="Escribe el título de tu publicación..."
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Contenido</label>
                        <Textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="¿Qué quieres compartir con la comunidad?"
                          className="bg-gray-800 border-gray-600"
                          rows={4}
                        />
                      </div>

                      {newPostType === "poll" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Opciones de la encuesta
                          </label>
                          {pollOptions.map((option, index) => (
                            <Input
                              key={index}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...pollOptions]
                                newOptions[index] = e.target.value
                                setPollOptions(newOptions)
                              }}
                              placeholder={`Opción ${index + 1}`}
                              className="bg-gray-800 border-gray-600 mb-2"
                            />
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPollOptions([...pollOptions, ""])}
                            className="border-gray-600"
                          >
                            Agregar opción
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <EmotePicker
                          onEmoteSelect={(emoji) => setNewPostContent((prev) => prev + emoji)}
                          userInventory={userInventory}
                          trigger={
                            <Button variant="outline" size="sm" className="border-gray-600">
                              😀 Emotes
                            </Button>
                          }
                        />
                      </div>

                      <div className="flex space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            Cancelar
                          </Button>
                        </DialogTrigger>
                        <Button onClick={createPost} className="flex-1 bg-blue-600 hover:bg-blue-700">
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">{post.userName}</h3>
                          {post.userBadge && (
                            <Badge className={`${getBadgeColor(post.userBadge)} text-white text-xs`}>
                              {getBadgeIcon(post.userBadge)}
                              {post.userBadge.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()} • {post.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.userId !== user.id && (
                        <Button
                          size="sm"
                          variant={isFollowing(post.userId) ? "default" : "outline"}
                          onClick={() => followUser(post.userId)}
                          className={isFollowing(post.userId) ? "bg-green-600 hover:bg-green-700" : "border-gray-600"}
                        >
                          {isFollowing(post.userId) ? (
                            <>
                              <UserMinus className="h-3 w-3 mr-1" />
                              Siguiendo
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Seguir
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                    <p className="text-gray-300">{post.content}</p>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Poll Options */}
                  {post.type === "poll" && post.pollOptions && (
                    <div className="space-y-2">
                      {post.pollOptions.map((option) => {
                        const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 0
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0

                        return (
                          <div key={option.id} className="space-y-1">
                            <Button
                              variant="outline"
                              className={`w-full justify-between border-gray-600 ${
                                post.userVote === option.id ? "bg-blue-600/20 border-blue-500" : ""
                              }`}
                              onClick={() => !post.userVote && voteInPoll(post.id, option.id)}
                              disabled={!!post.userVote}
                            >
                              <span>{option.text}</span>
                              <span>{option.votes} votos</span>
                            </Button>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 text-right">{percentage.toFixed(1)}%</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Post Reactions */}
                  <div className="flex flex-wrap gap-2">
                    {["👍", "❤️", "😂", "😮", "🔥", "🤔"].map((emoji) => (
                      <Button
                        key={emoji}
                        variant={hasUserReactedToPost(post, emoji) ? "default" : "outline"}
                        size="sm"
                        onClick={() => addReactionToPost(post.id, emoji)}
                        className={`text-xs ${
                          hasUserReactedToPost(post, emoji)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "border-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {emoji} {getPostReactionCount(post, emoji) > 0 && getPostReactionCount(post, emoji)}
                      </Button>
                    ))}
                    <EmotePicker
                      onEmoteSelect={(emoji) => addReactionToPost(post.id, emoji)}
                      userInventory={userInventory}
                      trigger={
                        <Button variant="outline" size="sm" className="border-gray-600">
                          Más...
                        </Button>
                      }
                    />
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center space-x-1 hover:text-white"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartir
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Flag className="h-4 w-4 mr-1" />
                        Reportar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-400 mb-2">No hay publicaciones aún</h2>
                <p className="text-gray-500 mb-6">¡Sé el primero en crear una publicación!</p>
              </div>
            )}
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts
                .sort((a, b) => b.likes + b.comments + b.views - (a.likes + a.comments + a.views))
                .slice(0, 6)
                .map((post) => (
                  <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white text-sm">{post.userName}</p>
                          <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-3 mb-3">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comentarios</span>
                        <span>{post.views} vistas</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Polls Tab */}
          <TabsContent value="polls" className="space-y-6">
            {posts
              .filter((post) => post.type === "poll")
              .map((post) => (
                <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{post.userName}</h3>
                        <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                      <p className="text-gray-300">{post.content}</p>
                    </div>

                    {post.pollOptions && (
                      <div className="space-y-2">
                        {post.pollOptions.map((option) => {
                          const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 0
                          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0

                          return (
                            <div key={option.id} className="space-y-1">
                              <Button
                                variant="outline"
                                className={`w-full justify-between border-gray-600 ${
                                  post.userVote === option.id ? "bg-blue-600/20 border-blue-500" : ""
                                }`}
                                onClick={() => !post.userVote && voteInPoll(post.id, option.id)}
                                disabled={!!post.userVote}
                              >
                                <span>{option.text}</span>
                                <span>{option.votes} votos</span>
                              </Button>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 text-right">{percentage.toFixed(1)}%</p>
                            </div>
                          )
                        })}
                        <p className="text-sm text-gray-400 mt-3">
                          Total de votos: {post.pollOptions.reduce((sum, opt) => sum + opt.votes, 0)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {follows
                .filter((follow) => follow.followerId === user.id)
                .map((follow) => {
                  const followedUserPosts = posts.filter((post) => post.userId === follow.followingId)
                  const followedUser = followedUserPosts[0]

                  if (!followedUser) return null

                  return (
                    <Card key={follow.followingId} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-4">
                          <AvatarImage src={followedUser.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{followedUser.userName[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-white mb-2">{followedUser.userName}</h3>
                        {followedUser.userBadge && (
                          <Badge className={`${getBadgeColor(followedUser.userBadge)} text-white text-xs mb-3`}>
                            {getBadgeIcon(followedUser.userBadge)}
                            {followedUser.userBadge.toUpperCase()}
                          </Badge>
                        )}
                        <p className="text-sm text-gray-400 mb-4">{followedUserPosts.length} publicaciones</p>
                        <Button
                          onClick={() => followUser(follow.followingId)}
                          variant="outline"
                          className="border-gray-600"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Dejar de seguir
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            {follows.filter((follow) => follow.followerId === user.id).length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-400 mb-2">No sigues a nadie aún</h2>
                <p className="text-gray-500 mb-6">Explora el feed y sigue a usuarios interesantes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

// Import storeItems for theme application
import { storeItems } from "@/lib/store-data"
