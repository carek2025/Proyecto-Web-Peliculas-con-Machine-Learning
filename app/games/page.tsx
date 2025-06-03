"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gamepad2, Trophy, Star, Clock, Play, ArrowLeft, Coins, Target, Zap, Puzzle, Dice1 } from "lucide-react"
import Link from "next/link"
import { storeItems } from "@/lib/store-data"

interface MiniGame {
  id: number
  name: string
  description: string
  category: "puzzle" | "action" | "trivia" | "memory" | "strategy"
  difficulty: "easy" | "medium" | "hard"
  pointsReward: number
  timeLimit?: number
  icon: string
  color: string
}

interface GameScore {
  gameId: number
  userId: number
  score: number
  completedAt: string
  pointsEarned: number
}

export default function GamesPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [gameScores, setGameScores] = useState<GameScore[]>([])
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null)
  const [gameState, setGameState] = useState<any>({})
  const [isPlaying, setIsPlaying] = useState(false)

  const miniGames: MiniGame[] = [
    {
      id: 1,
      name: "Trivia de Películas",
      description: "Demuestra tus conocimientos sobre cine respondiendo preguntas",
      category: "trivia",
      difficulty: "medium",
      pointsReward: 10,
      timeLimit: 60,
      icon: "🎬",
      color: "bg-blue-600",
    },
    {
      id: 2,
      name: "Memoria de Actores",
      description: "Encuentra las parejas de actores famosos",
      category: "memory",
      difficulty: "easy",
      pointsReward: 5,
      timeLimit: 120,
      icon: "🧠",
      color: "bg-green-600",
    },
    {
      id: 3,
      name: "Adivina la Película",
      description: "Identifica la película por una imagen o descripción",
      category: "puzzle",
      difficulty: "hard",
      pointsReward: 15,
      timeLimit: 90,
      icon: "🔍",
      color: "bg-purple-600",
    },
    {
      id: 4,
      name: "Reacción Rápida",
      description: "Haz clic en los elementos que aparecen lo más rápido posible",
      category: "action",
      difficulty: "medium",
      pointsReward: 8,
      timeLimit: 30,
      icon: "⚡",
      color: "bg-yellow-600",
    },
    {
      id: 5,
      name: "Estrategia de Géneros",
      description: "Organiza las películas por géneros de manera estratégica",
      category: "strategy",
      difficulty: "hard",
      pointsReward: 20,
      timeLimit: 180,
      icon: "🎯",
      color: "bg-red-600",
    },
    {
      id: 6,
      name: "Dados de la Suerte",
      description: "Juego de dados con premios aleatorios",
      category: "action",
      difficulty: "easy",
      pointsReward: 3,
      icon: "🎲",
      color: "bg-orange-600",
    },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load game scores
      const savedScores = localStorage.getItem(`gameScores_${parsedUser.id}`)
      if (savedScores) {
        setGameScores(JSON.parse(savedScores))
      }
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

  const startGame = (game: MiniGame) => {
    if (!user) {
      alert("Debes iniciar sesión para jugar")
      return
    }

    setCurrentGame(game)
    setIsPlaying(true)

    // Initialize game state based on game type
    switch (game.id) {
      case 1: // Trivia
        setGameState({
          currentQuestion: 0,
          score: 0,
          questions: generateTriviaQuestions(),
          timeLeft: game.timeLimit || 60,
        })
        break
      case 2: // Memory
        setGameState({
          cards: generateMemoryCards(),
          flippedCards: [],
          matchedPairs: 0,
          score: 0,
          timeLeft: game.timeLimit || 120,
        })
        break
      case 6: // Dice
        setGameState({
          diceValue: 1,
          rolls: 0,
          maxRolls: 3,
          score: 0,
        })
        break
      default:
        setGameState({ score: 0 })
    }
  }

  const generateTriviaQuestions = () => {
    return [
      {
        question: "¿Quién dirigió la película 'Inception'?",
        options: ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino"],
        correct: 0,
      },
      {
        question: "¿En qué año se estrenó 'Titanic'?",
        options: ["1995", "1997", "1999", "2001"],
        correct: 1,
      },
      {
        question: "¿Cuál es la película más taquillera de todos los tiempos?",
        options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars"],
        correct: 1,
      },
    ]
  }

  const generateMemoryCards = () => {
    const actors = ["🎭", "🎪", "🎨", "🎵", "🎸", "🎺", "🎻", "🎹"]
    const cards = [...actors, ...actors].map((actor, index) => ({
      id: index,
      content: actor,
      isFlipped: false,
      isMatched: false,
    }))
    return cards.sort(() => Math.random() - 0.5)
  }

  const endGame = (finalScore: number) => {
    if (!user || !currentGame) return

    const pointsEarned = Math.floor((finalScore / 100) * currentGame.pointsReward)

    // Save score
    const newScore: GameScore = {
      gameId: currentGame.id,
      userId: user.id,
      score: finalScore,
      completedAt: new Date().toISOString(),
      pointsEarned,
    }

    const updatedScores = [...gameScores, newScore]
    setGameScores(updatedScores)
    localStorage.setItem(`gameScores_${user.id}`, JSON.stringify(updatedScores))

    // Update user points
    const updatedUser = { ...user, points: user.points + pointsEarned }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    setIsPlaying(false)
    setCurrentGame(null)
    setGameState({})

    alert(`¡Juego completado! Puntuación: ${finalScore}. Has ganado ${pointsEarned} puntos.`)
  }

  const rollDice = () => {
    if (gameState.rolls >= gameState.maxRolls) return

    const newValue = Math.floor(Math.random() * 6) + 1
    const newRolls = gameState.rolls + 1
    const points = newValue * 2

    setGameState({
      ...gameState,
      diceValue: newValue,
      rolls: newRolls,
      score: gameState.score + points,
    })

    if (newRolls >= gameState.maxRolls) {
      setTimeout(() => endGame(gameState.score + points), 1000)
    }
  }

  const answerTrivia = (answerIndex: number) => {
    const question = gameState.questions[gameState.currentQuestion]
    const isCorrect = answerIndex === question.correct
    const newScore = gameState.score + (isCorrect ? 20 : 0)
    const nextQuestion = gameState.currentQuestion + 1

    if (nextQuestion >= gameState.questions.length) {
      endGame(newScore)
    } else {
      setGameState({
        ...gameState,
        currentQuestion: nextQuestion,
        score: newScore,
      })
    }
  }

  const flipMemoryCard = (cardId: number) => {
    if (gameState.flippedCards.length >= 2) return

    const updatedCards = gameState.cards.map((card: any) => (card.id === cardId ? { ...card, isFlipped: true } : card))

    const newFlippedCards = [...gameState.flippedCards, cardId]

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards
      const firstCard = updatedCards.find((c: any) => c.id === first)
      const secondCard = updatedCards.find((c: any) => c.id === second)

      if (firstCard.content === secondCard.content) {
        // Match found
        setTimeout(() => {
          const matchedCards = updatedCards.map((card: any) =>
            card.id === first || card.id === second ? { ...card, isMatched: true } : card,
          )

          const newMatchedPairs = gameState.matchedPairs + 1
          const newScore = gameState.score + 10

          setGameState({
            ...gameState,
            cards: matchedCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            score: newScore,
          })

          if (newMatchedPairs >= 8) {
            endGame(newScore)
          }
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = updatedCards.map((card: any) =>
            card.id === first || card.id === second ? { ...card, isFlipped: false } : card,
          )

          setGameState({
            ...gameState,
            cards: resetCards,
            flippedCards: [],
          })
        }, 1000)
      }
    }

    setGameState({
      ...gameState,
      cards: updatedCards,
      flippedCards: newFlippedCards,
    })
  }

  const getFilteredGames = () => {
    if (selectedCategory === "all") return miniGames
    return miniGames.filter((game) => game.category === selectedCategory)
  }

  const getUserBestScore = (gameId: number) => {
    const userScores = gameScores.filter((score) => score.gameId === gameId)
    return userScores.length > 0 ? Math.max(...userScores.map((s) => s.score)) : 0
  }

  const getTotalPointsEarned = () => {
    return gameScores.reduce((total, score) => total + score.pointsEarned, 0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-600"
      case "medium":
        return "bg-yellow-600"
      case "hard":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trivia":
        return <Star className="h-4 w-4" />
      case "memory":
        return <Puzzle className="h-4 w-4" />
      case "action":
        return <Zap className="h-4 w-4" />
      case "puzzle":
        return <Target className="h-4 w-4" />
      case "strategy":
        return <Trophy className="h-4 w-4" />
      default:
        return <Gamepad2 className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Gamepad2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-4">Debes iniciar sesión para acceder a los juegos</p>
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
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Gamepad2 className="mr-3 h-8 w-8 text-purple-500" />
              Área de Juegos
            </h1>
            <p className="text-gray-400">Diviértete y gana puntos con nuestros minijuegos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Games Area */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600"}
              >
                Todos
              </Button>
              <Button
                variant={selectedCategory === "trivia" ? "default" : "outline"}
                onClick={() => setSelectedCategory("trivia")}
                className={selectedCategory === "trivia" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600"}
              >
                <Star className="h-4 w-4 mr-2" />
                Trivia
              </Button>
              <Button
                variant={selectedCategory === "memory" ? "default" : "outline"}
                onClick={() => setSelectedCategory("memory")}
                className={selectedCategory === "memory" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600"}
              >
                <Puzzle className="h-4 w-4 mr-2" />
                Memoria
              </Button>
              <Button
                variant={selectedCategory === "action" ? "default" : "outline"}
                onClick={() => setSelectedCategory("action")}
                className={selectedCategory === "action" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600"}
              >
                <Zap className="h-4 w-4 mr-2" />
                Acción
              </Button>
              <Button
                variant={selectedCategory === "puzzle" ? "default" : "outline"}
                onClick={() => setSelectedCategory("puzzle")}
                className={selectedCategory === "puzzle" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600"}
              >
                <Target className="h-4 w-4 mr-2" />
                Puzzle
              </Button>
              <Button
                variant={selectedCategory === "strategy" ? "default" : "outline"}
                onClick={() => setSelectedCategory("strategy")}
                className={selectedCategory === "strategy" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600"}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Estrategia
              </Button>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getFilteredGames().map((game) => (
                <Card
                  key={game.id}
                  className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-2xl`}>
                          {game.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{game.name}</h3>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(game.category)}
                            <span className="text-sm text-gray-400 capitalize">{game.category}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{game.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400">{game.pointsReward} pts</span>
                        </div>
                        {game.timeLimit && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400">{game.timeLimit}s</span>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400">Mejor: {getUserBestScore(game.id)}</div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <Play className="mr-2 h-4 w-4" />
                          Jugar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white flex items-center">
                            <span className="text-2xl mr-2">{game.icon}</span>
                            {game.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {!isPlaying ? (
                            <div className="text-center space-y-4">
                              <p className="text-gray-300">{game.description}</p>
                              <div className="flex justify-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Coins className="h-4 w-4 text-yellow-400" />
                                  <span className="text-yellow-400">Hasta {game.pointsReward} puntos</span>
                                </div>
                                {game.timeLimit && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4 text-blue-400" />
                                    <span className="text-blue-400">{game.timeLimit} segundos</span>
                                  </div>
                                )}
                              </div>
                              <Button onClick={() => startGame(game)} className="bg-purple-600 hover:bg-purple-700">
                                Comenzar Juego
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Game UI based on game type */}
                              {currentGame?.id === 1 && gameState.questions && (
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">
                                      Pregunta {gameState.currentQuestion + 1} de {gameState.questions.length}
                                    </span>
                                    <span className="text-sm text-yellow-400">Puntuación: {gameState.score}</span>
                                  </div>
                                  <div className="bg-gray-800/50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                      {gameState.questions[gameState.currentQuestion].question}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                      {gameState.questions[gameState.currentQuestion].options.map(
                                        (option: string, index: number) => (
                                          <Button
                                            key={index}
                                            variant="outline"
                                            onClick={() => answerTrivia(index)}
                                            className="border-gray-600 hover:bg-purple-600 hover:border-purple-600"
                                          >
                                            {option}
                                          </Button>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {currentGame?.id === 2 && gameState.cards && (
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Parejas: {gameState.matchedPairs} / 8</span>
                                    <span className="text-sm text-yellow-400">Puntuación: {gameState.score}</span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                    {gameState.cards.map((card: any) => (
                                      <Button
                                        key={card.id}
                                        variant="outline"
                                        onClick={() => flipMemoryCard(card.id)}
                                        disabled={card.isFlipped || card.isMatched}
                                        className={`h-16 text-2xl border-gray-600 ${
                                          card.isMatched
                                            ? "bg-green-600 border-green-600"
                                            : card.isFlipped
                                              ? "bg-blue-600 border-blue-600"
                                              : ""
                                        }`}
                                      >
                                        {card.isFlipped || card.isMatched ? card.content : "?"}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {currentGame?.id === 6 && (
                                <div className="space-y-4 text-center">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">
                                      Tiradas: {gameState.rolls} / {gameState.maxRolls}
                                    </span>
                                    <span className="text-sm text-yellow-400">Puntuación: {gameState.score}</span>
                                  </div>
                                  <div className="bg-gray-800/50 p-8 rounded-lg">
                                    <div className="text-6xl mb-4">
                                      <Dice1 className="h-24 w-24 mx-auto" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-4">{gameState.diceValue}</div>
                                    <Button
                                      onClick={rollDice}
                                      disabled={gameState.rolls >= gameState.maxRolls}
                                      className="bg-orange-600 hover:bg-orange-700"
                                    >
                                      {gameState.rolls >= gameState.maxRolls ? "Juego Terminado" : "Lanzar Dado"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Tus Estadísticas</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Puntos totales</span>
                  <span className="text-yellow-400 font-semibold">{getTotalPointsEarned()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Juegos jugados</span>
                  <span className="text-white font-semibold">{gameScores.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mejor puntuación</span>
                  <span className="text-white font-semibold">
                    {gameScores.length > 0 ? Math.max(...gameScores.map((s) => s.score)) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Scores */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Puntuaciones Recientes</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {gameScores
                  .slice(-5)
                  .reverse()
                  .map((score, index) => {
                    const game = miniGames.find((g) => g.id === score.gameId)
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{game?.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{game?.name}</p>
                            <p className="text-xs text-gray-400">{new Date(score.completedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">{score.score}</p>
                          <p className="text-xs text-yellow-400">+{score.pointsEarned} pts</p>
                        </div>
                      </div>
                    )
                  })}

                {gameScores.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No has jugado ningún juego aún</p>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Tabla de Líderes</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white">1. {user.name}</span>
                  </div>
                  <span className="text-sm text-yellow-400">{getTotalPointsEarned()} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">2. Usuario Demo</span>
                  </div>
                  <span className="text-sm text-gray-400">150 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">3. Jugador Pro</span>
                  </div>
                  <span className="text-sm text-gray-400">120 pts</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
