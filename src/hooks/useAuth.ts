import { useState, useEffect, useCallback } from 'react';
import { UserMode } from '@/types/slides';

const VIEWER_PASSWORD = '123456';
const ADMIN_PASSWORD = 'tkck6688';
const AUTH_KEY = 'romantic-auth-mode';

export function useAuth() {
  const [mode, setMode] = useState<UserMode>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored === 'viewer' || stored === 'admin') {
      setMode(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((password: string): { success: boolean; mode: UserMode; error?: string } => {
    if (password === VIEWER_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'viewer');
      setMode('viewer');
      return { success: true, mode: 'viewer' };
    }
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'admin');
      setMode('admin');
      return { success: true, mode: 'admin' };
    }
    return { success: false, mode: null, error: '密码不对哦～再试试 💕' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setMode(null);
  }, []);

  return {
    mode,
    isLoading,
    isAuthenticated: mode !== null,
    isViewer: mode === 'viewer',
    isAdmin: mode === 'admin',
    login,
    logout
  };
}
