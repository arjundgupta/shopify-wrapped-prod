import { StoryCardProps } from './types'
import { findTopProduct } from '../../utils/shoppingAnalytics'

export function TopProductCard({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  const topProduct = findTopProduct(data.orders, data.curatedProducts, data.savedProducts)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 flex flex-col justify-center items-center text-white p-6">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-violet-500/25 to-indigo-500/25 rounded-full blur-3xl animate-float delay-400"></div>
        <div className="absolute bottom-20 right-12 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float delay-900"></div>
        
        {/* Floating product and star icons */}
        <div className="absolute top-1/5 right-1/6 text-7xl text-violet-400/30 animate-float-slow">⭐</div>
        <div className="absolute top-2/5 left-1/6 text-6xl text-indigo-400/25 animate-float-slow delay-600">🏆</div>
        <div className="absolute bottom-1/4 center text-5xl text-blue-400/25 animate-float-slow delay-1200">🎯</div>
        <div className="absolute bottom-1/3 right-1/5 text-4xl text-cyan-400/30 animate-float-slow delay-300">✨</div>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced title */}
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent mb-6">
          Your Top Product
        </h1>
        
        {/* Stunning main icon with star effect */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce-gentle filter drop-shadow-2xl">⭐</div>
          <div className="absolute inset-0 text-9xl animate-bounce-gentle blur-xl opacity-50">⭐</div>
          {/* Surrounding sparkles */}
          <div className="absolute -top-8 -right-8 text-4xl text-yellow-400/60 animate-sparkle">✨</div>
          <div className="absolute -bottom-6 -left-6 text-3xl text-violet-400/50 animate-sparkle delay-500">💫</div>
          <div className="absolute top-6 -right-12 text-2xl text-indigo-400/40 animate-sparkle delay-1000">⭐</div>
          <div className="absolute -top-4 left-8 text-xl text-blue-400/30 animate-sparkle delay-1500">✨</div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-violet-400/40 animate-ping"></div>
        </div>
        
        {/* Enhanced main stats card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-lg shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-6">
            {topProduct.productName ? (
              <>
                {/* Product name */}
                <div className="relative">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-300 bg-clip-text text-transparent leading-tight mb-6">
                    {topProduct.productName}
                  </div>
                  <div className="absolute inset-0 text-3xl md:text-4xl font-black text-violet-300/15 blur-lg">
                    {topProduct.productName}
                  </div>
                </div>
                
                {/* Purchase info with gradient background */}
                {topProduct.purchaseCount && topProduct.purchaseCount > 1 && (
                  <div className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl p-6 border border-violet-400/30">
                    <div className="text-5xl md:text-6xl font-black text-violet-200 mb-2 animate-number-pop">
                      {topProduct.purchaseCount}×
                    </div>
                    <div className="text-lg text-white/80 font-medium">
                      purchased multiple times
                    </div>
                  </div>
                )}
                
                {/* Total value if available */}
                {topProduct.totalValue && topProduct.totalValue > 0 && (
                  <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl p-6 border border-indigo-400/30">
                    <div className="text-4xl font-bold text-indigo-200 mb-2">
                      ${topProduct.totalValue.toFixed(0)}
                    </div>
                    <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                      Total Investment
                    </div>
                  </div>
                )}
                
                {/* Enhanced reason message */}
                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    {topProduct.reason === 'purchased_multiple' 
                      ? "🌟 You loved this so much, you bought it multiple times! Clear winner in your shopping journey."
                      : topProduct.reason === 'high_value'
                        ? "💎 Your most valuable purchase! You know quality when you see it."
                        : topProduct.reason === 'saved'
                          ? "💝 You've had this saved - great taste in wishlist items!"
                          : topProduct.reason === 'curated'
                            ? "🎯 Featured in curated collections - you have an eye for trending items!"
                            : "✨ This product caught your attention this year!"
                    }
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
                  Discovering
                </div>
                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    🌈 Keep shopping and saving items - your top product is waiting to be discovered!
                  </p>
                </div>
              </div>
            )}
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
            className="group bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">Next →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
