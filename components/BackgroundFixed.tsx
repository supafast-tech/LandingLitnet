// Автоматическая конвертация в WebP при сборке для оптимизации (настроено в vite.config.ts)
import adventBackgroundImage from '../images/advent-back-25.png';
import { useEffect, useState } from 'react';

export default function BackgroundFixed() {
  // ФИКСИРОВАННАЯ позиция БЕЗ параллакса - одинаковая на локале и на Vercel
  // Позиция не меняется при скролле
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  useEffect(() => {
    let scrollFrame: number | null = null;
    let resizeTimeout: NodeJS.Timeout | null = null;
    
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150); // Debounce resize
    };
    
    const handleScroll = () => {
      // ТОЛЬКО для затемнения - БЕЗ изменения позиции картинки (параллакс убран)
      if (scrollFrame) {
        return;
      }
      
      scrollFrame = requestAnimationFrame(() => {
        // Затемнение появляется когда скролл больше высоты экрана
        const heroHeight = Math.max(window.innerHeight, 1);
        const darkenOpacity = Math.min(window.scrollY / heroHeight, 1);
        setScrollOpacity(darkenOpacity);
        
        scrollFrame = null;
      });
    };
    
    handleScroll(); // Initial call
    handleResize(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollFrame) {
        cancelAnimationFrame(scrollFrame);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);
  
  // Background image
  const backgroundImageUrl = adventBackgroundImage || '';
  
  return (
    <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden" data-name="background_fixed" style={{ backgroundColor: '#1a1a2e' }}>
      {/* New background image */}
      <div className="absolute inset-0">
        {backgroundImageUrl && (
          <img
            alt=""
            className="absolute w-full h-full object-cover"
            src={backgroundImageUrl}
            onError={(e) => {
              console.error('Failed to load background image:', backgroundImageUrl);
              e.currentTarget.style.display = 'none';
            }}
            style={{
              // ФИКСИРОВАННАЯ позиция БЕЗ параллакса - одинаковая на локале и Vercel
              objectPosition: isMobile 
                ? '70% 158%'  // Мобилка: сдвиг вправо на 70%, фиксированная позиция по Y
                : 'center 158%', // Центр по горизонтали, фиксированная позиция по Y
              transform: 'scale(1.20) translateY(64px)', // Опущено на 64px (64pt ≈ 64px)
              // Без transition для objectPosition - позиция не меняется
              transition: 'transform 0.1s linear'
            }}
          />
        )}
      </div>
      
      {/* Bottom darkening gradient (always visible) */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      </div>
      
      {/* Top darkening overlay (appears on scroll) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
          opacity: scrollOpacity
        }}
      />
    </div>
  );
}
