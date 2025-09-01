import { StoryCardProps } from './types'

export function AllDataSlide({ onNext, onPrevious, currentSlide, totalSlides, data }: StoryCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black flex flex-col justify-center items-center text-white p-6">
      <div className="text-center space-y-6 animate-fadeIn max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">All Your Data</h1>
        <div className="text-6xl mb-6">📋</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="glass rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Orders ({data.orders.length})</h3>
            <div className="text-xs max-h-32 overflow-y-auto space-y-1">
              {data.orders.length > 0 ? data.orders.map((order, i) => (
                <div key={i} className="opacity-75">
                  Order {i + 1}: {order.total_price ? `$${order.total_price}` : 'N/A'}
                </div>
              )) : <div className="opacity-50">No orders found</div>}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Saved Products ({data.savedProducts.length})</h3>
            <div className="text-xs max-h-32 overflow-y-auto space-y-1">
              {data.savedProducts.length > 0 ? data.savedProducts.map((product, i) => (
                <div key={i} className="opacity-75">
                  {product.title || `Product ${i + 1}`}
                </div>
              )) : <div className="opacity-50">No saved products</div>}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Followed Shops ({data.followedShops.length})</h3>
            <div className="text-xs max-h-32 overflow-y-auto space-y-1">
              {data.followedShops.length > 0 ? data.followedShops.map((shop, i) => (
                <div key={i} className="opacity-75">
                  {shop.name || `Shop ${i + 1}`}
                </div>
              )) : <div className="opacity-50">No followed shops</div>}
            </div>
          </div>
          
          <div className="glass rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Curated Products ({data.curatedProducts.length})</h3>
            <div className="text-xs max-h-32 overflow-y-auto space-y-1">
              {data.curatedProducts.length > 0 ? data.curatedProducts.map((product, i) => (
                <div key={i} className="opacity-75">
                  {product.title || `Product ${i + 1}`}
                </div>
              )) : <div className="opacity-50">No curated products</div>}
            </div>
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
            className="bg-white text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
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
