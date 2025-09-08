import { useState, useEffect } from "react";
import {
    useOrders,
    useSavedProducts,
    useFollowedShops,
    useCuratedProducts,
    useRecentProducts,
    useBuyerAttributes,
    useRecentShops,
    useCurrentUser,
    useRecommendedProducts,
    useProductList,
    useProductLists,
} from "@shopify/shop-minis-react";
import { DebugPanel } from "./DebugPanel";
import type { StoryCardData } from "./story-cards/types";
import type { Product } from "../utils/shoppingAnalytics";

// Import all story cards
import { WelcomeCard } from "./story-cards/WelcomeCard";
import { MoneySpentCard } from "./story-cards/MoneySpentCard";
import { OrdersPlacedCard } from "./story-cards/OrdersPlacedCard";
import { MoneySavedCard } from "./story-cards/MoneySavedCard";
import { FavoriteShopCard } from "./story-cards/FavoriteShopCard";
import { TopProductCard } from "./story-cards/TopProductCard";
import { ShoppingPersonaCard } from "./story-cards/ShoppingPersonaCard";
import { YearInNumbersCard } from "./story-cards/YearInNumbersCard";
import { AllDataSlide } from "./story-cards/AllDataSlide";

// Main Shopify Wrapped Component
export function ShopifyWrapped() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fetch all data with error handling
    // Shopify SDK hooks: fetch user, orders, saved/recent products, followed/recent shops, buyer attributes
    // Hooks return different shapes depending on the SDK — call them as in other files in the repo
    const currentUser = useCurrentUser();
    const { orders } = useOrders();
    const { products: savedProducts } = useSavedProducts();
    const { products: recentProducts } = useRecentProducts();
    const { shops: followedShops } = useFollowedShops();
    const { shops: recentShops } = useRecentShops();
    const { buyerAttributes } = useBuyerAttributes();

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

    // Prepare data for story cards
    const storyData: StoryCardData = {
        user: currentUser || null,
        orders: orders || [],
        savedProducts: savedProducts || [],
        followedShops: followedShops || [],
        curatedProducts: curatedProducts || [],
        recentProducts: recentProducts || [],
        buyerAttributes: buyerAttributes || null,
        recentShops: recentShops || [],
        // newly added
        recommendedProducts: recommendedProducts || [],
        productList: productList || [],
        productLists: productLists || [],
    };

    // Define slide components array
    const slides = [
        WelcomeCard,
        MoneySpentCard,
        OrdersPlacedCard,
        MoneySavedCard,
        FavoriteShopCard,
        TopProductCard,
        ShoppingPersonaCard,
        YearInNumbersCard,
        AllDataSlide,
    ];

    const totalSlides = slides.length;

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const previousSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const jumpToSlide = (slideIndex: number) => {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            setCurrentSlide(slideIndex);
        }
    };

    const CurrentSlideComponent = slides[currentSlide];

    // Handle swipe gestures
    useEffect(() => {
        let startX = 0;
        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only register horizontal swipes (not vertical scrolling)
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    // Swipe left - next slide
                    nextSlide();
                } else if (diffX < -50) {
                    // Swipe right - previous slide
                    previousSlide();
                }
            }
        };

        // Handle keyboard navigation
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                nextSlide();
            } else if (e.key === "ArrowLeft") {
                previousSlide();
            }
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="relative overflow-hidden">
            <CurrentSlideComponent
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                data={storyData}
                onNext={currentSlide === 0 ? nextSlide : undefined}
                onJumpToSlide={jumpToSlide}
            />

            {/* Progress bar */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`w-8 h-1 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "bg-white"
                                    : "bg-white/30"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Debug panel (separate component) */}
            <DebugPanel
                storyData={storyData}
                currentSlide={currentSlide}
                slidesCount={totalSlides}
            />
        </div>
    );
}
