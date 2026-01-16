import { useEffect, useState, useRef, useCallback } from 'react';
import { Footer } from '../components/Footer';
import { FontPreload } from '../components/FontPreload';
import { YandexMetrika } from '../components/YandexMetrika';
import { SEOHead } from '../components/SEOHead';
import { StatsSlide1 } from '../components/stats/StatsSlide1';
import { StatsSlide2 } from '../components/stats/StatsSlide2';
import { StatsSlide3 } from '../components/stats/StatsSlide3';
import { StatsSlide4 } from '../components/stats/StatsSlide4';
import { StatsSlide5 } from '../components/stats/StatsSlide5';
import { StatsSlide6 } from '../components/stats/StatsSlide6';
import { StatsSlide7 } from '../components/stats/StatsSlide7';
import { StatsSlide8 } from '../components/stats/StatsSlide8';
import { StatsSlide9 } from '../components/stats/StatsSlide9';
import { StatsSlide10 } from '../components/stats/StatsSlide10';
import { StatsSlide11 } from '../components/stats/StatsSlide11';
import { fetchStatsContent, fetchStatsParameters, StatsData, StatsParameter } from '../utils/statsApi';
import { fetchContent, ContentData } from '../utils/api';
import { fetchStatsSeo, SeoData } from '../utils/seoApi';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Default SEO values
const DEFAULT_SEO: SeoData = {
  meta_title: 'Ваши итоги 2025 | Litnet',
  meta_description: 'Узнайте всё о вашей активности на Litnet в 2025 году',
  meta_keywords: 'litnet, итоги года, статистика, 2025, книги',
  og_title: 'Ваши итоги 2025 | Litnet',
  og_description: 'Узнайте всё о вашей активности на Litnet в 2025 году',
  og_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-stats.jpg',
  og_url: 'https://litnet.com/stats',
  twitter_card: 'summary_large_image',
  twitter_title: 'Ваши итоги 2025 | Litnet',
  twitter_description: 'Узнайте всё о вашей активности на Litnet в 2025 году',
  twitter_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-stats.jpg'
};

interface StatsPageProps {
  onBackToSite: () => void;
}

