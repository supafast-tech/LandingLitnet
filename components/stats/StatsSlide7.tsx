import { StatsData } from '../../utils/statsApi';
import { processLineBreaks, processTextWithMultiplePlaceholders } from '../../utils/textUtils';
import svgPaths from "../../imports/svg-398uq93q2b";
import highlightsPaths from "../../imports/svg-118r8zcvlf";
import { AnimatedBlobs } from './AnimatedBlobs';
import { getBookWord } from '../../utils/pluralUtils';
import characterImage from "figma:asset/26cc155403efa08bed9f79e0d1e29fc102b1e062.png";
import { useIsMobile } from '../../hooks/useIsMobile';

interface StatsSlide7Props {
  stats: StatsData | null;
  urlParams: Record<string, string>;
}

export function StatsSlide7({ stats, urlParams }: StatsSlide7Props) {
  const isMobile = useIsMobile();
  const genreParamName = stats?.slide6_genre_param || 'favorite_genre';
  const genre = urlParams[genreParamName] || 'Фэнтези';
  const booksCountParam = stats?.slide7_books_in_genre_param || 'books_in_genre_count';
  const booksCount = parseInt(urlParams[booksCountParam] || '45');
  const bookWord = getBookWord(booksCount);
  
  const mainText = stats?.slide7_text || `{число} в жанре {жанр} вы купили в 2025 году.`;
  const cardText = stats?.slide7_card_text || `Кажется, у вас серьёзные отношения с {жанр}`;

  // Process genre placeholder in cardText
  const processCardText = (text: string) => {
    const genrePlaceholder = text.includes(`{${genreParamName}}`) ? `{${genreParamName}}` : '{жанр}';
    let processedText = text.replace(new RegExp(genrePlaceholder, 'g'), genre);
    return processLineBreaks(processedText, isMobile);
  };

  // Process both placeholders in main text
  const processMainText = () => {
    const numberPlaceholder = mainText.includes(`{${booksCountParam}}`) ? `{${booksCountParam}}` : '{число}';
    const genrePlaceholder = mainText.includes(`{${genreParamName}}`) ? `{${genreParamName}}` : '{жанр}';
    
    return processTextWithMultiplePlaceholders(
      mainText,
      [
        { placeholder: numberPlaceholder, value: `${booksCount} ${bookWord}`, bold: true },
        { placeholder: genrePlaceholder, value: genre, bold: true }
      ],
      '',
      isMobile
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background with gradient layers */}
      <div className="absolute bg-[#e55733] h-full left-0 overflow-hidden top-0 w-full">
        <div className="absolute backdrop-blur-md backdrop-filter h-full left-0 top-0 w-full" style={{ backgroundImage: "linear-gradient(29.0166deg, rgba(255, 255, 255, 0.25) 0.68959%, rgba(111, 19, 70, 0) 100%), linear-gradient(150.642deg, rgb(245, 189, 51) 0%, rgba(255, 255, 255, 0) 100%)" }} />
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

      {/* Content - in front */}
      <div className="relative z-10 flex items-center w-full h-full px-4 md:px-20">
        {/* Right side - Character image (absolute positioning behind text) */}
        <div 
          className="absolute h-[100vh] w-auto pointer-events-none" 
          style={{ 
            zIndex: 5, 
            bottom: isMobile ? 'calc(144pt - 80pt + 32pt + 40pt)' : 'calc(-320pt + 64pt)',
            left: isMobile ? 'calc(-64pt + 24pt)' : 'auto',
            right: isMobile ? 'auto' : '0',
            transform: isMobile ? 'scale(2.0)' : 'scale(1.2)',
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          <img 
            src={characterImage} 
            alt="" 
            className="h-full w-auto object-contain object-bottom select-none"
            style={{ 
              maxHeight: '100vh',
              userSelect: 'none',
              pointerEvents: 'none',
              WebkitUserDrag: 'none',
              objectPosition: 'bottom center',
              width: isMobile ? '100%' : 'auto',
              height: isMobile ? 'auto' : '100vh'
            }}
            draggable={false}
          />
        </div>

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
            {processMainText()}
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
              {processCardText(cardText)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}