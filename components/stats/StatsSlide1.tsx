import { StatsData } from '../../utils/statsApi';
import svgPaths from "../../imports/svg-398uq93q2b";
import { motion } from 'motion/react';
import imgFrame2025 from "figma:asset/8d938fdbf66f7dc7ef6c5ca279abf46fb6fc0356.png";
import { useIsMobile } from '../../hooks/useIsMobile';
import { processLineBreaks } from '../../utils/textUtils';

interface StatsSlide1Props {
  stats: StatsData | null;
  urlParams: Record<string, string>;
  onNavigate?: () => void;
}

export function StatsSlide1({ stats, onNavigate }: StatsSlide1Props) {
  const isMobile = useIsMobile();
  const title = stats?.slide1_title || "Ваш книжный 2025 в одном месте";
  const subtitle = stats?.slide1_subtitle || "Всё, что вы читали, поддерживали и комментировали – теперь в красивом отчёте. Откройте, чтобы вспомнить лучшие моменты года.";

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-end justify-center pb-8">
      {/* Gradient Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 1200">
        <rect fill="url(#statsGradient)" height="1200" width="1920" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="statsGradient" x1="0" x2="1920" y1="0" y2="1200">
            <stop stopColor="#9B59B6" />
            <stop offset="0.5" stopColor="#BB8FCE" />
            <stop offset="1" stopColor="#8E44AD" />
          </linearGradient>
        </defs>
      </svg>

      {/* Animated Blobs - REMOVED */}
      
      {/* Litnet Logo Pattern - right side with blur */}
      <div className="absolute h-full right-[-267.38px] top-0 w-[1164.38px] opacity-10" style={{ filter: 'blur(8px)' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1165 1080">
          <path d={svgPaths.p5c5580} fill="white" />
        </svg>
      </div>

      {/* Litnet Logo - top center */}
      <div className="absolute left-1/2 top-[49px] -translate-x-1/2 w-[106px] h-[32px] z-20">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 106 32">
          <path d={svgPaths.p1bd50d00} fill="white" />
          <g>
            <path d={svgPaths.p2d7f3380} fill="white" />
            <path d={svgPaths.p38293900} fill="white" />
            <path d={svgPaths.p25912c80} fill="white" />
            <path d={svgPaths.p2d720900} fill="white" />
            <path d={svgPaths.p22076a00} fill="white" />
            <path d={svgPaths.p153f5a00} fill="white" />
          </g>
        </svg>
      </div>

      {/* 2025 Frame - top center, behind content */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 z-[15] pointer-events-none"
        style={{
          top: isMobile ? '0' : 'auto',
          bottom: isMobile ? 'auto' : '272pt',
          width: isMobile ? '100vw' : '920px',
          maxWidth: isMobile ? '100vw' : '90vw'
        }}
      >
        <img 
          src={imgFrame2025} 
          alt="" 
          className="w-full h-auto"
        />
      </div>

      {/* Content */}
      <div 
        className="relative z-10 flex flex-col items-center gap-6 px-10"
        style={{ maxWidth: '1080pt' }}
      >
        {/* Badge */}
        <div className="hidden md:block bg-[#de2e5c] px-5 py-3 rounded-full">
          <p className="font-['Montserrat',sans-serif] font-medium text-white text-[20px] uppercase leading-[0.9] text-center whitespace-nowrap">
            ПОДВОДИМ ИТОГИ 2025
          </p>
        </div>

        {/* Title */}
        <h1 
          className="font-['Lora',sans-serif] text-white text-center md:leading-[1]"
          style={{ 
            fontSize: isMobile ? '32pt' : '80px', 
            lineHeight: isMobile ? '100%' : '1' 
          }}
        >
          {processLineBreaks(title, isMobile)}
        </h1>

        {/* Subtitle */}
        <p 
          className="font-['Montserrat',sans-serif] text-[rgba(255,255,255,0.9)] text-center"
          style={{ 
            fontSize: isMobile ? '14pt' : '21.333px', 
            lineHeight: isMobile ? '120%' : '29.867px',
            maxWidth: '768px'
          }}
        >
          {processLineBreaks(subtitle, isMobile)}
        </p>

        {/* Scroll indicator */}
        <motion.div 
          className="mt-6 cursor-pointer"
          onClick={onNavigate}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="size-5" fill="none" viewBox="0 0 20 20">
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke="white" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.66667" 
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}