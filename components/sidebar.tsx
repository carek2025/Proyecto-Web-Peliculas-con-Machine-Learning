"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Category } from "@/lib/types"

interface SidebarProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export function Sidebar({ categories, selectedCategory, onCategorySelect }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-200">Categorías</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-800"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onCategorySelect("all")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-red-500/30"
                : "hover:bg-gray-800/50"
            }`}
          >
            <span className="text-2xl">🎬</span>
            {!isCollapsed && <span className="text-sm font-medium">Todas</span>}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.name)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-red-500/30"
                  : "hover:bg-gray-800/50"
              }`}
              style={{ backgroundColor: selectedCategory === category.name ? undefined : `${category.color}10` }}
            >
              <span className="text-2xl">{category.icon}</span>
              {!isCollapsed && <span className="text-sm font-medium">{category.name}</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
