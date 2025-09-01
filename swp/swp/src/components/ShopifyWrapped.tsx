import { useState, useEffect } from 'react'
import {
  useOrders,
  useSavedProducts,
  useFollowedShops,
  useCuratedProducts,
  useRecentProducts,
  useBuyerAttributes,
  useRecentShops,
} from '@shopify/shop-minis-react'

// Import all story cards
import { WelcomeCard } from './story-cards/WelcomeCard'
import { MoneySpentCard } from './story-cards/MoneySpentCard'
import { OrdersPlacedCard } from './story-cards/OrdersPlacedCard'
import { MoneySavedCard } from './story-cards/MoneySavedCard'
import { FavoriteShopCard } from './story-cards/FavoriteShopCard'
import { TopProductCard } from './story-cards/TopProductCard'
import { ShoppingPersonaCard } from './story-cards/ShoppingPersonaCard'
import { YearInNumbersCard } from './story-cards/YearInNumbersCard'
import { AllDataSlide } from './story-cards/AllDataSlide'

// Main Shopify Wrapped Component
export function ShopifyWrapped() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Fetch all data with error handling
  const { orders } = useOrders()
  const { products: savedProducts } = useSavedProducts()
  const { shops: followedShops } = useFollowedShops()
  const { products: recentProducts } = useRecentProducts()
  const { buyerAttributes } = useBuyerAttributes()
  const { shops: recentShops } = useRecentShops()
  
  let curatedProducts: any[] = []
  try {
    const result = useCuratedProducts({ handle: 'featured', first: 10 })
    curatedProducts = result.products || []
  } catch (error) {
    console.warn('Curated products not available:', error)
    curatedProducts = []
  }
  
  // Prepare data for story cards
  const storyData = {
    orders: orders || [],
    savedProducts: savedProducts || [],
    followedShops: followedShops || [],
    curatedProducts: curatedProducts,
    recentProducts: recentProducts || [],
    buyerAttributes: buyerAttributes || null,
    recentShops: recentShops || []
  }
  
  // Define slide components array
  const slides = [
    WelcomeCard,
    MoneySpentCard,
    OrdersPlacedCard,
    MoneySavedCard,
    FavoriteShopCard,
    TopProductCard,
    ShoppingPersonaCard,
    YearInNumbersCard,
    AllDataSlide
  ]
  
  const totalSlides = slides.length
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }
  
  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }
  
  const CurrentSlideComponent = slides[currentSlide]
  
  // Handle swipe gestures
  useEffect(() => {
    let startX = 0
    let startY = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return
      
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      
      const diffX = startX - endX
      const diffY = startY - endY
      
      // Only register horizontal swipes (not vertical scrolling)
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) {
          // Swipe left - next slide
          nextSlide()
        } else if (diffX < -50) {
          // Swipe right - previous slide
          previousSlide()
        }
      }
    }
    
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        previousSlide()
      }
    }
    
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  return (
    <div className="relative overflow-hidden">
      <CurrentSlideComponent
        onNext={nextSlide}
        onPrevious={previousSlide}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        data={storyData}
      />
      
      {/* Progress bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
