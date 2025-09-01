import { StoryCardProps } from './types'
import { calculateSavingsStats } from '../../utils/shoppingAnalytics'

export function MoneySavedCard({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  const savingsStats = calculateSavingsStats(data.orders)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex flex-col justify-center items-center text-white p-6">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-12 w-64 h-64 bg-gradient-to-r from-emerald-500/25 to-green-500/25 rounded-full blur-3xl animate-float delay-500"></div>
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        
        {/* Floating money and savings icons */}
        <div className="absolute top-1/5 right-1/6 text-7xl text-emerald-400/25 animate-float-slow">💰</div>
        <div className="absolute top-2/5 left-1/6 text-5xl text-green-400/25 animate-float-slow delay-700">🏷️</div>
        <div className="absolute bottom-1/4 center text-4xl text-teal-400/25 animate-float-slow delay-1200">💳</div>
        <div className="absolute bottom-1/3 right-1/5 text-6xl text-cyan-400/25 animate-float-slow delay-300">🎯</div>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced title */}
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent mb-6">
          Money Saved
        </h1>
        
        {/* Stunning main icon with sparkle effect */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce-gentle filter drop-shadow-2xl">💰</div>
          <div className="absolute inset-0 text-9xl animate-bounce-gentle blur-xl opacity-40">💰</div>
          {/* Sparkle effects */}
          <div className="absolute -top-4 -right-4 text-3xl animate-sparkle">✨</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-sparkle delay-300">�</div>
          <div className="absolute top-2 -right-8 text-xl animate-sparkle delay-700">⭐</div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping"></div>
        </div>
        
        {/* Enhanced main stats card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-lg shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-6">
            {/* Main savings amount */}
            <div className="relative">
              <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent animate-number-pop leading-none">
                ${savingsStats.totalSaved.toFixed(0)}
              </div>
              <div className="absolute inset-0 text-7xl md:text-8xl font-black text-emerald-300/20 blur-lg animate-pulse">
                ${savingsStats.totalSaved.toFixed(0)}
              </div>
            </div>
            
            {/* Enhanced message */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                {savingsStats.totalSaved > 500 
                  ? "🌟 Incredible savings! You're a master deal hunter who knows how to stretch every dollar."
                  : savingsStats.totalSaved > 200 
                    ? "💚 Great job finding deals! Your smart shopping saved you serious money."
                    : savingsStats.totalSaved > 50
                      ? "✨ Nice savings! Every dollar saved is a dollar earned."
                      : "🎯 Keep an eye out for deals - there are savings waiting for you!"
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced savings stats */}
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          <div className="backdrop-blur-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-white/20 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center space-y-3">
              <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                💳 Discount Orders
              </div>
              <div className="text-3xl font-bold text-emerald-200">
                {savingsStats.discountedOrders}
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mx-auto"></div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-white/20 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center space-y-3">
              <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                📊 Avg. Discount
              </div>
              <div className="text-3xl font-bold text-green-200">
                ${savingsStats.averageDiscount.toFixed(0)}
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
        
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
            className="group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">Next →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
