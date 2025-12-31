export type ContentType = 'article' | 'image' | 'video' | 'mixed';

export type BackgroundType = 
  | 'gradient-romantic' 
  | 'gradient-teal' 
  | 'gradient-pink' 
  | 'gradient-flow'
  | 'particles' 
  | 'hearts' 
  | 'stars' 
  | 'confetti'
  | 'bokeh'
  | 'ripple'
  | 'aurora'
  | 'snow'
  | 'solid';

export type OverlayType = 
  | 'hearts' 
  | 'stars' 
  | 'sparkles' 
  | 'confetti' 
  | 'balloons'
  | 'fireworks'
  | 'ribbons'
  | 'countdown'
  | 'none';

export type TransitionType = 'fade' | 'slide' | 'scale';

export type StickerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'floating';

export interface Sticker {
  type: OverlayType;
  position: StickerPosition;
  size: 'sm' | 'md' | 'lg';
  opacity?: number;
}

export interface MediaBlock {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  coverImage?: string;
}

export interface BackgroundSettings {
  type: BackgroundType;
  intensity?: number; // 0-100
  speed?: number; // 0-100
  density?: number; // 0-100
}

export interface Slide {
  id: string;
  title: string;
  contentType: ContentType;
  richText?: string;
  images?: string[];
  videos?: string[];
  mediaBlocks?: MediaBlock[];
  background: BackgroundType;
  backgroundSettings?: BackgroundSettings;
  overlays: Sticker[];
  transition: TransitionType;
  order: number;
}

export interface BGMConfig {
  enabled: boolean;
  url: string;
  fileName: string;
  volume: number; // 0-100
  autoPlay: boolean;
}

export interface SlidesData {
  slides: Slide[];
  title: string;
  subtitle: string;
  lastUpdated: string;
  bgm?: BGMConfig;
}

export type UserMode = 'viewer' | 'admin' | null;
