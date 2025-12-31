import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarouselViewer } from '@/components/CarouselViewer';
import { MusicPlayer } from '@/components/MusicPlayer';
import { useSlides } from '@/hooks/useSlides';
import { useAuth } from '@/hooks/useAuth';

export default function Viewer() {
  const navigate = useNavigate();
  const { mode, isLoading: authLoading } = useAuth();
  const { slides, slidesData, isLoading: slidesLoading } = useSlides();

  // Protect route
  useEffect(() => {
    if (!authLoading && !mode) {
      navigate('/', { replace: true });
    }
  }, [mode, authLoading, navigate]);

  if (authLoading || slidesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic">
        <div className="animate-pulse text-primary">加载中...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Music player in top right */}
      <div className="fixed top-4 right-4 z-50">
        <MusicPlayer />
      </div>

      {/* Carousel */}
      <CarouselViewer 
        slides={slides} 
        title={slidesData.title}
        subtitle={slidesData.subtitle}
      />
    </div>
  );
}
