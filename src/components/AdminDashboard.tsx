import { useState, useCallback, useRef } from 'react';
import { 
  Plus, Trash2, GripVertical, Eye, Download, Upload, 
  RotateCcw, LogOut, Image, FileText, Layers, Settings,
  Video, ChevronDown, ChevronUp, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Slide, ContentType, BackgroundType, OverlayType, Sticker, StickerPosition, BGMConfig } from '@/types/slides';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { BGMManager } from '@/components/MusicPlayer';

interface AdminDashboardProps {
  slides: Slide[];
  title: string;
  subtitle: string;
  bgmConfig?: BGMConfig;
  onUpdateSlide: (id: string, updates: Partial<Slide>) => void;
  onAddSlide: (slide: Omit<Slide, 'id' | 'order'>) => void;
  onDeleteSlide: (id: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onUpdateTitle: (title: string, subtitle: string) => void;
  onUpdateBGM: (config: BGMConfig) => void;
  onExport: () => void;
  onImport: (json: string) => boolean;
  onReset: () => void;
  onLogout: () => void;
  onPreview: () => void;
}

const contentTypeOptions: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'article', label: '文章', icon: <FileText className="w-4 h-4" /> },
  { value: 'image', label: '图片', icon: <Image className="w-4 h-4" /> },
  { value: 'video', label: '视频', icon: <Video className="w-4 h-4" /> },
  { value: 'mixed', label: '混合', icon: <Layers className="w-4 h-4" /> },
];

const backgroundOptions: { value: BackgroundType; label: string; emoji: string }[] = [
  { value: 'gradient-romantic', label: '浪漫渐变', emoji: '🌸' },
  { value: 'gradient-teal', label: '青绿渐变', emoji: '🌊' },
  { value: 'gradient-pink', label: '粉色渐变', emoji: '💗' },
  { value: 'gradient-flow', label: '流动渐变', emoji: '🌈' },
  { value: 'hearts', label: '漂浮爱心', emoji: '💕' },
  { value: 'stars', label: '闪烁星星', emoji: '⭐' },
  { value: 'particles', label: '粒子光斑', emoji: '✨' },
  { value: 'confetti', label: '彩色纸屑', emoji: '🎊' },
  { value: 'snow', label: '轻雪飘落', emoji: '❄️' },
  { value: 'bokeh', label: '柔光光斑', emoji: '🔮' },
  { value: 'ripple', label: '水波涟漪', emoji: '💧' },
  { value: 'aurora', label: '极光效果', emoji: '🌌' },
  { value: 'solid', label: '纯色背景', emoji: '⬜' },
];

const overlayOptions: { value: OverlayType; label: string; emoji: string }[] = [
  { value: 'none', label: '无', emoji: '➖' },
  { value: 'hearts', label: '爱心', emoji: '❤️' },
  { value: 'stars', label: '星星', emoji: '⭐' },
  { value: 'sparkles', label: '闪光', emoji: '✨' },
  { value: 'confetti', label: '彩带', emoji: '🎉' },
  { value: 'balloons', label: '气球', emoji: '🎈' },
  { value: 'fireworks', label: '烟花', emoji: '🎆' },
  { value: 'ribbons', label: '丝带', emoji: '🎀' },
  { value: 'countdown', label: '倒计时', emoji: '⏰' },
];

