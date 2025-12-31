import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { BGMConfig } from '@/types/slides';

interface MusicPlayerProps {
  bgmConfig?: BGMConfig;
  showVolumeSlider?: boolean;
}

const BGM_STORAGE_KEY = 'romantic-bgm-blob';

export function MusicPlayer({ bgmConfig, showVolumeSlider = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(bgmConfig?.volume ?? 50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>('/audio/bgm.mp3');
  const [showVolume, setShowVolume] = useState(false);

  // Load stored BGM blob or use config
  useEffect(() => {
    const loadBGM = async () => {
      try {
        // First check if there's a blob stored in localStorage
        const storedBlob = localStorage.getItem(BGM_STORAGE_KEY);
        if (storedBlob) {
          setAudioSrc(storedBlob);
          return;
        }
        
        // Then check config
        if (bgmConfig?.url) {
          setAudioSrc(bgmConfig.url);
        }
      } catch (error) {
        console.error('Failed to load BGM:', error);
      }
    };
    
    loadBGM();
  }, [bgmConfig]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = volume / 100;

    // Handle autoplay restrictions
    const handleFirstInteraction = () => {
      if (!hasInteracted && bgmConfig?.autoPlay !== false) {
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
  }, [hasInteracted, bgmConfig?.autoPlay, volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch(console.error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const audio = audioRef.current;
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audio) {
      audio.volume = newVolume / 100;
    }
  }, []);

  return (
    <>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      
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
          {isPlaying ? (
            <Music 
              className="w-5 h-5 text-primary animate-pulse"
            />
          ) : (
            <Music className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>

        <Button
          variant="icon"
          size="icon"
          onClick={toggleMute}
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
          className="rounded-full"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </Button>

        {(showVolumeSlider || showVolume) && (
          <div className="w-20 animate-fade-up">
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>
    </>
  );
}

// Admin BGM Manager Component
interface BGMManagerProps {
  bgmConfig?: BGMConfig;
  onUpdateBGM: (config: BGMConfig) => void;
}

export function BGMManager({ bgmConfig, onUpdateBGM }: BGMManagerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState(bgmConfig?.fileName || '');
  const [volume, setVolume] = useState(bgmConfig?.volume ?? 50);
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  // Load existing BGM
  useEffect(() => {
    const storedBlob = localStorage.getItem(BGM_STORAGE_KEY);
    if (storedBlob) {
      setAudioSrc(storedBlob);
    } else if (bgmConfig?.url) {
      setAudioSrc(bgmConfig.url);
    }
    
    if (bgmConfig?.fileName) {
      setFileName(bgmConfig.fileName);
    }
  }, [bgmConfig]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('请选择音频文件');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      // Store in localStorage
      try {
        localStorage.setItem(BGM_STORAGE_KEY, dataUrl);
      } catch (error) {
        console.error('Failed to store BGM:', error);
        alert('存储失败，文件可能太大');
        return;
      }
      
      setAudioSrc(dataUrl);
      setFileName(file.name);
      
      // Update config
      onUpdateBGM({
        enabled: true,
        url: dataUrl,
        fileName: file.name,
        volume: volume,
        autoPlay: true,
      });
    };
    reader.readAsDataURL(file);
  }, [volume, onUpdateBGM]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      setDuration(`${mins}:${secs.toString().padStart(2, '0')}`);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [isPlaying, audioSrc]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
    if (bgmConfig) {
      onUpdateBGM({ ...bgmConfig, volume: newVolume });
    }
  }, [bgmConfig, onUpdateBGM]);

  const handleRemoveBGM = useCallback(() => {
    localStorage.removeItem(BGM_STORAGE_KEY);
    setAudioSrc('');
    setFileName('');
    setDuration('');
    onUpdateBGM({
      enabled: false,
      url: '',
      fileName: '',
      volume: 50,
      autoPlay: false,
    });
  }, [onUpdateBGM]);

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">🎵 背景音乐</h3>
        {audioSrc && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={handleRemoveBGM}>
            移除
          </Button>
        )}
      </div>

      <audio 
        ref={audioRef} 
        src={audioSrc} 
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />

      {!audioSrc ? (
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
          <Music className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">点击上传 MP3 文件</span>
          <span className="text-xs text-muted-foreground mt-1">最大 10MB</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-3">
          {/* File info */}
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              {duration && <p className="text-xs text-muted-foreground">时长: {duration}</p>}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
          </div>

          {/* Replace button */}
          <label className="block">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <span className="cursor-pointer">
                更换音乐
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </span>
            </Button>
          </label>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        提示：移动端首次需点击屏幕后才能自动播放
      </p>
    </div>
  );
}
