import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Save } from 'lucide-react';
import { AdminBackground } from './AdminBackground';
import { SnowEffect } from '../SnowEffect';
import { getSettings } from '../../utils/settings';
import { fetchHomepageContent, updateHomepageLanding, HomepageLanding } from '../../utils/homepageApi';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

interface HomepageSettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

export function HomepageSettings({ onBack, onLogout, onBackToSite }: HomepageSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [landings, setLandings] = useState<HomepageLanding[]>([]);
  const settings = getSettings();

  useEffect(() => {
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHomepageContent();
      setLandings(data);
    } catch (error) {
      console.error('Failed to load homepage content:', error);
      toast.error('Ошибка загрузки контента главной');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (landingId: string, updatedData: Partial<HomepageLanding>) => {
    setIsSaving(true);
    try {
      await updateHomepageLanding(landingId, updatedData);
      toast.success('Контент успешно сохранен!');
      await loadHomepageContent();
    } catch (error) {
      console.error('Failed to save landing:', error);
      toast.error('Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (landingId: string, field: keyof HomepageLanding, value: string) => {
    setLandings(prev => prev.map(landing => 
      landing.landing_id === landingId 
        ? { ...landing, [field]: value }
        : landing
    ));
  };

  const getBackgroundStyle = () => {
    return {
      background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
      boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    };
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <AdminBackground />
      
      {/* Snow Effect */}
      {settings.snowEnabled && <SnowEffect intensity={settings.snowIntensity} />}
      
      {/* Затемнение всего фона */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
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
                Назад к панели
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onBackToSite}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white border border-white/20"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
              >
                Вернуться на сайт
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
              Контент главной страницы
            </h1>
            <p 
              className="text-white/70"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
            >
              Редактирование текстов для карточек лендингов
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              landings.map((landing) => (
                <div 
                  key={landing.landing_id}
                  className="p-8 rounded-3xl"
                  style={getBackgroundStyle()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 
                      className="text-white"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20pt', fontWeight: 600 }}
                    >
                      {landing.landing_id === 'advent' ? '🎄 Адвент Календарь' : '🎁 Итоги 2025'}
                    </h3>
                    
                    <button
                      onClick={() => handleSave(landing.landing_id, landing)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl transition-all text-white disabled:opacity-50"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {/* Title */}
                    <div>
                      <label 
                        className="block text-white/90 mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 500 }}
                      >
                        Заголовок
                      </label>
                      <input
                        type="text"
                        value={landing.title}
                        onChange={(e) => handleInputChange(landing.landing_id, 'title', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                        placeholder="Заголовок лендинга"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label 
                        className="block text-white/90 mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 500 }}
                      >
                        Описание
                      </label>
                      <textarea
                        value={landing.description}
                        onChange={(e) => handleInputChange(landing.landing_id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                        placeholder="Описание лендинга"
                      />
                    </div>

                    {/* Button Text */}
                    <div>
                      <label 
                        className="block text-white/90 mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 500 }}
                      >
                        Текст кнопки
                      </label>
                      <input
                        type="text"
                        value={landing.button_text}
                        onChange={(e) => handleInputChange(landing.landing_id, 'button_text', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                        placeholder="Текст на кнопке"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}