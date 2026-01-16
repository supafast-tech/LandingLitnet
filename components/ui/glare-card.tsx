import { cn } from "../../lib/utils";
import { useRef, memo } from "react";

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlareCard = memo((({
  children,
  className,
  style,
}: GlareCardProps) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    rotate: {
      x: 0,
      y: 0,
    },
  });
  
  const containerStyle = {
    "--r-x": "0deg",
    "--r-y": "0deg",
    "--duration": "100ms", // Более быстрая реакция для плавности
    "--radius": "24px",
    "--easing": "ease-out",
  } as any;

  const updateStyles = () => {
    if (refElement.current) {
      const { rotate } = state.current;
      refElement.current?.style.setProperty("--r-x", `${rotate.x}deg`);
      refElement.current?.style.setProperty("--r-y", `${rotate.y}deg`);
    }
  };
  
  const rotateFactor = 1.2; // Больший наклон
  
  return (
    <div
      style={containerStyle}
      className="relative isolate [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] w-full h-full"
      ref={refElement}
      onPointerMove={(event) => {
        if (!isPointerInside.current) return;
        
        const rect = event.currentTarget.getBoundingClientRect();
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        const percentage = {
          x: (100 / rect.width) * position.x,
          y: (100 / rect.height) * position.y,
        };
        const delta = {
          x: percentage.x - 50,
          y: percentage.y - 50,
        };

        const { rotate } = state.current;
        rotate.x = -(delta.x / 3.5) * rotateFactor;
        rotate.y = (delta.y / 2) * rotateFactor;

        updateStyles();
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        if (refElement.current) {
          // Мгновенно включаем плавную анимацию
          refElement.current?.style.setProperty("--duration", "100ms");
        }
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        if (refElement.current) {
          refElement.current?.style.setProperty("--duration", "300ms");
          refElement.current?.style.setProperty("--r-x", `0deg`);
          refElement.current?.style.setProperty("--r-y", `0deg`);
        }
      }}
    >
      <div 
        className={cn(
          "h-full w-full will-change-transform origin-center transition-transform duration-[var(--duration)] ease-[var(--easing)] rounded-[var(--radius)]",
          className
        )}
        style={{
          ...style,
          transform: 'rotateY(var(--r-x)) rotateX(var(--r-y))'
        }}
      >
        {children}
      </div>
    </div>
  );
}) as any);

GlareCard.displayName = 'GlareCard';
