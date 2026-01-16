import { StatsData } from '../../utils/statsApi';
import { processLineBreaks, processTextWithPlaceholder } from '../../utils/textUtils';
import svgPaths from "../../imports/svg-398uq93q2b";
import highlightsPaths from "../../imports/svg-118r8zcvlf";
import characterImage from "figma:asset/76a8a2a3de45b5dadcfbfd1e42ec91b221c8046c.png";
import { useIsMobile } from '../../hooks/useIsMobile';

interface StatsSlide6Props {
  stats: StatsData | null;
  urlParams: Record<string, string>;
}

export function StatsSlide6({ stats, urlParams }: StatsSlide6Props) {
  const isMobile = useIsMobile();
  const paramName = stats?.slide6_genre_param || 'favorite_genre';
  const genre = urlParams[paramName] || 'Фэнтези';
  const mainText = stats?.slide6_text || `Ваш жанр – {жанр}.`;
  const cardText = stats?.slide6_card_text || 'Из всех добавленных вами в библиотеку у 2025 году книг большинство относятся к жанру {жанр}. Вы созданы друг для друга!';

  // Process text - replace {жанр} or {favorite_genre} with genre value
  const processGenreText = (text: string) => {
    const placeholder = text.includes(`{${paramName}}`) ? `{${paramName}}` : '{жанр}';
    return processTextWithPlaceholder(text, placeholder, genre, true, '', isMobile);
  };

  // Process cardText with genre replacement
  const processCardWithGenre = (text: string) => {
    const placeholder = text.includes(`{${paramName}}`) ? `{${paramName}}` : '{жанр}';
    let processedText = text.replace(new RegExp(placeholder, 'g'), genre);
    return processLineBreaks(processedText, isMobile);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background gradient only */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 1200">
        <rect fill="url(#statsGradient6)" height="1200" width="1920" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="statsGradient6" x1="0" x2="1920" y1="0" y2="1200">
            <stop stopColor="#8E44AD" />
            <stop offset="0.3" stopColor="#A569BD" />
            <stop offset="0.7" stopColor="#BB8FCE" />
            <stop offset="1" stopColor="#D7BDE2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Litnet Logo Pattern - right side with blur */}
      <div className="absolute h-full right-[-267.38px] top-0 w-[1164.38px] opacity-10" style={{ filter: 'blur(8px)' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1165 1080">
          <path d={svgPaths.p5c5580} fill="white" />
        </svg>
      </div>

      {/* Litnet Logo - top center */}
      <div className="absolute left-1/2 top-[49px] -translate-x-1/2 h-[32px] z-20" style={{ width: '106px' }}>
        <svg className="block size-full" fill="none" viewBox="0 0 24 24"><path d={svgPaths.p75a9580} fill="white" /></svg>
      </div>

      {/* Character image - ABSOLUTE in corner, outside content container */}
      {!isMobile && (
        <img 
          src={characterImage} 
          alt="" 
          className="absolute pointer-events-none select-none"
          style={{ 
            bottom: 0,
            right: 0,
            height: 'auto',
            width: 'auto',
            maxHeight: '100vh',
            maxWidth: '50vw',
            transform: 'scaleX(-1)',
            zIndex: 5,
            userSelect: 'none',
            pointerEvents: 'none',
            WebkitUserDrag: 'none',
            objectFit: 'contain',
            objectPosition: 'bottom right'
          }}
          draggable={false}
        />
      )}

      {/* Character image - Mobile version */}
      {isMobile && (
        <div 
          className="absolute w-full pointer-events-none" 
          style={{ 
            zIndex: 5, 
            bottom: '-40pt',
            left: '50%',
            transform: 'translateX(-50%) scale(1.5) scaleX(-1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          <img 
            src={characterImage} 
            alt="" 
            className="select-none"
            style={{ 
              userSelect: 'none',
              pointerEvents: 'none',
              WebkitUserDrag: 'none',
              width: '100%',
              height: 'auto'
            }}
            draggable={false}
          />
        </div>
      )}

      {/* Content - in front */}
      <div className="relative z-10 flex items-center w-full h-full px-4 md:px-20">
        {/* Left side - Text content */}
        <div 
          className="flex flex-col w-full md:w-auto" 
          style={{ 
            zIndex: 10, 
            position: isMobile ? 'absolute' : 'relative',
            top: isMobile ? 'calc(49px + 32px + 32pt)' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : 'auto',
            maxWidth: isMobile ? '100%' : '1080pt',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            paddingLeft: isMobile ? '16px' : '80pt',
            paddingRight: isMobile ? '16px' : '0',
            gap: isMobile ? '16px' : '32px'
          }}
        >
          {/* Icon */}
          <div className="w-[67px] h-[65px] hidden md:block md:-ml-[70px]">
            <svg className="block size-full" fill="none" viewBox="0 0 67 65" style={{ transform: 'scale(1, -1)' }}>
              <g>
                <path clipRule="evenodd" d={highlightsPaths.p2a1a2800} fill="white" fillRule="evenodd" />
                <path clipRule="evenodd" d={highlightsPaths.p3c3de00} fill="white" fillRule="evenodd" />
                <path clipRule="evenodd" d={highlightsPaths.p1a795340} fill="white" fillRule="evenodd" />
              </g>
            </svg>
          </div>

          {/* Main text */}
          <h2 
            className="font-['Lora',sans-serif] text-white md:text-[80px] md:leading-[1] md:-mt-4" 
            style={{ 
              fontSize: isMobile ? '32pt' : '80px',
              lineHeight: isMobile ? '100%' : '1',
              width: isMobile ? '100%' : '540pt'
            }}
          >
            {processGenreText(mainText)}
          </h2>

          {/* Subtitle */}
          {cardText && (
            <p 
              className="font-['Montserrat',sans-serif] text-white opacity-90" 
              style={{ 
                fontSize: isMobile ? '14pt' : '16pt', 
                lineHeight: isMobile ? '120%' : '1.5',
                width: isMobile ? '100%' : '540pt'
              }}
            >
              {processCardWithGenre(cardText)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}