import { useState, useEffect } from 'react'
import {
  useOrders,
  useSavedProducts,
  useRecentProducts,
  useFollowedShops,
  useBuyerAttributes,
  useRecentShops,
} from '@shopify/shop-minis-react'

interface SlideProps {
  onNext: () => void
  onPrevious: () => void
  currentSlide: number
  totalSlides: number
}

// Welcome Slide
function WelcomeSlide({ onNext, currentSlide, totalSlides }: SlideProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-4">Your 2025 Shop Wrapped</h1>
        <div className="text-6xl mb-6 animate-pulse-slow">🛍️</div>
        <p className="text-xl">
          Hey there! Ready to see your shopping story?
        </p>
        <button
          onClick={onNext}
          className="mt-8 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105"
        >
          Let's Go!
        </button>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Orders Summary Slide
function OrdersSummarySlide({ onNext, onPrevious, currentSlide, totalSlides }: SlideProps) {
  const { orders } = useOrders()
  
  const totalOrders = orders?.length || 0
  // Simple fallback for total spent - we'll use mock data for demo
  const totalSpent = totalOrders * 50 // Mock average of $50 per order
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-500 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-8 animate-fadeIn">
        <h1 className="text-3xl font-bold">Your Shopping Numbers</h1>
        <div className="text-8xl mb-6">📊</div>
        
        <div className="space-y-6">
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold">{totalOrders}</div>
            <div className="text-lg">Total Orders</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold">${totalSpent.toFixed(2)}</div>
            <div className="text-lg">Total Spent</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <div className="text-lg">Average Order Value</div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onPrevious}
            className="glass text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Saved Products Slide
function SavedProductsSlide({ onNext, onPrevious, currentSlide, totalSlides }: SlideProps) {
  const { products: savedProducts } = useSavedProducts()
  
  const totalSaved = savedProducts?.length || 0
  const topSavedProducts = savedProducts?.slice(0, 3) || []
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-rose-500 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold">Your Wishlist Highlights</h1>
        <div className="text-6xl mb-6">💝</div>
        
        <div className="glass rounded-lg p-6 mb-6">
          <div className="text-4xl font-bold">{totalSaved}</div>
          <div className="text-lg">Products Saved</div>
        </div>
        
        {topSavedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Top Saved Items:</h2>
            <div className="grid gap-4 max-w-md">
              {topSavedProducts.map((product, index) => (
                <div key={product.id} className="glass rounded-lg p-4">
                  <div className="text-sm font-semibold">#{index + 1}</div>
                  <div className="text-lg">{product.title}</div>
                  <div className="text-sm opacity-90">Saved item</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onPrevious}
            className="glass text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Recent Activity Slide
function RecentActivitySlide({ onNext, onPrevious, currentSlide, totalSlides }: SlideProps) {
  const { products: recentProducts } = useRecentProducts()
  const { shops: recentShops } = useRecentShops()
  
  const recentProductsCount = recentProducts?.length || 0
  const recentShopsCount = recentShops?.length || 0
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold">Your Recent Activity</h1>
        <div className="text-6xl mb-6">🔥</div>
        
        <div className="space-y-6">
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold">{recentProductsCount}</div>
            <div className="text-lg">Products Viewed Recently</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold">{recentShopsCount}</div>
            <div className="text-lg">Shops Visited Recently</div>
          </div>
        </div>
        
        {recentProducts && recentProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Last Product You Viewed:</h3>
            <div className="glass rounded-lg p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium">{recentProducts[0].title}</div>
              <div className="text-sm opacity-90">Recently viewed</div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onPrevious}
            className="glass text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Followed Shops Slide
function FollowedShopsSlide({ onNext, onPrevious, currentSlide, totalSlides }: SlideProps) {
  const { shops: followedShops } = useFollowedShops()
  
  const totalFollowed = followedShops?.length || 0
  const topShops = followedShops?.slice(0, 3) || []
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold">Your Favorite Shops</h1>
        <div className="text-6xl mb-6">🏪</div>
        
        <div className="glass rounded-lg p-6 mb-6">
          <div className="text-4xl font-bold">{totalFollowed}</div>
          <div className="text-lg">Shops Following</div>
        </div>
        
        {topShops.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Top Followed Shops:</h2>
            <div className="space-y-3 max-w-md">
              {topShops.map((shop, index) => (
                <div key={shop.id} className="glass rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">#{index + 1}</div>
                    <div>
                      <div className="text-lg font-medium">{shop.name}</div>
                      <div className="text-sm opacity-90 truncate">Followed Shop</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onPrevious}
            className="glass text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Shopping Personality Slide
function PersonalitySlide({ onNext, onPrevious, currentSlide, totalSlides }: SlideProps) {
  const { buyerAttributes } = useBuyerAttributes()
  const { orders } = useOrders()
  const { products: savedProducts } = useSavedProducts()
  
  // Calculate shopping personality based on data
  const getShoppingPersonality = () => {
    const orderCount = orders?.length || 0
    const savedCount = savedProducts?.length || 0
    const ratio = savedCount > 0 ? orderCount / savedCount : orderCount
    
    if (orderCount >= 10 && ratio > 0.5) {
      return { type: "The Decisive Shopper", emoji: "⚡", description: "You know what you want and you get it!" }
    } else if (savedCount > orderCount * 2) {
      return { type: "The Thoughtful Browser", emoji: "🤔", description: "You love to save items for later consideration." }
    } else if (orderCount >= 5) {
      return { type: "The Regular Shopper", emoji: "🛒", description: "Shopping is a regular part of your routine." }
    } else if (savedCount > 5) {
      return { type: "The Wishlist Curator", emoji: "⭐", description: "You're building the perfect wishlist!" }
    } else {
      return { type: "The Explorer", emoji: "🔍", description: "You're just getting started on your shopping journey." }
    }
  }
  
  const personality = getShoppingPersonality()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold">Your Shopping Personality</h1>
        <div className="text-8xl mb-6 animate-pulse-slow">{personality.emoji}</div>
        
        <div className="glass rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">{personality.type}</h2>
          <p className="text-lg opacity-90">{personality.description}</p>
        </div>
        
        {buyerAttributes && (
          <div className="mt-6 space-y-3">
            {buyerAttributes.genderAffinity && (
              <div className="glass rounded-lg p-3">
                <span className="text-sm opacity-75">Style Preference: </span>
                <span className="font-semibold capitalize">{buyerAttributes.genderAffinity}</span>
              </div>
            )}
            {buyerAttributes.categoryAffinities && buyerAttributes.categoryAffinities.length > 0 && (
              <div className="glass rounded-lg p-3">
                <span className="text-sm opacity-75">Top Category: </span>
                <span className="font-semibold capitalize">{String(buyerAttributes.categoryAffinities[0])}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onPrevious}
            className="glass text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Final Summary Slide
function SummarySlide({ onPrevious, currentSlide, totalSlides }: SlideProps) {
  const { orders } = useOrders()
  const { products: savedProducts } = useSavedProducts()
  const { shops: followedShops } = useFollowedShops()
  
  const totalSpent = (orders?.length || 0) * 50 // Mock data
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-blue-600 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold">Your 2025 Shopping Journey</h1>
        <div className="text-6xl mb-6">🎉</div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
            <div className="text-sm">Orders</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold">${totalSpent.toFixed(0)}</div>
            <div className="text-sm">Spent</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold">{savedProducts?.length || 0}</div>
            <div className="text-sm">Saved</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold">{followedShops?.length || 0}</div>
            <div className="text-sm">Shops</div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Thanks for shopping with us!
          </h2>
          <p className="opacity-90">
            Here's to another year of amazing discoveries and great finds! 🛍️
          </p>
        </div>
        
        <button
          onClick={onPrevious}
          className="mt-8 glass text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
        >
          Previous
        </button>
      </div>
      <div className="absolute bottom-6 text-sm opacity-75">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}

// Main Shopify Wrapped Component
export function ShopifyWrapped() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    WelcomeSlide,
    OrdersSummarySlide,
    SavedProductsSlide,
    RecentActivitySlide,
    FollowedShopsSlide,
    PersonalitySlide,
    SummarySlide
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
