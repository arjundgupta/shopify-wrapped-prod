import {
  useCurrentUser,
  useOrders,
  useSavedProducts,
  useRecentProducts,
  useFollowedShops,
  useBuyerAttributes,
  useRecentShops,
} from '@shopify/shop-minis-react'

export interface ShopifyWrappedData {
  user: any
  orders: any[]
  savedProducts: any[]
  recentProducts: any[]
  followedShops: any[]
  recentShops: any[]
  buyerAttributes: any
  isLoading: boolean
  totalSpent: number
  avgOrderValue: number
}

export function useShopifyWrappedData(): ShopifyWrappedData {
  const currentUserData = useCurrentUser()
  const { orders } = useOrders()
  const { products: savedProducts } = useSavedProducts()
  const { products: recentProducts } = useRecentProducts()
  const { shops: followedShops } = useFollowedShops()
  const { shops: recentShops } = useRecentShops()
  const { buyerAttributes } = useBuyerAttributes()

  // Calculate derived data - using safer approach for order totals
  const totalSpent = orders?.reduce((sum, order) => {
    // Try different possible price properties
    const price = order.total?.amount || order.totalPrice || order.price || 0
    return sum + (typeof price === 'string' ? parseFloat(price) : price)
  }, 0) || 0

  const avgOrderValue = orders?.length ? totalSpent / orders.length : 0

  // Determine loading state - we'll consider it loading if any critical data is still loading
  const isLoading = !currentUserData && !orders && !savedProducts

  return {
    user: currentUserData,
    orders: orders || [],
    savedProducts: savedProducts || [],
    recentProducts: recentProducts || [],
    followedShops: followedShops || [],
    recentShops: recentShops || [],
    buyerAttributes,
    isLoading,
    totalSpent,
    avgOrderValue
  }
}

// Helper function to get shopping personality
export function getShoppingPersonality(data: ShopifyWrappedData) {
  const orderCount = data.orders.length
  const savedCount = data.savedProducts.length
  const ratio = savedCount > 0 ? orderCount / savedCount : orderCount

  if (orderCount >= 10 && ratio > 0.5) {
    return { 
      type: "The Decisive Shopper", 
      emoji: "⚡", 
      description: "You know what you want and you get it!",
      color: "from-yellow-400 to-orange-500"
    }
  } else if (savedCount > orderCount * 2) {
    return { 
      type: "The Thoughtful Browser", 
      emoji: "🤔", 
      description: "You love to save items for later consideration.",
      color: "from-blue-400 to-indigo-500"
    }
  } else if (orderCount >= 5) {
    return { 
      type: "The Regular Shopper", 
      emoji: "🛒", 
      description: "Shopping is a regular part of your routine.",
      color: "from-green-400 to-emerald-500"
    }
  } else if (savedCount > 5) {
    return { 
      type: "The Wishlist Curator", 
      emoji: "⭐", 
      description: "You're building the perfect wishlist!",
      color: "from-purple-400 to-pink-500"
    }
  } else {
    return { 
      type: "The Explorer", 
      emoji: "🔍", 
      description: "You're just getting started on your shopping journey.",
      color: "from-teal-400 to-cyan-500"
    }
  }
}

// Helper function to get fun stats
export function getFunStats(data: ShopifyWrappedData) {
  const stats = []

  if (data.orders.length > 0) {
    const mostRecentOrder = data.orders[0]
    if (mostRecentOrder?.createdAt) {
      const daysSinceLastOrder = Math.floor(
        (Date.now() - new Date(mostRecentOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      stats.push({
        label: "Days since last order",
        value: daysSinceLastOrder,
        emoji: "📅"
      })
    }
  }

  if (data.savedProducts.length > 0) {
    stats.push({
      label: "Items on wishlist",
      value: data.savedProducts.length,
      emoji: "💫"
    })
  }

  if (data.followedShops.length > 0) {
    stats.push({
      label: "Shops you follow",
      value: data.followedShops.length,
      emoji: "🏪"
    })
  }

  if (data.avgOrderValue > 0) {
    stats.push({
      label: "Average order value",
      value: `$${data.avgOrderValue.toFixed(2)}`,
      emoji: "💰"
    })
  }

  return stats
}
