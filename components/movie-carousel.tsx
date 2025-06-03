"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import type { Movie } from "@/lib/types"

interface MovieCarouselProps {
  movies: Movie[]
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, movies.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No se encontraron películas</p>
      </div>
    )
  }

  const currentMovie = movies[currentIndex]

  return (
    <div
      className="relative h-96 rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentMovie.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-2xl p-8">
          <h3 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">{currentMovie.title}</h3>
          <p className="text-lg text-gray-200 mb-4 line-clamp-3 drop-shadow">{currentMovie.description}</p>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(currentMovie.rating) ? "text-yellow-400" : "text-gray-600"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-white font-semibold">{currentMovie.rating}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">{currentMovie.year}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">{currentMovie.duration}</span>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
            onClick={() => (window.location.href = `/movie/${currentMovie.id}`)}
          >
            <Play className="mr-2 h-5 w-5" />
            Ver ahora
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.slice(0, 7).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-red-500" : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
