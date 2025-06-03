"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Palette, Smile, User, Gift, ArrowLeft, Check, RotateCcw, Send } from "lucide-react"
import { storeItems, defaultAvatars } from "@/lib/store-data"
import type { StoreItem, User as UserType } from "@/lib/types"
import Link from "next/link"

export default function InventoryPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("themes")
  const [userInventory, setUserInventory] = useState<any>({
    themes: [],
    emotes: [],
    avatars: [],
    others: [],
    activeTheme: null,
    activeBadge: null,
    activeFrame: null,
  })
  const [ownedItems, setOwnedItems] = useState<StoreItem[]>([])

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
        activeTheme: null,
        activeBadge: null,
        activeFrame: null,
      }
      setUserInventory(inventory)

      // Get owned items
      const allOwnedIds = [...inventory.themes, ...inventory.emotes, ...inventory.avatars, ...inventory.others]
      const owned = storeItems.filter((item) => allOwnedIds.includes(item.id))
      setOwnedItems(owned)
    }

    // Apply active theme if exists
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

  const getItemsByCategory = (category: string) => {
    const categoryKey = category as keyof typeof userInventory
    const itemIds = userInventory[categoryKey] || []
    return storeItems.filter((item) => itemIds.includes(item.id))
  }

  const applyTheme = (themeId: number) => {
    const updatedInventory = { ...userInventory, activeTheme: themeId }
    const updatedUser = { ...user, inventory: updatedInventory }

    setUserInventory(updatedInventory)
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Apply theme to document
    const theme = storeItems.find((item) => item.id === themeId)
    if (theme && theme.data) {
      const root = document.documentElement

      // Apply theme colors
      root.style.setProperty("--theme-primary", theme.data.primaryColor)
      root.style.setProperty("--theme-secondary", theme.data.secondaryColor)
      root.style.setProperty("--theme-accent", theme.data.accentColor)
      root.style.setProperty("--theme-bg", theme.data.backgroundColor)

      // Apply theme class
      root.className = root.className.replace(/theme-\w+/g, "")
      root.classList.add(`theme-${theme.data.name}`)

      // Store theme preference
      localStorage.setItem("activeTheme", themeId.toString())
    }

    alert(`Tema "${theme?.name}" aplicado exitosamente!`)
  }

  const resetToDefault = (category: string) => {
    if (category === "themes") {
      const updatedInventory = { ...userInventory, activeTheme: null }
      const updatedUser = { ...user, inventory: updatedInventory }

      setUserInventory(updatedInventory)
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Reset theme
      const root = document.documentElement
      root.style.removeProperty("--theme-primary")
      root.style.removeProperty("--theme-secondary")
      root.style.removeProperty("--theme-accent")
      root.style.removeProperty("--theme-bg")
      root.className = root.className.replace(/theme-\w+/g, "")

      localStorage.removeItem("activeTheme")

      alert("Tema restablecido al predeterminado")
    } else if (category === "avatars") {
      const updatedUser = { ...user, avatar: defaultAvatars[0] }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Force header re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent("avatarChanged", { detail: defaultAvatars[0] }))

      alert("Avatar restablecido al predeterminado")
    } else if (category === "others") {
      const updatedInventory = { ...userInventory, activeBadge: null, activeFrame: null }
      const updatedUser = { ...user, inventory: updatedInventory }

      setUserInventory(updatedInventory)
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      alert("Insignias y marcos restablecidos")
    }
  }

  const selectAvatar = (avatarId: number) => {
    const avatar = storeItems.find((item) => item.id === avatarId)
    if (avatar && avatar.data) {
      const updatedUser = { ...user, avatar: avatar.data.url }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Force header re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent("avatarChanged", { detail: avatar.data.url }))

      alert(`Avatar "${avatar.name}" seleccionado!`)
    }
  }

  const applyBadge = (badgeId: number) => {
    const updatedInventory = { ...userInventory, activeBadge: badgeId }
    const updatedUser = { ...user, inventory: updatedInventory }

    setUserInventory(updatedInventory)
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    alert("Insignia aplicada exitosamente!")
  }

  const applyFrame = (frameId: number) => {
    const updatedInventory = { ...userInventory, activeFrame: frameId }
    const updatedUser = { ...user, inventory: updatedInventory }

    setUserInventory(updatedInventory)
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    alert("Marco aplicado exitosamente!")
  }

  const giftItem = (itemId: number, recipientId: number) => {
    // This would normally involve server-side logic
    // For demo purposes, we'll just show a success message
    const item = storeItems.find((i) => i.id === itemId)
    alert(`¡Has regalado "${item?.name}" exitosamente!`)
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "theme":
        return <Palette className="h-5 w-5" />
      case "emote":
        return <Smile className="h-5 w-5" />
      case "avatar":
        return <User className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-4">Debes iniciar sesión para ver tu inventario</p>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/store" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Package className="mr-3 h-8 w-8 text-blue-500" />
              Mi Inventario
            </h1>
            <p className="text-gray-400">Gestiona y usa tus artículos comprados</p>
          </div>
        </div>

        {ownedItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">Tu inventario está vacío</h2>
            <p className="text-gray-500 mb-6">Visita la tienda para comprar temas, emotes y más</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/store">Ir a la Tienda</Link>
            </Button>
          </div>
        ) : (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="themes" className="data-[state=active]:bg-blue-600">
                <Palette className="h-4 w-4 mr-2" />
                Temas ({userInventory.themes?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="emotes" className="data-[state=active]:bg-blue-600">
                <Smile className="h-4 w-4 mr-2" />
                Emotes ({userInventory.emotes?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="avatars" className="data-[state=active]:bg-blue-600">
                <User className="h-4 w-4 mr-2" />
                Avatares ({userInventory.avatars?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="others" className="data-[state=active]:bg-blue-600">
                <Gift className="h-4 w-4 mr-2" />
                Otros ({userInventory.others?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Themes Tab */}
            <TabsContent value="themes" className="mt-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Mis Temas</h2>
                <Button onClick={() => resetToDefault("themes")} variant="outline" className="border-gray-600">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Tema Predeterminado
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getItemsByCategory("themes").map((item) => (
                  <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        {userInventory.activeTheme === item.id && (
                          <Badge className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => applyTheme(item.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={userInventory.activeTheme === item.id}
                        >
                          {userInventory.activeTheme === item.id ? "Aplicado" : "Aplicar"}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Regalar Tema</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-gray-300">¿A quién quieres regalar "{item.name}"?</p>
                              <Select>
                                <SelectTrigger className="bg-gray-800 border-gray-600">
                                  <SelectValue placeholder="Seleccionar usuario" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  <SelectItem value="demo">Usuario Demo</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                onClick={() => giftItem(item.id, 1)}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                Enviar Regalo
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Default Theme Card */}
              <Card className="bg-gray-800/50 border-gray-700 mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Tema Predeterminado</h3>
                    {!userInventory.activeTheme && (
                      <Badge className="bg-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">Tema Predeterminado</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">El tema original de Ilegalmovie</p>
                  <Button
                    onClick={() => resetToDefault("themes")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!userInventory.activeTheme}
                  >
                    {!userInventory.activeTheme ? "Aplicado" : "Aplicar"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emotes Tab */}
            <TabsContent value="emotes" className="mt-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Mis Emotes</h2>
                <p className="text-gray-400">Usa estos emotes en tus comentarios</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getItemsByCategory("emotes").map((item) => (
                  <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{item.data?.emoji}</div>
                      <h3 className="font-medium text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-400 mb-3">{item.data?.code}</p>
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          navigator.clipboard.writeText(item.data?.code || item.data?.emoji)
                          alert("Emote copiado al portapapeles")
                        }}
                      >
                        Copiar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Default Emotes */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Emotes Predeterminados</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                    { emoji: "😀", code: ":smile:" },
                    { emoji: "😂", code: ":joy:" },
                    { emoji: "😍", code: ":heart_eyes:" },
                    { emoji: "🤔", code: ":thinking:" },
                    { emoji: "👍", code: ":thumbs_up:" },
                    { emoji: "👎", code: ":thumbs_down:" },
                    { emoji: "❤️", code: ":heart:" },
                    { emoji: "🔥", code: ":fire:" },
                  ].map((emote, index) => (
                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{emote.emoji}</div>
                        <p className="text-xs text-gray-400 mb-3">{emote.code}</p>
                        <Button
                          size="sm"
                          className="w-full bg-gray-600 hover:bg-gray-700"
                          onClick={() => {
                            navigator.clipboard.writeText(emote.code || emote.emoji)
                            alert("Emote copiado al portapapeles")
                          }}
                        >
                          Copiar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Avatars Tab */}
            <TabsContent value="avatars" className="mt-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Mis Avatares</h2>
                <Button onClick={() => resetToDefault("avatars")} variant="outline" className="border-gray-600">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Avatar Predeterminado
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getItemsByCategory("avatars").map((item) => (
                  <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-600">
                        <img
                          src={item.data?.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      </div>
                      <h3 className="font-medium text-white text-sm mb-3">{item.name}</h3>
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => selectAvatar(item.id)}
                      >
                        Seleccionar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Default Avatars */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Avatares Predeterminados</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {defaultAvatars.map((avatar, index) => (
                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-600">
                          <img
                            src={avatar || "/placeholder.svg"}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                            }}
                          />
                        </div>
                        <h3 className="font-medium text-white text-sm mb-3">Avatar {index + 1}</h3>
                        <Button
                          size="sm"
                          className="w-full bg-gray-600 hover:bg-gray-700"
                          onClick={() => {
                            const updatedUser = { ...user, avatar: avatar }
                            setUser(updatedUser)
                            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
                            window.dispatchEvent(new CustomEvent("avatarChanged", { detail: avatar }))
                            alert("Avatar predeterminado seleccionado")
                          }}
                        >
                          Seleccionar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Others Tab */}
            <TabsContent value="others" className="mt-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Otros Artículos</h2>
                <Button onClick={() => resetToDefault("others")} variant="outline" className="border-gray-600">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restablecer
                </Button>
              </div>

              {/* Badges */}
              <h3 className="text-lg font-semibold text-white mb-4">Insignias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {getItemsByCategory("others")
                  .filter((item) => item.data?.type === "badge")
                  .map((item) => (
                    <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.data?.color || "#ffd700" }}
                          >
                            <span className="font-bold text-black">{item.data?.badge}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                          onClick={() => applyBadge(item.id)}
                          disabled={userInventory.activeBadge === item.id}
                        >
                          {userInventory.activeBadge === item.id ? "Aplicada" : "Aplicar"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Frames */}
              <h3 className="text-lg font-semibold text-white mb-4">Marcos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getItemsByCategory("others")
                  .filter((item) => item.data?.type === "frame")
                  .map((item) => (
                    <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full border-4"
                            style={{ borderColor: item.data?.frameColor || "#ffd700" }}
                          >
                            <img
                              src={user?.avatar || defaultAvatars[0]}
                              alt="Avatar Preview"
                              className="w-full h-full rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                          onClick={() => applyFrame(item.id)}
                          disabled={userInventory.activeFrame === item.id}
                        >
                          {userInventory.activeFrame === item.id ? "Aplicado" : "Aplicar"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Other Effects */}
              <h3 className="text-lg font-semibold text-white mb-4 mt-8">Efectos y Otros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getItemsByCategory("others")
                  .filter((item) => !item.data?.type || (item.data?.type !== "badge" && item.data?.type !== "frame"))
                  .map((item) => (
                    <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                            <Gift className="h-6 w-6 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  )
}
