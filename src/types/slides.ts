export type ContentType = 'article' | 'image' | 'mixed';

export type BackgroundType = 'gradient-romantic' | 'gradient-teal' | 'gradient-pink' | 'particles' | 'hearts' | 'stars' | 'solid';

export type OverlayType = 'hearts' | 'stars' | 'sparkles' | 'confetti' | 'none';

export type TransitionType = 'fade' | 'slide' | 'scale';

export type StickerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface Sticker {
  type: OverlayType;
  position: StickerPosition;
  size: 'sm' | 'md' | 'lg';
}

export interface Slide {
  id: string;
  title: string;
  contentType: ContentType;
  richText?: string;
  images?: string[];
  background: BackgroundType;
  overlays: Sticker[];
  transition: TransitionType;
  order: number;
}

export interface SlidesData {
  slides: Slide[];
  title: string;
  subtitle: string;
  lastUpdated: string;
}

export type UserMode = 'viewer' | 'admin' | null;
