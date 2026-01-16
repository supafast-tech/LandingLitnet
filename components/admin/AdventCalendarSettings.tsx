import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Save, Eye, EyeOff, Snowflake, Cloud } from 'lucide-react';
import BackgroundFixed from '../BackgroundFixed';
import { SnowEffect } from '../SnowEffect';
import { Gift } from '../../types/gift';
import { GiftModal } from '../GiftModal';
import { GiftEditModal } from './GiftEditModal';
import { getSettings, cacheGlobalSettings, LandingSettings } from '../../utils/settings';
import { fetchGlobalSettings, updateGlobalSettings, fetchAllCalendarDays, updateCalendarDay, CalendarDay, fetchContent, updateContent, ContentData } from '../../utils/api';
import { Skeleton } from '../ui/skeleton';

interface AdventCalendarSettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

type TabType = 'gifts' | 'landing-content' | 'effects';

export function AdventCalendarSettings({ onBack, onLogout, onBackToSite }: AdventCalendarSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('gifts');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [previewGift, setPreviewGift] = useState<Gift | null>(null);
  const [useRealDate, setUseRealDate] = useState(true);
  const [testDate, setTestDate] = useState(10);
  const [showAdminIcon, setShowAdminIcon] = useState(true); // Добавляем состояние для шестеренки
  const [savedMessage, setSavedMessage] = useState(false);
  const [settings, setSettings] = useState<LandingSettings>(getSettings());
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);
  const [landingContent, setLandingContent] = useState<ContentData>({});
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    loadGifts();
    loadSettings();
    loadLandingContent();
  }, []);

  const loadGifts = async () => {
    setIsLoadingGifts(true);
    try {
      const calendarDays = await fetchAllCalendarDays();
      // Convert CalendarDay to Gift format
      const giftsFromDB = calendarDays.map(day => ({
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
      }));
      setGifts(giftsFromDB);
      console.log('[ADMIN] Loaded calendar days from database:', giftsFromDB.length);
    } catch (error) {
      console.error('[ADMIN] Error loading calendar days:', error);
      setGifts([]);
    } finally {
      setIsLoadingGifts(false);
    }
  };

  const loadSettings = async () => {
    const realDate = localStorage.getItem('admin_use_real_date');
    const savedTestDate = localStorage.getItem('admin_test_date');
    const savedShowAdminIcon = localStorage.getItem('admin_show_admin_icon');
    
    // По умолчанию использовать реальную дату (если не сохранено явно)
    setUseRealDate(realDate === null ? true : realDate === 'true');
    if (savedTestDate) {
      setTestDate(parseInt(savedTestDate));
    }
    // По умолчанию показывать шестеренку (если не сохранено явно)
    setShowAdminIcon(savedShowAdminIcon === null ? true : savedShowAdminIcon === 'true');
    
    // Load global settings from server
    try {
      const globalSettings = await fetchGlobalSettings();
      cacheGlobalSettings(globalSettings);
      setSettings(globalSettings);
    } catch (error) {
      console.error('Error loading global settings:', error);
      setSettings(getSettings());
    }
  };

  const loadLandingContent = async () => {
    setIsLoadingContent(true);
    try {
      const contentData = await fetchContent();
      setLandingContent(contentData);
      console.log('[ADMIN] Loaded landing content from database');
    } catch (error) {
      console.error('[ADMIN] Error loading landing content:', error);
      setLandingContent({});
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleSaveGift = async () => {
    if (editingGift) {
      try {
        // Convert Gift to CalendarDay format and save to database
        const calendarDayData = {
          day: editingGift.id,
          title: editingGift.title,
          subtitle: '',
          giftType: 'promo' as const,
          promoCode: editingGift.promoCode,
          promoDescription: editingGift.description,
          promoDisclaimer: editingGift.promoDisclaimer || '',
          discount: '',
          bonusAmount: '',
          bonusDescription: '',
          hoverLabel: editingGift.hoverLabel || `${editingGift.id} декабря`,
          lockedMessage: 'Этот день ещё не наступил',
          pastMessage: 'Этот подарок уже недоступен',
          buttonLink: editingGift.buttonLink || '#',
          buttonText: editingGift.buttonText || 'Перейти к подарку',
          downloadFile: editingGift.downloadFile || false,
          // Второй промокод
          promoCode2: editingGift.promoCode2,
          promoDisclaimer2: editingGift.promoDisclaimer2,
          buttonLink2: editingGift.buttonLink2,
          buttonText2: editingGift.buttonText2,
          downloadFile2: editingGift.downloadFile2,
          popupType: editingGift.popupType || 'single_promo' // Добавляем тип попапа
        };
        
        await updateCalendarDay(editingGift.id, calendarDayData);
        await loadGifts();
        setEditingGift(null);
        showSavedMessage();
        console.log('[ADMIN] Gift saved to database successfully');
      } catch (error) {
        console.error('[ADMIN] Error saving gift:', error);
        alert('Ошибка при сохранении под����рка. Прове��ьте консоль.');
      }
    }
  };

  const handleSaveTestSettings = () => {
    localStorage.setItem('admin_use_real_date', useRealDate.toString());
    localStorage.setItem('admin_test_date', testDate.toString());
    localStorage.setItem('admin_show_admin_icon', showAdminIcon.toString());
    showSavedMessage();
    
    // Trigger content reload on main page to update footer
    window.dispatchEvent(new CustomEvent('contentUpdated'));
  };

  const handleSaveContent = async () => {
    try {
      // Save to global database
      await updateGlobalSettings(settings);
      // Update local cache
      cacheGlobalSettings(settings);
      showSavedMessage();
      
      // Trigger settings reload on main page
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (error) {
      console.error('Error saving global settings:', error);
      alert('Ошибка при сохранении настроек. Проверьте консоль.');
    }
  };

  const handleSaveLandingContent = async () => {
    try {
      console.log('[ADMIN] Saving landing content...');
      // Save all content keys to database, excluding removed visibility flags
      const keysToExclude = ['footer_link_terms_visible', 'footer_link_privacy_visible', 'footer_link_help_visible'];
      const updatePromises = Object.entries(landingContent)
        .filter(([key]) => !keysToExclude.includes(key))
        .map(([key, value]) => updateContent(key, value));
      await Promise.all(updatePromises);
      showSavedMessage();
      console.log('[ADMIN] Landing content saved successfully');
      
      // Trigger content reload on main page
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    } catch (error) {
      console.error('[ADMIN] Error saving landing content:', error);
      alert('Ошибка при сохранении контента. Проверьте консоль.');
    }
  };

  const showSavedMessage = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <BackgroundFixed />
      
      {/* Snow Effect */}
      {settings.snowEnabled && <SnowEffect intensity={settings.snowIntensity} />}
      
      {/* Затемнение всего фона */}
      <div 
        className="absolute inset-0 bg-black/60 pointer-events-none"
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
              >
                <ArrowLeft className="w-5 h-5" />
                К выбору лендинга
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white border border-white/20"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </div>
          
          {/* Title */}
          <div className="mb-8">
            <h1 
              className="text-white mb-2"
              style={{ 
                fontFamily: 'Argent CF, sans-serif', 
                fontWeight: 400, 
                fontStyle: 'italic', 
                fontSize: '32pt', 
                lineHeight: '0.9' 
              }}
            >
              Адвент Календарь 2025
            </h1>
            <p 
              className="text-white/70"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
            >
              Управление подарками и настройками календаря
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('gifts')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'gifts'
                  ? 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
            >
              Подарки дней
            </button>
            <button
              onClick={() => setActiveTab('landing-content')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'landing-content'
                  ? 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
            >
              Контент лендинга
            </button>
            <button
              onClick={() => setActiveTab('effects')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'effects'
                  ? 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
            >
              Эффекты
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'gifts' && (
            <>
              {/* Test Settings */}
              <div 
                className="mb-8 p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <h2 
                  className="text-white mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}
                >
                  Настройки тестирования
                </h2>
                
                <div className="flex items-center gap-6 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useRealDate}
                      onChange={(e) => setUseRealDate(e.target.checked)}
                      className="w-5 h-5 rounded border border-white/30 bg-white/10 checked:bg-orange-500 cursor-pointer"
                    />
                    <span 
                      className="text-white"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                    >
                      Точная дата (использовать реальную дату)
                    </span>
                  </label>
                  
                  {!useRealDate && (
                    <div className="flex items-center gap-3">
                      <span 
                        className="text-white"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      >
                        Активный день для теста:
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={testDate}
                        onChange={(e) => setTestDate(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                      <span 
                        className="text-white/70"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                      >
                        декабря
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAdminIcon}
                      onChange={(e) => setShowAdminIcon(e.target.checked)}
                      className="w-5 h-5 rounded border border-white/30 bg-white/10 checked:bg-orange-500 cursor-pointer"
                    />
                    <span 
                      className="text-white"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                    >
                      Показывать шестеренку в подвале лендинга
                    </span>
                  </label>
                  
                  <div className="flex items-center gap-4">
                    {savedMessage && (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-lg backdrop-blur-sm animate-in fade-in duration-300"
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif', 
                          fontSize: '11pt', 
                          fontWeight: 600,
                          color: '#4ade80',
                          boxShadow: '0 0 15px rgba(74, 222, 128, 0.3)'
                        }}
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Настройки сохранены
                      </div>
                    )}
                    <button
                      onClick={handleSaveTestSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-xl hover:from-red-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 border border-white/30"
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif', 
                        fontSize: '12pt', 
                        fontWeight: 600,
                        boxShadow: '0 0 15px rgba(234, 88, 12, 0.4)'
                      }}
                    >
                      <Save className="w-4 h-4" />
                      Сохранить
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Gifts Table */}
              <div 
                className="rounded-2xl backdrop-blur-md overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="px-4 py-3 text-left text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                          День
                        </th>
                        <th className="px-4 py-3 text-left text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                          Дата
                        </th>
                        <th className="px-4 py-3 text-left text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                          Заголовок
                        </th>
                        <th className="px-4 py-3 text-left text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                          Промокод
                        </th>
                        <th className="px-4 py-3 text-center text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingGifts ? (
                        // Loading skeletons
                        Array.from({ length: 31 }).map((_, index) => (
                          <tr 
                            key={index} 
                            className="border-b border-white/10"
                          >
                            <td className="px-4 py-3">
                              <Skeleton className="h-5 w-8 bg-white/10 rounded-lg" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-5 w-32 bg-white/10 rounded-lg" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-5 w-48 bg-white/10 rounded-lg" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-5 w-24 bg-white/10 rounded-lg" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <Skeleton className="h-8 w-28 bg-white/10 rounded-lg" />
                                <Skeleton className="h-8 w-10 bg-white/10 rounded-lg" />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Actual data
                        gifts.slice(0, 31).map((gift, index) => (
                          <tr 
                            key={gift.id} 
                            className="border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => setEditingGift(gift)}
                          >
                            <td className="px-4 py-3 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-white/80" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                              {formatDate(gift.date)}
                            </td>
                            <td className="px-4 py-3 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                              {gift.title || '—'}
                            </td>
                            <td className="px-4 py-3 text-orange-300" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                              {gift.promoCode || '—'}
                            </td>
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setEditingGift(gift)}
                                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
                                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10pt' }}
                                >
                                  Редактировать
                                </button>
                                <button
                                  onClick={() => setPreviewGift(gift)}
                                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                                  title="Превью"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'landing-content' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div 
                className="p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <h2 className="text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}>
                  Главный экран (Hero)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Заголовок
                    </label>
                    <textarea
                      value={landingContent.hero_title || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, hero_title: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors resize-none"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="Адвент\nкалендарь 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Подзаголовок
                    </label>
                    <input
                      type="text"
                      value={landingContent.hero_subtitle || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, hero_subtitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="Каждый день декабря – новый подарок от Литнета"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Текст кнопки
                      </label>
                      <input
                        type="text"
                        value={landingContent.hero_button_text || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, hero_button_text: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Открыть календарь"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка кнопки
                      </label>
                      <input
                        type="text"
                        value={landingContent.hero_button_link || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, hero_button_link: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="#calendar-section"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works Section */}
              <div 
                className="p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <h2 className="text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}>
                  Как это работает
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Заголовок секции
                    </label>
                    <textarea
                      value={landingContent.how_it_works_title || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, how_it_works_title: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors resize-none"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="Как это\nработает?"
                    />
                  </div>
                  
                  {/* Step 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 1 - Заголовок
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step1_title || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step1_title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Заходите каждый день"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 1 - Описание
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step1_desc || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step1_desc: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="С 1 по 31 декабря открывается новое окошко календаря"
                      />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 2 - Заголовок
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step2_title || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step2_title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Открывайте подарок"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 2 - Описание
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step2_desc || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step2_desc: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Нажмите на активную дату и получите пр��мокод или бонус"
                      />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 3 - Заголовок
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step3_title || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step3_title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Используйте на Литнете"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 3 - Описание
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step3_desc || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step3_desc: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Применяйте подарки для покупки любимых книг"
                      />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 4 - Заголовок
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step4_title || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step4_title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Собирайте все подарки"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Шаг 4 - Описание
                      </label>
                      <input
                        type="text"
                        value={landingContent.how_it_works_step4_desc || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, how_it_works_step4_desc: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Дед Мороз приготовил для вас 31 праздничный сюрприз"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div 
                className="p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <h2 className="text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}>
                  Секция календаря
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Заголовок
                    </label>
                    <textarea
                      value={landingContent.calendar_title || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, calendar_title: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors resize-none"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="Календарь\nподарков декабря 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Подзаголовок
                    </label>
                    <input
                      type="text"
                      value={landingContent.calendar_subtitle || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, calendar_subtitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="Открывайте новое окошко каждый день"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Текст кнопки возврата
                      </label>
                      <input
                        type="text"
                        value={landingContent.calendar_button_text || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, calendar_button_text: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Вернуться на главную Литнета"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка кнопки возврата
                      </label>
                      <input
                        type="text"
                        value={landingContent.calendar_button_link || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, calendar_button_link: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="https://litnet.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div 
                className="p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <h2 className="text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}>
                  Подвал (Footer)
                </h2>
                <p className="text-white/70 mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                  Что��ы скрыть ссылку - оставьте поле URL пустым
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Описание
                    </label>
                    <input
                      type="text"
                      value={landingContent.footer_description || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, footer_description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="Адвент календарь 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                      Копирайт
                    </label>
                    <input
                      type="text"
                      value={landingContent.footer_copyright || ''}
                      onChange={(e) => setLandingContent({ ...landingContent, footer_copyright: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      placeholder="© 2025 Litnet. Все права защищены."
                    />
                  </div>
                  
                  {/* Links */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка 1 - Текст
                      </label>
                      <input
                        type="text"
                        value={landingContent.footer_link_terms || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, footer_link_terms: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Правила акции"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка 1 - URL
                      </label>
                      <input
                        type="text"
                        value={landingContent.footer_link_terms_url || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, footer_link_terms_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Оставьте пустым, чтобы скрыть ссылку"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка 2 - Текст
                      </label>
                      <input
                        type="text"
                        value={landingContent.footer_link_privacy || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, footer_link_privacy: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Политика конфиденциальности"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка 2 - URL
                      </label>
                      <input
                        type="text"
                        value={landingContent.footer_link_privacy_url || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, footer_link_privacy_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Оставьте пустым, чтобы скрыть ссылку"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка 3 - Текст
                      </label>
                      <input
                        type="text"
                        value={landingContent.footer_link_help || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, footer_link_help: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Пользовательск��е согл��шение"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Ссылка 3 - URL
                      </label>
                      <input
                        type="text"
                        value={landingContent.footer_link_help_url || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, footer_link_help_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="Оставьте пустым, чтобы скрыть ссылку"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Networks Block */}
              <div 
                className="p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                  boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
                }}
              >
                <h2 className="text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}>
                  Социальные сети
                </h2>
                <div className="space-y-4">
                  <p className="text-white/70 mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                    Эти ссылки будут использоваться во всех лендингах (Адвент, Итоги, Главная)
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        ВКонтакте
                      </label>
                      <input
                        type="text"
                        value={landingContent.social_vk || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, social_vk: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="https://vk.com/litnetcom"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Telegram
                      </label>
                      <input
                        type="text"
                        value={landingContent.social_telegram || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, social_telegram: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="https://t.me/litnet_official"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Одноклассники
                      </label>
                      <input
                        type="text"
                        value={landingContent.social_ok || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, social_ok: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="https://ok.ru/litnet"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}>
                        Яндекс.Дзен
                      </label>
                      <input
                        type="text"
                        value={landingContent.social_dzen || ''}
                        onChange={(e) => setLandingContent({ ...landingContent, social_dzen: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                        placeholder="https://dzen.ru/litnet"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-4">
                {savedMessage && (
                  <div 
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-lg backdrop-blur-sm animate-in fade-in duration-300"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif', 
                      fontSize: '11pt', 
                      fontWeight: 600,
                      color: '#4ade80',
                      boxShadow: '0 0 15px rgba(74, 222, 128, 0.3)'
                    }}
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Контент сохранен
                  </div>
                )}
                <button
                  onClick={handleSaveLandingContent}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-xl hover:from-red-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 border border-white/30"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif', 
                    fontSize: '12pt', 
                    fontWeight: 600,
                    boxShadow: '0 0 15px rgba(234, 88, 12, 0.4)'
                  }}
                >
                  <Save className="w-5 h-5" />
                  Сохранить контент
                </button>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div 
              className="p-6 rounded-2xl backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
                boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
              }}
            >
              <h2 className="text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16pt', fontWeight: 600 }}>
                Управление эффектами
              </h2>
              
              <div className="space-y-6">
                {/* Snow Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <Snowflake className="w-8 h-8 text-white" />
                    <div>
                      <h3 className="text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', fontWeight: 600 }}>
                        Снежинки
                      </h3>
                      <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                        Включить/выключить эффект падающего снега
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.snowEnabled}
                      onChange={(e) => setSettings({ ...settings, snowEnabled: e.target.checked })}
                      className="w-6 h-6 rounded border border-white/30 bg-white/10 checked:bg-orange-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Snow Intensity */}
                {settings.snowEnabled && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <Cloud className="w-8 h-8 text-white" />
                      <div>
                        <h3 className="text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', fontWeight: 600 }}>
                          Интенсивность снега
                        </h3>
                        <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                          Выберите силу снегопада
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSettings({ ...settings, snowIntensity: 'normal' })}
                        className={`flex-1 py-3 px-6 rounded-xl transition-all ${
                          settings.snowIntensity === 'normal'
                            ? 'bg-white/10 text-white border border-orange-500'
                            : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                        }`}
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
                      >
                        Обычный
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, snowIntensity: 'crazy' })}
                        className={`flex-1 py-3 px-6 rounded-xl transition-all ${
                          settings.snowIntensity === 'crazy'
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border border-white/30'
                            : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                        }`}
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
                      >
                        Снегопад (опасно) ❄️💥
                      </button>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex items-center gap-4">
                  {savedMessage && (
                    <div 
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-lg backdrop-blur-sm animate-in fade-in duration-300"
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif', 
                        fontSize: '12pt', 
                        fontWeight: 600,
                        color: '#4ade80',
                        boxShadow: '0 0 15px rgba(74, 222, 128, 0.3)'
                      }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Эффекты применены
                    </div>
                  )}
                  <button
                    onClick={handleSaveContent}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-xl hover:from-red-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 border border-white/30"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif', 
                      fontSize: '14pt', 
                      fontWeight: 700,
                      boxShadow: '0 0 20px rgba(234, 88, 12, 0.5)'
                    }}
                  >
                    <Save className="w-5 h-5 inline mr-2" />
                    Применить эффекты
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      {editingGift && (
        <GiftEditModal
          gift={editingGift}
          onClose={() => setEditingGift(null)}
          onSave={handleSaveGift}
          setGift={setEditingGift}
          savedMessage={savedMessage}
        />
      )}
      
      {/* Preview Modal */}
      {previewGift && (
        <GiftModal gift={previewGift} onClose={() => setPreviewGift(null)} />
      )}
    </div>
  );
}
