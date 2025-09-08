import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { StoryCardData } from './story-cards/types';
import { WelcomeCard } from './story-cards/WelcomeCard';
import { MoneySpentCard } from './story-cards/MoneySpentCard';
import { OrdersPlacedCard } from './story-cards/OrdersPlacedCard';
import { TopProductCard } from './story-cards/TopProductCard';
import { FavoriteShopCard } from './story-cards/FavoriteShopCard';
import { MoneySavedCard } from './story-cards/MoneySavedCard';
import { ShoppingPersonaCard } from './story-cards/ShoppingPersonaCard';
import { YearInNumbersCard } from './story-cards/YearInNumbersCard';
import { AllDataSlide } from "./story-cards/AllDataSlide";

interface ImageExportPageProps {
    data: StoryCardData;
    onBack: () => void;
}

export function ImageExportPage({ data, onBack }: ImageExportPageProps) {
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(8); // Default to AllDataSlide
    const slideRef = useRef<HTMLDivElement>(null);

    // All story card slides
    const slides = [
        WelcomeCard,
        MoneySpentCard,
        OrdersPlacedCard,
        TopProductCard,
        FavoriteShopCard,
        MoneySavedCard,
        ShoppingPersonaCard,
        YearInNumbersCard,
        AllDataSlide
    ];

    const slideNames = [
        'Welcome',
        'Money Spent',
        'Orders Placed',
        'Top Product',
        'Favorite Shop',
        'Money Saved',
        'Shopping Persona',
        'Year in Numbers',
        'All Data Summary'
    ];

    // Get the selected slide component
    const SelectedSlideComponent = slides[selectedSlide];

    const captureSlideAsImage = async () => {
        const targetRef = slideRef.current;
        if (!targetRef) {
            alert('No slide to capture. Please try again.');
            return;
        }

        setIsCapturing(true);
        try {
            console.log('Starting image capture...');
            
            // Store original style
            const originalTransform = targetRef.style.transform;
            const originalWidth = targetRef.style.width;
            const originalHeight = targetRef.style.height;
            
            // Set to full size without scale for capture
            targetRef.style.transform = 'none';
            targetRef.style.width = '375px';
            targetRef.style.height = '812px';
            targetRef.style.overflow = 'visible';
            targetRef.style.position = 'relative';
            
            // Wait for layout to settle
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Target element dimensions:', {
                width: targetRef.offsetWidth,
                height: targetRef.offsetHeight,
                scrollWidth: targetRef.scrollWidth,
                scrollHeight: targetRef.scrollHeight,
                hasContent: targetRef.innerHTML.length > 100
            });
            
            const canvas = await html2canvas(targetRef, {
                backgroundColor: 'transparent',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: true,
                width: 375,
                height: targetRef.scrollHeight,
                x: -15,
                y: -450,
                scrollX: 0,
                scrollY: 0,
                foreignObjectRendering: true,
                ignoreElements: (element) => {
                    return element.tagName === 'SCRIPT';
                },
            });

            // Restore original styles
            targetRef.style.transform = originalTransform;
            targetRef.style.width = originalWidth;
            targetRef.style.height = originalHeight;

            console.log('Canvas created:', { width: canvas.width, height: canvas.height });

            const imageDataUrl = canvas.toDataURL('image/png', 1.0);
            console.log('Image data URL created, length:', imageDataUrl.length);
            
            setCapturedImage(imageDataUrl);
            
            // Automatically save on mobile devices
            if (isMobileDevice()) {
                await saveImageToDevice(imageDataUrl);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 5000);
            }
        } catch (error) {
            console.error('Failed to capture image:', error);
            // Restore styles in case of error
            if (targetRef) {
                targetRef.style.transform = 'scale(0.75)';
                targetRef.style.width = '375px';
                targetRef.style.height = '812px';
            }
            alert(`Failed to capture image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
        } finally {
            setIsCapturing(false);
        }
    };

    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const saveImageToDevice = async (imageDataUrl: string) => {
        try {
            const fileName = 'shopify-wrapped-all-data.png';
            
            // For iOS Safari, open in new tab with instructions
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <title>Shopify Wrapped - All Data</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <style>
                                    body { 
                                        margin: 0; 
                                        padding: 20px; 
                                        background: #000; 
                                        display: flex; 
                                        flex-direction: column; 
                                        align-items: center; 
                                        min-height: 100vh;
                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                    }
                                    img { 
                                        max-width: 100%; 
                                        height: auto; 
                                        border-radius: 10px;
                                        box-shadow: 0 4px 20px rgba(255,255,255,0.1);
                                    }
                                    .instructions {
                                        color: white;
                                        text-align: center;
                                        margin-bottom: 20px;
                                        padding: 20px;
                                        background: rgba(255,255,255,0.1);
                                        border-radius: 10px;
                                        backdrop-filter: blur(10px);
                                    }
                                    h2 { margin: 0 0 10px 0; }
                                    p { margin: 0; line-height: 1.5; }
                                </style>
                            </head>
                            <body>
                                <div class="instructions">
                                    <h2>📸 Your Shopify Wrapped</h2>
                                    <p><strong>To save to Photos:</strong><br>
                                    1. Tap and hold the image below<br>
                                    2. Select "Save to Photos" or "Add to Photos"</p>
                                </div>
                                <img src="${imageDataUrl}" alt="Shopify Wrapped - All Data" />
                            </body>
                        </html>
                    `);
                    newWindow.document.close();
                }
                return;
            }
            
            // For other devices, try direct download
            const link = document.createElement('a');
            link.download = fileName;
            link.href = imageDataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Unable to save automatically. Please take a screenshot or try again.');
        }
    };

    const downloadImage = () => {
        if (!capturedImage) return;
        saveImageToDevice(capturedImage);
    };

    const shareImage = async () => {
        if (!capturedImage) return;

        try {
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            const file = new File([blob], 'shopify-wrapped-all-data.png', { type: 'image/png' });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Shopify Wrapped - All Data',
                        text: 'Check out my Shopify Wrapped! 🛍️',
                        files: [file]
                    });
                    return;
                } catch (shareError) {
                    console.warn('Web Share API failed:', shareError);
                }
            }

            // Fallback to save
            await saveImageToDevice(capturedImage);
        } catch (error) {
            console.error('Error sharing image:', error);
            alert('Unable to share. Please try saving instead.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white text-black px-4 py-2 rounded-md text-sm font-medium">
                    ✅ Image ready! Check the new tab to save.
                </div>
            )}
            
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-900">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-1 text-gray-500 hover:text-white transition-colors text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="text-lg font-semibold text-white">Export Image</h1>
                <div className="w-12"></div>
            </div>

            {capturedImage ? (
                /* Show captured image with actions */
                <div 
                    className="fixed z-10"
                    style={{
                        top: '75px',    // Y position - change this number
                        right: '35px'    // X position from right - change this number
                    }}
                >
                    <div className="max-w-xs space-y-3">
                        <div className="bg-gray-900 rounded-lg p-2">
                            <img 
                                src={capturedImage} 
                                alt={`Shopify Wrapped - ${slideNames[selectedSlide]}`}
                                className="w-full h-auto rounded"
                            />
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={shareImage}
                                className="w-full bg-white hover:bg-gray-100 text-black font-medium py-2 px-3 rounded-md transition-colors text-xs"
                            >
                                Save to Photos
                            </button>
                            
                            <button
                                onClick={downloadImage}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-xs"
                            >
                                Download
                            </button>

                            <button
                                onClick={() => setCapturedImage(null)}
                                className="w-full bg-transparent border border-gray-700 hover:bg-gray-900 text-gray-300 font-medium py-2 px-3 rounded-md transition-colors text-xs"
                            >
                                Try Another
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Show slide selection and preview */
                <div className="p-4 space-y-4">
                    {/* Slide Selector */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Choose slide:</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {slideNames.map((name, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedSlide(index)}
                                    className={`p-2 rounded-md transition-all text-xs font-medium ${
                                        selectedSlide === index
                                            ? 'bg-white text-black'
                                            : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                                    }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Preview:</h3>
                        <div className="bg-gray-950 rounded-lg p-3 overflow-hidden">
                            <div 
                                ref={slideRef}
                                className="mx-auto"
                                style={{
                                    width: '300px',
                                    height: '800px',
                                    transform: 'scale(0.9) translateX(20px) translateY(-30px)',
                                    transformOrigin: 'center'
                                }}
                            >
                                <SelectedSlideComponent
                                    currentSlide={selectedSlide}
                                    totalSlides={slides.length}
                                    data={data}
                                    onNext={() => {}}
                                    onJumpToSlide={() => {}}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capture Button */}
                    <div className="pt-2">
                        <button
                            onClick={captureSlideAsImage}
                            disabled={isCapturing}
                            className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-3 px-4 rounded-md transition-all flex items-center justify-center space-x-2"
                        >
                            {isCapturing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                    <span className="text-sm">Capturing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm">Capture Image</span>
                                </>
                            )}
                        </button>
                        {isMobileDevice() && (
                            <p className="text-gray-600 text-xs mt-2 text-center">
                                📱 Image will open in new tab - tap and hold to save
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
