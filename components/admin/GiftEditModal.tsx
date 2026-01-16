import { X, Save } from 'lucide-react';
import { Gift } from '../../types/gift';

interface GiftEditModalProps {
  gift: Gift;
  onClose: () => void;
  onSave: () => Promise<void>;
  setGift: (gift: Gift) => void;
  savedMessage: boolean;
}

export function GiftEditModal({ gift, onClose, onSave, setGift, savedMessage }: GiftEditModalProps) {
  const popupType = gift.popupType || 'single_promo';

  const handleChange = (field: string, value: any) => {
    setGift({ ...gift, [field]: value });
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full rounded-3xl backdrop-blur-md overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.4) 0%, rgba(100, 116, 139, 0.35) 50%, rgba(148, 163, 184, 0.4) 100%)',
          boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.4)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto p-8" style={{ maxHeight: '90vh' }}>
          <h2 
            className="text-white mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20pt', fontWeight: 600 }}
          >
            Редактирование дня {new Date(gift.date).getDate()}
          </h2>
          
          <div className="space-y-4">
            {/* Выбор типа попапа - Стандартный Select */}
            <div>
              <label 
                className="block text-white mb-3"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
              >
                Тип попапа
              </label>
              <select
                value={popupType}
                onChange={(e) => handleChange('popupType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:outline-none transition-colors cursor-pointer appearance-none"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontSize: '12pt',
                  paddingRight: '16pt',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16pt center',
                  backgroundSize: '16pt'
                }}
              >
                <option value="single_promo" style={{ background: '#475569', color: 'white' }}>Один промокод</option>
                <option value="double_promo" style={{ background: '#475569', color: 'white' }}>Два промокода</option>
                <option value="download" style={{ background: '#475569', color: 'white' }}>Скачать файл</option>
              </select>
            </div>

            {/* Общие поля */}
            <div>
              <label 
                className="block text-white mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
              >
                Заголовок
              </label>
              <input
                type="text"
                value={gift.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
              />
            </div>
            
            <div>
              <label 
                className="block text-white mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
              >
                Описание
              </label>
              <textarea
                value={gift.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors resize-none"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
              />
            </div>
            
            <div>
              <label 
                className="block text-white mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
              >
                Подпись дня при ховере
              </label>
              <input
                type="text"
                value={gift.hoverLabel || ''}
                onChange={(e) => handleChange('hoverLabel', e.target.value)}
                placeholder="Например: Скидка 20%"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
              />
            </div>

            {/* Поля для "Один промокод" */}
            {popupType === 'single_promo' && (
              <>
                <div className="pt-2 border-t border-white/10">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                        Промокод
                      </label>
                      <input
                        type="text"
                        value={gift.promoCode}
                        onChange={(e) => handleChange('promoCode', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                        исклеймер
                      </label>
                      <input
                        type="text"
                        value={gift.promoDisclaimer || ''}
                        onChange={(e) => handleChange('promoDisclaimer', e.target.value)}
                        placeholder="Скидка действует до..."
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                        Ссылка кнопки
                      </label>
                      <input
                        type="text"
                        value={gift.buttonLink}
                        onChange={(e) => handleChange('buttonLink', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                        Текст кнопки
                      </label>
                      <input
                        type="text"
                        value={gift.buttonText || ''}
                        onChange={(e) => handleChange('buttonText', e.target.value)}
                        placeholder="Применить промокод"
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Поля для "Два промокода" */}
            {popupType === 'double_promo' && (
              <>
                {/* Первый промокод */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 700 }}>
                    Первый промокод
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={gift.promoCode}
                      onChange={(e) => handleChange('promoCode', e.target.value)}
                      placeholder="Промокод"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                    />
                    <input
                      type="text"
                      value={gift.promoDisclaimer || ''}
                      onChange={(e) => handleChange('promoDisclaimer', e.target.value)}
                      placeholder="Дисклеймер"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                    />
                    <input
                      type="text"
                      value={gift.buttonLink}
                      onChange={(e) => handleChange('buttonLink', e.target.value)}
                      placeholder="Ссылка"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                    />
                    <input
                      type="text"
                      value={gift.buttonText || ''}
                      onChange={(e) => handleChange('buttonText', e.target.value)}
                      placeholder="Текст кнопки"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                    />
                  </div>
                </div>

                {/* Второй промокод */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 700 }}>
                    Второй промокод
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={gift.promoCode2 || ''}
                      onChange={(e) => handleChange('promoCode2', e.target.value)}
                      placeholder="Промокод 2"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                    />
                    <input
                      type="text"
                      value={gift.promoDisclaimer2 || ''}
                      onChange={(e) => handleChange('promoDisclaimer2', e.target.value)}
                      placeholder="Дисклеймер 2"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                    />
                    <input
                      type="text"
                      value={gift.buttonLink2 || ''}
                      onChange={(e) => handleChange('buttonLink2', e.target.value)}
                      placeholder="Ссылка 2"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                    />
                    <input
                      type="text"
                      value={gift.buttonText2 || ''}
                      onChange={(e) => handleChange('buttonText2', e.target.value)}
                      placeholder="Текст кнопки 2"
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Поля для "Скачать файл" */}
            {popupType === 'download' && (
              <>
                <div className="pt-2 border-t border-white/10">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                        Ссылка на файл
                      </label>
                      <input
                        type="text"
                        value={gift.buttonLink}
                        onChange={(e) => handleChange('buttonLink', e.target.value)}
                        placeholder="https://example.com/file.zip"
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', fontWeight: 600 }}>
                        Текст кнопки
                      </label>
                      <input
                        type="text"
                        value={gift.buttonText || ''}
                        onChange={(e) => handleChange('buttonText', e.target.value)}
                        placeholder="Скачать"
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gift.downloadFile || false}
                          onChange={(e) => handleChange('downloadFile', e.target.checked)}
                          className="w-5 h-5 rounded border border-white/30 bg-white/10 checked:bg-orange-500 cursor-pointer"
                        />
                        <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
                          Скачать файл при клике
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Кнопка сохранения */}
            <div className="pt-4">
              {savedMessage && (
                <div 
                  className="flex items-center gap-2 px-4 py-2 mb-3 bg-green-500/20 border border-green-400/40 rounded-lg backdrop-blur-sm animate-in fade-in duration-300"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif', 
                    fontSize: '11pt', 
                    fontWeight: 600,
                    color: '#4ade80'
                  }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Сохранено
                </div>
              )}
              <button
                onClick={handleSave}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white border-2 border-white/30 transition-colors flex items-center justify-center gap-3"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
              >
                <Save className="w-5 h-5" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}