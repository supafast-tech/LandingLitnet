import { motion } from 'motion/react';

export function AnimatedBlobs() {
  // Конфигурация блобов с разными размерами и позициями
  const blobs = [
    { x: '10%', y: '15%', size: 300 },
    { x: '80%', y: '25%', size: 250 },
    { x: '60%', y: '60%', size: 280 },
    { x: '20%', y: '70%', size: 320 },
    { x: '85%', y: '75%', size: 260 },
    { x: '45%', y: '35%', size: 290 },
    { x: '70%', y: '90%', size: 270 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            background: '#E5664F',
            filter: 'blur(120px)',
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}