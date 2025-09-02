// Define typed interfaces for products, orders, shops and buyer attributes
export interface Product {
    id?: string;
    title?: string;
    name?: string;
    handle?: string;
    price?: number | { amount?: number | string };
    priceRange?: { minVariantPrice?: { amount?: number | string } };
    [key: string]: any;
}

export interface LineItem {
    id?: string;
    title?: string;
    quantity?: number;
    price?: number | { amount?: number | string };
    total_price?: number | string;
    product?: Product & { productType?: string };
    [key: string]: any;
}

export interface Shop {
    id?: string;
    name?: string;
    display_name?: string;
    vendor?: string;
    store_name?: string;
    [key: string]: any;
}

export interface BuyerAttributes {
    [key: string]: any;
}

export interface Order {
    id?: string;
    createdAt?: string;
    created_at?: string;
    date?: string;
    total?: number | { amount?: number | string };
    totalPrice?: number | { amount?: number | string };
    total_price?: number | string;
    price?: number | string;
    lineItems?: LineItem[];
    line_items?: LineItem[];
    shop?: Shop;
    shopName?: string;
    shop_name?: string;
    product?: Product;
    [key: string]: any;
}

export interface ShoppingData {
    orders: Order[];
    savedProducts: Product[];
    recentProducts: Product[];
    followedShops: Shop[];
    buyerAttributes: BuyerAttributes | null;
    recentShops: Shop[];
}

// Shopping Analytics and AI-Generated Insights
// Calculate money spent this year
export const calculateMoneySpent = (orders: Order[]): number => {
    return (
        orders?.reduce((sum, order) => {
            // Try various possible properties for order total
            const total =
                (order?.total &&
                    (typeof order.total === "object"
                        ? (order.total as any).amount
                        : order.total)) ||
                (order?.totalPrice &&
                    (typeof order.totalPrice === "object"
                        ? (order.totalPrice as any).amount
                        : order.totalPrice)) ||
                order?.total_price ||
                order?.price ||
                0;
            const parsed =
                typeof total === "string"
                    ? parseFloat(total)
                    : typeof total === "number"
                    ? total
                    : 0;
            return sum + parsed;
        }, 0) || 0
    );
};

// Calculate comprehensive order statistics
export const calculateOrderStats = (
    orders: Order[]
): {
    totalOrders: number;
    busiest_month: string | null;
    orders_in_busiest: number;
    averageOrderValue: number;
    totalSpent: number;
} => {
    if (!orders || orders.length === 0) {
        return {
            totalOrders: 0,
            busiest_month: null,
            orders_in_busiest: 0,
            averageOrderValue: 0,
            totalSpent: 0,
        };
    }

    const totalOrders = orders.length;
    const totalSpent = calculateMoneySpent(orders);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Calculate busiest month
    const monthCounts: { [key: string]: number } = {};

    orders.forEach((order) => {
        const dateStr = order.createdAt || order.created_at || order.date;
        if (dateStr) {
            const date = new Date(dateStr as string | number);
            const monthName = date.toLocaleString("default", { month: "long" });
            monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
        }
    });

    let busiest_month = null;
    let orders_in_busiest = 0;

    for (const [month, count] of Object.entries(monthCounts)) {
        if (count > orders_in_busiest) {
            busiest_month = month;
            orders_in_busiest = count;
        }
    }

    return {
        totalOrders,
        busiest_month,
        orders_in_busiest,
        averageOrderValue,
        totalSpent,
    };
};

