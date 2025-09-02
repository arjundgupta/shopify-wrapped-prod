# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Shop Wrapped** application - a React-based Shop Mini that creates an Instagram Stories-style "year in review" experience for Shopify users. The app analyzes user shopping data to generate personalized insights, statistics, and story cards showing their shopping patterns, favorite shops, spending habits, and more.

The application is built as a **Shopify Shop Mini** that runs inside the Shop app's webview, providing a native mobile experience for users to explore their shopping data in an engaging, swipeable story format.

## Development Commands

### Starting Development
```bash
# Start the development server using Shop Minis CLI
npm start
```

This command uses `shop-minis dev` which starts the Vite development server configured for Shop Minis development.

### Package Management
```bash
# Install dependencies
npm install

# Update dependencies
npm update
```

### Building (if needed)
While there's no explicit build command in package.json, Vite handles building through the Shop Minis CLI.

## Architecture Overview

### Core Structure
```
src/
├── components/
│   ├── ShopifyWrapped.tsx          # Main app component with slide management
│   └── story-cards/                # Individual story card components
│       ├── WelcomeCard.tsx         # Opening slide
│       ├── MoneySpentCard.tsx      # Total spending insights
│       ├── OrdersPlacedCard.tsx    # Order statistics
│       ├── MoneySavedCard.tsx      # Savings/discounts analysis
│       ├── FavoriteShopCard.tsx    # Most shopped store
│       ├── TopProductCard.tsx      # Most purchased/saved products
│       ├── ShoppingPersonaCard.tsx # AI-generated shopping personality
│       ├── YearInNumbersCard.tsx   # Summary statistics
│       ├── AllDataSlide.tsx        # Final data overview
│       └── types.ts                # TypeScript interfaces
├── hooks/
│   └── useShopifyWrappedData.ts    # Custom hook for data fetching and processing
├── utils/
│   └── shoppingAnalytics.ts        # Analytics calculations and data processing
├── App.tsx                         # Root component
├── main.tsx                        # React app entry point with MinisContainer
└── index.css                       # Custom animations and styles
```

### Key Architectural Patterns

1. **Story-Based Navigation**: The app uses a slides array to manage navigation between different story cards, with swipe and keyboard navigation support.

2. **Data Layer**: Uses Shopify's Shop Minis React SDK hooks (`useOrders`, `useSavedProducts`, etc.) to fetch user data, with comprehensive error handling and fallbacks.

3. **Analytics Engine**: The `shoppingAnalytics.ts` utility processes raw Shopify data to generate meaningful insights like spending patterns, favorite shops, and shopping personalities.

4. **Component Architecture**: Each story card is a self-contained component that receives standardized `StoryCardProps` and processes the data it needs.

5. **Mobile-First Design**: Built exclusively for mobile with touch gestures, responsive layouts, and performance optimizations for mobile webview.

## Key Technologies

- **React 18.2.0** - Core framework
- **@shopify/shop-minis-react** - Shopify's Shop Minis SDK for data access and UI components
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS v4** - Utility-first styling with custom animations
- **Vite** - Build tool and development server

## Data Processing Flow

1. **Data Fetching**: Multiple SDK hooks fetch user data (orders, saved products, followed shops, etc.)
2. **Data Normalization**: `shoppingAnalytics.ts` handles different data formats and calculates insights
3. **Story Generation**: Each card component processes relevant data and generates personalized content
4. **Personality Analysis**: Algorithm determines shopping personality based on behavior patterns
5. **Interactive Navigation**: Users swipe through story cards with progress tracking

## Development Guidelines

### Working with Shop Minis SDK
- Always check if required functionality exists in `@shopify/shop-minis-react` before creating custom components
- Use the provided hooks for data access (`useOrders`, `useSavedProducts`, etc.)
- Handle loading states and data unavailability gracefully
- Wrap the app with `MinisContainer` component (already done in `main.tsx`)

### Mobile-First Development
- All UI should be optimized for mobile touch interactions
- Use Tailwind CSS for responsive design
- Test gesture-based navigation (swipe, tap)
- Consider performance on mobile devices

### Data Handling
- Always provide fallbacks for missing or malformed data
- Use type-safe interfaces defined in `types.ts`
- Handle different data formats from various Shopify sources
- Implement error boundaries for data processing failures

### Animation and UX
- Use the custom animation classes defined in `index.css`
- Maintain smooth transitions between story cards
- Follow the glass morphism and gradient design patterns
- Ensure animations don't impact performance on mobile

## Cursor Rules Integration

This project includes `.cursorrules` with specific guidance for React development with the Shop Minis SDK. Key points:
- Use React as the core framework
- Prioritize `@shopify/shop-minis-react` components and hooks
- Use Tailwind CSS v4 for styling
- Focus on mobile UI design and touch interactions
- Optimize for performance and mobile device limitations

## File Structure Notes

- The project has a nested structure: `swp/swp/` contains the actual application code
- Configuration files (package.json, tsconfig.json, etc.) are in the inner `swp/` directory
- The Shop Mini manifest is at `src/manifest.json`

## Common Development Tasks

When adding new story cards:
1. Create component in `src/components/story-cards/`
2. Add to the slides array in `ShopifyWrapped.tsx`
3. Use the `StoryCardProps` interface for consistency
4. Add any new data processing logic to `shoppingAnalytics.ts`

When modifying data processing:
1. Update analytics functions in `utils/shoppingAnalytics.ts`
2. Ensure type safety with proper TypeScript interfaces
3. Handle edge cases and missing data gracefully
4. Test with various data scenarios
