import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide } from '@/types/slides';
import { SlideCard } from './SlideCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CarouselViewerProps {
  slides: Slide[];
  title: string;
  subtitle: string;
}

export function CarouselViewer({ slides, title, subtitle }: CarouselViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, slides.length, goToSlide]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">暂无内容 💕</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
          {subtitle}
        </p>
        <h1 className="text-lg font-bold text-gradient mt-1">
          {title}
        </h1>
      </div>

      {/* Slides container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className="min-w-full h-full flex-shrink-0"
          >
            <SlideCard slide={slide} isActive={index === currentIndex} />
          </div>
        ))}
      </div>

      {/* Navigation arrows - hidden on mobile, visible on larger screens */}
      <div className="hidden md:block">
        <Button
          variant="glass"
          size="icon"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full",
            currentIndex === 0 && "opacity-30 pointer-events-none"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="glass"
          size="icon"
          onClick={goToNext}
          disabled={currentIndex === slides.length - 1}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full",
            currentIndex === slides.length - 1 && "opacity-30 pointer-events-none"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 touch-target",
              index === currentIndex 
                ? "bg-primary w-6 shadow-glow" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint - only show on first slide */}
      {currentIndex === 0 && (
        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center animate-fade-up md:hidden">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            左右滑动翻页
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      )}
    </div>
  );
}
