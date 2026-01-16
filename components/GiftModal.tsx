import { X, Copy, Check } from 'lucide-react';
import { Gift } from '../types/gift';
import { useState } from 'react';

interface GiftModalProps {
  gift: Gift;
  onClose: () => void;
}

export function GiftModal({ gift, onClose }: GiftModalProps) {
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  
  // Определяем тип попапа на основе popupType (не проверяем наличие promoCode2)
  const popupType = gift.popupType || 'single_promo';
  
  // Debug logging
  console.log('[GiftModal] Gift data:', gift);
  console.log('[GiftModal] Popup type:', popupType);
  console.log('[GiftModal] Has second promo code:', !!gift.promoCode2);
  
  // Throttle mouse move for better performance
  let rafId: number | null = null;
  
  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafId !== null) return;
    
    rafId = requestAnimationFrame(() => {
      const modal = e.currentTarget;
      if (!modal) {
        rafId = null;
        return;
      }
      
      const rect = modal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Слабее эффект - делим на 30 вместо 15
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
      });
      
      rafId = null;
    });
  };
  
  const handleModalMouseLeave = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    });
  };
  
  const handleCopyPromoCode = () => {
    if (gift.promoCode) {
      navigator.clipboard.writeText(gift.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyPromoCode2 = () => {
    if (gift.promoCode2) {
      navigator.clipboard.writeText(gift.promoCode2);
      setCopied2(true);
      setTimeout(() => setCopied2(false), 2000);
    }
  };
  
  // Форматируем дату
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        padding: window.innerWidth < 768 ? '16pt' : '48pt'
      }}
    >
      <style>{`
        
        @keyframes pulse-modal {
          0%, 100% {
            box-shadow: 0 0 60px rgba(249, 115, 22, 0.5), 0 0 100px rgba(234, 88, 12, 0.3), inset 0 0 0 2pt rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 80px rgba(249, 115, 22, 0.7), 0 0 120px rgba(234, 88, 12, 0.5), inset 0 0 0 2pt rgba(255, 255, 255, 0.5);
          }
        }
      `}</style>
      
      <div 
        id="gift-modal-content"
        className="relative max-w-xl w-full transition-all duration-200"
        style={{
          ...tiltStyle,
          animation: 'pulse-modal 2s ease-in-out infinite',
          borderRadius: '23pt',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleModalMouseMove}
        onMouseLeave={handleModalMouseLeave}
      >
        {/* Bright orange background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 25%, #ff4500 50%, #ff6b00 75%, #ff8c00 100%)',
            borderRadius: '23pt'
          }}
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Content with scroll */}
        <div 
          className="relative overflow-y-auto"
          style={{
            padding: window.innerWidth < 768 ? '24pt' : '36pt',
            paddingTop: window.innerWidth < 768 ? '32pt' : '48pt',
            maxHeight: '100%'
          }}
        >
          {/* Date */}
          <div className="text-center mb-4">
            <p className="text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', fontWeight: 600 }}>
              {formatDate(gift.date)}
            </p>
          </div>
          
          {/* Title */}
          <h2 className="text-center mb-6 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20pt', fontWeight: 700, lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {gift.title}
          </h2>
          
          {/* Description */}
          <p className="text-center mb-8 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', lineHeight: window.innerWidth < 768 ? '1.0' : '1.2' }}>
            {gift.description.replace('Предложение действует до 11 декабря включительно.', '').trim()}
          </p>
          
          {/* Если есть два промокода - показываем оба с кнопками, без поля ввода */}
          {popupType === 'double_promo' ? (
            <div className="space-y-4 mb-4">
              {/* Первый промокод */}
              <div>
                <p className="text-center text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', fontWeight: 600 }}>
                  {gift.promoDisclaimer || 'Промокод'}
                </p>
                <a
                  href={gift.buttonLink}
                  target={gift.downloadFile ? undefined : "_blank"}
                  rel={gift.downloadFile ? undefined : "noopener noreferrer"}
                  download={gift.downloadFile ? true : undefined}
                  className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-white text-orange-600 hover:bg-white/90 text-center rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/50"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif', 
                    fontSize: '14pt',
                    fontWeight: 700,
                    lineHeight: '0.9'
                  }}
                >
                  <span>{gift.buttonText || 'Применить промокод'}</span>
                  <span 
                    className="px-3 py-1"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif', 
                      fontSize: window.innerWidth < 768 ? '11pt' : '14pt',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#ea580c',
                      border: '2px solid #ea580c',
                      borderRadius: '12pt'
                    }}
                  >
                    {gift.promoCode}
                  </span>
                </a>
              </div>

              {/* Второй промокод */}
              <div>
                <p className="text-center text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', fontWeight: 600 }}>
                  {gift.promoDisclaimer2 || 'Промокод 2'}
                </p>
                {gift.buttonLink2 && (
                  <a
                    href={gift.buttonLink2}
                    target={gift.downloadFile2 ? undefined : "_blank"}
                    rel={gift.downloadFile2 ? undefined : "noopener noreferrer"}
                    download={gift.downloadFile2 ? true : undefined}
                    className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-white text-orange-600 hover:bg-white/90 text-center rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/50"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif', 
                      fontSize: '14pt',
                      fontWeight: 700,
                      lineHeight: '0.9'
                    }}
                  >
                    <span>{gift.buttonText2 || 'Применить промокод'}</span>
                    <span 
                      className="px-3 py-1"
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif', 
                        fontSize: window.innerWidth < 768 ? '11pt' : '14pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#ea580c',
                        border: '2px solid #ea580c',
                        borderRadius: '12pt'
                      }}
                    >
                      {gift.promoCode2}
                    </span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Один промокод - старая версия */
            <>
              {/* Promo code with copy button */}
              {gift.promoCode && gift.promoCode.trim() !== '' && (
                <div className="mb-4">
                  <p className="text-center text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14pt', fontWeight: 600 }}>
                    Промокод
                  </p>
                  <div className="flex items-center gap-2 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30" style={{ padding: '18pt' }}>
                    <p className="flex-1 text-center text-white tracking-wider break-all" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: window.innerWidth < 768 ? '20pt' : '28pt', fontWeight: 700 }}>
                      {gift.promoCode}
                    </p>
                    <button
                      onClick={handleCopyPromoCode}
                      className="flex-shrink-0 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all border border-white/30 group"
                      title="Скопировать"
                    >
                      {copied ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Copy className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                  {/* Disclaimer */}
                  {gift.promoDisclaimer && (
                    <p className="text-center text-white/80 mt-3" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10pt', lineHeight: '1.4' }}>
                      {gift.promoDisclaimer}
                    </p>
                  )}
                </div>
              )}
              
              {/* Button */}
              <a
                href={gift.buttonLink}
                target={gift.downloadFile ? undefined : "_blank"}
                rel={gift.downloadFile ? undefined : "noopener noreferrer"}
                download={gift.downloadFile ? true : undefined}
                className="block w-full py-4 px-6 bg-white text-orange-600 hover:bg-white/90 text-center rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/50"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontSize: '14pt',
                  fontWeight: 700
                }}
              >
                {gift.buttonText || (gift.promoCode && gift.promoCode.trim() !== '' ? 'Применить промокод' : 'Получить подарок')}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}