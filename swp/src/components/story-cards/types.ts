import {
    Order,
    Product,
    Shop,
    BuyerAttributes,
} from "../../utils/shoppingAnalytics";

export interface StoryCardData {
    orders: Order[];
    savedProducts: Product[];
    followedShops: Shop[];
    curatedProducts: Product[];
    recentProducts: Product[];
    buyerAttributes: BuyerAttributes | null;
    recentShops: Shop[];
    // new fields from Shopify hooks
    recommendedProducts?: Product[];
    productList?: Product[];
    productLists?: Product[][];
}

export interface StoryCardProps {
    currentSlide: number;
    totalSlides: number;
    data: StoryCardData;
    onNext?: () => void; // Optional navigation function for welcome card
    onJumpToSlide?: (slideIndex: number) => void; // Optional function to jump to specific slide
}

export interface CardData {
    title: string;
    emoji: string;
    value: string | number;
    description: string;
    gradient: string;
}