export default function StatsPage({ onBackToSite }: StatsPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [urlParams, setUrlParams] = useState<Record<string, string>>({});
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const [content, setContent] = useState<ContentData>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(0);
  const scrollAccumulator = useRef(0);
  const scrollThreshold = 100; // Amount of scroll needed to trigger slide change
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [seoData, setSeoData] = useState<SeoData>(DEFAULT_SEO);

  // Wait for fonts to load before showing content
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Wait for fonts to be ready
        await document.fonts.ready;
        
        // Force check that specific fonts are loaded
        const loraLoaded = document.fonts.check('80px Lora');
        const montserratLoaded = document.fonts.check('16px Montserrat');
        
        console.log('Fonts loaded:', { loraLoaded, montserratLoaded });
        
        // Add class to body and show content
        document.body.classList.add('fonts-loaded');
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('Font loading error:', error);
        // Show content anyway after timeout
        document.body.classList.add('fonts-loaded');
        setFontsLoaded(true);
      }
    };
    loadFonts();
  }, []);

  // Parse URL parameters and merge with test values from database
  useEffect(() => {
    const loadUrlParams = async () => {
      try {
        // First, get URL parameters
        const params = new URLSearchParams(window.location.search);
        const urlParamsObj: Record<string, string> = {};
        params.forEach((value, key) => {
          urlParamsObj[key] = value;
        });
        
        // Then, load test values from database
        const testParameters = await fetchStatsParameters();
        
        // Create default params from test values
        const defaultParams: Record<string, string> = {};
        testParameters.forEach(param => {
          defaultParams[param.param_key] = param.test_value;
        });
        
        // Merge: URL params override test values
        const mergedParams = { ...defaultParams, ...urlParamsObj };
        
        setUrlParams(mergedParams);
        setParamsLoaded(true);
      } catch (error) {
        console.error('[StatsPage] Failed to load parameters:', error);
        // Fallback to just URL params if database fails
        const params = new URLSearchParams(window.location.search);
        const urlParamsObj: Record<string, string> = {};
        params.forEach((value, key) => {
          urlParamsObj[key] = value;
        });
        setUrlParams(urlParamsObj);
        setParamsLoaded(true);
      }
    };
    
    loadUrlParams();
  }, []);

  // Load stats data from database
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStatsContent();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []);

  // Load content data from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };
    loadContent();
  }, []);

  // Load SEO data from database
  useEffect(() => {
    const loadSeoData = async () => {
      try {
        const data = await fetchStatsSeo();
        setSeoData(data);
      } catch (error) {
        console.error('Failed to load SEO data:', error);
      }
    };
    loadSeoData();
  }, []);

  // Preload all images and wait for everything to be ready
  useEffect(() => {
    if (!fontsLoaded || !stats || !paramsLoaded) return;

    const preloadImages = async () => {
      try {
        // Get all images from the document
        const images = Array.from(document.images);
        const imagePromises = images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = resolve; // Don't fail on image errors
            // Timeout after 5 seconds
            setTimeout(resolve, 5000);
          });
        });

        await Promise.all(imagePromises);
        
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          setIsFullyLoaded(true);
        }, 300);
      } catch (error) {
        console.error('Image preload error:', error);
        setIsFullyLoaded(true);
      }
    };

    preloadImages();
  }, [fontsLoaded, stats, paramsLoaded]);

  const slides = [
    <StatsSlide1 key={0} stats={stats} urlParams={urlParams} content={content} onNavigate={() => navigateSlides(1)} />,
    <StatsSlide2 key={1} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide3 key={2} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide4 key={3} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide5 key={4} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide6 key={5} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide7 key={6} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide8 key={7} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide9 key={8} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide10 key={9} stats={stats} urlParams={urlParams} content={content} />,
    <StatsSlide11 key={10} stats={stats} urlParams={urlParams} content={content} />,
  ].filter((slide, index) => {
    // Всегда показываем слайд 1 и 11
    if (index === 0 || index === 10) return true;
    
    // Проверяем слайды 2-10 на наличие параметров со значением 0
    const slideParamMap: Record<number, string> = {
      1: stats?.slide2_books_count_param || 'books_count',
      2: stats?.slide3_subscriptions_param || 'subscriptions_count',
      3: stats?.slide4_library_param || 'library_count',
      4: stats?.slide5_pages_param || 'pages_count',
      5: stats?.slide6_genre_param || 'favorite_genre',
      6: stats?.slide7_books_in_genre_param || 'books_in_genre_count',
      7: stats?.slide8_author_param || 'favorite_author',
      8: stats?.slide9_awards_param || 'awards_count',
      9: stats?.slide10_comments_param || 'comments_count',
    };
    
    const paramName = slideParamMap[index];
    if (!paramName) return true;
    
    const paramValue = urlParams[paramName];
    
    // Скрываем слайд если значение = "0" или 0
    if (paramValue === '0' || paramValue === 0 || parseInt(paramValue) === 0) {
      return false;
    }
    
    return true;
  });

  const totalSlides = slides.length;

  // Navigate slides with direction
  const navigateSlides = useCallback((direction: number) => {
    if (isScrolling) return;
    
    const newSlide = currentSlide + direction;
    if (newSlide < 0 || newSlide >= totalSlides) return;
    
    setCurrentSlide(newSlide);
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  }, [currentSlide, totalSlides, isScrolling]);

  // Handle wheel scroll - smooth with accumulation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // If already scrolling, ignore new scroll events
      if (isScrolling) {
        scrollAccumulator.current = 0;
        return;
      }
      
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
      // Reset accumulator if too much time has passed
      if (timeSinceLastScroll > 500) {
        scrollAccumulator.current = 0;
      }
      
      // Accumulate scroll delta
      scrollAccumulator.current += e.deltaY;
      
      // Check if we've accumulated enough scroll to change slides
      if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        navigateSlides(direction);
        scrollAccumulator.current = 0; // Reset accumulator after slide change
      }
      
      lastScrollTime.current = now;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [navigateSlides, isScrolling, scrollThreshold]);

  // Handle keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateSlides(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSlides(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateSlides]);

  // Handle touch for mobile with swipe velocity
  const touchStartY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      navigateSlides(diff > 0 ? 1 : -1);
    }
  };

  // Go to specific slide
  const goToSlide = useCallback((index: number) => {
    if (isScrolling || index === currentSlide) return;
    
    setCurrentSlide(index);
    setIsScrolling(true);
    
    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set new timeout
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, [currentSlide, isScrolling]);

  return (
    <>
      {/* Loading overlay */}
      {!isFullyLoaded && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
          {/* Gradient Background - same as Slide1 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 1200">
            <rect fill="url(#loaderGradient)" height="1200" width="1920" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="loaderGradient" x1="0" x2="1920" y1="0" y2="1200">
                <stop stopColor="#9B59B6" />
                <stop offset="0.5" stopColor="#BB8FCE" />
                <stop offset="1" stopColor="#8E44AD" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Loading spinner and text */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p 
              className="text-white text-center"
              style={{ 
                fontFamily: 'Lora, serif', 
                fontSize: '24pt',
                marginTop: '24pt'
              }}
            >
              Загружаем вашу статистику
            </p>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="relative w-full h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          opacity: isFullyLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {/* Font Preload */}
        <FontPreload />
        
        {/* Render all slides with fixed positioning and overlay effect */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPast = index < currentSlide;
          const isFuture = index > currentSlide;
          
          return (
            <div
              key={index}
              className="fixed inset-0 w-full h-screen ease-in-out"
              style={{
                transform: isFuture 
                  ? 'translateY(100%)' 
                  : isPast 
                    ? 'translateY(-100%)' 
                    : 'translateY(0)',
                transition: 'all 0.7s ease-in-out',
                zIndex: totalSlides - Math.abs(index - currentSlide),
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {slide}
            </div>
          );
        })}

        {/* Slide indicators - centered vertically on the right */}
        <div className="fixed top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3 right-8 hidden md:flex">
          {/* Top arrow */}
          <button
            onClick={() => navigateSlides(-1)}
            className="group w-12 h-12 rounded-2xl bg-white/15 hover:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 mb-2 border border-white/30"
            style={{ opacity: currentSlide === 0 ? 0.3 : 1 }}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white group-hover:text-[#E74C3C] transition-colors duration-300">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Slide dots */}
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          
          {/* Bottom arrow */}
          <button
            onClick={() => navigateSlides(1)}
            className="group w-12 h-12 rounded-2xl bg-white/15 hover:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 mt-2 border border-white/30"
            style={{ opacity: currentSlide === totalSlides - 1 ? 0.3 : 1 }}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white group-hover:text-[#E74C3C] transition-colors duration-300">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile slide indicators - centered horizontally */}
        <div className="fixed z-50 flex flex-col items-center gap-3 md:hidden" style={{ bottom: '12pt', right: '12pt' }}>
          {/* Up arrow */}
          <button
            onClick={() => navigateSlides(-1)}
            className="group w-10 h-10 rounded-xl bg-white/15 active:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/30"
            style={{ opacity: currentSlide === 0 ? 0.3 : 1 }}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Down arrow */}
          <button
            onClick={() => navigateSlides(1)}
            className="group w-10 h-10 rounded-xl bg-white/15 active:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/30"
            style={{ opacity: currentSlide === totalSlides - 1 ? 0.3 : 1 }}
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Share button - bottom left */}
        <div className="fixed z-50" style={{ bottom: '12pt', left: '12pt' }}>
          <button
            onClick={async () => {
              try {
                // Get short URL from Yandex Clicker
                const endpoint = 'https://clck.ru/--';
                const response = await fetch(`${endpoint}?url=${encodeURIComponent(window.location.href)}`);
                const shortUrl = await response.text();
                
                if (navigator.share) {
                  // Try Web Share API first (mobile)
                  await navigator.share({
                    title: 'Мои итоги 2025 на Litnet',
                    url: shortUrl
                  }).catch(() => {
                    // If share fails, use fallback copy method
                    copyToClipboardFallback(shortUrl);
                  });
                } else {
                  // Desktop: use fallback copy method
                  copyToClipboardFallback(shortUrl);
                }
              } catch (error) {
                console.error('Error sharing:', error);
                // Fallback to original URL if shortening fails
                copyToClipboardFallback(window.location.href);
              }
            }}
            className="group flex items-center gap-3 rounded-2xl bg-white/15 hover:bg-white backdrop-blur-md transition-all duration-300 hover:scale-105 border border-white/30 w-10 h-10 md:w-auto md:h-auto justify-center md:px-6 md:py-4 rounded-xl md:rounded-2xl"
            aria-label="Поделиться"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white group-hover:text-[#E74C3C] transition-colors duration-300 flex-shrink-0 md:block hidden">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08259 9.16165C7.54305 8.4477 6.72553 8 5.8 8C4.14315 8 2.8 9.34315 2.8 11C2.8 12.6569 4.14315 14 5.8 14C6.72553 14 7.54305 13.5523 8.08259 12.8384L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0745 14 16.257 14.4477 15.7174 15.1616L8.77735 11.3706C8.79229 11.2492 8.8 11.1255 8.8 11C8.8 10.8745 8.79229 10.7508 8.77735 10.6294L15.7174 6.83835C16.257 7.5523 17.0745 8 18 8Z" fill="currentColor"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white md:hidden block">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08259 9.16165C7.54305 8.4477 6.72553 8 5.8 8C4.14315 8 2.8 9.34315 2.8 11C2.8 12.6569 4.14315 14 5.8 14C6.72553 14 7.54305 13.5523 8.08259 12.8384L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0745 14 16.257 14.4477 15.7174 15.1616L8.77735 11.3706C8.79229 11.2492 8.8 11.1255 8.8 11C8.8 10.8745 8.79229 10.7508 8.77735 10.6294L15.7174 6.83835C16.257 7.5523 17.0745 8 18 8Z" fill="currentColor"/>
            </svg>
            <span 
              className="text-white group-hover:text-[#E74C3C] transition-colors duration-300 whitespace-nowrap font-['Montserrat',sans-serif] md:block hidden"
              style={{ fontSize: '14pt' }}
            >
              Поделиться статистикой
            </span>
          </button>
        </div>
      </div>
      <YandexMetrika />
      <SEOHead seoData={seoData} />
    </>
  );
}

// Fallback copy method that works without Clipboard API
function copyToClipboardFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  textarea.style.top = '-999999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  
  try {
    document.execCommand('copy');
    alert('Ссылка скопирована в буфер обмена!');
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Last resort: show the URL in a prompt
    prompt('Скопируйте ссылку:', text);
  }
  
  document.body.removeChild(textarea);
}