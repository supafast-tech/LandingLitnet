import { X, Lock, Clock } from 'lucide-react';
import { DayStatus } from '../types/gift';
import { useState } from 'react';

interface BlockedModalProps {
  status: 'past' | 'future';
  onClose: () => void;
}

export function BlockedModal({ status, onClose }: BlockedModalProps) {
  const isPast = status === 'past';
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  
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
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{
        background: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <style>{`
        @keyframes pulse-modal-white {\n          0%, 100% {\n            box-shadow: 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.2), inset 0 0 0 2pt rgba(255, 255, 255, 0.4);\n          }\n          50% {\n            box-shadow: 0 0 80px rgba(255, 255, 255, 0.4), 0 0 120px rgba(255, 255, 255, 0.3), inset 0 0 0 2pt rgba(255, 255, 255, 0.5);\n          }\n        }
      `}</style>
      
      <div 
        id="blocked-modal-content"
        className="relative max-w-xl w-full overflow-hidden transition-all duration-200"
        style={{
          ...tiltStyle,
          animation: 'pulse-modal-white 2s ease-in-out infinite',
          borderRadius: '48px'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleModalMouseMove}
        onMouseLeave={handleModalMouseLeave}
      >
        {/* Transparent white background with backdrop blur */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '48px'
          }}
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Content */}
        <div className="relative p-10 pt-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
              {isPast ? (
                <Lock className="w-12 h-12 text-white" />
              ) : (
                <Clock className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-center mb-6 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20pt', fontWeight: 700, lineHeight: '1.3' }}>
            {isPast ? 'Этот подарок уже недоступен' : 'Этот подарок еще недоступен'}
          </h2>
          
          {/* Description */}
          <div className="text-center text-white mb-8 space-y-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', lineHeight: '1.6' }}>
            {isPast ? (
              <p>Дед Мороз уже уехал отсюда. Получить гостинец можно только в день его активности. Догоняйте волшебника, открывайте подарок сегодняшнего дня и обязательно приходите завтра!</p>
            ) : (
              <>
                <p>Дед Мороз еще едет сюда.</p>
                <p>Получить гостинец можно только в день его активности.</p>
                <p>Если вы уже открыли сегодняшний подарок, приходите завтра за новым.</p>
              </>
            )}
          </div>
          
          {/* Button */}
          <button
            onClick={onClose}
            className="block w-full py-4 px-6 bg-white text-gray-800 hover:bg-white/90 text-center rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/50"
            style={{ 
              fontFamily: 'Montserrat, sans-serif', 
              fontSize: '14pt',
              fontWeight: 700
            }}
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}