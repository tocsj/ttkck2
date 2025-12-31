import { memo } from 'react';
import { Heart, Star, Sparkles, PartyPopper } from 'lucide-react';
import { Sticker, OverlayType, StickerPosition } from '@/types/slides';
import { cn } from '@/lib/utils';

interface OverlayStickersProps {
  stickers: Sticker[];
}

const getPositionClasses = (position: StickerPosition): string => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'center':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    default:
      return 'top-4 right-4';
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg'): string => {
  switch (size) {
    case 'sm':
      return 'w-6 h-6';
    case 'md':
      return 'w-10 h-10';
    case 'lg':
      return 'w-16 h-16';
    default:
      return 'w-10 h-10';
  }
};

const StickerIcon = memo(function StickerIcon({ type, size }: { type: OverlayType; size: 'sm' | 'md' | 'lg' }) {
  const sizeClass = getSizeClasses(size);

  switch (type) {
    case 'hearts':
      return (
        <div className="relative">
          <Heart className={cn(sizeClass, "text-secondary animate-heart-beat")} fill="currentColor" />
          <Heart 
            className={cn(sizeClass, "absolute inset-0 text-secondary/50 animate-ping")} 
            fill="currentColor" 
          />
        </div>
      );
    case 'stars':
      return (
        <div className="relative">
          <Star className={cn(sizeClass, "text-accent animate-sparkle")} fill="currentColor" />
        </div>
      );
    case 'sparkles':
      return (
        <div className="flex gap-1">
          <Sparkles className={cn(getSizeClasses('sm'), "text-primary animate-float")} />
          <Sparkles className={cn(getSizeClasses('sm'), "text-secondary animate-float")} style={{ animationDelay: '0.5s' }} />
          <Sparkles className={cn(getSizeClasses('sm'), "text-accent animate-float")} style={{ animationDelay: '1s' }} />
        </div>
      );
    case 'confetti':
      return (
        <PartyPopper className={cn(sizeClass, "text-accent animate-float")} />
      );
    default:
      return null;
  }
});

export const OverlayStickers = memo(function OverlayStickers({ stickers }: OverlayStickersProps) {
  if (!stickers || stickers.length === 0) return null;

  return (
    <>
      {stickers.map((sticker, index) => {
        if (sticker.type === 'none') return null;

        return (
          <div
            key={`${sticker.type}-${sticker.position}-${index}`}
            className={cn(
              "absolute pointer-events-none z-10",
              getPositionClasses(sticker.position)
            )}
          >
            <StickerIcon type={sticker.type} size={sticker.size} />
          </div>
        );
      })}
    </>
  );
});
