import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-gradient-to-r from-[#001F3F] via-[#003366] to-[#001F3F] w-full fixed top-0 z-50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-b-[3px] border-kku-gold no-print">
      <div className="container mx-auto px-2 md:px-4 py-2 flex items-center justify-between relative min-h-[80px] md:min-h-[128px]">
        
        {/* FIXED: Left Section - Menu & Logo combined for mobile stability */}
        <div className="flex items-center gap-2 md:gap-4 z-20">
          <button 
            onClick={onMenuToggle}
            className="text-white p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90 border-2 border-white/20 shrink-0"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <div className="group cursor-pointer">
            {/* FIXED: Scaled down logo for mobile to prevent crowding */}
            <Logo className="w-[44px] h-[44px] md:w-[104px] md:h-[104px] transition-transform duration-500 group-hover:scale-105" />
          </div>
        </div>
        
        {/* FIXED: Main Title Block - Fluid text sizing and spacing */}
        <div className="flex flex-col items-center justify-center text-center font-serif flex-1 z-10 px-2 md:px-0 overflow-hidden">
          <h1 className="text-kku-gold text-[18px] sm:text-[28px] md:text-[42px] font-black tracking-[0.05em] leading-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] truncate w-full">
            K.K. University
          </h1>
          <div className="w-1/4 h-[1px] bg-kku-gold/30 my-0.5 md:my-1.5"></div>
          <h2 className="text-white text-[10px] sm:text-[14px] md:text-[18px] lg:text-[20px] font-bold tracking-wider leading-tight drop-shadow-md uppercase truncate w-full">
            School of Education Training & Research
          </h2>
          <div className="hidden md:flex mt-0.5 items-center justify-center gap-1.5">
            <span className="h-[1px] w-6 bg-kku-gold/40"></span>
            <span className="text-kku-gold font-black text-[15px] md:text-[18px] tracking-[0.2em]">(SOETR)</span>
            <span className="h-[1px] w-6 bg-kku-gold/40"></span>
          </div>
          
          <div className="mt-1 md:mt-2.5 bg-gradient-to-b from-yellow-300 to-kku-gold text-kku-blue px-3 sm:px-8 py-0.5 md:py-1 rounded-full shadow-2xl border border-white/20 transform hover:scale-105 transition-all max-w-[95%]">
             <h3 className="text-[8px] sm:text-[12px] md:text-[14px] font-black uppercase tracking-[0.1em] md:tracking-[0.12em] truncate">
               Student Help Desk Portal
             </h3>
          </div>
        </div>

        {/* Right spacer for perfect centering on desktop */}
        <div className="hidden md:block w-[148px]"></div>
      </div>
    </header>
  );
};