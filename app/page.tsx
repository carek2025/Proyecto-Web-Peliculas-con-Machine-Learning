"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { MovieCarousel } from "@/components/movie-carousel"
import { SearchBar } from "@/components/search-bar"
import { movies, categories } from "@/lib/data"
import type { Movie } from "@/lib/types"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let filtered = movies

    if (selectedCategory !== "all") {
      filtered = movies.filter((movie) =>
        movie.genres.some((genre) => genre.toLowerCase() === selectedCategory.toLowerCase()),
      )
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredMovies(filtered)
  }, [selectedCategory, searchQuery])

  // Apply active theme if exists
  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      const inventory = parsedUser.inventory || {}

      if (inventory.activeTheme) {
        const activeThemeId = inventory.activeTheme
        const theme = storeItems.find((item) => item.id === activeThemeId)
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
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar categories={categories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />

            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">
                {selectedCategory === "all" ? "Películas Destacadas" : `Categoría: ${selectedCategory}`}
              </h2>

              <MovieCarousel movies={filteredMovies.slice(0, 10)} />
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-6">Todas las Películas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-gray-800/50 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer"
                    onClick={() => (window.location.href = `/movie/${movie.id}`)}
                  >
                    <img
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">
                        {movie.year} • {movie.duration}
                      </p>
                      <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                      <div className="flex items-center mt-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < Math.floor(movie.rating) ? "text-yellow-400" : "text-gray-600"}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

// Import storeItems for theme application
import { storeItems } from "@/lib/store-data"
