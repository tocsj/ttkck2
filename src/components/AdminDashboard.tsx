import { useState } from 'react';
import { 
  Plus, Trash2, GripVertical, Eye, Download, Upload, 
  RotateCcw, LogOut, Image, FileText, Layers, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slide, ContentType, BackgroundType, OverlayType, Sticker } from '@/types/slides';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  slides: Slide[];
  title: string;
  subtitle: string;
  onUpdateSlide: (id: string, updates: Partial<Slide>) => void;
  onAddSlide: (slide: Omit<Slide, 'id' | 'order'>) => void;
  onDeleteSlide: (id: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onUpdateTitle: (title: string, subtitle: string) => void;
  onExport: () => void;
  onImport: (json: string) => boolean;
  onReset: () => void;
  onLogout: () => void;
  onPreview: () => void;
}

const contentTypeOptions: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'article', label: '文章', icon: <FileText className="w-4 h-4" /> },
  { value: 'image', label: '图片', icon: <Image className="w-4 h-4" /> },
  { value: 'mixed', label: '混合', icon: <Layers className="w-4 h-4" /> },
];

const backgroundOptions: { value: BackgroundType; label: string }[] = [
  { value: 'gradient-romantic', label: '浪漫渐变' },
  { value: 'gradient-teal', label: '青绿渐变' },
  { value: 'gradient-pink', label: '粉色渐变' },
  { value: 'hearts', label: '漂浮爱心' },
  { value: 'stars', label: '闪烁星星' },
  { value: 'particles', label: '粒子光斑' },
  { value: 'solid', label: '纯色背景' },
];

const overlayOptions: { value: OverlayType; label: string }[] = [
  { value: 'none', label: '无' },
  { value: 'hearts', label: '爱心' },
  { value: 'stars', label: '星星' },
  { value: 'sparkles', label: '闪光' },
  { value: 'confetti', label: '彩带' },
];

