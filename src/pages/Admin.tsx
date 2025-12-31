import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useSlides } from '@/hooks/useSlides';
import { useAuth } from '@/hooks/useAuth';

export default function Admin() {
  const navigate = useNavigate();
  const { mode, isLoading: authLoading, isAdmin, logout } = useAuth();
  const { 
    slides, 
    slidesData, 
    isLoading: slidesLoading,
    updateSlide,
    addSlide,
    deleteSlide,
    reorderSlides,
    updateTitle,
    updateBGM,
    exportData,
    importData,
    resetToDefault
  } = useSlides();

  // Protect route - only admin can access
  useEffect(() => {
    if (!authLoading) {
      if (!mode) {
        navigate('/', { replace: true });
      } else if (!isAdmin) {
        navigate('/viewer', { replace: true });
      }
    }
  }, [mode, isAdmin, authLoading, navigate]);

  if (authLoading || slidesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic">
        <div className="animate-pulse text-primary">加载中...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handlePreview = () => {
    navigate('/viewer');
  };

  return (
    <AdminDashboard
      slides={slides}
      title={slidesData.title}
      subtitle={slidesData.subtitle}
      bgmConfig={slidesData.bgm}
      onUpdateSlide={updateSlide}
      onAddSlide={addSlide}
      onDeleteSlide={deleteSlide}
      onReorderSlides={reorderSlides}
      onUpdateTitle={updateTitle}
      onUpdateBGM={updateBGM}
      onExport={exportData}
      onImport={importData}
      onReset={resetToDefault}
      onLogout={handleLogout}
      onPreview={handlePreview}
    />
  );
}
