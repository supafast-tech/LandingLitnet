import adventBackgroundImage from '../images/advent-back-25.png';
import { useEffect, useState } from 'react';

export default function BackgroundFixed() {
  const [backgroundPositionY, setBackgroundPositionY] = useState(30);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrolled / Math.max(maxScroll, 1), 1);
      
      // Начинаем с 30% (центр Деда Мороза), максимум 70% (больше снега снизу)
      const newPosition = 30 + (scrollProgress * 40);
      setBackgroundPositionY(newPosition);
      
      // Затемнение появляется когда скролл больше высоты экрана
      const heroHeight = Math.max(window.innerHeight, 1);
      const darkenOpacity = Math.min(scrolled / heroHeight, 1);
      setScrollOpacity(darkenOpacity);
    };
    
    handleScroll(); // Initial call
    handleResize(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
                ? `70% ${backgroundPositionY + 64}%`  // Мобилка: сдвиг вправо на 70%, опущено на 64pt
                : `center ${backgroundPositionY + 64}%`, // Опущено на 64pt
              transform: 'scale(1.20)',
              transition: 'object-position 0.1s linear'
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
