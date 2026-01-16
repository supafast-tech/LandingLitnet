import { memo, useState, useCallback, useEffect } from 'react';
import { Gift } from '../types/gift';
import { getDayStatus, formatDate } from '../utils/gifts';
import { GlareCard } from './ui/glare-card';

interface CalendarDayProps {
  gift: Gift;
  onClick: () => void;
  isAnyDayHovered?: boolean;
  onCurrentDayHoverChange?: (isHovered: boolean) => void;
  isJanuary?: boolean;
}

// Рандомные тексты для прошедших дней
const pastMessages = [
  'Дед Мороз уже уехал отсюда. Получить гостинец можно только в день его активности.'
];

// Рандомные тексты для будущих дней
const futureMessages = [
  'Приходите в этот день и заберите свой подарок',
  'Ждем вас здесь с сюрпризом',
  'Скоро откроем — не пропустите',
  'В этот день вас ждет гостинец',
  'Возвращайтесь сюда за подарком'
];

// Дни недели
const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Функция для получения дня недели (0-6, где 0 - воскресенье)
const getDayOfWeek = (dateStr: string): number => {
  const date = new Date(dateStr);
  return date.getDay();
};

// Функция для получения дня недели для января 2026
const getJanuaryDayOfWeek = (day: number): number => {
  // Январь 2026 года
  const date = new Date(2026, 0, day); // Месяц 0 = январь
  return date.getDay();
};

