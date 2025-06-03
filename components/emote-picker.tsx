"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { storeItems } from "@/lib/store-data"

interface EmotePickerProps {
  onEmoteSelect: (emote: string) => void
  userEmotes: number[]
}

export function EmotePicker({ onEmoteSelect, userEmotes }: EmotePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const availableEmotes = storeItems.filter((item) => item.type === "emote" && userEmotes.includes(item.id))

  // Default emotes available to everyone
  const defaultEmotes = [
    { emoji: "😀", code: ":smile:" },
    { emoji: "😂", code: ":joy:" },
    { emoji: "😍", code: ":heart_eyes:" },
    { emoji: "🤔", code: ":thinking:" },
    { emoji: "👍", code: ":thumbs_up:" },
    { emoji: "👎", code: ":thumbs_down:" },
    { emoji: "❤️", code: ":heart:" },
    { emoji: "🔥", code: ":fire:" },
  ]

  const handleEmoteClick = (emoji: string) => {
    onEmoteSelect(emoji)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-gray-600">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-900 border-gray-700" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Emotes Básicos</h4>
            <div className="grid grid-cols-8 gap-2">
              {defaultEmotes.map((emote) => (
                <button
                  key={emote.code}
                  onClick={() => handleEmoteClick(emote.emoji)}
                  className="p-2 text-xl hover:bg-gray-800 rounded transition-colors"
                  title={emote.code}
                >
                  {emote.emoji}
                </button>
              ))}
            </div>
          </div>

          {availableEmotes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Mis Emotes</h4>
              <div className="grid grid-cols-8 gap-2">
                {availableEmotes.map((emote) => (
                  <button
                    key={emote.id}
                    onClick={() => handleEmoteClick(emote.data?.emoji || "")}
                    className="p-2 text-xl hover:bg-gray-800 rounded transition-colors border border-yellow-500/30"
                    title={emote.data?.code}
                  >
                    {emote.data?.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableEmotes.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">Compra emotes en la tienda para tener más opciones</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
