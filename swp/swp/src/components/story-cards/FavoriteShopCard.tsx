import { StoryCardProps } from './types'
import { findFavoriteShop } from '../../utils/shoppingAnalytics'
import { InteractiveProgressIndicator } from './InteractiveProgressIndicator'

export function FavoriteShopCard({ currentSlide, totalSlides, data, onJumpToSlide }: StoryCardProps) {
  const favoriteShop = findFavoriteShop(data.orders, data.followedShops)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 flex flex-col justify-center items-center text-white p-6">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-12 right-10 w-80 h-80 bg-gradient-to-r from-rose-500/25 to-pink-500/25 rounded-full blur-3xl animate-float delay-200"></div>
        <div className="absolute bottom-12 left-16 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-3xl animate-float delay-800"></div>
        
        {/* Floating shop and heart icons */}
        <div className="absolute top-1/6 left-1/5 text-6xl text-rose-400/30 animate-float-slow">🏪</div>
        <div className="absolute top-1/3 right-1/4 text-7xl text-pink-400/25 animate-float-slow delay-500">❤️</div>
        <div className="absolute bottom-1/4 center text-5xl text-purple-400/25 animate-float-slow delay-1000">🛍️</div>
        <div className="absolute bottom-1/3 left-1/4 text-4xl text-violet-400/30 animate-float-slow delay-1500">⭐</div>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced title */}
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-rose-200 to-pink-200 bg-clip-text text-transparent mb-6">
          Your Favorite Shop
        </h1>
        
        {/* Stunning main icon with heart effect */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce-gentle filter drop-shadow-2xl">🏪</div>
          <div className="absolute inset-0 text-9xl animate-bounce-gentle blur-xl opacity-40">🏪</div>
          {/* Floating hearts */}
          <div className="absolute -top-6 -right-6 text-4xl text-pink-400/70 animate-heartbeat">💖</div>
          <div className="absolute -bottom-4 -left-4 text-3xl text-rose-400/60 animate-heartbeat delay-300">💝</div>
          <div className="absolute top-4 -right-10 text-2xl text-purple-400/50 animate-heartbeat delay-700">💕</div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/40 animate-ping"></div>
        </div>
        
        {/* Enhanced main stats card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-lg shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-6">
            {favoriteShop.shopName ? (
              <>
                {/* Shop name */}
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-400 via-pink-300 to-purple-300 bg-clip-text text-transparent leading-tight mb-4">
                    {favoriteShop.shopName}
                  </div>
                  <div className="absolute inset-0 text-4xl md:text-5xl font-black text-rose-300/15 blur-lg">
                    {favoriteShop.shopName}
                  </div>
                </div>
                
                {/* Order count with gradient background */}
                <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-2xl p-6 border border-rose-400/30">
                  <div className="text-6xl md:text-7xl font-black text-rose-200 mb-2 animate-number-pop">
                    {favoriteShop.orderCount}
                  </div>
                  <div className="text-lg text-white/80 font-medium">
                    orders placed here
                  </div>
                  
                  {/* Total spent if available */}
                  {favoriteShop.totalSpent > 0 && (
                    <div className="mt-4 text-pink-200 text-xl font-semibold">
                      ${favoriteShop.totalSpent.toFixed(0)} spent
                    </div>
                  )}
                </div>
                
                {/* Enhanced message */}
                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    {favoriteShop.orderCount > 10 
                      ? "💕 True loyalty! You've found your go-to shop and they've earned your trust."
                      : favoriteShop.orderCount > 5 
                        ? "⭐ A solid favorite! This shop clearly knows how to keep you happy."
                        : favoriteShop.orderCount > 2
                          ? "🌟 Building a relationship! This shop is winning you over."
                          : "✨ A new favorite in the making! Sometimes love starts with just one perfect order."
                    }
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-rose-400 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Exploring
                </div>
                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    🌈 You love variety! Each shop offers something unique, and you're exploring all the amazing options out there.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Following badge */}
        {favoriteShop.isFollowed && (
          <div className="backdrop-blur-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-6 max-w-sm mx-auto shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center space-y-3">
              <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                💝 Following This Shop
              </div>
              <div className="text-2xl font-bold text-rose-200">
                True Loyalty
              </div>
              <div className="text-sm text-white/80">
                You've got great taste in shops!
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto"></div>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Interactive progress indicator */}
      <InteractiveProgressIndicator
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onJumpToSlide={onJumpToSlide}
      />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>
    </div>
  )
}
