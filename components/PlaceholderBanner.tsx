import BackgroundFixed from './BackgroundFixed';
import { SnowEffect } from './SnowEffect';
import { ChevronDown } from 'lucide-react';

interface PlaceholderBannerProps {
  text: string;
  subtext?: string;
  buttonText: string;
  buttonLink: string;
  snowEnabled?: boolean;
}

export function PlaceholderBanner({ text, subtext, buttonText, buttonLink, snowEnabled = true }: PlaceholderBannerProps) {
  const handleButtonClick = () => {
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank');
    } else {
      window.location.href = buttonLink;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <BackgroundFixed />
      
      {/* Snow Effect */}
      {snowEnabled && <SnowEffect intensity="normal" />}
      
      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      {/* Content - как в Header */}
      <div className="relative h-screen flex items-end justify-center overflow-hidden" style={{ paddingBottom: '180px' }}>
        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
          {/* Main title - стили как в Header */}
          <h1 
            className="text-white drop-shadow-2xl mb-6 max-w-6xl mx-auto md:text-[72pt] text-[36pt]"
            style={{ 
              fontFamily: '"Argent CF", sans-serif', 
              fontWeight: 400, 
              fontStyle: 'italic', 
              textShadow: '0 2px 15px rgba(0,0,0,0.3), 0 1px 6px rgba(0,0,0,0.2)', 
              lineHeight: '0.9',
              whiteSpace: 'pre-line',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            {text.split('\n').map((line, i) => (
              <span key={i} className="font-[Argent_CF]">
                {line}
                {i < text.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          
          {/* Subtitle - стили как в Header */}
          {subtext && (
            <h3 
              className="text-white/90 drop-shadow-xl max-w-3xl mx-auto md:text-[16pt] text-[12pt]"
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                lineHeight: '1.4', 
                textShadow: '0 1px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                whiteSpace: 'pre-line',
                fontWeight: 400,
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              {subtext}
            </h3>
          )}
        </div>

        {/* Button - стили как в Header */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
          <button
            onClick={handleButtonClick}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform duration-300 group"
            style={{
              animation: 'bounce 2s ease-in-out infinite'
            }}
          >
            <div 
              className="px-6 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-full border-2 border-white/30"
              style={{ 
                boxShadow: '0 0 20px rgba(234, 88, 12, 0.8), 0 0 10px rgba(239, 68, 68, 0.6)',
              }}
            >
              <span 
                className="text-white drop-shadow-lg" 
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontSize: '14pt', 
                  lineHeight: '0.9', 
                  fontWeight: 600,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              >
                {buttonText}
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
        ` }} />
      </div>
    </div>
  );
}
