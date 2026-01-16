import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HowItWorks } from './components/HowItWorks';
import { AdventCalendar } from './components/AdventCalendar';
import { Footer } from './components/Footer';
import BackgroundFixed from './components/BackgroundFixed';
import { SnowEffect } from './components/SnowEffect';
import AdminPage from './pages/AdminPage';
import StatsPage from './pages/StatsPage';
import HomePage from './pages/HomePage';
import { getSettings, cacheGlobalSettings } from './utils/settings';
import { fetchGlobalSettings, initializeCalendarDays, fetchAllCalendarDays, CalendarDay, fetchContent, ContentData } from './utils/api';
import { Gift } from './types/gift';
import { GlareCard } from './components/ui/glare-card';
import { FontPreload } from './components/FontPreload';
import { FadeInOnScroll } from './components/FadeInOnScroll';
import { Toaster } from 'sonner';
import { YandexMetrika } from './components/YandexMetrika';
import { SEOHead } from './components/SEOHead';
import { fetchAdventSeo, SeoData } from './utils/seoApi';
import { getDayStatus } from './utils/gifts';

// Default SEO values
const DEFAULT_SEO: SeoData = {
  meta_title: 'Адвент календарь 2025 | Litnet',
  meta_description: 'Открывайте подарки каждый день в адвент календаре Litnet 2025',
  meta_keywords: 'litnet, адвент календарь, 2025, книги, подарки',
  og_title: 'Адвент календарь 2025 | Litnet',
  og_description: 'Открывайте подарки каждый день в адвент календаре Litnet 2025',
  og_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-advent.jpg',
  og_url: 'https://litnet.com/advent',
  twitter_card: 'summary_large_image',
  twitter_title: 'Адвент календарь 2025 | Litnet',
  twitter_description: 'Открывайте подарки каждый день в адвент календаре Litnet 2025',
  twitter_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-advent.jpg'
};

// Convert CalendarDay from API to Gift for frontend
function calendarDayToGift(day: CalendarDay): Gift {
  return {
    id: day.day,
    date: `2025-12-${String(day.day).padStart(2, '0')}`,
    title: day.title,
    description: day.promoDescription,
    promoCode: day.promoCode,
    promoDisclaimer: day.promoDisclaimer,
    buttonLink: day.buttonLink || '#',
    buttonText: day.buttonText || 'Перейти к подарку',
    downloadFile: day.downloadFile || false,
    // Второй промокод
    promoCode2: day.promoCode2,
    promoDisclaimer2: day.promoDisclaimer2,
    buttonLink2: day.buttonLink2,
    buttonText2: day.buttonText2,
    downloadFile2: day.downloadFile2,
    enabled: true,
    hoverLabel: day.hoverLabel,
    popupType: day.popupType || 'single_promo' // Добавляем тип попапа
  };
}

