// Автоматическая конвертация в WebP при сборке для оптимизации
import adventBackgroundImage from '../images/advent-back-25.png?format=webp&quality=85';
import { useEffect, useState } from 'react';

export default function BackgroundFixed() {
  // Начальное смещение увеличено на 128pt (с 30 до 158 для опускания картинки ниже)
  const [backgroundPositionY, setBackgroundPositionY] = useState(158);
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
      // Throttle scroll с requestAnimationFrame
      if (scrollFrame) {
        return;
      }
      
      scrollFrame = requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrolled / Math.max(maxScroll, 1), 1);
        
        // Начинаем с 158% (опущено ниже на 128pt), максимум 198% (больше снега снизу)
        const newPosition = 158 + (scrollProgress * 40);
        setBackgroundPositionY(newPosition);
        
        // Затемнение появляется когда скролл больше высоты экрана
        const heroHeight = Math.max(window.innerHeight, 1);
        const darkenOpacity = Math.min(scrolled / heroHeight, 1);
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
              objectPosition: isMobile 
                ? `70% ${backgroundPositionY}%`  // Мобилка: сдвиг вправо на 70%
                : `center ${backgroundPositionY}%`, // Центр по горизонтали
              transform: 'scale(1.20) translateY(64px)', // Опущено на 64px (64pt ≈ 64px)
              transition: 'object-position 0.1s linear, transform 0.1s linear'
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
