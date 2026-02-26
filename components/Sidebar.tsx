
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SIDEBAR_LINKS } from '../constants';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isFormOpen } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] md:hidden backdrop-blur-md transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 md:top-[128px] bottom-0 w-[320px] bg-[#000F1F] overflow-y-auto shadow-[15px_0_60px_rgba(0,0,0,0.8)] z-[110] no-print transition-all duration-700 transform ease-in-out border-r-2 border-kku-gold/20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-kku-gold via-yellow-300 to-kku-gold opacity-80"></div>

        <div className="md:hidden flex items-center justify-between p-8 border-b border-white/10 bg-black/40">
          <span className="text-kku-gold font-black tracking-[0.3em] uppercase text-[10px]">SOETR Navigation</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 transition-all active:scale-90">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col py-10 px-6 space-y-3 mb-24">
          {SIDEBAR_LINKS.map((link) => {
            const isExternal = link.path.startsWith('http');
            const isActive = !isExternal && location.pathname === link.path;
            
            const formMap: Record<string, string> = {
              '/form/data-entry': 'data-entry',
              '/form/exam': 'exam',
              '/form/leave': 'leave',
              '/form/internship': 'internship',
              '/form/grievance': 'grievance',
              'https://kk-university-feedback-portal.ramayanyug.workers.dev': 'feedback'
            };
            
            const formId = formMap[link.path];
            const isFormLocked = formId ? !isFormOpen(formId) : false;

            const baseClasses = "group relative flex items-center px-6 py-5 rounded-[2.5rem] transition-all duration-500 ease-out border overflow-hidden shadow-sm";
            
            let stateClasses = "";
            if (isFormLocked) {
              stateClasses = "bg-black/40 border-white/5 text-gray-600 cursor-not-allowed grayscale-[0.8] opacity-50 select-none scale-[0.98]";
            } else if (isActive) {
              stateClasses = "bg-white/10 border-kku-gold/60 text-kku-gold shadow-[0_15px_40px_rgba(212,175,55,0.25)] translate-x-2 border-l-8";
            } else {
              stateClasses = "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:border-white/20 hover:text-white hover:translate-x-1.5 hover:shadow-2xl";
            }

            const content = (
              <>
                <div className={`w-3 h-3 rounded-full mr-6 transition-all duration-500 shadow-md 
                  ${isFormLocked ? 'bg-red-950 border border-red-900/50' : isActive ? 'bg-kku-gold scale-125 ring-4 ring-kku-gold/20' : 'bg-white/10 group-hover:bg-kku-gold group-hover:scale-110'}`}>
                </div>

                <span className={`flex-1 font-black text-[13px] uppercase tracking-[0.18em] leading-none ${isActive ? 'text-kku-gold' : 'text-inherit'}`}>
                  {link.label}
                </span>

                {isFormLocked ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] font-black uppercase text-red-900 tracking-tighter opacity-80">Environment Locked</span>
                    <svg className="w-4 h-4 text-red-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                ) : isExternal ? (
                  <svg className="w-4 h-4 ml-3 text-gray-600 group-hover:text-kku-gold transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                ) : isActive && (
                  <svg className="w-5 h-5 ml-3 text-kku-gold shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </>
            );

            if (isFormLocked) {
              return (
                <div key={link.path} className={`${baseClasses} ${stateClasses}`} title="Institutional Governance Alert: This environment is currently restricted.">
                  {content}
                </div>
              );
            }

            if (isExternal) {
              return (
                <a key={link.path} href={link.path} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${stateClasses}`}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={link.path} to={link.path} className={`${baseClasses} ${stateClasses}`} onClick={onClose}>
                {content}
              </Link>
            );
          })}
        </nav>

        {/* Admin Access Footer */}
        <div className="sticky bottom-0 left-0 right-0 p-8 bg-[#000F1F]/95 backdrop-blur-xl border-t-2 border-white/5 z-20">
          <Link 
            to="/admin-login" 
            onClick={onClose}
            className="flex items-center justify-center gap-4 w-full py-5 bg-gradient-to-r from-white/5 to-white/10 border-2 border-white/10 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 hover:bg-white hover:text-[#000F1F] hover:border-white transition-all duration-500 group shadow-3xl"
          >
            <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-[#000F1F]/20 transition-colors">
              <svg className="w-4 h-4 transition-transform duration-700 group-hover:rotate-[360deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            Internal Admin Control
          </Link>
        </div>
      </aside>
    </>
  );
};
