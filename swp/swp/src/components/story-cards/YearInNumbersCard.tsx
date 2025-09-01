import { StoryCardProps } from './types'
import { calculateYearStats } from '../../utils/shoppingAnalytics'

export function YearInNumbersCard({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  const yearStats = calculateYearStats(data.orders, data.savedProducts, data.followedShops, data.curatedProducts)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 to-gray-800 flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">Your Year in Numbers</h1>
        <div className="text-8xl mb-6 animate-pulse-slow">📊</div>
        
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold text-blue-300 mb-2">
              {yearStats.totalOrders}
            </div>
            <div className="text-sm opacity-75">Orders Placed</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold text-green-300 mb-2">
              ${yearStats.totalSpent.toFixed(0)}
            </div>
            <div className="text-sm opacity-75">Total Spent</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold text-purple-300 mb-2">
              {yearStats.productsInteractedWith}
            </div>
            <div className="text-sm opacity-75">Products Discovered</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold text-yellow-300 mb-2">
              ${yearStats.totalSaved.toFixed(0)}
            </div>
            <div className="text-sm opacity-75">Money Saved</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold text-pink-300 mb-2">
              {yearStats.shopsFollowed}
            </div>
            <div className="text-sm opacity-75">Shops Followed</div>
          </div>
          
          <div className="glass rounded-lg p-6">
            <div className="text-4xl font-bold text-orange-300 mb-2">
              {yearStats.averageOrderValue.toFixed(0)}
            </div>
            <div className="text-sm opacity-75">Avg Order Value</div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6 mt-6 max-w-md">
          <div className="text-lg opacity-90">
            {yearStats.totalOrders > 20 
              ? "What an active year of shopping! You've discovered so many great products."
              : yearStats.totalOrders > 10 
                ? "A solid year of thoughtful shopping and product discovery."
                : "Quality over quantity - every purchase and save was intentional!"
            }
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
            className="bg-white text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
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
