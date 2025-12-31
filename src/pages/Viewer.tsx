import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { CarouselViewer } from '@/components/CarouselViewer';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Button } from '@/components/ui/button';
import { useSlides } from '@/hooks/useSlides';
import { useAuth } from '@/hooks/useAuth';

export default function Viewer() {
  const navigate = useNavigate();
  const { mode, isLoading: authLoading, logout } = useAuth();
  const { slides, slidesData, isLoading: slidesLoading } = useSlides();

  // Protect route
  useEffect(() => {
    if (!authLoading && !mode) {
      navigate('/', { replace: true });
    }
  }, [mode, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (authLoading || slidesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic">
        <div className="animate-pulse text-primary">加载中...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Top bar with controls */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        {/* Logout button */}
        <Button 
          variant="icon" 
          size="icon" 
          onClick={handleLogout}
          className="rounded-full"
          title="退出登录"
        >
          <LogOut className="w-5 h-5" />
        </Button>

        {/* Music player */}
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