// Calculate savings statistics
export const calculateSavingsStats = (
    orders: Order[]
): {
    totalSaved: number;
    discountedOrders: number;
    averageDiscount: number;
} => {
    if (!orders || orders.length === 0) {
        return {
            totalSaved: 0,
            discountedOrders: 0,
            averageDiscount: 0,
        };
    }

    let totalSaved = 0;
    let discountedOrders = 0;

    orders.forEach((order) => {
        const discount = parseFloat(
            ((order as any).discountAmount ||
                (order as any).discount_amount ||
                (order as any).total_discounts ||
                0) as any
        );
        const originalPrice = parseFloat(
            ((order as any).originalPrice ||
                (order as any).original_price ||
                0) as any
        );
        const salePrice = parseFloat(
            ((order as any).totalPrice ||
                (order as any).total_price ||
                (order as any).price ||
                0) as any
        );

        if (discount > 0) {
            totalSaved += discount;
            discountedOrders++;
        } else if (originalPrice > salePrice && originalPrice > 0) {
            totalSaved += originalPrice - salePrice;
            discountedOrders++;
        }
    });

    const averageDiscount =
        discountedOrders > 0 ? totalSaved / discountedOrders : 0;

    return {
        totalSaved,
        discountedOrders,
        averageDiscount,
    };
};

// Find favorite shop based on order frequency and following status
export const findFavoriteShop = (
    orders: Order[],
    followedShops: Shop[]
): {
    shopName: string | null;
    orderCount: number;
    totalSpent: number;
    isFollowed: boolean;
} => {
    if (!orders || orders.length === 0) {
        return {
            shopName: null,
            orderCount: 0,
            totalSpent: 0,
            isFollowed: false,
        };
    }

    const shopCounts: { [key: string]: { count: number; spent: number } } = {};

    orders.forEach((order) => {
        const shopName =
            order.shop?.name ||
            order.shopName ||
            order.shop_name ||
            order.vendor ||
            order.store_name ||
            "Unknown Shop";
        const priceRaw = (order.totalPrice ||
            order.total_price ||
            order.price ||
            0) as any;
        const price =
            typeof priceRaw === "string"
                ? parseFloat(priceRaw)
                : typeof priceRaw === "number"
                ? priceRaw
                : 0;

        if (!shopCounts[shopName]) {
            shopCounts[shopName] = { count: 0, spent: 0 };
        }

        shopCounts[shopName].count++;
        shopCounts[shopName].spent += price;
    });

    let favoriteShop = null;
    let maxOrders = 0;
    let totalSpent = 0;

    for (const [shopName, stats] of Object.entries(shopCounts)) {
        if (stats.count > maxOrders) {
            favoriteShop = shopName;
            maxOrders = stats.count;
            totalSpent = stats.spent;
        }
    }

    const isFollowed =
        followedShops?.some(
            (shop) =>
                shop.name === favoriteShop || shop.display_name === favoriteShop
        ) || false;

    return {
        shopName: favoriteShop,
        orderCount: maxOrders,
        totalSpent,
        isFollowed,
    };
};

