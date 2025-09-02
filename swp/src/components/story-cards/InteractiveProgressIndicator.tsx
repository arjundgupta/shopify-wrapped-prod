import { useState, useRef, useCallback, useEffect } from 'react'

interface InteractiveProgressIndicatorProps {
  currentSlide: number
  totalSlides: number
  onJumpToSlide?: (slideIndex: number) => void
}

export function InteractiveProgressIndicator({ 
  currentSlide, 
  totalSlides, 
  onJumpToSlide 
}: InteractiveProgressIndicatorProps) {
  const [showDots, setShowDots] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [hoveredDot, setHoveredDot] = useState(-1) // Which dot is being hovered/targeted
  const containerRef = useRef<HTMLDivElement>(null)
  const holdTimeoutRef = useRef<NodeJS.Timeout>()
  const startPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const calculateDotFromPosition = useCallback((clientX: number) => {
    if (!containerRef.current || !showDots) return -1
    
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    
    // Calculate which dot we're over with some padding
    const dotWidth = rect.width / totalSlides
    const dotIndex = Math.max(0, Math.min(totalSlides - 1, Math.floor(x / dotWidth)))
    
    return dotIndex
  }, [showDots, totalSlides])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsHolding(true)
    setHoveredDot(-1) // Reset hovered dot
    startPositionRef.current = { x: clientX, y: clientY }
    
    // Show dots after short delay
    holdTimeoutRef.current = setTimeout(() => {
      if (isHolding) {
        setShowDots(true)
      }
    }, 200)
  }, [isHolding])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isHolding) return
    
    // If dots are showing, update hover indicator but don't change pages
    if (showDots) {
      const dotIndex = calculateDotFromPosition(clientX)
      setHoveredDot(dotIndex)
    } else {
      // Check if we've moved enough to trigger dots early
      const deltaX = Math.abs(clientX - startPositionRef.current.x)
      const deltaY = Math.abs(clientY - startPositionRef.current.y)
      
      if (deltaX > 10 || deltaY > 10) {
        // User is dragging, show dots immediately
        if (holdTimeoutRef.current) {
          clearTimeout(holdTimeoutRef.current)
        }
        setShowDots(true)
      }
    }
  }, [isHolding, showDots, calculateDotFromPosition])

  const handleEnd = useCallback(() => {
    setIsHolding(false)
    
    // Clear timeout
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
    }
    
    // If we have a hovered dot and it's different from current, navigate there
    if (hoveredDot >= 0 && hoveredDot !== currentSlide && onJumpToSlide) {
      onJumpToSlide(hoveredDot)
    }
    
    // Hide dots and reset state with small delay
    setTimeout(() => {
      setShowDots(false)
      setHoveredDot(-1)
    }, 100)
  }, [hoveredDot, currentSlide, onJumpToSlide])

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }, [handleMove])

  const handleTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Global mouse/touch handlers for when dragging outside the component
  useEffect(() => {
    if (!isHolding) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleGlobalMouseUp = () => {
      handleEnd()
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleGlobalTouchEnd = () => {
      handleEnd()
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    document.addEventListener('touchend', handleGlobalTouchEnd)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [isHolding, handleMove, handleEnd])

  const handleDotClick = useCallback((slideIndex: number) => {
    if (onJumpToSlide) {
      onJumpToSlide(slideIndex)
    }
    setShowDots(false)
    setIsHolding(false)
    setHoveredDot(-1)
  }, [onJumpToSlide])

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      {!showDots ? (
        // Default page number display
        <div 
          ref={containerRef}
          className="text-white/70 font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-colors duration-200 select-none border border-white/10 touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentSlide + 1} / {totalSlides}
        </div>
      ) : (
        // Draggable dots navigation display
        <div 
          ref={containerRef}
          className="flex gap-3 bg-black/20 px-6 py-4 rounded-full backdrop-blur-sm border border-white/10 cursor-grabbing touch-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-150 touch-none relative ${
                index === currentSlide 
                  ? 'bg-white scale-125 ring-2 ring-white/50' 
                  : index === hoveredDot
                  ? 'bg-white/80 scale-110 ring-1 ring-white/30' 
                  : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Target indicator for hovered dot */}
              {index === hoveredDot && index !== currentSlide && (
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
