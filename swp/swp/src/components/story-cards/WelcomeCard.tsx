import { StoryCardProps } from './types'

export function WelcomeCard({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col justify-center items-center text-white p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-float delay-0"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-yellow-400/40 rounded-full animate-float delay-300"></div>
        <div className="absolute bottom-40 left-16 w-3 h-3 bg-pink-400/30 rounded-full animate-float delay-700"></div>
        <div className="absolute bottom-60 right-12 w-2 h-2 bg-blue-400/40 rounded-full animate-float delay-1000"></div>
      </div>
      
      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced emoji with glow effect */}
        <div className="relative">
          <div className="text-9xl mb-6 animate-bounce-gentle filter drop-shadow-2xl">🎉</div>
          <div className="absolute inset-0 text-9xl mb-6 animate-bounce-gentle blur-lg opacity-50">🎉</div>
        </div>
        
        {/* Enhanced title with better typography */}
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Your Shopping
          </h1>
          <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-shimmer leading-tight">
            Wrapped 2025
          </h2>
        </div>
        
        {/* Enhanced glass card with better backdrop */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md mt-8 shadow-2xl ring-1 ring-white/10">
          <p className="text-xl font-medium text-white/90 leading-relaxed tracking-wide">
            Ready to discover your shopping story? 
            <span className="block mt-2 text-gradient">
              Let's dive into your year of amazing finds, 
              smart saves, and shopping adventures!
            </span>
          </p>
        </div>
        
        {/* Enhanced CTA button */}
        <div className="mt-12">
          <button
            onClick={onNext}
            className="group relative bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-16 py-5 rounded-full text-2xl font-bold overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Let's Go! 
              <span className="text-3xl group-hover:animate-bounce">🚀</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 animate-pulse-ring"></div>
          </button>
        </div>
        
        {/* Enhanced instruction text */}
        <div className="mt-8 text-white/60 font-medium">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>👆</span>
            <span>Swipe or tap to navigate through your story</span>
            <span>👆</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none"></div>
    </div>
  )
}