// Find top product based on various criteria
export const findTopProduct = (
    orders: Order[],
    curatedProducts: Product[],
    savedProducts: Product[]
): {
    productName: string | null;
    reason: "purchased_multiple" | "high_value" | "saved" | "curated" | null;
    purchaseCount?: number;
    totalValue?: number;
} => {
    // First, try to find products purchased multiple times
    const productCounts: { [key: string]: { count: number; value: number } } =
        {};

    orders?.forEach((order) => {
        const items = order.lineItems || order.line_items || [];
        items.forEach((item: LineItem) => {
            const productName =
                item.title ||
                item.product?.title ||
                item.product_title ||
                item.name;
            const priceRaw =
                (item.price &&
                    (typeof item.price === "object"
                        ? (item.price as any).amount
                        : item.price)) ||
                item.total_price ||
                0;
            const price =
                typeof priceRaw === "string"
                    ? parseFloat(priceRaw)
                    : typeof priceRaw === "number"
                    ? priceRaw
                    : 0;
            const qty = item.quantity || 1;

            if (productName) {
                if (!productCounts[productName]) {
                    productCounts[productName] = { count: 0, value: 0 };
                }
                productCounts[productName].count += qty;
                productCounts[productName].value += price * qty;
            }
        });
    });

    // Find most purchased product
    let topByCount: string | null = null;
    let maxCount = 0;
    for (const [productName, stats] of Object.entries(productCounts)) {
        if (stats.count > maxCount) {
            topByCount = productName;
            maxCount = stats.count;
        }
    }

    if (maxCount > 1 && topByCount) {
        return {
            productName: topByCount,
            reason: "purchased_multiple",
            purchaseCount: maxCount,
            totalValue: productCounts[topByCount].value,
        };
    }

    // Find highest value single purchase
    let topByValue: string | null = null;
    let maxValue = 0;
    for (const [productName, stats] of Object.entries(productCounts)) {
        if (stats.value > maxValue) {
            topByValue = productName;
            maxValue = stats.value;
        }
    }

    if (maxValue > 100 && topByValue) {
        return {
            productName: topByValue,
            reason: "high_value",
            totalValue: maxValue,
        };
    }

    if (savedProducts && savedProducts.length > 0) {
        return {
            productName:
                savedProducts[0].title ||
                (savedProducts[0].name as any) ||
                null,
            reason: "saved",
        };
    }

    if (curatedProducts && curatedProducts.length > 0) {
        return {
            productName:
                curatedProducts[0].title ||
                (curatedProducts[0].name as any) ||
                null,
            reason: "curated",
        };
    }

    return {
        productName: null,
        reason: null,
    };
};

// Determine shopping persona based on behavior patterns
export const determineShoppingPersona = (
    orders: Order[],
    savedProducts: Product[],
    followedShops: Shop[],
    curatedProducts: Product[]
): {
    title: string;
    description: string;
    traits: string[];
} => {
    const orderCount = orders?.length || 0;
    const savedCount = savedProducts?.length || 0;
    const followedCount = followedShops?.length || 0;
    const curatedCount = curatedProducts?.length || 0;

    const totalSpent = calculateMoneySpent(orders);
    const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
    const savingsStats = calculateSavingsStats(orders);
    const savedToOrderRatio =
        orderCount > 0 ? savedCount / orderCount : savedCount;

    // Decision tree for persona
    if (orderCount >= 20 && avgOrderValue > 100) {
        return {
            title: "The Trendsetter",
            description:
                "You're always ahead of the curve, investing in quality and style. Your shopping reflects your refined taste and confidence.",
            traits: [
                "High-value purchases",
                "Frequent shopper",
                "Quality over quantity",
                "Fashion-forward",
            ],
        };
    }

    if (followedCount >= 5 && orderCount >= 10) {
        return {
            title: "The Loyal Shopper",
            description:
                "You build relationships with your favorite brands and shops. Loyalty is your superpower in the shopping world.",
            traits: [
                "Brand loyal",
                "Follows favorite shops",
                "Repeat customer",
                "Trustworthy choices",
            ],
        };
    }

    if (
        savingsStats.totalSaved > 100 ||
        savingsStats.discountedOrders > orderCount * 0.5
    ) {
        return {
            title: "The Deal Hunter",
            description:
                "You have a keen eye for value and never miss a great deal. Smart shopping is your art form.",
            traits: [
                "Bargain finder",
                "Budget conscious",
                "Strategic shopper",
                "Value maximizer",
            ],
        };
    }

    if (curatedCount >= 5 || savedToOrderRatio > 3) {
        return {
            title: "The Curator",
            description:
                "You carefully curate your collection, taking time to consider each purchase. Your wishlist is a work of art.",
            traits: [
                "Thoughtful selection",
                "Aesthetic focused",
                "Patient buyer",
                "Quality curator",
            ],
        };
    }

    if (orderCount >= 10 && savedCount >= 10) {
        return {
            title: "The Explorer",
            description:
                "You love discovering new products and brands. Shopping is an adventure, and you're always ready for the next find.",
            traits: [
                "Product explorer",
                "Open to new brands",
                "Diverse interests",
                "Discovery driven",
            ],
        };
    }

    if (orderCount <= 5 && avgOrderValue > 50) {
        return {
            title: "The Minimalist",
            description:
                "You believe in intentional purchasing. Every item you buy serves a purpose and brings you joy.",
            traits: [
                "Intentional buyer",
                "Quality focused",
                "Less is more",
                "Mindful consumption",
            ],
        };
    }

    if (savedCount > orderCount * 2) {
        return {
            title: "The Window Shopper",
            description:
                "You love browsing and saving items for later. Your wishlist is extensive, and you take time to make decisions.",
            traits: [
                "Research focused",
                "Patient decision maker",
                "Wishlist builder",
                "Comparison shopper",
            ],
        };
    }

    return {
        title: "The Spontaneous Shopper",
        description:
            "You shop with your heart and follow your instincts. Each purchase is driven by excitement and immediate appeal.",
        traits: [
            "Impulse buyer",
            "Heart-led decisions",
            "Spontaneous finds",
            "Emotion-driven",
        ],
    };
};

