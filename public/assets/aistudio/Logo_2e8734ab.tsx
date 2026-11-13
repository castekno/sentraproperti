import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base leading-tight',
    md: 'text-xl md:text-2xl leading-none',
    lg: 'text-2xl md:text-3xl leading-none',
    xl: 'text-3xl md:text-4xl leading-none',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] md:text-xs tracking-widest',
    lg: 'text-xs md:text-sm tracking-widest',
    xl: 'text-sm md:text-base tracking-[0.2em]',
  };

  return (
    <div id="sentra-logo" className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* House Emblem Graphic */}
      <div className={`relative flex-shrink-0 flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 160 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(202,138,4,0.3)]"
        >
          <defs>
            {/* Rich Gold Gradient */}
            <linearGradient id="goldRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#AA7C11" />
              <stop offset="100%" stopColor="#E5C158" />
            </linearGradient>
            
            {/* Gold Swoosh Gradient */}
            <linearGradient id="goldSwoopGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#B38728" />
              <stop offset="50%" stopColor="#FBF5B7" />
              <stop offset="100%" stopColor="#AA771C" />
            </linearGradient>
          </defs>

          {/* Chimney */}
          <path
            d="M 56 36 L 56 22 L 67 22 L 67 44 Z"
            fill="url(#goldRoofGrad)"
          />

          {/* Main Gabled Roof Outline */}
          <path
            d="M 18 68 L 74 16 L 130 68 L 123 75 L 74 29 L 25 75 Z"
            fill="url(#goldRoofGrad)"
          />

          {/* Window in Gabled Roof (4 Panes) */}
          <g fill="url(#goldRoofGrad)">
            <rect x="64" y="44" width="9" height="9" rx="1" />
            <rect x="75" y="44" width="9" height="9" rx="1" />
            <rect x="64" y="55" width="9" height="9" rx="1" />
            <rect x="75" y="55" width="9" height="9" rx="1" />
          </g>

          {/* Secondary Roof Layer (Right Wing) */}
          <path
            d="M 100 42 L 128 17 L 156 42 L 148 49 L 128 30 L 108 49 Z"
            fill="url(#goldRoofGrad)"
          />
          {/* Right wing posts */}
          <rect x="135" y="52" width="6" height="24" rx="1" fill="url(#goldRoofGrad)" />

          {/* Dynamic Gold Swoop / Base Arc */}
          <path
            d="M 6 86 C 45 68 115 68 158 84 C 120 98 48 99 6 86 Z"
            fill="url(#goldSwoopGrad)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`font-black flex items-baseline tracking-tight ${titleSizes[size]}`}>
          <span className="text-[#0B1E36] font-extrabold tracking-wider">SENTRA</span>
          <span className="ml-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-black tracking-wider">
            PROPERTI
          </span>
        </div>
        {showSubtitle && (
          <div className={`text-[#0B1E36] font-semibold text-center whitespace-nowrap mt-0.5 ${subSizes[size]}`}>
            — SOLUSI PROPERTI TERPERCAYA —
          </div>
        )}
      </div>
    </div>
  );
};
