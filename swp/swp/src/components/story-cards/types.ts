export interface StoryCardData {
  orders: any[]
  savedProducts: any[]
  followedShops: any[]
  curatedProducts: any[]
  recentProducts: any[]
  buyerAttributes: any
  recentShops: any[]
}

export interface StoryCardProps {
  currentSlide: number
  totalSlides: number
  data: StoryCardData
  onNext?: () => void // Optional navigation function for welcome card
  onJumpToSlide?: (slideIndex: number) => void // Optional function to jump to specific slide
}

export interface CardData {
  title: string
  emoji: string
  value: string | number
  description: string
  gradient: string
}
