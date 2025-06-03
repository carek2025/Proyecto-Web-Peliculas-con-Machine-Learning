export interface Movie {
  id: number
  title: string
  description: string
  image: string
  year: number
  duration: string
  rating: number
  genres: string[]
  cast: string[]
  director: string
  trailer?: string
  reactions?: MovieReaction[]
}

export interface MovieReaction {
  id: number
  userId: number
  userName: string
  emoji: string
  timestamp: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Comment {
  id: number
  userId: number
  userName: string
  userAvatar: string
  text: string
  date: string
  likes: number
  movieId: number
  reactions?: CommentReaction[]
}

export interface CommentReaction {
  id: number
  userId: number
  emoji: string
  timestamp: string
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  points: number
  joinDate: string
  favorites: number[]
  comments: Comment[]
  watchHistory: WatchHistoryItem[]
  favoriteMovie?: string
  isAdmin?: boolean
  inventory?: UserInventory
  level?: UserLevel
  totalPointsEarned?: number
  privileges?: "user" | "vip" | "super_vip" | "moderator" | "admin" | "super_admin"
  followers?: number[]
  following?: number[]
  badges?: number[]
  frames?: number[]
}

export interface WatchHistoryItem {
  movieId: number
  watchedAt: string
  completed: boolean
}

export interface StoreItem {
  id: number
  type: "theme" | "emote" | "avatar" | "other"
  name: string
  description: string
  image: string
  cost: number
  data?: any
}

export interface UserInventory {
  themes: number[]
  emotes: number[]
  avatars: number[]
  others: number[]
  activeTheme?: number
  activeBadge?: number
  activeFrame?: number
}

export interface UserLevel {
  level: number
  name: string
  pointsRequired: number
  badge: string
}

export interface MovieSuggestion {
  id: number
  userId: number
  userName: string
  title: string
  description: string
  image: string
  year: number
  duration: string
  genres: string[]
  cast: string[]
  director: string
  trailer?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: number
}

export interface Purchase {
  id: number
  userId: number
  itemId: number
  itemName: string
  itemType: string
  cost: number
  purchasedAt: string
}

export interface Notification {
  id: number
  userId: number
  type:
    | "purchase"
    | "suggestion_approved"
    | "suggestion_rejected"
    | "gift_received"
    | "level_up"
    | "new_release"
    | "follow"
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: any
}

export interface CommunityPost {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  type: "post" | "poll" | "discussion"
  timestamp: string
  likes: number
  comments: CommunityComment[]
  poll?: Poll
}

export interface Poll {
  id: number
  question: string
  options: PollOption[]
  endsAt: string
}

export interface PollOption {
  id: number
  text: string
  votes: number
  voters: number[]
}

export interface CommunityComment {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
}

export interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  releaseDate: string
  genres: string[]
  trailer?: string
  status: "coming_soon" | "released"
  createdAt: string
}

export interface MiniGame {
  id: number
  name: string
  description: string
  image: string
  type: "trivia" | "memory" | "puzzle" | "arcade"
  pointsReward: number
  difficulty: "easy" | "medium" | "hard"
}
// export type User = {
//   id: number;
//   name: string;
//   avatar?: string;
//   inventory?: { activeFrame?: boolean; activeBadge?: string };
//   badge?: string;
//   points?: number;
//   role?: string;
// }