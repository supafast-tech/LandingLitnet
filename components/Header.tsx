import Logo from '../imports/Логотипы';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSettings, LandingSettings } from '../utils/settings';
import { ContentData } from '../utils/api';

interface HeaderProps {
  content?: ContentData;
}

export function Header({ content = {} }: HeaderProps) {
  // Load Argent CF font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/argent-cf';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  const [badgeTilt, setBadgeTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [settings, setSettings] = useState<LandingSettings>(getSettings());
  
  useEffect(() => {
    setSettings(getSettings());
    
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      setSettings(getSettings());
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);
  
  const scrollToCalendar = () => {
    const href = content.hero_button_link || settings.heroButtonLink;
    if (href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  const handleBadgeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const badge = e.currentTarget;
    const rect = badge.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    setBadgeTilt({ rotateX, rotateY });
  };
  
  const handleBadgeMouseLeave = () => {
    setBadgeTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen flex items-end justify-center overflow-hidden" style={{ paddingBottom: '180px' }}>
        {/* Logo at top */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <a 
            href="https://litnet.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-32 h-10 transition-transform duration-300 hover:scale-110"
          >
            <Logo />
          </a>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
          {/* Badge with "Зимнее чудо" */}
          <div className="mb-6 flex justify-center">
            <div 
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-md rounded-full cursor-pointer transition-all duration-300"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
                transform: `perspective(1000px) rotateX(${badgeTilt.rotateX}deg) rotateY(${badgeTilt.rotateY}deg) scale(${badgeTilt.rotateX === 0 && badgeTilt.rotateY === 0 ? 1 : 1.05})`,
              }}
              onMouseMove={handleBadgeMouseMove}
              onMouseLeave={handleBadgeMouseLeave}
            >
              <span className="text-xl">✨</span>
              <h3 className="text-white drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: window.innerWidth < 768 ? '10pt' : '12pt', lineHeight: '0.9' }}>
                Зимнее чудо от Деда Мороза
              </h3>
              <span className="text-xl">✨</span>
            </div>
          </div>
          
          {/* Main title */}
          <h1 className="text-white drop-shadow-2xl mb-6 max-w-6xl mx-auto md:text-[72pt] text-[36pt]" style={{ fontFamily: '"Argent CF", sans-serif', fontWeight: 400, fontStyle: 'italic', textShadow: '0 2px 15px rgba(0,0,0,0.3), 0 1px 6px rgba(0,0,0,0.2)', lineHeight: '0.9' }}>
            {(content.hero_title || settings.heroTitle).split('\n').map((line, i) => (
              <span key={i} className="font-[Argent_CF]">
                {line}
                {i < (content.hero_title || settings.heroTitle).split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <h3 className="text-white/90 drop-shadow-xl max-w-3xl mx-auto md:text-[16pt] text-[12pt]" style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: '1.4', textShadow: '0 1px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)' }}>
            {content.hero_subtitle || settings.heroSubtitle}
          </h3>
        </div>

        {/* Scroll to calendar button */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
          <button
            onClick={scrollToCalendar}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform duration-300 group"
            style={{
              animation: 'bounce 2s ease-in-out infinite'
            }}
          >
            <div className="px-6 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-full border-2 border-white/30" style={{ 
              boxShadow: '0 0 20px rgba(234, 88, 12, 0.8), 0 0 10px rgba(239, 68, 68, 0.6)',
            }}>
              <span className="text-white drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', lineHeight: '0.9', fontWeight: 600 }}>
                {content.hero_button_text || settings.heroButtonText}
              </span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          
          @keyframes glow-pulse {
            0%, 100% {
              box-shadow: 0 0 30px rgba(234, 88, 12, 0.8), 0 0 15px rgba(239, 68, 68, 0.6);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 40px rgba(234, 88, 12, 1), 0 0 25px rgba(239, 68, 68, 0.8);
              transform: scale(1.03);
            }
          }
          
          .animate-glow-pulse {
            animation: glow-pulse 3s ease-in-out infinite;
          }
        ` }} />
      </div>
    </>
  );
}