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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    ✅ Image ready! Check the new tab to save to Photos.
                </div>
            )}
            
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Wrapped</span>
                </button>
                <h1 className="text-xl font-bold text-white">Export as Image</h1>
                <div className="w-24"></div>
            </div>

            {capturedImage || capturedImages.length > 0 ? (
                /* Show captured image(s) with actions */
                <div className="p-4 space-y-4">
                    {capturedImage ? (
                        /* Single image result */
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Image Captured! 📸</h2>
                            <div className="bg-white rounded-lg p-4 max-w-sm mx-auto shadow-2xl">
                                <img 
                                    src={capturedImage} 
                                    alt={`Shopify Wrapped - ${slideNames[selectedSlide]}`}
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    ) : (
                        /* Multiple images result */
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">All Images Captured! 🎉</h2>
                            <p className="text-white/80 mb-6">Successfully captured {capturedImages.length} slides</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {capturedImages.map((image, index) => (
                                    <div key={index} className="bg-white rounded-lg p-2 shadow-lg">
                                        <img 
                                            src={image.url} 
                                            alt={`Shopify Wrapped - ${image.name}`}
                                            className="w-full h-auto rounded"
                                        />
                                        <p className="text-xs text-gray-600 mt-1 text-center">{image.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col space-y-3 max-w-sm mx-auto">
                        {capturedImage ? (
                            /* Single image actions */
                            <>
                                <button
                                    onClick={shareImage}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                    <span>Save to Photos</span>
                                </button>
                                
                                <button
                                    onClick={downloadImage}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Download</span>
                                </button>

                                <button
                                    onClick={() => setCapturedImage(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Choose Different Slide
                                </button>
                            </>
                        ) : (
                            /* Multiple images actions */
                            <>
                                <button
                                    onClick={() => downloadAllImages(capturedImages)}
                                    disabled={isCapturing}
                                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    {isCapturing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <span>
                                                {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                                                    ? `View All ${capturedImages.length} Images` 
                                                    : `Download All ${capturedImages.length} Images`}
                                            </span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setCapturedImages([])}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Capture More
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                /* Show slide selection and preview */
                <div className="p-4 space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {isBulkCapturing ? 'Capturing All Slides...' : 'Choose a slide to export'}
                        </h2>
                        
                        {/* Slide Selector */}
                        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-6">
                            {slideNames.map((name, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedSlide(index)}
                                    className={`relative overflow-hidden rounded-lg transition-all duration-300 p-3 ${
                                        selectedSlide === index
                                            ? 'ring-3 ring-white scale-105 shadow-lg bg-white/20'
                                            : 'hover:scale-102 opacity-80 hover:opacity-100 bg-white/10 hover:bg-white/15'
                                    }`}
                                >
                                    <div className="text-white font-medium text-sm">
                                        {name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview of Selected Slide */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-4">Preview: {slideNames[selectedSlide]}</h3>
                        <div 
                            ref={slideRef}
                            className="mx-auto relative bg-transparent overflow-hidden"
                            style={{
                                width: '375px',
                                height: '812px',
                                transform: 'scale(0.75)',
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

                    {/* Capture Button */}
                    <div className="text-center space-y-4">
                        <button
                            onClick={captureSingleSlide}
                            disabled={isCapturing || isBulkCapturing}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto shadow-lg"
                        >
                            {isCapturing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Capturing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Capture This Slide</span>
                                </>
                            )}
                        </button>
                        
                        {/* Export All Button */}
                        <button
                            onClick={captureAllSlides}
                            disabled={isCapturing || isBulkCapturing}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto shadow-lg"
                        >
                            {isBulkCapturing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Capturing {Math.round(bulkProgress)}%</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Export All {slides.length} Slides</span>
                                </>
                            )}
                        </button>
                        
                        {isBulkCapturing && (
                            <div className="w-full max-w-md mx-auto">
                                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-green-400 h-full transition-all duration-300"
                                        style={{ width: `${bulkProgress}%` }}
                                    />
                                </div>
                                <p className="text-white/80 text-sm text-center mt-2">
                                    Capturing slide {Math.ceil(bulkProgress / 100 * slides.length)} of {slides.length}
                                </p>
                            </div>
                        )}
                        {isMobileDevice() && (
                            <p className="text-white/70 text-sm mt-3 max-w-md mx-auto">
                                📱 On iPhone: The image will open in a new tab. Tap and hold to save to Photos.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Gallery Overlay */}
            {showMobileGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
                    <div className="min-h-screen p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl font-bold">Your Shopify Wrapped Images</h2>
                            <button
                                onClick={() => setShowMobileGallery(false)}
                                className="text-white text-2xl hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <p className="text-white/80 text-sm mb-6 text-center">
                            📱 Tap and hold each image to save it to your Photos
                        </p>
                        
                        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                            {capturedImages.map((image, index) => (
                                <div key={index} className="bg-white/10 rounded-lg p-4">
                                    <h3 className="text-white text-center mb-2 font-medium">
                                        {image.name}
                                    </h3>
                                    <img
                                        src={image.url}
                                        alt={`Shopify Wrapped - ${image.name}`}
                                        className="w-full rounded-lg shadow-lg"
                                        style={{ 
                                            maxWidth: '100%',
                                            height: 'auto',
                                            touchAction: 'manipulation'
                                        }}
                                    />
                                    <p className="text-white/60 text-xs text-center mt-2">
                                        Tap and hold to save
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setShowMobileGallery(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
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
