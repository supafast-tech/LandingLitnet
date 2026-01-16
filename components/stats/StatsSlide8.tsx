import { StatsData } from '../../utils/statsApi';
import { processLineBreaks, processTextWithPlaceholder } from '../../utils/textUtils';
import svgPaths from "../../imports/svg-398uq93q2b";
import highlightsPaths from "../../imports/svg-118r8zcvlf";
import { AnimatedBlobs } from './AnimatedBlobs';
import characterImage from "figma:asset/76522b51d054efff1237addb349c320f126987d8.png";
import { useIsMobile } from '../../hooks/useIsMobile';

interface StatsSlide8Props {
  stats: StatsData | null;
  urlParams: Record<string, string>;
}

export function StatsSlide8({ stats, urlParams }: StatsSlide8Props) {
  const isMobile = useIsMobile();
  const paramName = stats?.slide8_author_param || 'favorite_author';
  const author = urlParams[paramName] || 'Александр Пушкин';
  const mainText = stats?.slide8_text || `Книги {имя автора} покорили ваше сердце в 2025 году.`;
  const cardText = stats?.slide8_card_text || 'Вы прочитали больше всего произведений этого автора. Настоящая литературная любовь!';

  // Process text - replace {имя автора} or {favorite_author} with author value
  const processAuthorText = (text: string) => {
    const placeholder = text.includes(`{${paramName}}`) ? `{${paramName}}` : '{имя автора}';
    return processTextWithPlaceholder(text, placeholder, author, true, '', isMobile);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background with gradient layers */}
      <div className="absolute bg-[#7d3668] h-full left-0 overflow-hidden top-0 w-full">
        <div className="absolute backdrop-blur-md backdrop-filter h-full left-0 top-0 w-full" style={{ backgroundImage: "linear-gradient(29.0166deg, rgba(255, 255, 255, 0.25) 0.68959%, rgba(111, 19, 70, 0) 100%), linear-gradient(150.642deg, rgb(222, 46, 92) 0%, rgba(255, 255, 255, 0) 100%)" }} />
      </div>

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
            bottom: '-32pt',
            left: '0',
            right: '0',
            transform: 'scale(1.4)',
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
            {processAuthorText(mainText)}
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
              {processLineBreaks(cardText, isMobile)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}