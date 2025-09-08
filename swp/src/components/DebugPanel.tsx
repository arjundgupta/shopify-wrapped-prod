import React, { useState, useEffect } from "react";

interface DebugPanelProps {
    storyData: any;
    currentSlide: number;
    slidesCount: number;
}

export function DebugPanel({
    storyData,
    currentSlide,
    slidesCount,
}: DebugPanelProps) {
    // Debug mode for development: toggle via ?debug=true or localStorage 'SWP_DEBUG'
    const [debugMode, setDebugMode] = useState<boolean>(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            return (
                params.get("debug") === "true" ||
                localStorage.getItem("SWP_DEBUG") === "1"
            );
        } catch (e) {
            return false;
        }
    });

    useEffect(() => {
        if (!debugMode) return;
        console.groupCollapsed("ShopifyWrapped — debug");
        try {
            console.log("storyData", storyData);
            console.log("currentSlide", currentSlide);
            console.log("slidesCount", slidesCount);
        } catch (e) {
            console.warn("Debug logging failed", e);
        }
        console.groupEnd();
    }, [debugMode, storyData, currentSlide, slidesCount]);

    const debugInfo = {
        userPresent: !!storyData.user,
        ordersCount: (storyData.orders || []).length,
        savedCount: (storyData.savedProducts || []).length,
        followedShopsCount: (storyData.followedShops || []).length,
        curatedCount: (storyData.curatedProducts || []).length,
        recentProductsCount: (storyData.recentProducts || []).length,
        recentShopsCount: (storyData.recentShops || []).length,
        buyerAttributes: storyData.buyerAttributes || null,
    };

    const copyDebugJSON = async () => {
        try {
            const payload = JSON.stringify({ storyData, debugInfo }, null, 2);
            await navigator.clipboard.writeText(payload);
            // eslint-disable-next-line no-alert
            alert("Debug JSON copied to clipboard");
        } catch (e) {
            console.error("Failed to copy debug JSON", e);
        }
    };

    if (process.env.NODE_ENV === "production") return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 text-sm">
            <div className="flex flex-col items-end">
                <button
                    onClick={() => {
                        setDebugMode((d) => {
                            const next = !d;
                            try {
                                localStorage.setItem(
                                    "SWP_DEBUG",
                                    next ? "1" : "0"
                                );
                            } catch (_) {}
                            return next;
                        });
                    }}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10"
                >
                    {debugMode ? "Hide Debug" : "Show Debug"}
                </button>

                {debugMode && (
                    <div className="mt-2 w-96 max-h-80 overflow-auto p-3 bg-black/80 text-white rounded-lg border border-white/10 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">
                                ShopifyWrapped Debug
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyDebugJSON}
                                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
                                >
                                    Copy
                                </button>
                                <button
                                    onClick={() => console.clear()}
                                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
                                >
                                    Clear Console
                                </button>
                            </div>
                        </div>

                        <div className="text-xs opacity-80 mb-2">Summary</div>
                        <pre className="text-xs leading-tight whitespace-pre-wrap mb-3">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>

                        <div className="text-xs opacity-80 mb-2">
                            Full storyData
                        </div>
                        <pre className="text-xs leading-tight whitespace-pre-wrap">
                            {JSON.stringify(storyData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