const positionOptions: { value: StickerPosition; label: string }[] = [
  { value: 'top-left', label: '左上' },
  { value: 'top-right', label: '右上' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-right', label: '右下' },
  { value: 'center', label: '居中' },
  { value: 'floating', label: '浮动' },
];

export function AdminDashboard({
  slides,
  title,
  subtitle,
  bgmConfig,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides,
  onUpdateTitle,
  onUpdateBGM,
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('content');

  const selectedSlide = slides.find(s => s.id === selectedSlideId);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const newOverlay: Sticker = { type: 'hearts', position: 'top-right', size: 'md', opacity: 1 };
    onUpdateSlide(slideId, { 
      overlays: [...(selectedSlide.overlays || []), newOverlay] 
    });
  };

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    onReorderSlides(draggedIndex, dropIndex);
    setDraggedIndex(null);
  }, [draggedIndex, onReorderSlides]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  // Image upload handler
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedSlide) return;

    const newImages: string[] = [...(selectedSlide.images || [])];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newImages.push(dataUrl);
        onUpdateSlide(selectedSlide.id, { images: newImages });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }, [selectedSlide, onUpdateSlide]);

  // Video upload handler
  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlide) return;

    if (!file.type.startsWith('video/')) {
      toast({ title: '请选择视频文件', variant: 'destructive' });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: '视频文件不能超过50MB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newVideos = [...(selectedSlide.videos || []), dataUrl];
      onUpdateSlide(selectedSlide.id, { videos: newVideos });
      toast({ title: '视频已添加' });
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  }, [selectedSlide, onUpdateSlide]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const SectionHeader = ({ id, title, icon }: { id: string; title: string; icon: React.ReactNode }) => (
    <button
      className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors"
      onClick={() => toggleSection(id)}
    >
      <span className="flex items-center gap-2 font-medium text-sm">
        {icon}
        {title}
      </span>
      {expandedSection === id ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

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
          <div className="max-w-6xl mx-auto space-y-6">
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

            {/* BGM Manager */}
            <BGMManager bgmConfig={bgmConfig} onUpdateBGM={onUpdateBGM} />

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
        <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">页面列表 ({slides.length})</h2>
            <Button size="sm" variant="outline" onClick={handleAddSlide}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-3">拖拽调整顺序</p>

          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all group",
                  selectedSlideId === slide.id 
                    ? "bg-primary/10 border-2 border-primary" 
                    : "bg-muted/50 hover:bg-muted border-2 border-transparent",
                  draggedIndex === index && "opacity-50 scale-95"
                )}
                onClick={() => setSelectedSlideId(slide.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 drag-handle cursor-grab active:cursor-grabbing" />
                <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                <span className="flex-1 text-sm truncate">{slide.title}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slides.length > 1) {
                      onDeleteSlide(slide.id);
                      if (selectedSlideId === slide.id) {
                        setSelectedSlideId(slides[0]?.id || null);
                      }
                      toast({ title: '已删除页面' });
                    } else {
                      toast({ title: '至少保留一个页面', variant: 'destructive' });
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
            <div className="space-y-4">
              {/* Page title */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">页面标题</label>
                <Input
                  value={selectedSlide.title}
                  onChange={(e) => onUpdateSlide(selectedSlide.id, { title: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Content Type */}
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

              {/* Content Section */}
              <div className="space-y-3">
                <SectionHeader id="content" title="内容编辑" icon={<FileText className="w-4 h-4" />} />
                
                {expandedSection === 'content' && (
                  <div className="space-y-4 animate-fade-up">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">HTML 内容</label>
                      <textarea
                        value={selectedSlide.richText || ''}
                        onChange={(e) => onUpdateSlide(selectedSlide.id, { richText: e.target.value })}
                        className="w-full min-h-[150px] p-3 rounded-xl border border-input bg-background text-sm font-mono resize-y"
                        placeholder="<p>在这里写入HTML内容...</p>"
                      />
                    </div>

                    {(selectedSlide.contentType === 'image' || selectedSlide.contentType === 'mixed') && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">图片</label>
                        <div className="space-y-2">
                          {/* Image previews */}
                          {(selectedSlide.images || []).length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {(selectedSlide.images || []).map((img, idx) => (
                                <div key={idx} className="relative group aspect-square">
                                  <img 
                                    src={img} 
                                    alt={`图片 ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      const newImages = selectedSlide.images?.filter((_, i) => i !== idx);
                                      onUpdateSlide(selectedSlide.id, { images: newImages });
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Image className="w-5 h-5" />
                              点击上传图片
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {(selectedSlide.contentType === 'video' || selectedSlide.contentType === 'mixed') && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">视频</label>
                        <div className="space-y-2">
                          {/* Video previews */}
                          {(selectedSlide.videos || []).map((vid, idx) => (
                            <div key={idx} className="relative group">
                              <video 
                                src={vid}
                                controls
                                className="w-full rounded-lg"
                              />
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newVideos = selectedSlide.videos?.filter((_, i) => i !== idx);
                                  onUpdateSlide(selectedSlide.id, { videos: newVideos });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Video className="w-5 h-5" />
                              点击上传视频 (最大50MB)
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Background Section */}
              <div className="space-y-3">
                <SectionHeader id="background" title="背景效果" icon={<span className="text-sm">🎨</span>} />
                
                {expandedSection === 'background' && (
                  <div className="space-y-4 animate-fade-up">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {backgroundOptions.map((option) => (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={selectedSlide.background === option.value ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => onUpdateSlide(selectedSlide.id, { background: option.value })}
                        >
                          <span className="mr-1">{option.emoji}</span>
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    {/* Background settings */}
                    <div className="space-y-3 p-3 bg-muted/30 rounded-xl">
                      <div>
                        <label className="text-xs text-muted-foreground flex justify-between">
                          <span>强度</span>
                          <span>{selectedSlide.backgroundSettings?.intensity ?? 50}%</span>
                        </label>
                        <Slider
                          value={[selectedSlide.backgroundSettings?.intensity ?? 50]}
                          onValueChange={(v) => onUpdateSlide(selectedSlide.id, { 
                            backgroundSettings: { 
                              ...selectedSlide.backgroundSettings,
                              type: selectedSlide.background,
                              intensity: v[0] 
                            }
                          })}
                          max={100}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground flex justify-between">
                          <span>速度</span>
                          <span>{selectedSlide.backgroundSettings?.speed ?? 50}%</span>
                        </label>
                        <Slider
                          value={[selectedSlide.backgroundSettings?.speed ?? 50]}
                          onValueChange={(v) => onUpdateSlide(selectedSlide.id, { 
                            backgroundSettings: { 
                              ...selectedSlide.backgroundSettings,
                              type: selectedSlide.background,
                              speed: v[0] 
                            }
                          })}
                          max={100}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground flex justify-between">
                          <span>密度</span>
                          <span>{selectedSlide.backgroundSettings?.density ?? 50}%</span>
                        </label>
                        <Slider
                          value={[selectedSlide.backgroundSettings?.density ?? 50]}
                          onValueChange={(v) => onUpdateSlide(selectedSlide.id, { 
                            backgroundSettings: { 
                              ...selectedSlide.backgroundSettings,
                              type: selectedSlide.background,
                              density: v[0] 
                            }
                          })}
                          max={100}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlays Section */}
              <div className="space-y-3">
                <SectionHeader id="overlays" title="贴纸效果" icon={<span className="text-sm">🎀</span>} />
                
                {expandedSection === 'overlays' && (
                  <div className="space-y-3 animate-fade-up">
                    <Button size="sm" variant="outline" onClick={() => handleAddOverlay(selectedSlide.id)}>
                      <Plus className="w-4 h-4 mr-1" /> 添加贴纸
                    </Button>

                    <div className="space-y-2">
                      {(selectedSlide.overlays || []).map((overlay, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                          <select
                            value={overlay.type}
                            onChange={(e) => {
                              const newOverlays = [...selectedSlide.overlays];
                              newOverlays[index] = { ...overlay, type: e.target.value as OverlayType };
                              onUpdateSlide(selectedSlide.id, { overlays: newOverlays });
                            }}
                            className="flex-1 p-2 rounded-lg border border-input bg-background text-sm"
                          >
                            {overlayOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.emoji} {opt.label}
                              </option>
                            ))}
                          </select>
                          
                          <select
                            value={overlay.position}
                            onChange={(e) => {
                              const newOverlays = [...selectedSlide.overlays];
                              newOverlays[index] = { ...overlay, position: e.target.value as StickerPosition };
                              onUpdateSlide(selectedSlide.id, { overlays: newOverlays });
                            }}
                            className="p-2 rounded-lg border border-input bg-background text-sm"
                          >
                            {positionOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>

                          <select
                            value={overlay.size}
                            onChange={(e) => {
                              const newOverlays = [...selectedSlide.overlays];
                              newOverlays[index] = { ...overlay, size: e.target.value as 'sm' | 'md' | 'lg' };
                              onUpdateSlide(selectedSlide.id, { overlays: newOverlays });
                            }}
                            className="p-2 rounded-lg border border-input bg-background text-sm w-16"
                          >
                            <option value="sm">小</option>
                            <option value="md">中</option>
                            <option value="lg">大</option>
                          </select>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 flex-shrink-0"
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
                )}
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
