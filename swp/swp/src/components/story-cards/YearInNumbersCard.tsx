import { StoryCardProps } from './types'
import { calculateYearStats } from '../../utils/shoppingAnalytics'
import { InteractiveProgressIndicator } from './InteractiveProgressIndicator'

export function YearInNumbersCard({ currentSlide, totalSlides, data, onJumpToSlide }: StoryCardProps) {
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
      </div>
      
      {/* Interactive progress indicator */}
      <InteractiveProgressIndicator
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onJumpToSlide={onJumpToSlide}
      />
    </div>
  )
}
