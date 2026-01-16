import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Home, Calendar, TrendingUp } from 'lucide-react';
import { AdminBackground } from './AdminBackground';
import { SnowEffect } from '../SnowEffect';
import { AdventCalendarSettings } from './AdventCalendarSettings';
import { StatsSettings } from './StatsSettings_NEW';
import { HomepageSettings } from './HomepageSettings';
import { getSettings } from '../../utils/settings';
import { GlareCard } from '../ui/glare-card';

interface AdminDashboardProps {
  onLogout: () => void;
  onBack: () => void;
}

export function AdminDashboard({ onLogout, onBack }: AdminDashboardProps) {
  const [selectedLanding, setSelectedLanding] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiltStyles, setTiltStyles] = useState<any[]>([{}, {}, {}]);
  const settings = getSettings();

  console.log('AdminDashboard rendered with new cards design');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setTiltStyles(prev => {
      const newStyles = [...prev];
      newStyles[index] = {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'none'
      };
      return newStyles;
    });
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    setTiltStyles(prev => {
      const newStyles = [...prev];
      newStyles[index] = {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      };
      return newStyles;
    });
  };

  const cards = [
    {
      id: 'homepage',
      icon: Home,
      title: 'Контент главной',
      description: 'Управление текстами лендингов'
    },
    {
      id: 'advent-calendar',
      icon: Calendar,
      title: 'Адвент Календарь',
      description: 'Управление настройками лендинга'
    },
    {
      id: 'stats-2025',
      icon: TrendingUp,
      title: 'Итоги 2025',
      description: 'Управление настройками лендинга'
    }
  ];

  if (selectedLanding === 'advent-calendar') {
    return (
      <AdventCalendarSettings 
        onBack={() => setSelectedLanding(null)} 
        onLogout={onLogout}
        onBackToSite={onBack}
      />
    );
  }

  if (selectedLanding === 'stats-2025') {
    return (
      <StatsSettings 
        onBack={() => setSelectedLanding(null)} 
        onLogout={onLogout}
        onBackToSite={onBack}
      />
    );
  }

  if (selectedLanding === 'homepage') {
    return (
      <HomepageSettings 
        onBack={() => setSelectedLanding(null)} 
        onLogout={onLogout}
        onBackToSite={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <AdminBackground />
      
      {/* Snow Effect */}
      {settings.snowEnabled && <SnowEffect intensity={settings.snowIntensity} />}
      
      {/* Затемнение всего фона */}
      <div 
        className="absolute inset-0 bg-black/60 pointer-events-none"
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
              >
                <ArrowLeft className="w-5 h-5" />
                Выйти из админки
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white border border-white/20"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', borderRadius: '12px' }}
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="mt-12">
            <h1 
              className="text-white text-center mb-4"
              style={{ 
                fontFamily: 'Argent CF, sans-serif', 
                fontWeight: 400, 
                fontStyle: 'italic', 
                fontSize: '40pt', 
                lineHeight: '0.9' 
              }}
            >
              Панель управления
            </h1>
            
            <p 
              className="text-white/70 text-center mb-12"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt' }}
            >
              Управление контентом и настройками
            </p>
            
            {/* Landing cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              {cards.map((card, index) => {
                const Icon = card.icon;
                const isHovered = hoveredIndex === index;
                
                const borderStyle = isHovered ? {
                  borderRadius: '24px',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), 0 0 20px rgba(249, 115, 22, 0.3), 0 0 10px rgba(239, 68, 68, 0.2), inset 0 0 0 2pt #ef4444, inset 0 0 0 4pt rgba(255, 255, 255, 0.2)'
                } : {
                  borderRadius: '24px',
                  boxShadow: 'inset 0 0 0 2pt rgba(255, 255, 255, 0.3)'
                };
                
                return (
                  <div
                    key={card.id}
                    className="relative flex cursor-pointer"
                    style={{ 
                      zIndex: isHovered ? 20 : 'auto',
                      transition: 'transform 0.1s ease-out',
                      ...(window.innerWidth >= 768 ? tiltStyles[index] : {})
                    }}
                    onMouseEnter={() => window.innerWidth >= 768 && setHoveredIndex(index)}
                    onMouseMove={(e) => window.innerWidth >= 768 && handleMouseMove(e, index)}
                    onMouseLeave={() => window.innerWidth >= 768 && handleMouseLeave(index)}
                    onClick={() => setSelectedLanding(card.id)}
                  >
                    <div className="w-full md:block" style={{ transformStyle: 'preserve-3d' }}>
                      <GlareCard
                        className={`relative overflow-hidden md:p-8 p-5 h-full transition-all duration-300`}
                        style={{
                          ...borderStyle,
                          borderRadius: isHovered ? '22px' : '24px',
                          aspectRatio: window.innerWidth >= 768 ? '1 / 1' : 'auto'
                        }}
                      >
                        {/* Background layer with blur */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            pointerEvents: 'none',
                            borderRadius: isHovered ? '20px' : '22px',
                            transition: 'border-radius 0.3s ease'
                          }}
                        />
                        
                        {/* Color overlay */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: isHovered 
                              ? 'linear-gradient(135deg, rgb(220, 38, 38) 0%, rgb(234, 88, 12) 50%, rgb(220, 38, 38) 100%)'
                              : 'linear-gradient(135deg, rgba(71, 85, 105, 0.2) 0%, rgba(100, 116, 139, 0.15) 50%, rgba(148, 163, 184, 0.2) 100%)',
                            pointerEvents: 'none',
                            borderRadius: isHovered ? '20px' : '22px',
                            transition: 'background 0.3s ease, border-radius 0.3s ease'
                          }}
                        />
                        
                        {/* Content */}
                        <div className={`flex flex-col md:h-full relative z-10 ${isHovered ? 'md:animate-pulse-scale' : ''}`}>
                          {/* Icon слева сверху */}
                          <div className="md:mb-4 mb-3">
                            <div 
                              className={`w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center transition-all duration-300 ${
                                isHovered ? 'md:scale-110' : ''
                              }`}
                            >
                              <Icon className={`w-7 h-7 text-white transition-transform duration-300`} />
                            </div>
                          </div>
                        
                          {/* Text внизу слева */}
                          <div className="flex-1 flex flex-col md:justify-end pt-0 md:pt-2">
                            <h3 className="text-white md:mb-3 mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: window.innerWidth < 768 ? '16pt' : '18pt', fontWeight: 600, lineHeight: '1.2' }}>
                              {card.title}
                            </h3>
                            <p className="text-white/80" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: window.innerWidth < 768 ? '11pt' : '13pt', lineHeight: '1.4' }}>
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </GlareCard>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      ` }} />
    </div>
  );
}