import { memo } from 'react';
import { Slide } from '@/types/slides';
import { BackgroundRenderer } from './BackgroundRenderer';
import { OverlayStickers } from './OverlayStickers';
import { cn } from '@/lib/utils';

interface SlideCardProps {
  slide: Slide;
  isActive?: boolean;
}

export const SlideCard = memo(function SlideCard({ slide, isActive = true }: SlideCardProps) {
  return (
    <div className={cn(
      "relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden",
      isActive && "animate-fade-up"
    )}>
      {/* Background */}
      <BackgroundRenderer type={slide.background} />

      {/* Stickers overlay */}
      <OverlayStickers stickers={slide.overlays} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Article content */}
        {(slide.contentType === 'article' || slide.contentType === 'mixed') && slide.richText && (
          <div 
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: slide.richText }}
          />
        )}

        {/* Images */}
        {(slide.contentType === 'image' || slide.contentType === 'mixed') && slide.images && slide.images.length > 0 && (
          <div className={cn(
            "mt-6 space-y-4",
            slide.contentType === 'image' && "mt-0"
          )}>
            {slide.images.map((src, index) => (
              <div 
                key={index}
                className="relative rounded-2xl overflow-hidden shadow-romantic"
              >
                <img
                  src={src}
                  alt={`${slide.title} - ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
            
            {/* Caption for image slides */}
            {slide.contentType === 'image' && slide.richText && (
              <div 
                className="mt-4 prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: slide.richText }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
