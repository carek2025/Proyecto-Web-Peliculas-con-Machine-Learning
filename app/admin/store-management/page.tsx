"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Plus, Edit, Trash2, Palette, Smile, User, Gift, ArrowLeft, Save, Package } from "lucide-react"
import { storeItems } from "@/lib/store-data"
import type { StoreItem } from "@/lib/types"
import Link from "next/link"

export default function StoreManagementPage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<StoreItem[]>(storeItems)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<StoreItem>>({
    type: "theme",
    name: "",
    description: "",
    image: "",
    cost: 0,
    data: {},
  })

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.isAdmin) {
        window.location.href = "/"
        return
      }
      setUser(parsedUser)
    }

    // Load custom store items
    const customItems = JSON.parse(localStorage.getItem("customStoreItems") || "[]")
    setItems([...storeItems, ...customItems])
  }, [])

  const getFilteredItems = () => {
    if (selectedCategory === "all") return items
    return items.filter((item) => item.type === selectedCategory)
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.description || !newItem.cost) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const item: StoreItem = {
      id: Math.max(...items.map((i) => i.id)) + 1,
      type: newItem.type!,
      name: newItem.name!,
      description: newItem.description!,
      image: newItem.image || "/placeholder.svg?height=200&width=300",
      cost: newItem.cost!,
      data: newItem.data || {},
    }

    const updatedItems = [...items, item]
    setItems(updatedItems)

    // Save custom items
    const customItems = updatedItems.filter((i) => i.id > 1000) // Assuming original items have IDs < 1000
    localStorage.setItem("customStoreItems", JSON.stringify(customItems))

    setNewItem({
      type: "theme",
      name: "",
      description: "",
      image: "",
      cost: 0,
      data: {},
    })
    setIsAddingItem(false)
    alert("Artículo agregado exitosamente")
  }

  const handleEditItem = (item: StoreItem) => {
    setEditingItem(item)
    setNewItem(item)
    setIsAddingItem(true)
  }

  const handleUpdateItem = () => {
    if (!editingItem) return

    const updatedItems = items.map((item) => (item.id === editingItem.id ? { ...(newItem as StoreItem) } : item))
    setItems(updatedItems)

    // Save custom items
    const customItems = updatedItems.filter((i) => i.id > 1000)
    localStorage.setItem("customStoreItems", JSON.stringify(customItems))

    setEditingItem(null)
    setNewItem({
      type: "theme",
      name: "",
      description: "",
      image: "",
      cost: 0,
      data: {},
    })
    setIsAddingItem(false)
    alert("Artículo actualizado exitosamente")
  }

  const handleDeleteItem = (itemId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      const updatedItems = items.filter((item) => item.id !== itemId)
      setItems(updatedItems)

      // Save custom items
      const customItems = updatedItems.filter((i) => i.id > 1000)
      localStorage.setItem("customStoreItems", JSON.stringify(customItems))

      alert("Artículo eliminado exitosamente")
    }
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
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <ShoppingCart className="mr-3 h-8 w-8 text-purple-500" />
                Gestión de Tienda
              </h1>
              <p className="text-gray-400">Administra los artículos de la tienda</p>
            </div>
          </div>

          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Artículo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingItem ? "Editar Artículo" : "Agregar Nuevo Artículo"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemType" className="text-gray-200">
                      Tipo *
                    </Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value as any })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="theme">Tema</SelectItem>
                        <SelectItem value="emote">Emote</SelectItem>
                        <SelectItem value="avatar">Avatar</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="itemCost" className="text-gray-200">
                      Costo (puntos) *
                    </Label>
                    <Input
                      id="itemCost"
                      type="number"
                      value={newItem.cost}
                      onChange={(e) => setNewItem({ ...newItem, cost: Number.parseInt(e.target.value) })}
                      className="bg-gray-800 border-gray-600 text-white"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="itemName" className="text-gray-200">
                    Nombre *
                  </Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Nombre del artículo"
                  />
                </div>

                <div>
                  <Label htmlFor="itemDescription" className="text-gray-200">
                    Descripción *
                  </Label>
                  <Textarea
                    id="itemDescription"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Descripción del artículo"
                  />
                </div>

                <div>
                  <Label htmlFor="itemImage" className="text-gray-200">
                    URL de Imagen
                  </Label>
                  <Input
                    id="itemImage"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://..."
                  />
                </div>

                {newItem.type === "emote" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emoji" className="text-gray-200">
                        Emoji
                      </Label>
                      <Input
                        id="emoji"
                        value={newItem.data?.emoji || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            data: { ...newItem.data, emoji: e.target.value },
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="😀"
                      />
                    </div>
                    <div>
                      <Label htmlFor="code" className="text-gray-200">
                        Código
                      </Label>
                      <Input
                        id="code"
                        value={newItem.data?.code || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            data: { ...newItem.data, code: e.target.value },
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder=":smile:"
                      />
                    </div>
                  </div>
                )}

                {newItem.type === "avatar" && (
                  <div>
                    <Label htmlFor="avatarUrl" className="text-gray-200">
                      URL del Avatar
                    </Label>
                    <Input
                      id="avatarUrl"
                      value={newItem.data?.url || ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          data: { ...newItem.data, url: e.target.value },
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setIsAddingItem(false)
                      setEditingItem(null)
                      setNewItem({
                        type: "theme",
                        name: "",
                        description: "",
                        image: "",
                        cost: 0,
                        data: {},
                      })
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={editingItem ? handleUpdateItem : handleAddItem}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {editingItem ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{items.length}</div>
              <div className="text-sm text-gray-400">Total Artículos</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Palette className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{items.filter((i) => i.type === "theme").length}</div>
              <div className="text-sm text-gray-400">Temas</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Smile className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{items.filter((i) => i.type === "emote").length}</div>
              <div className="text-sm text-gray-400">Emotes</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{items.filter((i) => i.type === "avatar").length}</div>
              <div className="text-sm text-gray-400">Avatares</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              Todos
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-purple-600">
              Temas
            </TabsTrigger>
            <TabsTrigger value="emote" className="data-[state=active]:bg-purple-600">
              Emotes
            </TabsTrigger>
            <TabsTrigger value="avatar" className="data-[state=active]:bg-purple-600">
              Avatares
            </TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-purple-600">
              Otros
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="space-y-4">
              {getFilteredItems().map((item) => (
                <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.type === "emote" ? (
                          <span className="text-2xl">{item.data?.emoji || "🎭"}</span>
                        ) : (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getItemIcon(item.type)}
                          <h3 className="font-semibold text-white">{item.name}</h3>
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
                        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-yellow-400 font-semibold">{item.cost} puntos</span>
                          {item.id > 1000 && <Badge className="bg-green-600 text-xs">Personalizado</Badge>}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditItem(item)}
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {item.id > 1000 && (
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getFilteredItems().length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No hay artículos en esta categoría</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
