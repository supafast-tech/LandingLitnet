import React from 'react';

interface StatsButtonProps {
  href: string;
  text: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
  hoverTextColor?: string;
  backgroundColor?: string;
}

export function StatsButton({ href, text, fullWidth = false, variant = 'secondary', hoverTextColor = '#336bb7', backgroundColor }: StatsButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Default background: if not specified, use the original behavior
  const defaultBg = backgroundColor === undefined ? (isHovered ? 'white' : 'rgba(255, 255, 255, 0.15)') : backgroundColor;
  const activeBg = backgroundColor === 'transparent' ? 'transparent' : (isHovered ? 'white' : backgroundColor || 'rgba(255, 255, 255, 0.15)');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-block mt-4`}
      style={{
        background: isHovered ? 'white' : (backgroundColor || 'rgba(255, 255, 255, 0.15)'),
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        padding: '20px 40px',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        width: 'fit-content',
        maxWidth: '400px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span 
        style={{ 
          fontFamily: 'Montserrat, sans-serif', 
          fontSize: '14pt', 
          fontWeight: 600,
          lineHeight: '1',
          color: isHovered ? hoverTextColor : 'white',
          transition: 'color 0.3s ease',
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </span>
    </a>
  );
}