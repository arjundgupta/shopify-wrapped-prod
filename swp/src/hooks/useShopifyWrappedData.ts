import {
  useOrders,
  useSavedProducts,
  useRecentProducts,
  useFollowedShops,
  useBuyerAttributes,
  useRecentShops,
  useCuratedProducts,
  useRecommendedProducts,
  useProductList,
  useProductLists,
} from '@shopify/shop-minis-react'
import type { StoryCardData } from '../components/story-cards/types'
import type { Product } from '../utils/shoppingAnalytics'

export function useShopifyWrappedData(): StoryCardData {
  const { orders } = useOrders()
  const { products: savedProducts } = useSavedProducts()
  const { products: recentProducts } = useRecentProducts()
  const { shops: followedShops } = useFollowedShops()
  const { shops: recentShops } = useRecentShops()
  const { buyerAttributes } = useBuyerAttributes()

  // Curated products hook can throw if used outside provider - keep try/catch
  let curatedProducts: Product[] = [];

  // Helper to normalize various hook return shapes into Product[]
  const normalizeProducts = (res: any): Product[] => {
      if (!res) return [];
      if (Array.isArray(res)) return res as Product[];
      if (res.products && Array.isArray(res.products))
          return res.products as Product[];
      if (res.items && Array.isArray(res.items))
          return res.items as Product[];
      if (res.results && Array.isArray(res.results))
          return res.results as Product[];
      return [];
  };

  const normalizeProductLists = (res: any): Product[][] => {
      if (!res) return [];
      if (Array.isArray(res)) {
          // Could be array of products or array of lists
          if (res.length === 0) return [];
          if (Array.isArray(res[0])) return res as Product[][]; // already arrays
          // array of list objects
          return (res as any[]).map((l) => normalizeProducts(l));
      }
      if (res.lists && Array.isArray(res.lists))
          return res.lists.map((l: any) => normalizeProducts(l));
      if (res.productLists && Array.isArray(res.productLists))
          return res.productLists.map((l: any) => normalizeProducts(l));
      return [];
  };

  try {
      const result = useCuratedProducts({ handle: "featured", first: 10 });
      curatedProducts = normalizeProducts(result);
  } catch (error) {
      console.warn("Curated products not available:", error);
      curatedProducts = [];
  }

  // Recommended products and product lists (some hooks may not be available in all SDK versions)
  let recommendedProducts: Product[] = [];
  let productList: Product[] = [];
  let productLists: Product[][] = [];

  try {
      const res = useRecommendedProducts?.();
      recommendedProducts = normalizeProducts(res);
  } catch (error) {
      console.warn("Recommended products not available:", error);
      recommendedProducts = [];
  }

  try {
      const res = useProductList?.();
      productList = normalizeProducts(res);
  } catch (error) {
      console.warn("useProductList not available:", error);
      productList = [];
  }

  try {
      const res = useProductLists?.();
      productLists = normalizeProductLists(res);
  } catch (error) {
      console.warn("useProductLists not available:", error);
      productLists = [];
  }

  return {
    orders: (orders as any) || [],
    savedProducts: savedProducts || [],
    followedShops: followedShops || [],
    curatedProducts: curatedProducts || [],
    recentProducts: recentProducts || [],
    buyerAttributes: buyerAttributes || null,
    recentShops: recentShops || [],
    recommendedProducts: recommendedProducts || [],
    productList: productList || [],
    productLists: productLists || [],
  }
}