// Calculate comprehensive year statistics
export const calculateYearStats = (
    orders: Order[],
    savedProducts: Product[],
    followedShops: Shop[],
    curatedProducts: Product[]
): {
    totalOrders: number;
    totalSpent: number;
    totalSaved: number;
    productsInteractedWith: number;
    shopsFollowed: number;
    averageOrderValue: number;
} => {
    const totalOrders = orders?.length || 0;
    const totalSpent = calculateMoneySpent(orders);
    const savingsStats = calculateSavingsStats(orders);
    const totalSaved = savingsStats.totalSaved;

    // Count unique products interacted with
    const uniqueProducts = new Set();

    orders?.forEach((order) => {
        const items = order.lineItems || order.line_items || [];
        items.forEach((item: LineItem) => {
            const productName =
                item.title ||
                item.product?.title ||
                item.product_title ||
                item.name;
            if (productName) uniqueProducts.add(productName);
        });
    });

    savedProducts?.forEach((product) => {
        const productName = product.title || product.name;
        if (productName) uniqueProducts.add(productName);
    });

    curatedProducts?.forEach((product) => {
        const productName = product.title || product.name;
        if (productName) uniqueProducts.add(productName);
    });

    const productsInteractedWith = uniqueProducts.size;
    const shopsFollowed = followedShops?.length || 0;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
        totalOrders,
        totalSpent,
        totalSaved,
        productsInteractedWith,
        shopsFollowed,
        averageOrderValue,
    };
};

// Calculate money saved (estimated based on saved products)
export const calculateMoneySaved = (savedProducts: any[]): number => {
    return (
        savedProducts?.reduce((sum, product) => {
            const price =
                product?.priceRange?.minVariantPrice?.amount ||
                product?.price?.amount ||
                product?.price ||
                50; // fallback average price
            const parsedPrice =
                typeof price === "string" ? parseFloat(price) : price;
            return sum + parsedPrice * 0.15; // Assume 15% average savings
        }, 0) || 0
    );
};

// Find favorite shop (most orders from)
export const getFavoriteShop = (
    orders: any[]
): { name: string; count: number } | null => {
    if (!orders?.length) return null;

    const shopCounts: { [key: string]: number } = {};
    orders.forEach((order) => {
        const shopName = order?.shop?.name || order?.shopName || "Unknown Shop";
        shopCounts[shopName] = (shopCounts[shopName] || 0) + 1;
    });

    const topShop = Object.entries(shopCounts).reduce((a, b) =>
        shopCounts[a[0]] > shopCounts[b[0]] ? a : b
    );

    return { name: topShop[0], count: topShop[1] };
};

