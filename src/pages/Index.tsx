import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordModal } from '@/components/PasswordModal';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { mode, isLoading, login } = useAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isLoading && mode) {
      if (mode === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/viewer', { replace: true });
      }
    }
  }, [mode, isLoading, navigate]);

  const handlePasswordSubmit = (password: string) => {
    const result = login(password);
    
    if (result.success) {
      if (result.mode === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/viewer', { replace: true });
      }
    }
    
    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-romantic">
        <div className="animate-pulse text-primary">加载中...</div>
      </div>
    );
  }

  // Show password modal if not authenticated
  if (!mode) {
    return <PasswordModal onSubmit={handlePasswordSubmit} />;
  }

  return null;
};

export default Index;
