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
    const [isBulkCapturing, setIsBulkCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedImages, setCapturedImages] = useState<Array<{url: string, name: string}>>([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(8); // Default to AllDataSlide
    const [bulkProgress, setBulkProgress] = useState(0);
    const [showMobileGallery, setShowMobileGallery] = useState(false);
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

    const captureSlideAsImage = async (slideIndex?: number) => {
        const targetRef = slideRef.current;
        if (!targetRef) {
            alert('No slide to capture. Please try again.');
            return null;
        }

        const currentSlideIndex = slideIndex ?? selectedSlide;
        
        try {
            console.log(`Starting image capture for slide ${currentSlideIndex}...`);
            
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
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 375,
                height: targetRef.scrollHeight,
                x: -15,
                y: -450,
                scrollX: 0,
                scrollY: 0,
                foreignObjectRendering: true,
            } as any);

            // Restore original styles
            targetRef.style.transform = originalTransform;
            targetRef.style.width = originalWidth;
            targetRef.style.height = originalHeight;

            console.log('Canvas created:', { width: canvas.width, height: canvas.height });

            const imageDataUrl = canvas.toDataURL('image/png', 1.0);
            console.log('Image data URL created, length:', imageDataUrl.length);
            
            return imageDataUrl;
        } catch (error) {
            console.error('Failed to capture image:', error);
            // Restore styles in case of error
            if (targetRef) {
                targetRef.style.transform = 'scale(0.75)';
                targetRef.style.width = '375px';
                targetRef.style.height = '812px';
            }
            throw error;
        }
    };

    const captureSingleSlide = async () => {
        setIsCapturing(true);
        try {
            const imageDataUrl = await captureSlideAsImage();
            if (imageDataUrl) {
                setCapturedImage(imageDataUrl);
                
                // Automatically save on mobile devices
                if (isMobileDevice()) {
                    await saveImageToDevice(imageDataUrl);
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 5000);
                }
            }
        } catch (error) {
            alert(`Failed to capture image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
        } finally {
            setIsCapturing(false);
        }
    };

    const captureAllSlides = async () => {
        setIsBulkCapturing(true);
        setBulkProgress(0);
        const images: Array<{url: string, name: string}> = [];
        
        try {
            for (let i = 0; i < slides.length; i++) {
                console.log(`Capturing slide ${i + 1} of ${slides.length}: ${slideNames[i]}`);
                
                // Update the selected slide for rendering
                setSelectedSlide(i);
                
                // Wait for React to re-render with new slide
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                try {
                    const imageDataUrl = await captureSlideAsImage(i);
                    if (imageDataUrl) {
                        images.push({
                            url: imageDataUrl,
                            name: slideNames[i]
                        });
                    }
                } catch (error) {
                    console.error(`Failed to capture slide ${i}:`, error);
                }
                
                setBulkProgress(((i + 1) / slides.length) * 100);
            }
            
            setCapturedImages(images);
            
            // Don't auto-download, let user choose when to download
            console.log(`Successfully captured ${images.length} images`);
            
        } catch (error) {
            console.error('Bulk capture failed:', error);
            alert(`Failed to capture all images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsBulkCapturing(false);
            setBulkProgress(0);
        }
    };

    const downloadAllImages = async (images: Array<{url: string, name: string}>) => {
        console.log('Starting download of all images...');
        
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // On mobile, show images in gallery for manual save
            setShowMobileGallery(true);
            alert('Images are ready! Tap and hold each image below to save it to your photos.');
            return;
        }
        
        setIsCapturing(true); // Show loading state
        
        try {
            // Create a zip file in memory if supported, otherwise download individually
            if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
                // Use File System Access API for modern browsers
                try {
                    const dirHandle = await (window as any).showDirectoryPicker();
                    
                    for (const image of images) {
                        const response = await fetch(image.url);
                        const blob = await response.blob();
                        const fileName = `shopify-wrapped-${image.name.toLowerCase().replace(/\s+/g, '-')}.png`;
                        
                        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
                        const writable = await fileHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                    }
                    
                    setIsCapturing(false);
                    alert(`✅ All ${images.length} images saved successfully!`);
                    return;
                } catch (error) {
                    console.log('Directory picker not available, falling back to individual downloads');
                }
            }
            
            // Fallback: Download images individually with delay
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const fileName = `shopify-wrapped-${image.name.toLowerCase().replace(/\s+/g, '-')}.png`;
                
                try {
                    // Create download link for each image
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = image.url;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    
                    // Trigger download
                    link.click();
                    
                    // Clean up
                    document.body.removeChild(link);
                    
                    console.log(`Downloaded image ${i + 1}/${images.length}: ${fileName}`);
                    
                    // Add delay between downloads to prevent browser blocking
                    if (i < images.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (downloadError) {
                    console.error(`Error downloading image ${i + 1}:`, downloadError);
                }
            }
            
            setIsCapturing(false);
            alert(`✅ All ${images.length} images downloaded! Check your downloads folder.`);
            
        } catch (error) {
            console.error('Error downloading all images:', error);
            setIsCapturing(false);
            alert('Some images may not have downloaded properly. Please try again or download individually.');
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
        <div className="min-h-screen bg-white">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
                    ✓ Image ready! Check the new tab to save to Photos.
                </div>
            )}
            
            {/* Minimal Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="text-lg font-semibold text-black">Export Images</h1>
                    <div className="w-16"></div>
                </div>
            </div>

            {capturedImage || capturedImages.length > 0 ? (
                /* Show captured image(s) with actions */
                <div className="p-4 max-w-4xl mx-auto">
                    {capturedImage ? (
                        /* Single image result */
                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            <div>
                                <div className="text-center mb-4">
                                    <h2 className="text-lg font-semibold text-black mb-1">Image Ready</h2>
                                    <p className="text-gray-600 text-sm">{slideNames[selectedSlide]}</p>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={shareImage}
                                        className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                                    >
                                        Save to Photos
                                    </button>
                                    
                                    <button
                                        onClick={downloadImage}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                                    >
                                        Download
                                    </button>

                                    <button
                                        onClick={() => setCapturedImage(null)}
                                        className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm transition-colors"
                                    >
                                        Choose Different Slide
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="bg-gray-50 rounded-lg p-3 border max-w-xs">
                                    <img 
                                        src={capturedImage} 
                                        alt={`Shopify Wrapped - ${slideNames[selectedSlide]}`}
                                        className="w-full h-auto rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Multiple images result */
                        <div className="space-y-4">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-black mb-1">All Images Ready</h2>
                                <p className="text-gray-600 text-sm">{capturedImages.length} slides captured</p>
                            </div>
                            
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
                                {capturedImages.map((image, index) => (
                                    <div key={index} className="bg-gray-50 rounded-md p-1 border">
                                        <img 
                                            src={image.url}
                                            alt={`Shopify Wrapped - ${image.name}`}
                                            className="w-full h-auto rounded"
                                        />
                                        <p className="text-xs text-gray-600 mt-1 text-center truncate">{image.name}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => downloadAllImages(capturedImages)}
                                    disabled={isCapturing}
                                    className="bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-md transition-colors text-sm"
                                >
                                    {isCapturing ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Processing...</span>
                                        </span>
                                    ) : (
                                        <span>
                                            {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                                                ? `View All ${capturedImages.length} Images` 
                                                : `Download All ${capturedImages.length} Images`}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setCapturedImages([])}
                                    className="text-gray-500 hover:text-gray-700 font-medium py-2.5 px-4 text-sm transition-colors"
                                >
                                    Capture Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Show slide selection and preview */
                <div className="p-4 max-w-6xl mx-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-semibold text-black mb-1">
                            {isBulkCapturing ? 'Capturing All Slides...' : 'Choose a slide to export'}
                        </h2>
                        {!isBulkCapturing && (
                            <p className="text-gray-600 text-sm">Select a slide to preview and capture</p>
                        )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Slide Selector and Actions */}
                        <div className="space-y-4">
                            {!isBulkCapturing && (
                                /* Slide Selector */
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select Slide</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {slideNames.map((name, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedSlide(index)}
                                                className={`p-2 rounded-md text-sm font-medium transition-all text-left ${
                                                    selectedSlide === index
                                                        ? 'bg-black text-white'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Capture Buttons */}
                            <div className="space-y-2">
                                {!isBulkCapturing && (
                                    <button
                                        onClick={captureSingleSlide}
                                        disabled={isCapturing || isBulkCapturing}
                                        className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                                    >
                                        {isCapturing ? (
                                            <span className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Capturing...</span>
                                            </span>
                                        ) : (
                                            'Capture This Slide'
                                        )}
                                    </button>
                                )}
                                
                                {/* Export All Button */}
                                <button
                                    onClick={captureAllSlides}
                                    disabled={isCapturing || isBulkCapturing}
                                    className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                                >
                                    {isBulkCapturing ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                                            <span>Capturing {Math.round(bulkProgress)}%</span>
                                        </span>
                                    ) : (
                                        `Capture All ${slides.length} Slides`
                                    )}
                                </button>
                                
                                {isBulkCapturing && (
                                    <div className="text-center">
                                        <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-black h-full transition-all duration-300"
                                                style={{ width: `${bulkProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-gray-600 text-xs mt-1">
                                            Slide {Math.ceil(bulkProgress / 100 * slides.length)} of {slides.length}
                                        </p>
                                    </div>
                                )}
                                
                                {isMobileDevice() && (
                                    <p className="text-gray-500 text-xs text-center mt-2">
                                        📱 Tap and hold image to save to Photos
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Right Column: Preview */}
                        {!isBulkCapturing && (
                            <div className="flex justify-center">
                                <div className="bg-gray-50 rounded-lg p-3 border">
                                    <div className="text-center mb-2">
                                        <span className="text-xs font-medium text-gray-600">{slideNames[selectedSlide]}</span>
                                    </div>
                                    <div 
                                        ref={slideRef}
                                        className="mx-auto relative bg-transparent overflow-hidden rounded"
                                        style={{
                                            width: '187.5px',  // 375px * 0.5
                                            height: '406px',   // 812px * 0.5
                                            transform: 'scale(0.5)',
                                            transformOrigin: 'center top'
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
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Gallery Overlay */}
            {showMobileGallery && (
                <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
                    <div className="min-h-screen p-6">
                        <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
                            <h2 className="text-xl font-semibold text-black">Your Images</h2>
                            <button
                                onClick={() => setShowMobileGallery(false)}
                                className="text-gray-600 hover:text-black text-2xl font-light"
                            >
                                ×
                            </button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-8 text-center max-w-md mx-auto">
                            Tap and hold each image to save it to your Photos
                        </p>
                        
                        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                            {capturedImages.map((image: any, index: number) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                                    <h3 className="text-black text-center mb-3 font-medium text-sm">
                                        {image.name}
                                    </h3>
                                    <img
                                        src={image.url}
                                        alt={`Shopify Wrapped - ${image.name}`}
                                        className="w-full rounded-lg"
                                        style={{ 
                                            maxWidth: '100%',
                                            height: 'auto',
                                            touchAction: 'manipulation'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowMobileGallery(false)}
                                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