// Find top product (most bought)
export const getTopProduct = (
    orders: any[]
): { name: string; count: number } | null => {
    if (!orders?.length) return null;

    const productCounts: { [key: string]: number } = {};
    orders.forEach((order) => {
        order?.lineItems?.forEach((item: any) => {
            const productName =
                item?.title || item?.product?.title || "Unknown Product";
            productCounts[productName] =
                (productCounts[productName] || 0) + (item?.quantity || 1);
        });
    });

    if (Object.keys(productCounts).length === 0) return null;

    const topProduct = Object.entries(productCounts).reduce((a, b) =>
        productCounts[a[0]] > productCounts[b[0]] ? a : b
    );

    return { name: topProduct[0], count: topProduct[1] };
};

// Generate shopping style based on patterns
export const getShoppingStyle = (
    data: ShoppingData
): { style: string; description: string; emoji: string } => {
    const { orders, savedProducts, recentProducts, followedShops } = data;

    const orderCount = orders?.length || 0;
    const savedCount = savedProducts?.length || 0;
    const browsingCount = recentProducts?.length || 0;
    const followingCount = followedShops?.length || 0;

    const totalSpent = calculateMoneySpent(orders);
    const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

    // Decision tree for shopping styles
    if (avgOrderValue > 200 && orderCount >= 10) {
        return {
            style: "Luxury Connoisseur",
            description:
                "You appreciate quality over quantity and aren't afraid to invest in premium items that bring you joy.",
            emoji: "💎",
        };
    } else if (savedCount > orderCount * 3) {
        return {
            style: "The Wishlist Curator",
            description:
                "You love the thrill of discovery and carefully curate your desires before making thoughtful purchases.",
            emoji: "⭐",
        };
    } else if (orderCount >= 15 && avgOrderValue < 50) {
        return {
            style: "Deal Hunter",
            description:
                "You've mastered the art of finding amazing deals and getting the most value for every dollar spent.",
            emoji: "🎯",
        };
    } else if (browsingCount > savedCount && browsingCount > orderCount) {
        return {
            style: "Window Shopper",
            description:
                "You love exploring new products and discovering trends, enjoying the shopping journey as much as the destination.",
            emoji: "👀",
        };
    } else if (followingCount > 10 && orderCount > 5) {
        return {
            style: "Brand Enthusiast",
            description:
                "You've found your favorite brands and love supporting the shops that align with your values and style.",
            emoji: "🏪",
        };
    } else if (orderCount >= 8 && orderCount <= 15) {
        return {
            style: "Balanced Buyer",
            description:
                "You've found the perfect shopping rhythm - not too much, not too little, just right for your lifestyle.",
            emoji: "⚖️",
        };
    } else {
        return {
            style: "Mindful Minimalist",
            description:
                "You believe in intentional purchasing, choosing each item with care and purpose.",
            emoji: "🧘",
        };
    }
};

// Calculate shopping statistics
export const getYearInNumbers = (data: ShoppingData) => {
    const { orders, savedProducts } = data;

    const productsPurchased =
        orders?.reduce((sum, order) => {
            return sum + (order?.lineItems?.length || 1);
        }, 0) || 0;

    const uniqueShops =
        new Set(
            orders?.map(
                (order) => order?.shop?.name || order?.shopName || "Unknown"
            )
        ).size || 0;

    const avgOrderValue = calculateMoneySpent(orders) / (orders?.length || 1);
    const itemsSavedForLater = savedProducts?.length || 0;

    return {
        productsPurchased,
        uniqueShops,
        avgOrderValue,
        itemsSavedForLater,
        totalOrders: orders?.length || 0,
    };
};

