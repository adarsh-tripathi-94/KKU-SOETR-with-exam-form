
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <svg 
      width="120" 
      height="120"
      viewBox="0 0 100 100" 
      className={className || "w-[120px] h-[120px]"} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .logo-motif { 
          transform-box: fill-box; 
          transform-origin: center; 
          transition: transform 0.3s ease; 
        }
        svg:hover .logo-motif { 
          animation: logo-pulse 2s infinite ease-in-out; 
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
      
      {/* Outer borders for maximum clarity */}
      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#001F3F" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44.5" fill="none" stroke="#B8860B" strokeWidth="1.2" />
      
      {/* Inner dark core */}
      <circle cx="50" cy="50" r="29" fill="#001F3F" stroke="#B8860B" strokeWidth="1" />

      {/* Circular Text Paths */}
      <defs>
        {/* Top path for K.K. UNIVERSITY (Clockwise) */}
        <path id="curve-top" d="M 15,50 A 35,35 0 0,1 85,50" />
        {/* Bottom path for SOETR (Counter-Clockwise to keep text upright) */}
        <path id="curve-bottom" d="M 15,50 A 35,35 0 0,0 85,50" />
      </defs>
      
      {/* Text Ring - Top */}
      <text fill="#001F3F" fontFamily="'Times New Roman', Times, serif" fontSize="8.5" fontWeight="900" letterSpacing="0.8">
        <textPath href="#curve-top" startOffset="50%" textAnchor="middle">K.K. UNIVERSITY</textPath>
      </text>

      {/* Text Ring - Bottom (SOETR) aligned as content below */}
      <text fill="#001F3F" fontFamily="'Times New Roman', Times, serif" fontSize="9" fontWeight="900" letterSpacing="2">
        <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle" side="right" dy="-3">SOETR</textPath>
      </text>

      {/* Center Motif - Book & Torch (Higher contrast) */}
      <g className="logo-motif" transform="translate(0, 2)">
        {/* Open Book */}
        <path d="M 38 56 Q 50 60 62 56 L 62 50 Q 50 54 38 50 Z" fill="#ffffff" stroke="#B8860B" strokeWidth="0.5" />
        <path d="M 50 51 L 50 59" stroke="#001F3F" strokeWidth="0.8" />
        
        {/* Torch element */}
        <path d="M 48 50 L 52 50 L 50 38 Z" fill="#B8860B" />
        <path d="M 50 28 Q 44 35 50 40 Q 56 35 50 28 Z" fill="#B8860B" stroke="#ffffff" strokeWidth="0.5" />
        <path d="M 50 32 Q 48 36 50 39 Q 52 36 50 32 Z" fill="#ffffff" />
      </g>
    </svg>
  );
};