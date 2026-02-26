
import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-gradient-to-r from-[#001F3F] via-[#003366] to-[#001F3F] w-full fixed top-0 z-50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-b-[3px] border-kku-gold no-print">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between relative min-h-[80px] md:min-h-[128px]">
        {/* Menu Toggle for Sidebar (Desktop & Mobile) */}
        <div className="z-50">
          <button 
            onClick={onMenuToggle}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90 border-2 border-white/20"
            aria-label="Toggle Menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Logo - Perfectly aligned Left */}
        <div className="flex items-center group cursor-pointer z-20">
          <div className="absolute left-16 md:left-20 flex items-center gap-4">
            <Logo className="w-[60px] h-[60px] md:w-[104px] md:h-[104px] transition-transform duration-500 group-hover:scale-105" />
          </div>
        </div>
        
        {/* Main Title Block - Centered and Weighted */}
        <div className="flex flex-col items-center justify-center text-center font-serif flex-1 z-10 px-12 md:px-0">
          <h1 className="text-kku-gold text-[4.5vw] sm:text-[28px] md:text-[42px] font-black tracking-[0.05em] leading-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            K.K. University
          </h1>
          <div className="w-1/4 h-[1px] bg-kku-gold/30 my-1 md:my-1.5"></div>
          <h2 className="text-white text-[2.2vw] sm:text-[14px] md:text-[18px] lg:text-[20px] font-bold tracking-wider leading-tight drop-shadow-md uppercase">
            School of Education Training & Research
          </h2>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-[1px] w-6 bg-kku-gold/40"></span>
            <span className="text-kku-gold font-black text-[2.5vw] sm:text-[15px] md:text-[18px] tracking-[0.2em]">(SOETR)</span>
            <span className="h-[1px] w-6 bg-kku-gold/40"></span>
          </div>
          
          {/* Dashboard Badge */}
          <div className="mt-1.5 md:mt-2.5 bg-gradient-to-b from-yellow-300 to-kku-gold text-kku-blue px-4 sm:px-8 py-0.5 md:py-1 rounded-full shadow-2xl border border-white/20 transform hover:scale-105 transition-all">
             <h3 className="text-[9px] sm:text-[12px] md:text-[14px] font-black uppercase tracking-[0.12em] whitespace-nowrap">
               Student Help Desk Portal
             </h3>
          </div>
        </div>

        {/* Hidden spacer to maintain perfect center for title */}
        <div className="hidden md:block w-[104px]"></div>
      </div>
    </header>
  );
};
