import { StoryCardProps } from './types'
import { determineShoppingPersona } from '../../utils/shoppingAnalytics'
import { InteractiveProgressIndicator } from './InteractiveProgressIndicator'

export function ShoppingPersonaCard({ currentSlide, totalSlides, data, onJumpToSlide }: StoryCardProps) {
  const persona = determineShoppingPersona(data.orders, data.savedProducts, data.followedShops, data.curatedProducts)
  
  const personaEmojis: { [key: string]: string } = {
    'The Trendsetter': '🌟',
    'The Loyal Shopper': '💎',
    'The Deal Hunter': '🎯',
    'The Curator': '🎨',
    'The Explorer': '🔍',
    'The Minimalist': '✨',
    'The Window Shopper': '👀',
    'The Spontaneous Shopper': '⚡'
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900 flex flex-col justify-center items-center text-white p-6">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-14 right-8 w-80 h-80 bg-gradient-to-r from-purple-500/25 to-fuchsia-500/25 rounded-full blur-3xl animate-float delay-600"></div>
        <div className="absolute bottom-16 left-12 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-float delay-1100"></div>
        
        {/* Floating persona icons */}
        <div className="absolute top-1/6 left-1/5 text-6xl text-purple-400/30 animate-float-slow">🌟</div>
        <div className="absolute top-1/3 right-1/4 text-5xl text-fuchsia-400/25 animate-float-slow delay-800">💎</div>
        <div className="absolute bottom-1/4 center text-7xl text-pink-400/25 animate-float-slow delay-1400">🎨</div>
        <div className="absolute bottom-1/3 left-1/4 text-4xl text-rose-400/30 animate-float-slow delay-400">🔍</div>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slideInUp">
        {/* Enhanced title */}
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text text-transparent mb-6">
          Your Shopping Persona
        </h1>
        
        {/* Stunning main icon with dynamic animation */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce-gentle filter drop-shadow-2xl">
            {personaEmojis[persona.title] || '🛍️'}
          </div>
          <div className="absolute inset-0 text-9xl animate-bounce-gentle blur-xl opacity-50">
            {personaEmojis[persona.title] || '🛍️'}
          </div>
          {/* Surrounding personality elements */}
          <div className="absolute -top-8 -right-8 text-3xl text-purple-400/60 animate-sparkle">✨</div>
          <div className="absolute -bottom-6 -left-6 text-4xl text-fuchsia-400/50 animate-sparkle delay-700">💫</div>
          <div className="absolute top-8 -right-12 text-2xl text-pink-400/40 animate-sparkle delay-1200">⭐</div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping"></div>
        </div>
        
        {/* Enhanced main persona card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-lg shadow-2xl ring-1 ring-white/10 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-6">
            {/* Persona title */}
            <div className="relative">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent leading-tight mb-4">
                {persona.title}
              </div>
              <div className="absolute inset-0 text-4xl md:text-5xl font-black text-purple-300/15 blur-lg">
                {persona.title}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                {persona.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced traits showcase */}
        <div className="space-y-4 max-w-lg">
          <div className="text-lg font-semibold text-white/80 mb-4">✨ Your Key Traits</div>
          <div className="grid gap-3">
            {persona.traits.map((trait, index) => (
              <div key={index} className="backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-white/20 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="text-sm font-semibold text-white/90">{trait}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced stats grid */}
        <div className="backdrop-blur-lg bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-6 max-w-sm mx-auto shadow-xl">
          <div className="text-sm text-white/70 font-medium uppercase tracking-wider mb-4 text-center">
            📊 Your Shopping Stats
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-200">{data.orders.length}</div>
              <div className="text-xs text-white/70">Orders</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-fuchsia-200">{data.savedProducts.length}</div>
              <div className="text-xs text-white/70">Saved</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-pink-200">{data.followedShops.length}</div>
              <div className="text-xs text-white/70">Following</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-rose-200">{data.curatedProducts.length}</div>
              <div className="text-xs text-white/70">Curated</div>
            </div>
          </div>
        </div>
        
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
