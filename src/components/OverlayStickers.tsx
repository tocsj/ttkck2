import { memo, useEffect, useState } from 'react';
import { Heart, Star, Sparkles, PartyPopper, Ribbon, Flame } from 'lucide-react';
import { Sticker, OverlayType, StickerPosition } from '@/types/slides';
import { cn } from '@/lib/utils';

interface OverlayStickersProps {
  stickers: Sticker[];
  reducedMotion?: boolean;
}

const getPositionClasses = (position: StickerPosition): string => {
  switch (position) {
    case 'top-left':
      return 'top-16 left-4';
    case 'top-right':
      return 'top-16 right-4';
    case 'bottom-left':
      return 'bottom-20 left-4';
    case 'bottom-right':
      return 'bottom-20 right-4';
    case 'center':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    case 'floating':
      return 'top-1/3 right-1/4';
    default:
      return 'top-4 right-4';
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg'): { class: string; px: number } => {
  switch (size) {
    case 'sm':
      return { class: 'w-6 h-6', px: 24 };
    case 'md':
      return { class: 'w-10 h-10', px: 40 };
    case 'lg':
      return { class: 'w-16 h-16', px: 64 };
    default:
      return { class: 'w-10 h-10', px: 40 };
  }
};

// Balloon component
const Balloon = memo(function Balloon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none">
      <ellipse cx="20" cy="18" rx="18" ry="18" fill={color} />
      <polygon points="20,36 16,42 24,42" fill={color} />
      <path d="M20 42 Q18 48, 20 56 Q22 48, 20 42" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
});

// Firework spark
const FireworkSpark = memo(function FireworkSpark({ reducedMotion }: { reducedMotion?: boolean }) {
  if (reducedMotion) {
    return <Sparkles className="w-8 h-8 text-accent" />;
  }
  
  return (
    <div className="relative">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent animate-firework-burst"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-12px)`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
      <Flame className="w-6 h-6 text-accent animate-pulse" />
    </div>
  );
});

// Countdown widget
const CountdownWidget = memo(function CountdownWidget({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const sizeConfig = {
    sm: 'text-xs p-1',
    md: 'text-sm p-2',
    lg: 'text-base p-3',
  };

  return (
    <div className={cn("glass rounded-xl", sizeConfig[size])}>
      <div className="text-center text-muted-foreground text-[10px] mb-1">距离2026</div>
      <div className="flex gap-1 text-primary font-mono font-bold">
        <span>{timeLeft.days}天</span>
        <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
});

const StickerIcon = memo(function StickerIcon({ 
  type, 
  size,
  reducedMotion 
}: { 
  type: OverlayType; 
  size: 'sm' | 'md' | 'lg';
  reducedMotion?: boolean;
}) {
  const { class: sizeClass, px: sizePx } = getSizeClasses(size);
  const animClass = reducedMotion ? '' : 'animate-float';

  switch (type) {
    case 'hearts':
      return (
        <div className="relative">
          <Heart className={cn(sizeClass, "text-secondary", !reducedMotion && "animate-heart-beat")} fill="currentColor" />
          {!reducedMotion && (
            <Heart 
              className={cn(sizeClass, "absolute inset-0 text-secondary/50 animate-ping")} 
              fill="currentColor" 
            />
          )}
        </div>
      );
    case 'stars':
      return (
        <div className="relative">
          <Star className={cn(sizeClass, "text-accent", !reducedMotion && "animate-twinkle")} fill="currentColor" />
        </div>
      );
    case 'sparkles':
      return (
        <div className={cn("flex gap-1", animClass)}>
          <Sparkles className={cn(getSizeClasses('sm').class, "text-primary")} />
          <Sparkles className={cn(getSizeClasses('sm').class, "text-secondary")} style={{ animationDelay: '0.5s' }} />
          <Sparkles className={cn(getSizeClasses('sm').class, "text-accent")} style={{ animationDelay: '1s' }} />
        </div>
      );
    case 'confetti':
      return (
        <PartyPopper className={cn(sizeClass, "text-accent", animClass)} />
      );
    case 'balloons':
      return (
        <div className={cn("flex gap-1", animClass)}>
          <Balloon size={sizePx * 0.6} color="hsl(330, 81%, 60%)" />
          <Balloon size={sizePx * 0.5} color="hsl(168, 76%, 42%)" />
          <Balloon size={sizePx * 0.55} color="hsl(45, 80%, 65%)" />
        </div>
      );
    case 'fireworks':
      return <FireworkSpark reducedMotion={reducedMotion} />;
    case 'ribbons':
      return (
        <div className={cn("flex gap-0.5", animClass)}>
          <Ribbon className={cn(sizeClass, "text-secondary rotate-12")} />
          <Ribbon className={cn(sizeClass, "text-primary -rotate-12")} />
        </div>
      );
    case 'countdown':
      return <CountdownWidget size={size} />;
    default:
      return null;
  }
});

export const OverlayStickers = memo(function OverlayStickers({ stickers, reducedMotion }: OverlayStickersProps) {
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
            style={{ opacity: sticker.opacity ?? 1 }}
          >
            <StickerIcon type={sticker.type} size={sticker.size} reducedMotion={reducedMotion} />
          </div>
        );
      })}
    </>
  );
});