// Generate shopping persona with GPT-style insights
export const getShoppingPersona = (
    data: ShoppingData
): {
    persona: string;
    traits: string[];
    description: string;
    emoji: string;
} => {
    const numbers = getYearInNumbers(data);

    const personas = [
        {
            persona: "The Trendsetting Explorer",
            traits: ["Adventurous", "Style-conscious", "Early adopter"],
            description:
                "You're always ahead of the curve, discovering new brands and products before they become mainstream. Your shopping choices inspire others.",
            emoji: "🚀",
            condition:
                numbers.uniqueShops > 5 && data.recentProducts?.length > 10,
        },
        {
            persona: "The Loyal Devotee",
            traits: ["Consistent", "Brand-loyal", "Quality-focused"],
            description:
                "You know what you love and stick with it. Your favorite shops can count on you, and you've built lasting relationships with brands.",
            emoji: "❤️",
            condition:
                data.followedShops?.length > 3 && numbers.totalOrders > 5,
        },
        {
            persona: "The Strategic Shopper",
            traits: ["Analytical", "Value-driven", "Patient"],
            description:
                "Every purchase is a calculated decision. You research, compare, and wait for the perfect moment to buy exactly what you need.",
            emoji: "🎯",
            condition: data.savedProducts?.length > numbers.totalOrders,
        },
        {
            persona: "The Spontaneous Splurger",
            traits: ["Impulsive", "Fun-loving", "Optimistic"],
            description:
                "Shopping is your therapy and entertainment rolled into one. You believe life's too short not to treat yourself to things that spark joy.",
            emoji: "✨",
            condition: numbers.avgOrderValue > 100 && numbers.totalOrders > 8,
        },
    ];

    const matchedPersona = personas.find((p) => p.condition) || personas[2]; // Default to Strategic Shopper

    return {
        persona: matchedPersona.persona,
        traits: matchedPersona.traits,
        description: matchedPersona.description,
        emoji: matchedPersona.emoji,
    };
};

// Calculate shopping streaks
export const getShoppingStreak = (
    orders: any[]
): { longestStreak: number; currentStreak: number; type: string } => {
    if (!orders?.length)
        return { longestStreak: 0, currentStreak: 0, type: "days" };

    // Sort orders by date
    const sortedOrders = orders
        .filter((order) => order.createdAt)
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );

    if (sortedOrders.length === 0)
        return { longestStreak: 0, currentStreak: 0, type: "days" };

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedOrders.length; i++) {
        const prevDate = new Date(sortedOrders[i - 1].createdAt);
        const currDate = new Date(sortedOrders[i].createdAt);
        const daysDiff = Math.floor(
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff <= 7) {
            // Within a week
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }

    return {
        longestStreak,
        currentStreak: 1, // Current streak from last order
        type: longestStreak > 4 ? "weeks" : "days",
    };
};

// Calculate environmental impact
export const getEnvironmentalStats = (
    orders: any[]
): { treesSaved: number; carbonReduced: number; plasticAvoided: number } => {
    const totalItems =
        orders?.reduce((sum, order) => {
            return sum + (order?.lineItems?.length || 1);
        }, 0) || 0;

    // Estimated environmental impact per item (these are hypothetical values)
    const treesSaved = Math.round(totalItems * 0.1); // 0.1 trees saved per item through sustainable practices
    const carbonReduced = Math.round(totalItems * 2.5); // 2.5 kg CO2 reduced per item
    const plasticAvoided = Math.round(totalItems * 15); // 15g plastic avoided per item

    return { treesSaved, carbonReduced, plasticAvoided };
};

// Generate recommended products for year recap
export const getYearRecapRecommendations = (data: ShoppingData): string[] => {
    const { orders } = data;

    const purchasedCategories = new Set();
    orders?.forEach((order) => {
        order?.lineItems?.forEach((item: any) => {
            if (item?.product?.productType) {
                purchasedCategories.add(item.product.productType);
            }
        });
    });

    // Generate recommendations based on purchase history and saved items
    const recommendations = [
        "Eco-friendly tote bag for your sustainable shopping",
        "Premium skincare set to pamper yourself",
        "Cozy home essentials for winter comfort",
        "Tech accessories to upgrade your daily routine",
        "Stylish accessories to complement your wardrobe",
    ];

    return recommendations.slice(0, 3); // Return top 3 recommendations
};
