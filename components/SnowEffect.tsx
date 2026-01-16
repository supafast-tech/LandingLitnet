import { useEffect, useState, useRef, useMemo } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

interface SnowEffectProps {
  intensity?: 'normal' | 'crazy';
  isModalOpen?: boolean;
}

export function SnowEffect({ intensity = 'normal', isModalOpen = false }: SnowEffectProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const nextIdRef = useRef(0);
  const lastTimestampRef = useRef(Date.now());
  const [isPageVisible, setIsPageVisible] = useState(true);
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  const isCrazy = useMemo(() => intensity === 'crazy', [intensity]);
  
  // Don't render snow if modal is open on mobile
  if (isModalOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }
  
  // Track page visibility
  useEffect(() => {
    let clearTimeoutId: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      
      if (isVisible) {
        // Обновляем timestamp когда страница становится видимой
        // чтобы не генерировать кучу снежинок сразу
        lastTimestampRef.current = Date.now();
        
        // Отменяем таймер очистки если страница снова стала видимой
        if (clearTimeoutId) {
          clearTimeout(clearTimeoutId);
        }
      } else {
        // Если страница скрыта больше 30 секунд, очищаем все снежинки
        // чтобы не было резкого появления большого количества снежинок
        clearTimeoutId = setTimeout(() => {
          setSnowflakes([]);
        }, 30000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (clearTimeoutId) {
        clearTimeout(clearTimeoutId);
      }
    };
  }, []);

  // Update mobile detection on resize
  useEffect(() => {
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create new snowflakes
  useEffect(() => {
    const interval = setInterval(() => {
      // Не создаем снежинки если страница не видна
      if (!isPageVisible) {
        return;
      }
      
      const now = Date.now();
      const timeSinceLastUpdate = now - lastTimestampRef.current;
      const isMobile = isMobileRef.current;
      
      setSnowflakes(prev => {
        // Limit total snowflakes - в мобилке в 5 раз меньше
        const maxFlakes = isMobile 
          ? (isCrazy ? 160 : 80)  // Мобилка: 160/80
          : (isCrazy ? 800 : 400); // Десктоп: 800/400
        
        // Проверяем на дубли - удаляем дубликаты если есть
        const uniqueFlakes = prev.filter((flake, index, self) => 
          index === self.findIndex(f => f.id === flake.id)
        );
        
        if (uniqueFlakes.length > maxFlakes) {
          return uniqueFlakes.slice(0, maxFlakes);
        }
        
        // Если прошло больше 5 секунд с последнего обновления,
        // создаем только 1-2 снежинки вместо множества
        const isCatchingUp = timeSinceLastUpdate > 5000;
        if (isCatchingUp && Math.random() > 0.3) {
          return uniqueFlakes;
        }
        
        const newFlake: Snowflake = {
          id: nextIdRef.current++,
          x: Math.random() * 100,
          y: -5,
          size: Math.random() * (isCrazy ? 6 : 3) + (isCrazy ? 2 : 1.5), // crazy: 2-8px, normal: 1.5-4.5px
          speed: Math.random() * (isCrazy ? 0.5 : 0.2) + (isCrazy ? 0.2 : 0.1), // crazy: 0.2-0.7, normal: 0.1-0.3
          opacity: Math.random() * 0.4 + 0.6, // 0.6-1
          drift: (Math.random() - 0.5) * (isCrazy ? 0.3 : 0.15) // больше дрейфа в crazy режиме
        };
        
        // Проверяем, нет ли уже снежинки с таким же ID (защита от дублей)
        const hasDuplicate = uniqueFlakes.some(f => f.id === newFlake.id);
        if (hasDuplicate) {
          return uniqueFlakes;
        }
        
        return [...uniqueFlakes, newFlake];
      });
      
      lastTimestampRef.current = now;
    }, isMobileRef.current 
      ? (isCrazy ? 100 : 200)  // Мобилка: медленнее создаем
      : (isCrazy ? 40 : 80));  // Десктоп: быстрее создаем

    return () => clearInterval(interval);
  }, [isCrazy, isPageVisible]);

  // Animate snowflakes with better performance
  useEffect(() => {
    let animationFrame: number;
    let lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      // Останавливаем анимацию если страница не видна
      if (!isPageVisible) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = currentTime - lastFrameTime;
      
      // Limit to ~60fps
      if (deltaTime < 16) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTime = currentTime;
      
      setSnowflakes(prev => {
        return prev
          .map(flake => {
            const newY = flake.y + flake.speed;
            const newX = flake.x + flake.drift;
            
            return {
              ...flake,
              y: newY,
              x: newX
            };
          })
          .filter(flake => {
            // Удаляем снежинки которые достигли низа экрана
            return flake.y < 105;
          });
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isPageVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          style={{
            position: 'absolute',
            left: `${flake.x}%`,
            top: `${flake.y}vh`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: flake.opacity,
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
            willChange: 'transform',
            transform: 'translateZ(0)', // GPU acceleration
            contain: 'layout style paint' // Performance optimization
          }}
        />
      ))}
    </div>
  );
}