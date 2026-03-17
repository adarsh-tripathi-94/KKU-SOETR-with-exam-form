import React from 'react';
import kkuLogo from './logo.jpg';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`logo-wrapper relative flex items-center justify-center rounded-full bg-white border-[2.5px] border-[#001F3F] shadow-sm ${className || "w-[120px] h-[120px]"}`}>
      <style>{`
        .logo-motif { 
          transition: transform 0.3s ease; 
          transform-origin: center;
        }
        /* Applies the pulse animation on hover and touch */
        .logo-wrapper:hover .logo-motif,
        .logo-wrapper:active .logo-motif { 
          animation: logo-pulse 2s infinite ease-in-out; 
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
      
      {/* Inner Gold Ring (Restores the original SVG ring design) */}
      <div className="absolute inset-1 rounded-full border-[1.2px] border-[#B8860B] pointer-events-none z-10"></div>
      
      {/* Your PNG Image with the pulse effect applied */}
      <img 
        src={kkuLogo} 
        alt="K.K. University Logo" 
        className="logo-motif w-full h-full object-cover rounded-full p-1.5" 
      />
    </div>
  );
};