export const CalendarDay = memo(({ gift, onClick, isAnyDayHovered, onCurrentDayHoverChange, isJanuary }: CalendarDayProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const status = getDayStatus(gift.date);
  const day = isJanuary ? String(gift.date) : formatDate(gift.date);
  const dayOfWeek = isJanuary ? getJanuaryDayOfWeek(Number(gift.date)) : getDayOfWeek(gift.date);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Debug log for day 19
  if (gift.id === 19) {
    console.log('[CalendarDay] Rendering day 19:');
    console.log('  - Gift:', gift);
    console.log('  - Status:', status);
    console.log('  - Date:', gift.date);
    console.log('  - Day display:', day);
  }
  
  // Для января все дни недоступны
  const isDisabled = !gift.enabled || isJanuary;
  const isCurrent = status === 'current' && !isJanuary;
  const isPast = status === 'past' || isJanuary;
  const isFuture = status === 'future' && !isJanuary;
  
  // 31 декабря - особый день
  const isSpecial = day === '31' && !isJanuary;
  
  // Для прошедших дней делаем недоступными
  const isClickDisabled = isDisabled || isPast;
  
  // Notify parent when current day is hovered
  useEffect(() => {
    if (isCurrent && !isDisabled && onCurrentDayHoverChange) {
      onCurrentDayHoverChange(isHovered);
    }
  }, [isHovered, isCurrent, isDisabled, onCurrentDayHoverChange]);
  
  // Получаем рандомное сообщение
  const getMessage = useCallback(() => {
    const dayNum = parseInt(day);
    if (isPast) {
      return pastMessages[dayNum % pastMessages.length];
    }
    if (isFuture) {
      return futureMessages[dayNum % futureMessages.length];
    }
    return '';
  }, [day, isPast, isFuture]);

  // Get background color based on status
  const getBackgroundClass = () => {
    if (isCurrent && !isDisabled) {
      return 'bg-gradient-to-br from-red-600/80 via-orange-600/80 to-red-600/80';
    }
    if (isPast) {
      return 'bg-black/30';
    }
    if (isFuture && isHovered && !isDisabled) {
      return 'bg-white/25'; // Светлее при ховере
    }
    if (isFuture || isDisabled) {
      return 'bg-white/15';
    }
    return 'bg-white/15';
  };
  
  // ��пределяем цвет бордера - inner border через box-shadow
  const getBorderStyle = () => {
    // 31 декабря всегда оранжевый бордер
    if (isSpecial) {
      return {
        boxShadow: 'inset 0 0 0 2pt #f97316'
      };
    }
    
    if (isCurrent && !isDisabled) {
      // Для активного дня - ярко красно-оранжевый бордер с светлым слоем
      return {
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), 0 0 20px rgba(249, 115, 22, 0.3), 0 0 10px rgba(239, 68, 68, 0.2), inset 0 0 0 2pt #ef4444, inset 0 0 0 4pt rgba(255, 255, 255, 0.2)'
      };
    }
    
    if (isHovered && isFuture && !isDisabled) {
      // При ховере на будущие дни - только обводка без свечения
      return {
        boxShadow: 'inset 0 0 0 2pt #ef4444, inset 0 0 0 4pt rgba(255, 255, 255, 0.2)'
      };
    }
    
    // Прошедшие дни - без ховер эффектов
    
    // По умолчанию - белый полупрозрачный с эффектом стекла
    return {
      boxShadow: 'inset 0 0 0 2pt rgba(255, 255, 255, 0.3)'
    };
  };
  
  // Определяем масштаб при ховере
  const getHoverScale = () => {
    if (isCurrent && !isDisabled) {
      return 'hover:scale-125'; // Больше для активного дня
    }
    if (isFuture && !isDisabled) {
      return 'hover:scale-110'; // Средний масштаб для будущих дней
    }
    // Прошедшие дни - без hover эффектов
    return '';
  };
  
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const handleClick = useCallback(() => {
    if (!isClickDisabled) {
      onClick();
    }
  }, [isClickDisabled, onClick]);
  
  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative transition-all duration-300 group w-full
        ${isCurrent && !isDisabled ? 'shadow-2xl rounded-3xl animate-pulse-scale' : ''}
        ${!isClickDisabled ? `cursor-pointer ${getHoverScale()}` : ''}
        ${isClickDisabled ? 'cursor-not-allowed' : ''}
      `}
      style={{
        aspectRatio: '1 / 1.3',
        zIndex: isCurrent && !isDisabled ? (isHovered ? 20 : 11) : 'auto'
      }}
    >
      
      <GlareCard 
        className={`
          w-full 
          h-full 
          relative 
          overflow-visible
          transition-all
          duration-300
          rounded-3xl
        `}
        style={getBorderStyle()}
      >
        {/* Background layer with blur */}
        <div 
          className="absolute inset-0"
          style={{
            backdropFilter: window.innerWidth >= 768 ? 'blur(16px) saturate(180%)' : 'none',
            WebkitBackdropFilter: window.innerWidth >= 768 ? 'blur(16px) saturate(180%)' : 'none',
            pointerEvents: 'none',
            borderRadius: '24px'
          }}
        />
        
        {/* Color overlay */}
        <div 
          className={`absolute inset-0 ${getBackgroundClass()}`}
          style={{
            pointerEvents: 'none',
            borderRadius: '22px',
            transition: 'border-radius 0.3s ease'
          }}
        />
        {/* "СЕГОДНЯ" badge for current day - inside card */}
        {isCurrent && !isDisabled && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 group-hover:scale-105">
            <div className="bg-white px-2 py-0.5 rounded-full shadow-md" style={{ padding: window.innerWidth < 768 ? '2px 16px 4px 16px' : '0px 8px 2px 8px' }}>
              <span 
                className="text-red-600"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontSize: window.innerWidth < 768 ? '10pt' : '6pt',
                  lineHeight: '1.2',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}
              >
                СЕГОДНЯ
              </span>
            </div>
          </div>
        )}
        
        {/* Content container */}
        <div 
          className={`absolute inset-0 flex flex-col bg-transparent overflow-hidden ${isCurrent && !isDisabled ? 'pt-3 px-4 pb-4' : 'p-4'} z-10`}
          style={{
            borderRadius: '22px',
            transition: 'border-radius 0.3s ease'
          }}
        >
          {/* Day number and weekday - centered in flex-1 space */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
            {/* Day number */}
            <span 
              className={`
                text-white italic transition-all duration-300
                ${isCurrent && !isDisabled ? 'drop-shadow-[0_0_20px_rgba(255,255,255,1)]' : ''}
                ${isPast && !isHovered ? 'opacity-40' : ''}
                ${isPast && isHovered ? 'opacity-30 blur-sm scale-90' : ''}
                ${isHovered && isFuture ? 'opacity-30 blur-sm scale-90' : ''}
              `} 
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                fontWeight: 900, 
                fontStyle: 'italic', 
                fontSize: window.innerWidth < 768 ? '80pt' : '64pt',
                lineHeight: '1' 
              }}
            >
              {day}
            </span>
            
            {/* Hover message overlay for future days */}
            {isHovered && isFuture && (
              <div className="absolute inset-0 flex items-center justify-center px-2">
                {isSpecial ? (
                  <div className="text-white text-center drop-shadow-lg animate-in fade-in duration-200 flex flex-col items-center gap-2">
                    <span style={{ fontSize: window.innerWidth < 768 ? '72pt' : '48pt', lineHeight: '1' }}>🎁</span>
                    <p 
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif', 
                        fontSize: window.innerWidth < 768 ? '16pt' : '10pt',
                        lineHeight: '1.2',
                        fontWeight: 600
                      }}
                    >
                      Особый приз<br/>для финала года!
                    </p>
                  </div>
                ) : (
                  <p 
                    className="text-white text-center drop-shadow-lg animate-in fade-in duration-200"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif', 
                      fontSize: window.innerWidth < 768 ? '16pt' : '10pt',
                      lineHeight: '1.2',
                      fontWeight: 600
                    }}
                  >
                    {getMessage()}
                  </p>
                )}
              </div>
            )}
            
            {/* Hover message overlay for past days */}
            {isHovered && isPast && (
              <div className="absolute inset-0 flex items-center justify-center px-3">
                <p 
                  className="text-white text-center drop-shadow-lg animate-in fade-in duration-200"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif', 
                    fontSize: window.innerWidth < 768 ? '14pt' : '9pt',
                    lineHeight: '1.3',
                    fontWeight: 600
                  }}
                >
                  {getMessage()}
                </p>
              </div>
            )}
            
            {/* Day of week */}
            <span 
              className={`
                mt-2 transition-all duration-300
                ${isCurrent && !isDisabled 
                  ? (isWeekend ? 'text-red-200' : 'text-white/90')
                  : (isWeekend ? 'text-red-400' : 'text-white/60')
                }
                ${isPast ? 'opacity-40' : ''}
                ${isHovered && (isFuture || isPast) ? 'opacity-0' : ''}
              `}
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                fontSize: window.innerWidth < 768 ? '12pt' : '8pt',
                lineHeight: '1',
                fontWeight: 500
              }}
            >
              {weekDays[dayOfWeek]}
            </span>
          </div>
          
          {/* Button for current day - pinned to bottom */}
          {isCurrent && !isDisabled && (
            <div className="w-full mt-auto">
              <div 
                className="w-full py-2 rounded-full transition-all duration-300 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 group-hover:scale-105" 
                style={{ 
                  boxShadow: '0 0 30px rgba(234, 88, 12, 0.8), 0 0 15px rgba(239, 68, 68, 0.6)',
                  borderRadius: '9999px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: window.innerWidth < 768 ? '12px 0' : '8px 0'
                }}
              >
                <span 
                  className="text-white block text-center" 
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif', 
                    fontSize: window.innerWidth < 768 ? '16pt' : '12pt',
                    lineHeight: '1', 
                    fontWeight: 600 
                  }}
                >
                  Открыть
                </span>
              </div>
            </div>
          )}
        </div>
        

      </GlareCard>
    </button>
  );
});

CalendarDay.displayName = 'CalendarDay';