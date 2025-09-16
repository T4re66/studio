
'use client'

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

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

  const confetti = useMemo(() => Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
      animationName: 'drop'
    };
    return <div key={i} className="confetti-piece" style={style}></div>;
  }), []);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {confetti}
      <style jsx>{`
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 16px;
          top: -20px;
          opacity: 0;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes drop {
          0% {
            transform: translateY(0vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