export function AdminDashboard({
  slides,
  title,
  subtitle,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
  onUpdateTitle,
  onExport,
  onImport,
  onReset,
  onLogout,
  onPreview,
}: AdminDashboardProps) {
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides[0]?.id || null);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);
  const [showSettings, setShowSettings] = useState(false);

  const selectedSlide = slides.find(s => s.id === selectedSlideId);

  const handleAddSlide = () => {
    const newSlide: Omit<Slide, 'id' | 'order'> = {
      title: '新页面',
      contentType: 'article',
      richText: '<p class="text-center">在这里编辑内容...</p>',
      background: 'gradient-romantic',
      overlays: [],
      transition: 'fade',
    };
    onAddSlide(newSlide);
    toast({ title: '已添加新页面', description: '请编辑内容' });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (onImport(result)) {
          toast({ title: '导入成功', description: '数据已更新' });
        } else {
          toast({ title: '导入失败', description: '请检查JSON格式', variant: 'destructive' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSaveSettings = () => {
    onUpdateTitle(editTitle, editSubtitle);
    setShowSettings(false);
    toast({ title: '设置已保存' });
  };

  const handleAddOverlay = (slideId: string) => {
    if (!selectedSlide) return;
    const newOverlay: Sticker = { type: 'hearts', position: 'top-right', size: 'md' };
    onUpdateSlide(slideId, { 
      overlays: [...(selectedSlide.overlays || []), newOverlay] 
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-lg font-bold text-gradient">管理后台</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">预览</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-card border-b border-border p-4 animate-fade-up">
          <div className="max-w-6xl mx-auto space-y-4">
            <h2 className="font-semibold">网站设置</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">标题</label>
                <Input 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">副标题</label>
                <Input 
                  value={editSubtitle} 
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={handleSaveSettings}>保存设置</Button>
              <Button size="sm" variant="outline" onClick={onExport}>
                <Download className="w-4 h-4 mr-1" /> 导出JSON
              </Button>
              <Button size="sm" variant="outline" onClick={handleImport}>
                <Upload className="w-4 h-4 mr-1" /> 导入JSON
              </Button>
              <Button size="sm" variant="outline" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-1" /> 重置默认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full">
        {/* Slides list */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">页面列表</h2>
            <Button size="sm" variant="outline" onClick={handleAddSlide}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all",
                  selectedSlideId === slide.id 
                    ? "bg-primary/10 border-2 border-primary" 
                    : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                )}
                onClick={() => setSelectedSlideId(slide.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{index + 1}</span>
                <span className="flex-1 text-sm truncate">{slide.title}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="w-7 h-7 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slides.length > 1) {
                      onDeleteSlide(slide.id);
                      if (selectedSlideId === slide.id) {
                        setSelectedSlideId(slides[0]?.id || null);
                      }
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1 p-4 overflow-auto">
          {selectedSlide ? (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">页面标题</label>
                <Input
                  value={selectedSlide.title}
                  onChange={(e) => onUpdateSlide(selectedSlide.id, { title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">内容类型</label>
                <div className="flex gap-2 flex-wrap">
                  {contentTypeOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={selectedSlide.contentType === option.value ? 'default' : 'outline'}
                      onClick={() => onUpdateSlide(selectedSlide.id, { contentType: option.value })}
                    >
                      {option.icon}
                      <span className="ml-1">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">内容 (HTML)</label>
                <textarea
                  value={selectedSlide.richText || ''}
                  onChange={(e) => onUpdateSlide(selectedSlide.id, { richText: e.target.value })}
                  className="w-full min-h-[200px] p-3 rounded-xl border border-input bg-background text-sm font-mono resize-y"
                  placeholder="<p>在这里写入HTML内容...</p>"
                />
              </div>

              {(selectedSlide.contentType === 'image' || selectedSlide.contentType === 'mixed') && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    图片URL (每行一个)
                  </label>
                  <textarea
                    value={(selectedSlide.images || []).join('\n')}
                    onChange={(e) => onUpdateSlide(selectedSlide.id, { 
                      images: e.target.value.split('\n').filter(url => url.trim()) 
                    })}
                    className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background text-sm font-mono resize-y"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">背景效果</label>
                <div className="flex gap-2 flex-wrap">
                  {backgroundOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={selectedSlide.background === option.value ? 'default' : 'outline'}
                      onClick={() => onUpdateSlide(selectedSlide.id, { background: option.value })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">贴纸效果</label>
                  <Button size="sm" variant="ghost" onClick={() => handleAddOverlay(selectedSlide.id)}>
                    <Plus className="w-4 h-4" /> 添加
                  </Button>
                </div>
                <div className="space-y-2">
                  {(selectedSlide.overlays || []).map((overlay, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <select
                        value={overlay.type}
                        onChange={(e) => {
                          const newOverlays = [...selectedSlide.overlays];
                          newOverlays[index] = { ...overlay, type: e.target.value as OverlayType };
                          onUpdateSlide(selectedSlide.id, { overlays: newOverlays });
                        }}
                        className="flex-1 p-2 rounded-md border border-input bg-background text-sm"
                      >
                        {overlayOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={overlay.position}
                        onChange={(e) => {
                          const newOverlays = [...selectedSlide.overlays];
                          newOverlays[index] = { ...overlay, position: e.target.value as Sticker['position'] };
                          onUpdateSlide(selectedSlide.id, { overlays: newOverlays });
                        }}
                        className="p-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="top-left">左上</option>
                        <option value="top-right">右上</option>
                        <option value="bottom-left">左下</option>
                        <option value="bottom-right">右下</option>
                        <option value="center">居中</option>
                      </select>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8"
                        onClick={() => {
                          const newOverlays = selectedSlide.overlays.filter((_, i) => i !== index);
                          onUpdateSlide(selectedSlide.id, { overlays: newOverlays });
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              选择一个页面进行编辑
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
