
'use client'

import * as React from 'react';
import { useEffect, useState } from 'react';

const CONFETTI_COUNT = 150;

const colors = [
  '#FFC700', // Yellow
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  'hsl(var(--primary))',
  'hsl(var(--accent))',
];

export function PartyConfetti() {
  const [pieces, setPieces] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
      const duration = 2.5 + Math.random() * 2.5; // 2.5s to 5s
      const delay = Math.random() * 5; // Start at different times over 5s
      const initialX = Math.random() * 100;
      const rotation = Math.random() * 360;
      const finalX = initialX + (Math.random() - 0.5) * 200;

      const style: React.CSSProperties = {
        left: `${initialX}vw`,
        top: '-15px',
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `rotate(${rotation}deg)`,
        animationName: `fall-${i}`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: 'linear',
        animationFillMode: 'forwards',
      };
      
      // Use React.Fragment with a key to group the style and div
      return (
        <React.Fragment key={i}>
            <style>{`
                @keyframes fall-${i} {
                    from {
                        transform: translate(0, 0) rotate(${rotation}deg);
                    }
                    to {
                        transform: translate(${finalX - initialX}px, 110vh) rotate(${rotation + 360}deg);
                    }
                }
            `}</style>
            <div className="confetti-piece" style={style}></div>
        </React.Fragment>
      );
    });
    setPieces(newPieces);
  }, []);


  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {pieces}
      <style jsx>{`
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 12px;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
