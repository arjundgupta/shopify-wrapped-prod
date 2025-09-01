import { StoryCardProps } from './types'
import { calculateOrderStats } from '../../utils/shoppingAnalytics'

export function OrdersPlacedCard({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  const orderStats = calculateOrderStats(data.orders)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col justify-center items-center text-white p-6">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-float delay-700"></div>
        
        {/* Floating package icons */}
        <div className="absolute top-1/4 left-1/5 text-6xl text-blue-400/20 animate-float-slow">📦</div>
        <div className="absolute top-1/3 right-1/4 text-4xl text-indigo-400/20 animate-float-slow delay-500">🛍️</div>
        <div className="absolute bottom-1/3 left-1/3 text-5xl text-purple-400/20 animate-float-slow delay-1000">🎁</div>
        <div className="absolute bottom-1/4 right-1/3 text-3xl text-pink-400/20 animate-float-slow delay-1500">📋</div>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced title */}
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-6">
          Orders Placed
        </h1>
        
        {/* Stunning main icon */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce-gentle filter drop-shadow-2xl">📦</div>
          <div className="absolute inset-0 text-9xl animate-bounce-gentle blur-xl opacity-30">📦</div>
          {/* Pulsing rings around the icon */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border border-indigo-400/20 animate-pulse"></div>
        </div>
        
        {/* Enhanced main stats card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-lg shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-6">
            {/* Main number with counter animation effect */}
            <div className="relative">
              <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent animate-number-pop leading-none">
                {orderStats.totalOrders}
              </div>
              <div className="absolute inset-0 text-8xl md:text-9xl font-black text-blue-300/20 blur-lg animate-pulse">
                {orderStats.totalOrders}
              </div>
            </div>
            
            {/* Enhanced message */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                {orderStats.totalOrders > 50 
                  ? "🌟 You're a shopping superstar! So many exciting deliveries to look forward to."
                  : orderStats.totalOrders > 20 
                    ? "⭐ A steady shopper! You know how to find what you need."
                    : orderStats.totalOrders > 5
                      ? "🎯 Quality over quantity - you make thoughtful purchasing decisions!"
                      : "✨ Every order tells a story. You're selective with your choices!"
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced busiest month card */}
        {orderStats.busiest_month && (
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-white/20 rounded-2xl p-6 max-w-sm mx-auto shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center space-y-3">
              <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                🔥 Busiest Shopping Month
              </div>
              <div className="text-3xl font-bold text-blue-200">
                {orderStats.busiest_month}
              </div>
              <div className="text-lg text-white/80">
                {orderStats.orders_in_busiest} orders
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto"></div>
            </div>
          </div>
        )}
        
        {/* Enhanced navigation buttons */}
        <div className="flex gap-6 mt-10">
          <button
            onClick={onPrevious}
            className="group backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">← Previous</span>
          </button>
          <button
            onClick={onNext}
            className="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">Next →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Enhanced progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-sm bg-black/20 px-6 py-3 rounded-full text-white/70 font-medium border border-white/10">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>
    </div>
  )
}
