import { ReactNode } from 'react'

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
  onNext: () => void
  onPrevious: () => void
  currentSlide: number
  totalSlides: number
  data: StoryCardData
}

export interface CardData {
  title: string
  emoji: string
  value: string | number
  description: string
  gradient: string
}
