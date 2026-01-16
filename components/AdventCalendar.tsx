import { useState, useEffect, useRef } from 'react';
import { Gift, DayStatus } from '../types/gift';
import { CalendarDay } from './CalendarDay';
import { GiftModal } from './GiftModal';
import { BlockedModal } from './BlockedModal';
import { getDayStatus } from '../utils/gifts';

interface AdventCalendarProps {
  gifts: Gift[];
  onCurrentDayHoverChange?: (isHovered: boolean) => void;
}

export function AdventCalendar({ gifts, onCurrentDayHoverChange }: AdventCalendarProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [blockedStatus, setBlockedStatus] = useState<'past' | 'future' | null>(null);
  const [isAnyDayHovered, setIsAnyDayHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Notify parent about modal state
  useEffect(() => {
    const isModalOpen = selectedGift !== null || blockedStatus !== null;
    window.dispatchEvent(new CustomEvent('modalStateChange', { detail: isModalOpen }));
  }, [selectedGift, blockedStatus]);
  
  const handleDayClick = (gift: Gift) => {
    const status = getDayStatus(gift.date);
    
    if (!gift.enabled) {
      return;
    }
    
    if (status === 'current') {
      setSelectedGift(gift);
    } else if (status === 'past' || status === 'future') {
      setBlockedStatus(status);
    }
  };
  
  // Auto scroll to current day on mobile and desktop
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentDayIndex = gifts.findIndex(gift => getDayStatus(gift.date) === 'current');
      if (currentDayIndex !== -1 && window.innerWidth < 768) {
        const container = scrollContainerRef.current;
        const dayWidth = 240; // approximate width of each day card (doubled)
        const gap = 16; // gap between cards
        const scrollPosition = (dayWidth + gap) * currentDayIndex - (container.offsetWidth / 2) + (dayWidth / 2);
        
        setTimeout(() => {
          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [gifts]);
  
  // Initial scroll on mount
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 768) {
      const currentDayIndex = gifts.findIndex(gift => getDayStatus(gift.date) === 'current');
      if (currentDayIndex !== -1) {
        const container = scrollContainerRef.current;
        const dayWidth = 240;
        const gap = 16;
        const scrollPosition = (dayWidth + gap) * currentDayIndex - (container.offsetWidth / 2) + (dayWidth / 2);
        
        setTimeout(() => {
          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }, 300);
      }
    }
  }, []);
  
  return (
    <div
      onMouseEnter={() => setIsAnyDayHovered(true)}
      onMouseLeave={() => setIsAnyDayHovered(false)}
    >
      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-7 gap-2 sm:gap-3 md:gap-4 w-full mx-auto">
        {gifts.map((gift, index) => {
          const isJanuary = index >= 31;
          return (
            <div key={gift.id} className="relative">
              <CalendarDay
                gift={gift}
                onClick={() => handleDayClick(gift)}
                isAnyDayHovered={isAnyDayHovered}
                onCurrentDayHoverChange={onCurrentDayHoverChange}
                isJanuary={isJanuary}
              />
            </div>
          );
        })}
      </div>
      
      {/* Mobile horizontal scroll with swipe */}
      <div 
        ref={scrollContainerRef}
        className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingTop: '20px',
          paddingBottom: '20px',
          marginTop: '-20px',
          marginBottom: '-20px'
        }}
      >
        {gifts.map((gift, index) => {
          const isJanuary = index >= 31;
          return (
            <div 
              key={gift.id} 
              className="flex-shrink-0 snap-center" 
              style={{ 
                width: '240px',
                scrollSnapAlign: 'center'
              }}
            >
              <CalendarDay
                gift={gift}
                onClick={() => handleDayClick(gift)}
                isAnyDayHovered={false}
                onCurrentDayHoverChange={onCurrentDayHoverChange}
                isJanuary={isJanuary}
              />
            </div>
          );
        })}
      </div>
      
      {/* Gift Modal */}
      {selectedGift && (
        <GiftModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
      
      {/* Blocked Modal */}
      {blockedStatus && (
        <BlockedModal
          status={blockedStatus}
          onClose={() => setBlockedStatus(null)}
        />
      )}
    </div>
  );
}