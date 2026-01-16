import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BackgroundFixed from '../components/BackgroundFixed';
import { SnowEffect } from '../components/SnowEffect';
import { FontPreload } from '../components/FontPreload';
import { YandexMetrika } from '../components/YandexMetrika';
import { SEOHead } from '../components/SEOHead';
import { fetchHomepageContent, HomepageLanding } from '../utils/homepageApi';
import { fetchHomepageSeo, SeoData } from '../utils/seoApi';
import svgPaths from "../imports/svg-398uq93q2b";
import imgFrame2025 from "figma:asset/8d938fdbf66f7dc7ef6c5ca279abf46fb6fc0356.png";

interface Landing {
  id: string;
  title: string;
  description: string;
  backgroundType: 'advent' | 'stats';
  backgroundImage?: string;
  buttonText: string;
  route: string;
}

const DEFAULT_SEO: SeoData = {
  meta_title: 'Litnet - Новогодние акции 2025',
  meta_description: 'Адвент-календарь и итоги 2025 года на Litnet. Выберите лендинг и откройте для себя праздничные сюрпризы!',
  meta_keywords: 'litnet, новый год, акции, адвент календарь, итоги года, 2025',
  og_title: 'Litnet - Новог��дние акции 2025',
  og_description: 'Адвент-календарь и итоги 2025 года на Litnet. Выберите лендинг и откройте для себя праздничные сюрпризы!',
  og_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-homepage.jpg',
  og_url: 'https://litnet.com/',
  twitter_card: 'summary_large_image',
  twitter_title: 'Litnet - Новогодние акции 2025',
  twitter_description: 'Адвент-календарь и итоги 2025 года на Litnet. Выберите лендинг и откройте для себя праздничные сюрпризы!',
  twitter_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-homepage.jpg'
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [landings, setLandings] = useState<Landing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seoData, setSeoData] = useState<SeoData>(DEFAULT_SEO);

  // Load homepage content and SEO from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load content
        const data = await fetchHomepageContent();
        console.log('[HomePage] Loaded content from database:', data);
        
        // Transform database data to Landing format
        const transformedLandings: Landing[] = data.map((item: HomepageLanding) => ({
          id: item.landing_id,
          title: item.title,
          description: item.description,
          backgroundType: item.background_type,
          backgroundImage: item.landing_id === 'stats' ? imgFrame2025 : undefined,
          buttonText: item.button_text,
          route: item.route
        }));
        
        setLandings(transformedLandings);
        
        // Load SEO data
        try {
          const seo = await fetchHomepageSeo();
          console.log('[HomePage] Loaded SEO from database:', seo);
          setSeoData(seo);
        } catch (seoError) {
          console.error('[HomePage] Error loading SEO, using defaults:', seoError);
          setSeoData(DEFAULT_SEO);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('[HomePage] Error loading content:', error);
        // Fallback to default content
        setLandings([
          {
            id: 'advent',
            title: 'Адвент-календарь 2025',
            description: 'Открывайте подарки каждый день декабря! Эксклюзивные промокоды, бонусы и сюрпризы ждут вас.',
            backgroundType: 'advent',
            buttonText: 'Перейти на лендинг',
            route: '/advent'
          },
          {
            id: 'stats',
            title: 'Итоги 2025',
            description: 'Всё, что вы читали, поддерживали и комментировали – теперь в красивом отчёте. Откройте, чтобы вспомнить лучшие моменты года.',
            backgroundType: 'stats',
            backgroundImage: imgFrame2025,
            buttonText: 'Перейти на лендинг',
            route: '/stats'
          }
        ]);
        setSeoData(DEFAULT_SEO);
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % landings.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + landings.length) % landings.length;
    goToSlide(prev);
  };

  // Auto-advance slides every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 15000);

    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isTransitioning]);

  const handleNavigate = (route: string) => {
    window.history.pushState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const currentLanding = landings[currentSlide];

  // Show loading or wait for data
  if (isLoading || !currentLanding) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <BackgroundFixed />
        <SnowEffect intensity="medium" />
        <FontPreload />
        <YandexMetrika />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: 'white' }}>
      {/* Font Preload */}
      <FontPreload />
      
      {/* Background layers */}
      {landings.map((landing, index) => {
        const isActive = index === currentSlide;
        
        return (
          <div
            key={landing.id}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 700ms ease-in-out, visibility 700ms ease-in-out',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {landing.backgroundType === 'advent' ? (
              <>
                <BackgroundFixed />
                <SnowEffect intensity="medium" />
              </>
            ) : (
              <>
                {/* Gradient Background from StatsSlide1 */}
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

                {/* Litnet Logo Pattern - right side with blur */}
                <div className="absolute h-full right-[-267.38px] top-0 w-[1164.38px] opacity-10" style={{ filter: 'blur(8px)' }}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1165 1080">
                    <path d={svgPaths.p5c5580} fill="white" />
                  </svg>
                </div>

                {/* 2025 Frame - centered */}
                <div 
                  className="absolute left-1/2 top-0 -translate-x-1/2 z-[5] pointer-events-none"
                  style={{
                    width: '920px',
                    maxWidth: '90vw'
                  }}
                >
                  <img 
                    src={landing.backgroundImage} 
                    alt="" 
                    className="w-full h-auto"
                  />
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Bottom shadow for better contrast - 50% of screen height */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[5]"
        style={{
          height: '50vh',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
        }}
      />

      {/* Content - centered at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-32 px-8">
        <div className="mx-auto text-center" style={{ maxWidth: '1080pt' }}>
          <div 
            className="transition-all duration-700"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)'
            }}
          >
            {/* Badge - "Выберите лендинг" */}
            <div className="flex justify-center mb-6">
              <div 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <span 
                  className="text-white"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif', 
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                >
                  Выберите лендинг
                </span>
              </div>
            </div>

            {/* Landing Title */}
            <h2 
              className="text-white mb-4"
              style={{ 
                fontFamily: 'Lora, serif', 
                fontSize: '64px',
                fontWeight: 400,
                lineHeight: '1.1',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)'
              }}
            >
              {currentLanding.title}
            </h2>

            {/* Landing Description */}
            <p 
              className="text-white/90 mb-8 mx-auto max-w-2xl"
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                fontSize: '20px',
                lineHeight: '1.6',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              {currentLanding.description}
            </p>

            {/* Button */}
            <button
              onClick={() => handleNavigate(currentLanding.route)}
              className="group px-10 py-5 rounded-2xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(249, 115, 22, 0.25) 50%, rgba(220, 38, 38, 0.3) 100%)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 0 2pt #ef4444',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 0 2pt #ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 0 2pt #ef4444';
              }}
            >
              {currentLanding.buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 rounded-full backdrop-blur-md bg-white/10 border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed md:w-12 md:h-12 w-14 h-14"
        aria-label="Previous landing"
      >
        <ChevronLeft className="md:w-7 md:h-7 w-8 h-8 text-white" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 rounded-full backdrop-blur-md bg-white/10 border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed md:w-12 md:h-12 w-14 h-14"
        aria-label="Next landing"
      >
        <ChevronRight className="md:w-7 md:h-7 w-8 h-8 text-white" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {landings.map((landing, index) => (
          <button
            key={landing.id}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className="transition-all duration-300 rounded-full"
            style={{
              width: index === currentSlide ? '48px' : '12px',
              height: '12px',
              background: index === currentSlide 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.3)',
              boxShadow: index === currentSlide
                ? '0 0 10px rgba(255, 255, 255, 0.5)'
                : 'none'
            }}
            aria-label={`Go to ${landing.title}`}
          />
        ))}
      </div>
      <YandexMetrika />
      <SEOHead seoData={seoData} />
    </div>
  );
}