export default function App() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [currentRoute, setCurrentRoute] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [isCurrentDayHovered, setIsCurrentDayHovered] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [content, setContent] = useState<ContentData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [seoData, setSeoData] = useState<SeoData>(DEFAULT_SEO);
  
  // Expose gifts to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugGifts = gifts;
      (window as any).debugCheckDay19 = () => {
        const day19 = gifts.find(g => g.id === 19);
        console.log('=== DAY 19 DEBUG ===');
        console.log('Day 19 gift:', day19);
        console.log('Total gifts:', gifts.length);
        console.log('All gifts:', gifts);
        if (day19) {
          console.log('Day 19 date:', day19.date);
          console.log('Day 19 status:', getDayStatus(day19.date));
        } else {
          console.log('❌ Day 19 NOT FOUND in gifts array!');
        }
        console.log('===================');
      };
    }
  }, [gifts]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check current path
    const checkRoute = () => {
      const path = window.location.pathname;
      
      // Redirect from / to /advent
      if (path === '/') {
        window.history.replaceState({}, '', '/advent');
        setCurrentRoute('/advent');
      } else {
        setCurrentRoute(path);
      }
    };
    
    checkRoute();
    
    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', checkRoute);
    
    // Set mobile browser theme color to transparent for background image
    if (typeof document !== 'undefined') {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', 'transparent');
      
      // Add viewport meta to prevent scaling issues
      let metaViewport = document.querySelector('meta[name="viewport"]');
      if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');
        document.head.appendChild(metaViewport);
      }
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      
      // Load Argent CF font
      const link = document.createElement('link');
      link.href = 'https://fonts.cdnfonts.com/css/argent-cf';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Load advent calendar data only when on /advent page
  useEffect(() => {
    if (currentRoute !== '/advent') {
      return; // Don't load data for other pages
    }

    // Reset loading state when entering advent page
    setIsLoading(true);

    // Initialize data for advent calendar
    const initializeApp = async () => {
      const startTime = Date.now();
      
      try {
        // Загружаем все данные параллельно для максимальной скорости
        const [seoResult, contentResult, calendarResult, settingsResult] = await Promise.allSettled([
          fetchAdventSeo(),
          fetchContent(),
          fetchAllCalendarDays(),
          fetchGlobalSettings()
        ]);

        // Обработка SEO данных
        if (seoResult.status === 'fulfilled') {
          setSeoData(seoResult.value);
          console.log('[APP] Loaded advent SEO from database');
        } else {
          console.error('[APP] Error loading SEO, using defaults:', seoResult.reason);
          setSeoData(DEFAULT_SEO);
        }

        // Обработка контента
        if (contentResult.status === 'fulfilled') {
          setContent(contentResult.value);
          console.log('[APP] Loaded content from database');
        } else {
          console.error('Error fetching content:', contentResult.reason);
          setContent({});
        }

        // Обработка календарных дней
        if (calendarResult.status === 'fulfilled') {
          const giftsFromDB = calendarResult.value.map(calendarDayToGift);
          
          console.log('[APP] Calendar data from DB:', calendarResult.value);
          console.log('[APP] Gifts after conversion:', giftsFromDB);
          
          // Find day 19 for debugging
          const day19 = giftsFromDB.find(g => g.id === 19);
          if (day19) {
            console.log('[APP] Day 19 found:', day19);
          } else {
            console.warn('[APP] Day 19 NOT FOUND in database!');
          }
          
          // Add 4 disabled January days to complete the grid
          const januaryDays: Gift[] = [1, 2, 3, 4].map(day => ({
            id: 31 + day,
            date: day,
            enabled: false,
            title: '',
            subtitle: '',
            giftType: 'promo' as const,
            promoCode: '',
            promoDescription: '',
            promoDisclaimer: '',
            discount: '',
            bonusAmount: '',
            bonusDescription: '',
            hoverLabel: `${day} января`,
            lockedMessage: '',
            pastMessage: '',
            buttonLink: '#',
            buttonText: 'Перейти к подарку'
          }));
          
          setGifts([...giftsFromDB, ...januaryDays]);
          console.log('[APP] Loaded calendar days from database:', giftsFromDB.length, '+ 4 January days');
        } else {
          console.error('Failed to load calendar days from database:', calendarResult.reason);
          setGifts([]);
        }

        // Обработка настроек
        if (settingsResult.status === 'fulfilled') {
          cacheGlobalSettings(settingsResult.value);
          setSettings(settingsResult.value);
        } else {
          console.error('Failed to load global settings, using defaults:', settingsResult.reason);
          setSettings(getSettings());
        }
        
        // Initialize calendar days in database if not exist (асинхронно, не ждем)
        initializeCalendarDays().catch(err => {
          console.warn('Calendar days initialization failed, continuing with defaults:', err);
        });
        
        // Минимальная задержка для плавности (200ms)
        const elapsed = Date.now() - startTime;
        const minDelay = 200;
        if (elapsed < minDelay) {
          await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
        }
        
        // Hide loader after everything is loaded
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to cached/default settings
        setSettings(getSettings());
        setIsLoading(false);
      }
    };
    
    initializeApp();
    
    // Listen for settings updates
    const handleSettingsUpdate = async () => {
      try {
        const globalSettings = await fetchGlobalSettings();
        cacheGlobalSettings(globalSettings);
        setSettings(globalSettings);
      } catch (error) {
        console.error('Error reloading settings:', error);
      }
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    // Listen for content updates
    const handleContentUpdate = async () => {
      try {
        const contentData = await fetchContent();
        setContent(contentData);
      } catch (error) {
        console.error('Error reloading content:', error);
      }
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    // Listen for modal state changes
    const handleModalStateChange = (e: CustomEvent) => {
      setIsModalOpen(e.detail);
    };
    
    window.addEventListener('modalStateChange', handleModalStateChange as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('contentUpdated', handleContentUpdate);
      window.removeEventListener('modalStateChange', handleModalStateChange as EventListener);
    };
  }, [currentRoute]);
  
  if (currentRoute === '/admin') {
    return <AdminPage />;
  }
  
  if (currentRoute === '/stats') {
    return <StatsPage onBackToSite={() => {
      window.history.pushState({}, '', '/advent');
      setCurrentRoute('/advent');
    }} />;
  }

  // Home page - landing selector
  if (currentRoute === '/') {
    return <HomePage />;
  }
  
  // Default - Advent Calendar page
  return (
    <>
      <SEOHead seoData={seoData} />
      <div className="min-h-screen relative" style={{ background: 'transparent' }}>
        <BackgroundFixed />
        {settings.snowEnabled && !selectedGift && <SnowEffect intensity={settings.snowIntensity} />}
        
        {/* Loading overlay with spinner */}
        {isLoading && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
            style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div className="flex flex-col items-center gap-4">
              {/* Spinning loader - same as in StatsPage */}
              <div 
                className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"
                style={{ animationDuration: '0.6s' }}
              ></div>
              <p 
                className="text-white text-lg"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                }}
              >
                Подготовливаем адвент календарь
              </p>
            </div>
          </div>
        )}
        
        {/* Main content with fade-in animation */}
        <div 
          className="transition-opacity duration-500"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          {/* Font Preload */}
          <FontPreload />
          
          {/* Content with z-index */}
          <div className="relative z-10">
            {/* Header with hero */}
            <FadeInOnScroll>
              <Header content={content} />
            </FadeInOnScroll>
            
            {/* How it works */}
            <FadeInOnScroll delay={100}>
              <HowItWorks content={content} />
            </FadeInOnScroll>
            
            {/* Advent Calendar */}
            <section id="calendar-section" className="py-12 md:px-4 pb-12 relative">
              {/* Затемнение блока */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 70%)'
                }}
              />
              
              <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="text-center mb-12">
                  <div style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)' }}>
                    <h2 className="text-white drop-shadow-xl mb-4 md:text-[52pt] text-[32pt]" style={{ fontFamily: '"Argent CF", sans-serif', fontWeight: 400, fontStyle: 'italic', lineHeight: '0.9' }}>
                      {(content.calendar_title || settings.calendarTitle).split('\n').map((line, i) => (
                        <span key={i} className="font-[Argent_CF]">
                          {line}
                          {i < (content.calendar_title || settings.calendarTitle).split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </h2>
                    <p className="text-white/80 md:text-[18pt] text-[14pt]" style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: '1.4' }}>
                      {content.calendar_subtitle || settings.calendarSubtitle}
                    </p>
                  </div>
                </div>
                
                <AdventCalendar 
                  gifts={gifts} 
                  onCurrentDayHoverChange={setIsCurrentDayHovered}
                />
              </div>
            </section>
            
            {/* Return Button - между календарем и подвалом */}
            <FadeInOnScroll delay={300}>
              <div className="px-4 md:mb-[324px]" style={{ marginTop: (typeof window !== 'undefined' && window.innerWidth < 768) ? '40pt' : '80pt', marginBottom: (typeof window !== 'undefined' && window.innerWidth < 768) ? '40pt' : '80pt' }}>
              <div className="max-w-7xl mx-auto flex justify-center">
                <div className="transition-transform duration-300 hover:scale-110">
                  <GlareCard
                    className="group cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.4) 0%, rgba(100, 116, 139, 0.35) 50%, rgba(148, 163, 184, 0.4) 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 2pt rgba(255, 255, 255, 0.3)',
                      padding: (typeof window !== 'undefined' && window.innerWidth < 768) ? '15px 30px' : '20px 40px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.background = 'linear-gradient(135deg, rgb(220 38 38 / 0.8) 0%, rgb(249 115 22 / 0.8) 50%, rgb(220 38 38 / 0.8) 100%)';
                      target.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.4), 0 0 20px rgba(249, 115, 22, 0.3), 0 0 10px rgba(239, 68, 68, 0.2), inset 0 0 0 2pt #ef4444, inset 0 0 0 4pt rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.background = 'linear-gradient(135deg, rgba(71, 85, 105, 0.4) 0%, rgba(100, 116, 139, 0.35) 50%, rgba(148, 163, 184, 0.4) 100%)';
                      target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 2pt rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    <a
                      href={content.calendar_button_link || settings.returnButtonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                    >
                      <span 
                        className="text-white"
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif', 
                          fontSize: (typeof window !== 'undefined' && window.innerWidth < 768) ? '12pt' : '14pt', 
                          fontWeight: 600,
                          lineHeight: '1'
                        }}
                      >
                        {content.calendar_button_text || settings.returnButtonText}
                      </span>
                    </a>
                  </GlareCard>
                </div>
              </div>
              </div>
            </FadeInOnScroll>
            
            {/* Footer */}
            <FadeInOnScroll delay={400}>
              <Footer content={content} />
            </FadeInOnScroll>
          </div>
        </div>
      </div>
      <Toaster position="bottom-left" richColors />
      <YandexMetrika />
    </>
  );
}