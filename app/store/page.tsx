"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Coins, Package, Palette, Smile, User, Gift, ArrowLeft, Check } from "lucide-react"
import { storeItems } from "@/lib/store-data"
import type { StoreItem, User as UserType, Purchase } from "@/lib/types"
import Link from "next/link"

export default function StorePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>(storeItems)
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

      // Load user inventory
      const inventory = parsedUser.inventory || {
        themes: [],
        emotes: [],
        avatars: [],
        others: [],
      }
      setUserInventory(inventory)
    }
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(storeItems)
    } else {
      setFilteredItems(storeItems.filter((item) => item.type === selectedCategory))
    }
  }, [selectedCategory])

  const handlePurchase = (item: StoreItem) => {
    if (!user) {
      alert("Debes iniciar sesión para comprar")
      return
    }

    if (user.points < item.cost) {
      alert("No tienes suficientes puntos para comprar este artículo")
      return
    }

    // Check if user already owns this item
    const inventoryKey = `${item.type}s` as keyof typeof userInventory
    if (userInventory[inventoryKey]?.includes(item.id)) {
      alert("Ya posees este artículo")
      return
    }

    // Deduct points and add to inventory
    const updatedUser = {
      ...user,
      points: user.points - item.cost,
    }

    const updatedInventory = {
      ...userInventory,
      [inventoryKey]: [...(userInventory[inventoryKey] || []), item.id],
    }

    updatedUser.inventory = updatedInventory

    // Save purchase record
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    const newPurchase: Purchase = {
      id: Date.now(),
      userId: user.id,
      itemId: item.id,
      itemName: item.name,
      itemType: item.type,
      cost: item.cost,
      purchasedAt: new Date().toISOString(),
    }
    purchases.push(newPurchase)
    localStorage.setItem("purchases", JSON.stringify(purchases))

    // Add notification
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const notification = {
      id: Date.now(),
      userId: user.id,
      type: "purchase",
      title: "¡Compra realizada!",
      message: `Has comprado ${item.name} por ${item.cost} puntos`,
      read: false,
      createdAt: new Date().toISOString(),
      data: { itemId: item.id, itemName: item.name },
    }
    notifications.unshift(notification)
    localStorage.setItem("notifications", JSON.stringify(notifications))

    setUser(updatedUser)
    setUserInventory(updatedInventory)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    alert(`¡Has comprado ${item.name} exitosamente!`)
  }

  const isOwned = (item: StoreItem) => {
    const inventoryKey = `${item.type}s` as keyof typeof userInventory
    return userInventory[inventoryKey]?.includes(item.id) || false
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
            <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-4">Debes iniciar sesión para acceder a la tienda</p>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <ShoppingCart className="mr-3 h-8 w-8 text-red-500" />
                Tienda
              </h1>
              <p className="text-gray-400">Compra temas, emotes y más con tus puntos</p>
            </div>
          </div>

          {/* Points Display */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center space-x-2">
              <Coins className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Tus Puntos</p>
                <p className="text-2xl font-bold text-yellow-400">{user.points}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-red-600">
              <Package className="h-4 w-4 mr-2" />
              Todos
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-red-600">
              <Palette className="h-4 w-4 mr-2" />
              Temas
            </TabsTrigger>
            <TabsTrigger value="emote" className="data-[state=active]:bg-red-600">
              <Smile className="h-4 w-4 mr-2" />
              Emotes
            </TabsTrigger>
            <TabsTrigger value="avatar" className="data-[state=active]:bg-red-600">
              <User className="h-4 w-4 mr-2" />
              Avatares
            </TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-red-600">
              <Gift className="h-4 w-4 mr-2" />
              Otros
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-gray-800/50 border-gray-700 hover:border-red-500/50 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getItemIcon(item.type)}
                        <Badge variant="secondary" className="text-xs">
                          {item.type === "theme"
                            ? "Tema"
                            : item.type === "emote"
                              ? "Emote"
                              : item.type === "avatar"
                                ? "Avatar"
                                : "Otro"}
                        </Badge>
                      </div>
                      {isOwned(item) && (
                        <Badge className="bg-green-600 text-white">
                          <Check className="h-3 w-3 mr-1" />
                          Poseído
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.type === "emote" ? (
                        <span className="text-4xl">{item.data?.emoji || "🎭"}</span>
                      ) : (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-yellow-400" />
                          <span className="font-semibold text-yellow-400">{item.cost}</span>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700" disabled={isOwned(item)}>
                              {isOwned(item) ? "Poseído" : "Comprar"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Confirmar Compra</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center">
                                  {item.type === "emote" ? (
                                    <span className="text-2xl">{item.data?.emoji || "🎭"}</span>
                                  ) : (
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-full h-full object-cover rounded-lg"
                                      onError={(e) => {
                                        e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                                      }}
                                    />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white">{item.name}</h3>
                                  <p className="text-sm text-gray-400">{item.description}</p>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Coins className="h-4 w-4 text-yellow-400" />
                                    <span className="font-semibold text-yellow-400">{item.cost} puntos</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gray-800/50 p-3 rounded-lg">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Puntos actuales:</span>
                                  <span className="text-white">{user.points}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Costo del artículo:</span>
                                  <span className="text-red-400">-{item.cost}</span>
                                </div>
                                <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-semibold">
                                  <span className="text-gray-400">Puntos restantes:</span>
                                  <span className={user.points - item.cost >= 0 ? "text-green-400" : "text-red-400"}>
                                    {user.points - item.cost}
                                  </span>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="flex-1">
                                    Cancelar
                                  </Button>
                                </DialogTrigger>
                                <Button
                                  onClick={() => handlePurchase(item)}
                                  className="flex-1 bg-red-600 hover:bg-red-700"
                                  disabled={user.points < item.cost}
                                >
                                  Confirmar Compra
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

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No hay artículos en esta categoría</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Access to Inventory */}
        <Card className="bg-gray-800/50 border-gray-700 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Tu Inventario</h3>
                <p className="text-gray-400">Gestiona y usa tus artículos comprados</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/inventory">
                  <Package className="mr-2 h-4 w-4" />
                  Ver Inventario
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
