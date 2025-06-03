"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { movies } from "@/lib/data"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = movies
        .filter(
          (movie) =>
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.description.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (movie: any) => {
    setQuery(movie.title)
    setShowSuggestions(false)
    window.location.href = `/movie/${movie.id}`
  }

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Busca tu película favorita..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-4 py-3 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 rounded-full text-lg"
        />
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {suggestions.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSuggestionClick(movie)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-800 transition-colors text-left"
            >
              <img
                src={movie.image || "/placeholder.svg"}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <h4 className="font-semibold text-white">{movie.title}</h4>
                <p className="text-sm text-gray-400">
                  {movie.year} • {movie.genres.join(", ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
