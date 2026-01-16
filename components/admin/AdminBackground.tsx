import { useEffect, useState } from 'react';
import newBgImage from 'figma:asset/e4aafa9eeb992109f037cc15bd7b05f69a077fad.png';

export function AdminBackground() {
  const [backgroundPositionY, setBackgroundPositionY] = useState(30);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrolled / Math.max(maxScroll, 1), 1);
      
      const newPosition = 30 + (scrollProgress * 40);
      setBackgroundPositionY(newPosition);
      
      const heroHeight = Math.max(window.innerHeight, 1);
      const darkenOpacity = Math.min(scrolled / heroHeight, 1);
      setScrollOpacity(darkenOpacity);
    };
    
    handleScroll();
    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden" data-name="admin_background">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          alt=""
          className="absolute w-full h-full object-cover"
          src={newBgImage}
          style={{
            objectPosition: isMobile 
              ? `70% ${backgroundPositionY}%`
              : `center ${backgroundPositionY}%`,
            transform: 'scale(1.20)',
            transition: 'object-position 0.1s linear'
          }}
        />
      </div>
      
      {/* Bottom darkening gradient */}
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