import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Save, Eye } from 'lucide-react';
import svgPaths from "../../imports/svg-398uq93q2b";
import { getSettings } from '../../utils/settings';
import { fetchStatsContent, updateStatsContent, StatsData, fetchStatsParameters, StatsParameter } from '../../utils/statsApi';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

interface StatsSettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
  theme: string;
}

interface URLParam {
  key: string;
  value: string;
}

export function StatsSettings({ onBack, onLogout, onBackToSite, theme }: StatsSettingsProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'url' | 'seo'>('content');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<StatsData>({});
  const [statsParameters, setStatsParameters] = useState<StatsParameter[]>([]);
  const [urlParams, setUrlParams] = useState<URLParam[]>([
    { key: '', value: '' }
  ]);
  const settings = getSettings();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStatsContent();
      setStats(data);
      
      // Load stats parameters from database for reference
      const parameters = await fetchStatsParameters();
      setStatsParameters(parameters);
      
      // Auto-populate URL params from stats_parameters table (param_key + test_value)
      if (parameters.length > 0) {
        const autoParams = parameters.map(param => ({
          key: param.param_key,
          value: param.test_value || ''
        }));
        setUrlParams(autoParams);
      } else {
        // Load saved URL params if they exist (fallback)
        if (data.url_params) {
          try {
            const parsed = JSON.parse(data.url_params as string);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setUrlParams(parsed);
            }
          } catch (e) {
            console.error('Failed to parse URL params:', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save URL params as JSON string
      const statsToSave = {
        ...stats,
        url_params: JSON.stringify(urlParams)
      };
      await updateStatsContent(statsToSave);
      toast.success('Настройки успешно сохранены!');
    } catch (error) {
      console.error('Failed to save stats:', error);
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Build URL with params
    const params = urlParams
      .filter(p => p.key && p.value)
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    
    const url = params ? `/stats?${params}` : '/stats';
    window.open(url, '_blank');
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...urlParams];
    newParams[index][field] = value;
    setUrlParams(newParams);
  };

  const updateField = (field: keyof StatsData, value: string) => {
    setStats(prev => ({ ...prev, [field]: value }));
  };

  // Helper to render text field with label
  const renderTextField = (label: string, field: keyof StatsData, placeholder: string, isTextarea: boolean = false) => (
    <div>
      <label className="block text-white/70 mb-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          value={(stats[field] as string) || ''}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#9B59B6] focus:ring-1 focus:ring-[#9B59B6] transition-all resize-y min-h-[100px]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={(stats[field] as string) || ''}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#9B59B6] focus:ring-1 focus:ring-[#9B59B6] transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Background with Stats Theme - gradient like Slide 1 */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 1200">
        <rect fill="url(#adminStatsGradient)" height="1200" width="1920" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="adminStatsGradient" x1="0" x2="1920" y1="0" y2="1200">
            <stop stopColor="#9B59B6" />
            <stop offset="0.5" stopColor="#BB8FCE" />
            <stop offset="1" stopColor="#8E44AD" />
          </linearGradient>
        </defs>
      </svg>

      {/* Litnet Logo Pattern - right side with blur */}
      <div className="fixed h-full right-[-267.38px] top-0 w-[1164.38px] opacity-10" style={{ filter: 'blur(8px)' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1165 1080">
          <path d={svgPaths.p5c5580} fill="white" />
        </svg>
      </div>
      
      {/* Removed dark overlay */}
      
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к списку
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-white disabled:opacity-50"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontSize: '11pt',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
              
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
          <h1 
            className="text-white text-center mb-4"
            style={{ 
              fontFamily: 'Argent CF, sans-serif', 
              fontWeight: 400, 
              fontStyle: 'italic', 
              fontSize: '40pt', 
              lineHeight: '0.9' 
            }}
          >
            Итоги 2025
          </h1>
          
          <p className="text-white/70 text-center mb-12" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt' }}>
            Управление контентом лендинга
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-8 py-3 rounded-xl transition-all ${
                activeTab === 'content' 
                  ? 'text-white border-2 border-white' 
                  : 'text-white/60 border-2 border-white/20 hover:text-white/80 hover:border-white/40'
              }`}
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                fontSize: '13pt',
                background: activeTab === 'content' 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                  : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              Контент лендинга
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-8 py-3 rounded-xl transition-all ${
                activeTab === 'url' 
                  ? 'text-white border-2 border-white' 
                  : 'text-white/60 border-2 border-white/20 hover:text-white/80 hover:border-white/40'
              }`}
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                fontSize: '13pt',
                background: activeTab === 'url' 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                  : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              Параметры URL
            </button>
          </div>
          
          {/* Content */}
          {isLoading ? (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                <Skeleton className="h-8 w-48 bg-white/10 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full bg-white/10" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {activeTab === 'content' && (
                <div className="grid grid-cols-1 gap-6">
                  {/* Slide 1 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      📄 Слайд 1 - Заглавный
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Заголовок', 'slide1_title', 'Ваш книжный 2025\\nв одном месте', true)}
                      {renderTextField('Подзаголовок', 'slide1_subtitle', 'Всё, что вы читали...', true)}
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      📚 Слайд 2 - Купленные книги
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide2_text', 'Вы купили\\n{books_count}\\nв 2025 году.', true)}
                      {renderTextField('Описание', 'slide2_card_text', 'Как вы думаете...', true)}
                      {renderTextField('Параметр для количества книг', 'slide2_books_count_param', 'books_count')}
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      🎯 Слайд 3 - Подписки
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide3_text', 'В 2025 году\\nвы купили\\n{subscriptions_count}.', true)}
                      {renderTextField('Описание', 'slide3_card_text', 'Подписка помогает поддерживать авторов...', true)}
                      {renderTextField('Параметр для подписок', 'slide3_subscriptions_count_param', 'subscriptions_count')}
                    </div>
                  </div>

                  {/* Slide 4 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      📖 Слайд 4 - Библиотека
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide4_text', 'В 2025 году\\nваша личная\\nбиблиотека\\nпополнилась\\nна {library_count}.', true)}
                      {renderTextField('Описание', 'slide4_card_text', 'В вашей книжной галактике зажглись новые звезды.', true)}
                      {renderTextField('Параметр для библиотеки', 'slide4_library_count_param', 'library_count')}
                    </div>
                  </div>

                  {/* Slide 5 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      📄 Слайд 5 - Страницы
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('екст', 'slide5_text', 'За 2025\\nвы прочитали\\n{pages_count}.', true)}
                      {renderTextField('Описание', 'slide5_card_text', 'Страницы сменяли друг друга...', true)}
                      {renderTextField('Параметр для страниц', 'slide5_pages_count_param', 'pages_count')}
                    </div>
                  </div>

                  {/* Slide 6 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      🎭 Слайд 6 - Любимый жанр
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide6_text', 'Ваш\\nжанр – {favorite_genre}.', true)}
                      {renderTextField('Описание', 'slide6_card_text', 'Из всех добавленных вами в библиотеку...', true)}
                      {renderTextField('Параметр для жанра', 'slide6_genre_param', 'favorite_genre')}
                    </div>
                  </div>

                  {/* Slide 7 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      📚 Слайд 7 - Книги в жанре
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide7_text', '{books_in_genre_count} в жанре\\n{favorite_genre}\\nвы купили\\nв 2025 году.', true)}
                      {renderTextField('Описание', 'slide7_card_text', 'Кажется, у вас серьёзные отношения...', true)}
                      {renderTextField('Параметр для автора', 'slide7_author_param', 'favorite_author')}
                      {renderTextField('Параметр для книг в жанре', 'slide7_books_in_genre_param', 'books_in_genre_count')}
                    </div>
                  </div>

                  {/* Slide 8 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      ✍️ Слайд 8 - Любимый автор
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide8_text', 'В 2025 году\\nвы отдали сердце\\n{favorite_author}.', true)}
                      {renderTextField('Описание', 'slide8_card_text', 'Большинство купленных вами книг...', true)}
                      {renderTextField('Параметр для автора', 'slide8_author_param', 'favorite_author')}
                    </div>
                  </div>

                  {/* Slide 9 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      🏆 Слайд 9 - Награды
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide9_text', 'В 2025 году\\nвы подарили\\nавторам\\n{awards_count}.', true)}
                      {renderTextField('Описание', 'slide9_card_text', 'Награда – теплая поддержка...', true)}
                      {renderTextField('П��раметр для наград', 'slide9_awards_count_param', 'awards_count')}
                      {renderTextField('Текст кнопки', 'slide9_button_text', 'Подарить награду')}
                      {renderTextField('Ссылка кнопки', 'slide9_button_url', 'https://litnet.com/account/library')}
                    </div>
                  </div>

                  {/* Slide 10 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      💬 Слайд 10 - Комментарии
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Текст', 'slide10_text', 'В 2025 году\\nвы оставили\\n{comments_count} комментариев.', true)}
                      {renderTextField('Описание', 'slide10_card_text', 'Комментарии — ваш голос...', true)}
                      {renderTextField('Параметр для комментариев', 'slide10_comments_count_param', 'comments_count')}
                      {renderTextField('Текст кнопки', 'slide10_button_text', 'Читайт ещё с выгодой')}
                      {renderTextField('Ссылка кнопки', 'slide10_button_url', 'https://litnet.com/account/library?discount_code=READ2026')}
                    </div>
                  </div>

                  {/* Slide 11 */}
                  <div className="p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      🎁 Слайд 11 - Финальный (Промокод)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {renderTextField('Заголовок', 'slide11_title', 'В 2025 вы открывали много\\nновых сюжетов...', true)}
                      {renderTextField('Подзаголовок', 'slide11_subtitle', 'Чтобы вам было проще...\\nпромокод READ2026...', true)}
                      {renderTextField('Текст кнопки', 'slide11_button_text', 'Использовать промокод')}
                      {renderTextField('Ссылка кнопки', 'slide11_button_link', 'https://litnet.com')}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-8">
                  {/* URL Parameters Section */}
                  <div className="p-8 rounded-3xl" style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-gray-900 text-2xl font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Параметры URL
                      </h3>
                      <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-white"
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif', 
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
                          border: '2px solid rgba(155, 89, 182, 0.3)',
                          boxShadow: '0 4px 12px rgba(155, 89, 182, 0.3)'
                        }}
                      >
                        <Eye className="w-5 h-5" />
                        Предпросмотр
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Параметры автоматически загружаются из таблицы <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded">stats_parameters</code> при открытии админки.
                      <br />
                      Вы можете изменить значения для тестирования. Фактические данные пользователей будут браться из URL.
                      <br />
                      Пример ссылки: <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded">/stats?books_count=25&pages_count=1500</code>
                    </p>

                    <div className="space-y-4">
                      {urlParams.map((param, index) => {
                        const paramInfo = statsParameters.find(p => p.param_key === param.key);
                        return (
                          <div key={index} className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex-1">
                                <label className="block text-gray-700 mb-2 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  Название параметра
                                </label>
                                <input
                                  type="text"
                                  value={param.key}
                                  onChange={(e) => updateParam(index, 'key', e.target.value)}
                                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                                  placeholder="books_count"
                                  readOnly
                                />
                              </div>
                              
                              <div className="flex-1">
                                <label className="block text-gray-700 mb-2 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  Значение для тестирования
                                </label>
                                <input
                                  type="text"
                                  value={param.value}
                                  onChange={(e) => updateParam(index, 'value', e.target.value)}
                                  className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                                  placeholder="25"
                                />
                              </div>
                            </div>
                            {paramInfo && (
                              <div className="text-gray-500 text-sm ml-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {paramInfo.param_label}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {urlParams.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Нет параметров. Параметры загружаются из таблицы stats_parameters.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}