"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Bell,
  User,
  LogOut,
  Settings,
  Heart,
  MessageSquare,
  Package,
  ShoppingCart,
  Users,
  Newspaper,
  Gamepad2,
  Crown,
  Star,
} from "lucide-react"
import Link from "next/link"
import type { User as UserType } from "@/lib/types"

// Mapeo de IDs de badges a nombres
const badgeMap: Record<number, string> = {
  1: "admin",
  2: "vip",
  3: "pro",
  4: "elite",
}

const getBadgeColor = (badgeId?: number) => {
  const badge = badgeId ? badgeMap[badgeId] : undefined
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

const getBadgeIcon = (badgeId?: number) => {
  const badge = badgeId ? badgeMap[badgeId] : undefined
  switch (badge) {
    case "admin":
      return <Crown className="h-3 w-3" />
    case "vip":
      return <Star className="h-3 w-3" />
    default:
      return null
  }
}
import { defaultAvatars } from "@/lib/store-data"

export function Header() {
  const [user, setUser] = useState<UserType | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
  
        // Cargar notificaciones
        const userNotifications = JSON.parse(localStorage.getItem(`notifications_${parsedUser.id}`) || "[]")
        setNotifications(userNotifications)
        setUnreadCount(userNotifications.filter((n: any) => !n.read).length)
      }
    } catch (error) {
      console.error("Error al parsear datos de usuario o notificaciones:", error)
    }

    const handleAvatarChange = (event: CustomEvent) => {
      if (user) {
        const updatedUser = { ...user, avatar: event.detail }
        setUser(updatedUser)
      }
    }
  
    window.addEventListener("avatarChanged", handleAvatarChange as EventListener)
  
    return () => {
      window.removeEventListener("avatarChanged", handleAvatarChange as EventListener)
    }
  }, []) // Arreglo de dependencias vacío // Updated dependency array
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    window.location.href = "/"
  }
  

  const markNotificationAsRead = (notificationId: number) => {
    if (!user) return

    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif,
    )
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length)
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications))
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

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-white">Ilegalmovie</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/community" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Comunidad
            </Link>
            <Link href="/news" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Newspaper className="h-4 w-4 mr-1" />
              Noticias
            </Link>
            <Link href="/games" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Gamepad2 className="h-4 w-4 mr-1" />
              Juegos
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-xs">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Notificaciones</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            notification.read ? "bg-gray-800/50" : "bg-blue-600/20 border border-blue-600/30"
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
                        <p className="text-gray-400 text-sm text-center py-4">No hay notificaciones</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || defaultAvatars[0]} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        {user.inventory?.activeFrame && (
                          <div className="absolute inset-0 rounded-full border-2 border-yellow-400 shadow-lg shadow-yellow-400/50" />
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          {user.inventory?.activeBadge && (
                            <Badge className={`${getBadgeColor(user.badge)} text-white text-xs`}>
                              {getBadgeIcon(user.badge)}
                              {user.badge?.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{user.points} puntos</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-comments" className="flex items-center cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Mis Comentarios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/store" className="flex items-center cursor-pointer">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Tienda
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/inventory" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Inventario
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center cursor-pointer text-red-400">
                            <Crown className="mr-2 h-4 w-4" />
                            Panel Admin
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
