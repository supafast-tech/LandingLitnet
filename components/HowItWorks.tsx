import { Calendar, Gift, Clock, Sparkles } from 'lucide-react';
import { GlareCard } from './ui/glare-card';
import { useState, useRef, useEffect } from 'react';
import { getSettings, LandingSettings } from '../utils/settings';
import { ContentData } from '../utils/api';

interface HowItWorksProps {
  content?: ContentData;
}

export function HowItWorks({ content = {} }: HowItWorksProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiltStyles, setTiltStyles] = useState<Record<number, { transform: string }>>({});
  const [settings, setSettings] = useState<LandingSettings>(getSettings());
  
  useEffect(() => {
    setSettings(getSettings());
    
    // Load Argent CF font
    const link = document.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/argent-cf';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      setSettings(getSettings());
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);
  
  const icons = [Calendar, Gift, Clock, Sparkles];
  
  // Use content from advent_content if available, otherwise use settings
  const steps = [
    {
      icon: Calendar,
      title: content.how_it_works_step1_title || settings.howItWorksSteps[0]?.title || 'Заходите каждый день',
      description: content.how_it_works_step1_desc || settings.howItWorksSteps[0]?.description || ''
    },
    {
      icon: Gift,
      title: content.how_it_works_step2_title || settings.howItWorksSteps[1]?.title || 'Открывайте подарок',
      description: content.how_it_works_step2_desc || settings.howItWorksSteps[1]?.description || ''
    },
    {
      icon: Clock,
      title: content.how_it_works_step3_title || settings.howItWorksSteps[2]?.title || 'Используйте на Литнете',
      description: content.how_it_works_step3_desc || settings.howItWorksSteps[2]?.description || ''
    },
    {
      icon: Sparkles,
      title: content.how_it_works_step4_title || settings.howItWorksSteps[3]?.title || 'Собирайте все подарки',
      description: content.how_it_works_step4_desc || settings.howItWorksSteps[3]?.description || ''
    }
  ];
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTiltStyles(prev => ({
      ...prev,
      [index]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.15, 1.15, 1.15)`
      }
    }));
  };
  
  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    setTiltStyles(prev => ({
      ...prev,
      [index]: {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }
    }));
  };
  
  return (
    <section className="px-4 relative z-10 flex items-center" style={{ minHeight: '75vh' }}>
      {/* Затемнение по центру для читаемости текста */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 70%)'
        }}
      />
      
      <div className="mx-auto w-full relative z-10" style={{ maxWidth: '1080pt' }}>
        <h2 className="text-center mb-16 text-white drop-shadow-xl md:text-[52pt] text-[32pt]" style={{ fontFamily: '"Argent CF", sans-serif', fontWeight: 400, fontStyle: 'italic', lineHeight: '0.9' }}>
          {(content.how_it_works_title || settings.howItWorksTitle).split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < (content.how_it_works_title || settings.howItWorksTitle).split('\n').length - 1 && <br />}
            </span>
          ))}
        </h2>
        
        {/* Grid with 4 columns in 1 row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            const isHovered = hoveredIndex === index;
            // При ховере - как у сегодняшнего дня
            const borderStyle = isHovered ? {
              borderRadius: '24px',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), 0 0 20px rgba(249, 115, 22, 0.3), 0 0 10px rgba(239, 68, 68, 0.2), inset 0 0 0 2pt #ef4444, inset 0 0 0 4pt rgba(255, 255, 255, 0.2)'
            } : {
              borderRadius: '24px',
              boxShadow: 'inset 0 0 0 2pt rgba(255, 255, 255, 0.3)'
            };
            
            return (
              <div
                key={index}
                className="relative flex"
                style={{ 
                  zIndex: isHovered ? 20 : 'auto',
                  transition: 'transform 0.1s ease-out',
                  ...(window.innerWidth >= 768 ? tiltStyles[index] : {})
                }}
                onMouseEnter={() => window.innerWidth >= 768 && setHoveredIndex(index)}
                onMouseMove={(e) => window.innerWidth >= 768 && handleMouseMove(e, index)}
                onMouseLeave={() => window.innerWidth >= 768 && handleMouseLeave(index)}
              >
                <div className="w-full md:block" style={{ transformStyle: 'preserve-3d' }}>
                  <GlareCard
                    className={`relative overflow-hidden md:p-8 p-5 md:h-full transition-all duration-300`}
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
                        {step.title}
                      </h3>
                      <p className="text-white/80" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: window.innerWidth < 768 ? '11pt' : '13pt', lineHeight: '1.4' }}>
                        {step.description}
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
    </section>
  );
}