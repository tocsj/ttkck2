import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  src?: string;
}

export function MusicPlayer({ src = '/audio/bgm.mp3' }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.5;

    // Handle autoplay restrictions
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, user needs to click
        });
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      
      <div className="flex items-center gap-2">
        <Button
          variant="icon"
          size="icon"
          onClick={togglePlay}
          className={cn(
            "rounded-full transition-all duration-300",
            isPlaying && "ring-2 ring-primary ring-offset-2 ring-offset-transparent"
          )}
        >
          <Music 
            className={cn(
              "w-5 h-5 transition-all",
              isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"
            )} 
          />
        </Button>

        <Button
          variant="icon"
          size="icon"
          onClick={toggleMute}
          className="rounded-full"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </Button>
      </div>
    </>
  );
}
