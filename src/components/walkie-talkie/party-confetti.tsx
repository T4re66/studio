
'use client'

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
      const style: React.CSSProperties = {
        left: `${45 + Math.random() * 10}%`,
        top: `${45 + Math.random() * 10}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `rotate(${Math.random() * 360}deg)`,
        animationName: 'explode',
        animationDuration: `${0.5 + Math.random() * 1.5}s`,
        animationDelay: `${Math.random() * 0.2}s`,
      };
      return <div key={i} className="confetti-piece" style={style}></div>;
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
          opacity: 1;
          animation-timing-function: cubic-bezier(0.1, 0.5, 0.5, 1);
          animation-fill-mode: forwards;
        }

        @keyframes explode {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(${Math.random() * 100 - 50}vw), calc(${Math.random() * 100 - 50}vh)) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
