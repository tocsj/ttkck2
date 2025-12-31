import { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordModalProps {
  onSubmit: (password: string) => { success: boolean; error?: string };
}

export function PasswordModal({ onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSubmit(password);
    if (!result.success) {
      setError(result.error || '密码不对哦～');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 gradient-romantic">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-secondary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${16 + Math.random() * 24}px`,
            }}
            size={16 + Math.random() * 24}
          />
        ))}
      </div>

      {/* Modal card */}
      <div
        className={cn(
          "relative w-full max-w-sm glass rounded-3xl p-8 shadow-romantic transition-all duration-500",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          shake && "animate-shake"
        )}
      >
        {/* Decorative sparkles */}
        <Sparkles className="absolute -top-3 -right-3 text-accent w-8 h-8 animate-pulse-glow" />
        <Sparkles className="absolute -bottom-3 -left-3 text-primary w-6 h-6 animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-glow">
            <Heart className="w-8 h-8 text-primary-foreground animate-heart-beat" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            专属浪漫空间
          </h1>
          <p className="text-muted-foreground text-sm">
            输入密码，开启我们的故事 ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="请输入密码..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="h-14 text-center text-lg rounded-2xl border-2 border-primary/20 focus:border-primary bg-white/50 backdrop-blur-sm"
              autoFocus
            />
            {error && (
              <p className="text-secondary text-sm text-center animate-fade-up">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="romantic"
            size="lg"
            className="w-full"
          >
            <Heart className="w-5 h-5 mr-2" fill="currentColor" />
            进入
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          🌹 为你精心准备的跨年礼物 🌹
        </p>
      </div>
    </div>
  );
}
