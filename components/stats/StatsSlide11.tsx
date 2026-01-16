import { StatsData } from '../../utils/statsApi';
import { processLineBreaks } from '../../utils/textUtils';
import { StatsButton } from './StatsButton';
import { ContentData } from '../../utils/api';
import { Footer } from '../Footer';
import svgPaths from "../../imports/svg-398uq93q2b";
import backgroundImage from "figma:asset/e031ec19f5218dc55c8ee374790b6e8237e1d58f.png";
import { useIsMobile } from '../../hooks/useIsMobile';

interface StatsSlide11Props {
  stats: StatsData | null;
  urlParams: Record<string, string>;
  content?: ContentData;
}

export function StatsSlide11({ stats, content }: StatsSlide11Props) {
  const isMobile = useIsMobile();
  const title = stats?.slide11_title || "Такими были ваши итоги\nуходящего книжного года";
  const subtitle = stats?.slide11_subtitle || "Встречайте наступающий с новыми историями и любимыми авторами.\nЖелаем вам приятных открытий и ярких впечатлений!";
  const buttonText = stats?.slide11_button_text || "К книгам";
  const buttonLink = stats?.slide11_button_link || "https://litnet.com";

  return (
    <div className="relative w-full h-screen flex flex-col" style={{ overflow: isMobile ? 'hidden' : 'auto' }}>
      {/* Background Image - Full Screen */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: isMobile ? '338%' : 'cover',
          backgroundPosition: isMobile ? 'calc(50% + 208pt) calc(50% + 128pt)' : 'center',
        }}
      />

      {/* Dark Overlay for Contrast */}
      <div className="fixed inset-0 w-full h-full bg-black/20" />

      {/* Litnet Logo Pattern - right side with blur - REMOVED */}

      {/* Content - aligned to top with padding */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-20 pb-0" style={{ paddingTop: isMobile ? 'calc(49px + 32px + 32pt - 40pt)' : '160pt', minHeight: isMobile ? 'auto' : 'auto' }}>
        <div className="flex flex-col items-center gap-6 max-w-7xl text-center">
          {/* Title */}
          <h1 
            className="font-['Lora',sans-serif] text-white"
            style={{ 
              fontSize: isMobile ? '24pt' : '60px', 
              lineHeight: isMobile ? '100%' : '1',
              marginTop: isMobile ? '24pt' : '0'
            }}
          >
            {processLineBreaks(title, isMobile)}
          </h1>

          {/* Subtitle */}
          <p 
            className="font-['Montserrat',sans-serif] text-white/90"
            style={{ 
              fontSize: isMobile ? '14pt' : '14pt', 
              lineHeight: isMobile ? '120%' : '1.4' 
            }}
          >
            {processLineBreaks(subtitle, isMobile)}
          </p>

          {/* Button */}
          <StatsButton
            href={buttonLink}
            text={buttonText}
            variant="primary"
            hoverTextColor="#9B59B6"
          />
        </div>
      </div>

      {/* Footer - pinned to bottom, hidden on mobile */}
      {!isMobile && (
        <div className="relative z-10 mt-auto" style={{ paddingTop: '0' }}>
          <Footer content={content} landingType="stats" />
        </div>
      )}
    </div>
  );
}