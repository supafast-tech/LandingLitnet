import BackgroundFixed from './BackgroundFixed';
import { SnowEffect } from './SnowEffect';
import { useState, useEffect } from 'react';

interface PlaceholderBannerProps {
  text: string;
  subtext?: string;
  buttonText: string;
  buttonLink: string;
  snowEnabled?: boolean;
  isLoading?: boolean;
}

export function PlaceholderBanner({ text, subtext, buttonText, buttonLink, snowEnabled = true, isLoading = false }: PlaceholderBannerProps) {
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
      
      {/* Затемнение только снизу под текстом */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '50vh',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)'
        }}
      />
      
      {/* Content - как в Header */}
      <div className="relative h-screen flex items-end justify-center overflow-hidden">
        <div className="absolute left-0 right-0 flex justify-center z-10 text-center px-4 w-full max-w-7xl mx-auto" style={{ bottom: '128pt' }}>
          {/* Main title - стили как в Header */}
          <div>
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
                  fontFamily: '"Montserrat", sans-serif', 
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
        </div>

        {/* Button - без анимации и стрелки */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
          {isLoading ? (
            // Loader
            <div className="flex items-center justify-center">
              <div 
                className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"
                style={{
                  animation: 'spin 1s linear infinite'
                }}
              />
            </div>
          ) : (
            <button
              onClick={handleButtonClick}
              className="text-white hover:scale-105 transition-transform duration-300"
            >
              <div 
                className="px-8 py-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-full border-2 border-white/30 flex items-center justify-center"
                style={{ 
                  boxShadow: '0 0 20px rgba(234, 88, 12, 0.8), 0 0 10px rgba(239, 68, 68, 0.6)',
                }}
              >
                <span 
                  className="text-white drop-shadow-lg whitespace-nowrap" 
                  style={{ 
                    fontFamily: '"Montserrat", sans-serif', 
                    fontSize: '14pt', 
                    lineHeight: '1', 
                    fontWeight: 600,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                >
                  {buttonText}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      ` }} />
    </div>
  );
}
