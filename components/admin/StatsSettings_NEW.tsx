import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Save, Eye } from 'lucide-react';
import { AdminBackground } from './AdminBackground';
import { SnowEffect } from '../SnowEffect';
import { getSettings } from '../../utils/settings';
import { fetchStatsContent, updateStatsContent, StatsData, fetchStatsParameters, StatsParameter } from '../../utils/statsApi';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

interface StatsSettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

interface URLParam {
  key: string;
  value: string;
}

export function StatsSettings({ onBack, onLogout, onBackToSite }: StatsSettingsProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'url'>('content');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<StatsData>({});
  const [statsParameters, setStatsParameters] = useState<StatsParameter[]>([]);
  const [urlParams, setUrlParams] = useState<URLParam[]>([{ key: '', value: '' }]);
  const settings = getSettings();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStatsContent();
      setStats(data);
      
      const parameters = await fetchStatsParameters();
      setStatsParameters(parameters);
      
      if (parameters.length > 0) {
        const autoParams = parameters.map(param => ({
          key: param.param_key,
          value: param.test_value || ''
        }));
        setUrlParams(autoParams);
      } else {
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
      const statsToSave = {
        ...stats,
        url_params: JSON.stringify(urlParams)
      };
      await updateStatsContent(statsToSave);
      toast.success('Данные успешно сохранены!');
    } catch (error) {
      console.error('Failed to save stats:', error);
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
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

  const getBackgroundStyle = () => {
    return {
      background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
      boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    };
  };

  const renderTextField = (label: string, field: keyof StatsData, placeholder: string, isTextarea: boolean = false) => (
    <div>
      <label className="block text-white/70 mb-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          value={(stats[field] as string) || ''}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-all resize-y min-h-[100px]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={(stats[field] as string) || ''}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <AdminBackground />
      
      {/* Snow Effect */}
      {settings.snowEnabled && <SnowEffect intensity={settings.snowIntensity} />}
      
      {/* Затемнение всего фона */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
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
                onClick={onBackToSite}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white border border-white/20"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
              >
                Вернуться на сайт
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl transition-all text-white disabled:opacity-50"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}
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
              <div className="p-8 rounded-3xl" style={getBackgroundStyle()}>
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
                  {/* Подсказка */}
                  <div className="p-6 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <p className="text-blue-200" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}>
                      💡 <strong>Подсказка:</strong> Для переноса строки в текстах используйте символы <code className="bg-white/20 px-2 py-1 rounded">\n</code> (обратный слеш + n)
                    </p>
                  </div>

                  {/* Slides */}
                  {[
                    { num: 1, title: 'Заглавный', fields: [
                      { label: 'Заголовок', field: 'slide1_title' as keyof StatsData, placeholder: 'Ваш книжный 2025\\nв одном месте', isTextarea: true },
                      { label: 'Подзаголовок', field: 'slide1_subtitle' as keyof StatsData, placeholder: 'Всё, что вы читали...', isTextarea: true }
                    ]},
                    { num: 2, title: 'Купленные книги', fields: [
                      { label: 'Текст', field: 'slide2_text' as keyof StatsData, placeholder: 'Вы купили\\n{books_count}\\nв 2025 году.', isTextarea: true },
                      { label: 'Описание', field: 'slide2_card_text' as keyof StatsData, placeholder: 'Как вы думаете...', isTextarea: true }
                    ]},
                    { num: 3, title: 'Подписки', fields: [
                      { label: 'Текст', field: 'slide3_text' as keyof StatsData, placeholder: 'В 2025 году\\nвы купили\\n{subscriptions_count}.', isTextarea: true },
                      { label: 'Описание', field: 'slide3_card_text' as keyof StatsData, placeholder: 'Подписка помогает поддерживать авторов...', isTextarea: true }
                    ]},
                    { num: 4, title: 'Библиотека', fields: [
                      { label: 'Текст', field: 'slide4_text' as keyof StatsData, placeholder: 'В 2025 году\\nваша личная\\nбиблиотека\\nпополнилась\\nна {library_count}.', isTextarea: true },
                      { label: 'Описание', field: 'slide4_card_text' as keyof StatsData, placeholder: 'В вашей книжной галактике зажглись новые звезды.', isTextarea: true }
                    ]},
                    { num: 5, title: 'Страницы', fields: [
                      { label: 'Текст', field: 'slide5_text' as keyof StatsData, placeholder: 'За 2025\\nвы прочитали\\n{pages_count}.', isTextarea: true },
                      { label: 'Описание', field: 'slide5_card_text' as keyof StatsData, placeholder: 'Страницы сменяли друг друга...', isTextarea: true }
                    ]},
                    { num: 6, title: 'Любимый жанр', fields: [
                      { label: 'Текст', field: 'slide6_text' as keyof StatsData, placeholder: 'Ваш\\nжанр – {favorite_genre}.', isTextarea: true },
                      { label: 'Описание', field: 'slide6_card_text' as keyof StatsData, placeholder: 'Из всех добавленных вами в библиотеку...', isTextarea: true }
                    ]},
                    { num: 7, title: 'Книги в жанре', fields: [
                      { label: 'Текст', field: 'slide7_text' as keyof StatsData, placeholder: '{books_in_genre_count} в жанре\\n{favorite_genre}\\nвы купили\\nв 2025 году.', isTextarea: true },
                      { label: 'Описание', field: 'slide7_card_text' as keyof StatsData, placeholder: 'Кажется, у вас серьёзные отношения...', isTextarea: true }
                    ]},
                    { num: 8, title: 'Любимый автор', fields: [
                      { label: 'Текст', field: 'slide8_text' as keyof StatsData, placeholder: 'В 2025 году\\nвы отдали сердце\\n{favorite_author}.', isTextarea: true },
                      { label: 'Описание', field: 'slide8_card_text' as keyof StatsData, placeholder: 'Большинство купленных вами книг...', isTextarea: true }
                    ]},
                    { num: 9, title: 'Награды', fields: [
                      { label: 'Текст', field: 'slide9_text' as keyof StatsData, placeholder: 'В 2025 году\\nвы подарили\\nавторам\\n{awards_count}.', isTextarea: true },
                      { label: 'Описание', field: 'slide9_card_text' as keyof StatsData, placeholder: 'Награда – теплая поддержка...', isTextarea: true },
                      { label: 'Текст кнопки', field: 'slide9_button_text' as keyof StatsData, placeholder: 'Подарить награду', isTextarea: false },
                      { label: 'Ссылка кнопки', field: 'slide9_button_url' as keyof StatsData, placeholder: 'https://litnet.com/account/library', isTextarea: false }
                    ]},
                    { num: 10, title: 'Комментарии', fields: [
                      { label: 'Текст', field: 'slide10_text' as keyof StatsData, placeholder: 'В 2025 году\\nвы оставили\\n{comments_count} комментариев.', isTextarea: true },
                      { label: 'Описание', field: 'slide10_card_text' as keyof StatsData, placeholder: 'Комментарии — ваш голос...', isTextarea: true },
                      { label: 'Текст кнопки', field: 'slide10_button_text' as keyof StatsData, placeholder: 'Читайте ещё с выгодой', isTextarea: false },
                      { label: 'Ссылка кнопки', field: 'slide10_button_url' as keyof StatsData, placeholder: 'https://litnet.com/account/library?discount_code=READ2026', isTextarea: false }
                    ]},
                    { num: 11, title: 'Финальный (Промокод)', fields: [
                      { label: 'Заголовок', field: 'slide11_title' as keyof StatsData, placeholder: 'В 2025 вы открывали много\\nновых сюжетов...', isTextarea: true },
                      { label: 'Подзаголовок', field: 'slide11_subtitle' as keyof StatsData, placeholder: 'Чтобы вам было проще...\\nпромокод READ2026...', isTextarea: true },
                      { label: 'Текст кнопки', field: 'slide11_button_text' as keyof StatsData, placeholder: 'Использовать промокод', isTextarea: false },
                      { label: 'Ссылка кнопки', field: 'slide11_button_link' as keyof StatsData, placeholder: 'https://litnet.com', isTextarea: false }
                    ]}
                  ].map(slide => (
                    <div key={slide.num} className="p-8 rounded-3xl" style={getBackgroundStyle()}>
                      <h3 className="text-white text-xl font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Слайд {slide.num} - {slide.title}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {slide.fields.map((fieldConfig, idx) => (
                          <div key={idx}>
                            {renderTextField(fieldConfig.label, fieldConfig.field, fieldConfig.placeholder, fieldConfig.isTextarea)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-8">
                  <div className="p-8 rounded-3xl" style={getBackgroundStyle()}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white text-2xl font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Параметры URL
                      </h3>
                      <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all text-white"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        <Eye className="w-5 h-5" />
                        Предпросмотр
                      </button>
                    </div>
                    
                    <p className="text-white/60 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Параметры автоматически загружаются из таблицы <code className="bg-white/10 px-2 py-1 rounded">stats_parameters</code> при открытии админки.
                      <br />
                      Вы можете изменить значения для тестирования. Фактические данные пользователей будут браться из URL.
                      <br />
                      Пример ссылки: <code className="bg-white/10 px-2 py-1 rounded">/stats?books_count=25&pages_count=1500</code>
                      <br />
                      <br />
                      Полная тестовая ссылка:{' '}
                      <code className="bg-white/10 px-2 py-1 rounded break-all block mt-2">
                        {`/stats?${urlParams.filter(p => p.key && p.value).map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')}`}
                      </code>
                    </p>

                    <div className="space-y-4">
                      {urlParams.map((param, index) => {
                        const paramInfo = statsParameters.find(p => p.param_key === param.key);
                        return (
                          <div key={index} className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex-1">
                                <label className="block text-white/70 mb-2 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  Название параметра
                                </label>
                                <input
                                  type="text"
                                  value={param.key}
                                  onChange={(e) => updateParam(index, 'key', e.target.value)}
                                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-all"
                                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                                  placeholder="books_count"
                                  readOnly
                                />
                              </div>
                              
                              <div className="flex-1">
                                <label className="block text-white/70 mb-2 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  Значение для тестирования
                                </label>
                                <input
                                  type="text"
                                  value={param.value}
                                  onChange={(e) => updateParam(index, 'value', e.target.value)}
                                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-all"
                                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                                  placeholder="25"
                                />
                              </div>
                            </div>
                            {paramInfo && (
                              <div className="text-white/50 text-sm ml-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {paramInfo.param_label}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {urlParams.length === 0 && (
                        <div className="text-center py-8 text-white/50">
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