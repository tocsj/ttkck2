import { useEffect, useState, memo, useMemo } from 'react';
import { Heart, Star, Sparkles, Snowflake, Circle } from 'lucide-react';
import { BackgroundType, BackgroundSettings } from '@/types/slides';
import { cn } from '@/lib/utils';

interface BackgroundRendererProps {
  type: BackgroundType;
  settings?: BackgroundSettings;
  className?: string;
  reducedMotion?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const generateParticles = (count: number, density: number = 50): Particle[] => {
  const actualCount = Math.floor(count * (density / 50));
  return Array.from({ length: Math.max(5, actualCount) }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 20,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 8,
    opacity: 0.3 + Math.random() * 0.5,
  }));
};

export const BackgroundRenderer = memo(function BackgroundRenderer({ 
  type, 
  settings,
  className,
  reducedMotion = false 
}: BackgroundRendererProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const intensity = settings?.intensity ?? 50;
  const speed = settings?.speed ?? 50;
  const density = settings?.density ?? 50;

  const particleTypes: BackgroundType[] = ['particles', 'hearts', 'stars', 'confetti', 'bokeh', 'snow'];

  useEffect(() => {
    if (particleTypes.includes(type)) {
      setParticles(generateParticles(15, density));
    }
  }, [type, density]);

  const getGradientClass = () => {
    switch (type) {
      case 'gradient-romantic':
        return 'bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20';
      case 'gradient-teal':
        return 'bg-gradient-to-br from-primary/30 via-primary/10 to-background';
      case 'gradient-pink':
        return 'bg-gradient-to-br from-secondary/30 via-secondary/10 to-background';
      case 'gradient-flow':
        return 'animate-gradient-flow bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 bg-[length:200%_200%]';
      case 'aurora':
        return 'bg-gradient-to-t from-primary/10 via-secondary/20 to-accent/10';
      case 'ripple':
        return 'bg-gradient-to-br from-primary/15 to-secondary/15';
      case 'solid':
        return 'bg-background';
      default:
        return 'bg-gradient-to-br from-primary/10 to-secondary/10';
    }
  };

  const speedMultiplier = useMemo(() => (100 - speed) / 50 + 0.5, [speed]);
  const opacityMultiplier = useMemo(() => intensity / 100, [intensity]);

  const renderParticle = (particle: Particle) => {
    if (reducedMotion) return null;

    const style = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animationDelay: `${particle.delay}s`,
      animationDuration: `${particle.duration * speedMultiplier}s`,
      opacity: particle.opacity * opacityMultiplier,
    };

    switch (type) {
      case 'hearts':
        return (
          <Heart
            key={particle.id}
            className="absolute text-secondary animate-float-up"
            style={style}
            size={particle.size}
            fill="currentColor"
          />
        );
      case 'stars':
        return (
          <Star
            key={particle.id}
            className="absolute text-accent animate-twinkle"
            style={style}
            size={particle.size}
            fill="currentColor"
          />
        );
      case 'particles':
        return (
          <Sparkles
            key={particle.id}
            className="absolute text-primary animate-drift"
            style={style}
            size={particle.size}
          />
        );
      case 'confetti':
        return (
          <div
            key={particle.id}
            className="absolute animate-confetti-fall"
            style={{
              ...style,
              width: particle.size * 0.4,
              height: particle.size,
              background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              transform: `rotate(${Math.random() * 360}deg)`,
              borderRadius: '2px',
            }}
          />
        );
      case 'snow':
        return (
          <Snowflake
            key={particle.id}
            className="absolute text-foreground/20 animate-snow-fall"
            style={style}
            size={particle.size * 0.8}
          />
        );
      case 'bokeh':
        return (
          <Circle
            key={particle.id}
            className="absolute text-primary/20 animate-bokeh"
            style={{
              ...style,
              filter: `blur(${particle.size / 3}px)`,
            }}
            size={particle.size * 2}
            fill="currentColor"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden", getGradientClass(), className)}>
      {/* Aurora effect */}
      {type === 'aurora' && !reducedMotion && (
        <>
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent animate-aurora-wave"
              style={{ animationDuration: `${12 * speedMultiplier}s` }}
            />
            <div 
              className="absolute top-0 left-1/4 w-1/2 h-2/3 bg-gradient-to-b from-accent/30 via-primary/20 to-transparent animate-aurora-wave"
              style={{ animationDelay: '2s', animationDuration: `${15 * speedMultiplier}s` }}
            />
          </div>
        </>
      )}

      {/* Ripple effect */}
      {type === 'ripple' && !reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-primary/20 animate-ripple"
              style={{
                width: '50%',
                height: '50%',
                animationDelay: `${i * (2 * speedMultiplier)}s`,
                animationDuration: `${6 * speedMultiplier}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient glow circles */}
      <div 
        className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" 
        style={{ opacity: opacityMultiplier }}
      />
      <div 
        className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" 
        style={{ animationDelay: '1.5s', opacity: opacityMultiplier }}
      />

      {/* Particles */}
      {particleTypes.includes(type) && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(renderParticle)}
        </div>
      )}
    </div>
  );
});
