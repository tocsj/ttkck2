import { useEffect, useState, memo } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { BackgroundType } from '@/types/slides';
import { cn } from '@/lib/utils';

interface BackgroundRendererProps {
  type: BackgroundType;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 12 + Math.random() * 16,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
  }));
};

export const BackgroundRenderer = memo(function BackgroundRenderer({ type, className }: BackgroundRendererProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (type === 'particles' || type === 'hearts' || type === 'stars') {
      setParticles(generateParticles(12));
    }
  }, [type]);

  const getGradientClass = () => {
    switch (type) {
      case 'gradient-romantic':
        return 'bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20';
      case 'gradient-teal':
        return 'bg-gradient-to-br from-primary/30 via-primary/10 to-background';
      case 'gradient-pink':
        return 'bg-gradient-to-br from-secondary/30 via-secondary/10 to-background';
      case 'solid':
        return 'bg-background';
      default:
        return 'bg-gradient-to-br from-primary/10 to-secondary/10';
    }
  };

  const renderIcon = (particle: Particle) => {
    const style = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animationDelay: `${particle.delay}s`,
      animationDuration: `${particle.duration}s`,
    };

    switch (type) {
      case 'hearts':
        return (
          <Heart
            key={particle.id}
            className="absolute text-secondary/30 animate-float"
            style={style}
            size={particle.size}
            fill="currentColor"
          />
        );
      case 'stars':
        return (
          <Star
            key={particle.id}
            className="absolute text-accent/40 animate-sparkle"
            style={style}
            size={particle.size}
            fill="currentColor"
          />
        );
      case 'particles':
        return (
          <Sparkles
            key={particle.id}
            className="absolute text-primary/30 animate-drift"
            style={style}
            size={particle.size}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden", getGradientClass(), className)}>
      {/* Ambient glow circles */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div 
        className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" 
        style={{ animationDelay: '1.5s' }}
      />

      {/* Particles */}
      {(type === 'particles' || type === 'hearts' || type === 'stars') && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(renderIcon)}
        </div>
      )}
    </div>
  );
});
