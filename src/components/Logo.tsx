import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
}) => {
  // Dimensions based on size
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const titleStyles = {
    sm: 'text-sm tracking-widest',
    md: 'text-base md:text-lg tracking-[0.2em]',
    lg: 'text-xl md:text-2xl tracking-[0.25em]',
    xl: 'text-2xl md:text-4xl tracking-[0.3em]',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Luxury SG Crown & Monogram Emblem */}
      <div className={`relative ${iconDimensions} shrink-0 drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)]`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Metallic Gold Gradient */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="30%" stopColor="#F5E6B5" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#AA7C11" />
              <stop offset="100%" stopColor="#8A6409" />
            </linearGradient>

            {/* Silver Ribbon Accent Gradient */}
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E0E0E0" />
              <stop offset="100%" stopColor="#9E9E9E" />
            </linearGradient>

            {/* Diamond Shimmer Glow */}
            <radialGradient id="diamondShine" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#C9E6FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>

            {/* Outer Ring Glow */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Royal Circular Ring */}
          <circle
            cx="100"
            cy="108"
            r="82"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeOpacity="0.9"
            fill="#090909"
            fillOpacity="0.8"
          />
          <circle
            cx="100"
            cy="108"
            r="86"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="4 3"
          />

          {/* Crown on Top */}
          <g filter="url(#goldGlow)" transform="translate(0, -6)">
            {/* Crown Base Band */}
            <path
              d="M74 38 C88 41 112 41 126 38 L123 44 C112 46 88 46 77 44 Z"
              fill="url(#goldGradient)"
            />
            {/* Crown Peaks */}
            <path
              d="M74 38 L70 20 L87 31 L100 10 L113 31 L130 20 L126 38 Z"
              fill="url(#goldGradient)"
            />
            {/* Jewels on crown tips */}
            <circle cx="70" cy="19" r="2.5" fill="#FFFFFF" />
            <circle cx="100" cy="9" r="3.5" fill="#FFFFFF" />
            <circle cx="130" cy="19" r="2.5" fill="#FFFFFF" />
            <circle cx="87" cy="30" r="1.8" fill="#FFF4D0" />
            <circle cx="113" cy="30" r="1.8" fill="#FFF4D0" />
          </g>

          {/* Interlocking Monogram: Letter S */}
          <path
            d="M78 68 C88 64 105 66 112 76 C117 84 113 93 103 98 C91 104 70 108 66 122 C61 138 74 154 94 156 C108 157 122 150 128 142 L124 135 C118 141 108 146 95 146 C81 146 72 136 75 125 C78 114 96 110 108 103 C123 95 127 82 121 70 C112 55 88 54 75 60 Z"
            fill="url(#goldGradient)"
          />

          {/* Interlocking Monogram: Letter G */}
          <path
            d="M136 92 C132 80 120 72 108 72 C90 72 74 88 74 110 C74 132 90 148 112 148 C128 148 140 138 144 125 L116 125 L116 117 L152 117 L152 130 C146 148 130 157 110 157 C83 157 63 136 63 110 C63 83 83 63 110 63 C126 63 140 73 146 88 Z"
            fill="url(#goldGradient)"
            fillOpacity="0.95"
          />

          {/* Ornate Silver Filigree Accent Ribbon */}
          <path
            d="M60 128 C74 105 98 102 126 94 C138 90 148 83 154 74 C150 78 140 85 128 88 C98 96 76 102 60 128 Z"
            fill="url(#silverGradient)"
          />

          {/* Brilliant Cut Diamond Jewel */}
          <g transform="translate(114, 76)">
            {/* Diamond Sparkle Outer */}
            <polygon
              points="14,0 28,10 14,24 0,10"
              fill="url(#diamondShine)"
            />
            {/* Diamond Facets */}
            <polygon
              points="14,2 24,10 14,21 4,10"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
            <line x1="4" y1="10" x2="24" y2="10" stroke="#75A4D3" strokeWidth="0.8" />
            <line x1="14" y1="2" x2="14" y2="21" stroke="#75A4D3" strokeWidth="0.8" />
            <circle cx="14" cy="10" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Subtle Bottom Accent Jewel */}
          <polygon
            points="100,166 104,171 100,176 96,171"
            fill="url(#goldGradient)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-cinzel font-bold text-[#F5E6B5] drop-shadow-sm ${titleStyles}`}
            >
              SRIKANTH GHORAI
            </span>
          </div>

          {showTagline ? (
            <span className="text-[10px] md:text-xs text-[#D4AF37] font-serif-luxury tracking-wider italic mt-0.5">
              Where Every Gram Tells a Story.
            </span>
          ) : (
            <span className="text-[9px] md:text-[10px] text-[#B8B8B8] tracking-widest uppercase">
              Master Atelier &amp; Karigar Guild
            </span>
          )}
        </div>
      )}
    </div>
  );
};
