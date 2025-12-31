import { useState, useEffect, useCallback } from 'react';
import { SlidesData, Slide } from '@/types/slides';
import { defaultSlidesData } from '@/data/defaultSlides';

const STORAGE_KEY = 'romantic-slides-data';

export function useSlides() {
  const [slidesData, setSlidesData] = useState<SlidesData>(defaultSlidesData);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SlidesData;
        setSlidesData(parsed);
      }
    } catch (error) {
      console.error('Failed to load slides from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveData = useCallback((data: SlidesData) => {
    try {
      const updated = { ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSlidesData(updated);
    } catch (error) {
      console.error('Failed to save slides to localStorage:', error);
    }
  }, []);

  const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
    setSlidesData(prev => {
      const newSlides = prev.slides.map(slide =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      );
      const newData = { ...prev, slides: newSlides };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const addSlide = useCallback((slide: Omit<Slide, 'id' | 'order'>) => {
    setSlidesData(prev => {
      const newSlide: Slide = {
        ...slide,
        id: Date.now().toString(),
        order: prev.slides.length
      };
      const newData = { ...prev, slides: [...prev.slides, newSlide] };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const deleteSlide = useCallback((slideId: string) => {
    setSlidesData(prev => {
      const newSlides = prev.slides
        .filter(slide => slide.id !== slideId)
        .map((slide, index) => ({ ...slide, order: index }));
      const newData = { ...prev, slides: newSlides };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const reorderSlides = useCallback((startIndex: number, endIndex: number) => {
    setSlidesData(prev => {
      const newSlides = [...prev.slides];
      const [removed] = newSlides.splice(startIndex, 1);
      newSlides.splice(endIndex, 0, removed);
      const reordered = newSlides.map((slide, index) => ({ ...slide, order: index }));
      const newData = { ...prev, slides: reordered };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const updateTitle = useCallback((title: string, subtitle: string) => {
    setSlidesData(prev => {
      const newData = { ...prev, title, subtitle };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(slidesData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `romantic-slides-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [slidesData]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as SlidesData;
      if (parsed.slides && Array.isArray(parsed.slides)) {
        saveData(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [saveData]);

  const resetToDefault = useCallback(() => {
    saveData(defaultSlidesData);
  }, [saveData]);

  return {
    slidesData,
    slides: slidesData.slides.sort((a, b) => a.order - b.order),
    isLoading,
    updateSlide,
    addSlide,
    deleteSlide,
    reorderSlides,
    updateTitle,
    exportData,
    importData,
    resetToDefault
  };
}
