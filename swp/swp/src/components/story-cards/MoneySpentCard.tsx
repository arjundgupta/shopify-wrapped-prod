import { StoryCardProps } from './types'
import { calculateMoneySpent } from '../../utils/shoppingAnalytics'

export function MoneySpentCard({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  const totalSpent = calculateMoneySpent(data.orders)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex flex-col justify-center items-center text-white p-6">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-float delay-1000"></div>
        
        {/* Money symbols floating */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-green-400/20 animate-float-slow">💰</div>
        <div className="absolute top-1/3 right-1/4 text-4xl text-emerald-400/20 animate-float-slow delay-500">💸</div>
        <div className="absolute bottom-1/3 left-1/3 text-5xl text-teal-400/20 animate-float-slow delay-1000">🤑</div>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced title with better positioning */}
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-6">
          Money Spent This Year
        </h1>
        
        {/* Stunning main emoji with glow effect */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce-gentle filter drop-shadow-2xl">💸</div>
          <div className="absolute inset-0 text-9xl animate-bounce-gentle blur-xl opacity-30">💸</div>
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        {/* Enhanced main stats card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-lg shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-6">
            {/* Main amount with enhanced styling */}
            <div className="relative">
              <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent animate-shimmer leading-none">
                ${totalSpent.toFixed(2)}
              </div>
              <div className="absolute inset-0 text-7xl md:text-8xl font-black text-green-300/20 blur-lg animate-pulse">
                ${totalSpent.toFixed(2)}
              </div>
            </div>
            
            {/* Enhanced message with better typography */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                {totalSpent > 1000 
                  ? "🌟 You've invested in quality experiences and products that bring you joy!"
                  : totalSpent > 500 
                    ? "✨ A thoughtful approach to spending - you know what you value!"
                    : "🎯 Mindful spending - you're great at making every dollar count!"
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced secondary stat */}
        {data.orders.length > 0 && (
          <div className="backdrop-blur-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-white/20 rounded-2xl p-6 max-w-xs mx-auto shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center space-y-2">
              <div className="text-sm text-white/70 font-medium uppercase tracking-wider">Average per order</div>
              <div className="text-3xl font-bold text-emerald-200">
                ${(totalSpent / data.orders.length).toFixed(2)}
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
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
            className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">Next →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Enhanced progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-sm bg-black/20 px-6 py-3 rounded-full text-white/70 font-medium border border-white/10">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none"></div>
    </div>
  )
}
