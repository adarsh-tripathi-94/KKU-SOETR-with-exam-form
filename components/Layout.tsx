
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isFormOpen } = useAuth();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const isAdmin = user?.role === Role.ADMIN;

  const isFeedbackOpen = isFormOpen('feedback');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Header onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />
      

      <div className="flex flex-1 relative pt-[80px] md:pt-[128px]">
        <Sidebar isOpen={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
        
        <div className={`flex-1 flex flex-col transition-all duration-500 min-h-full ${isSidebarVisible ? 'md:ml-[320px]' : 'ml-0'}`}>
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      
      {/* Floating Feedback Button */}
      {isFeedbackOpen && (
        <a 
          href="https://kk-university-feedback-portal.ramayanyug.workers.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#001F3F] text-white font-black py-5 px-2 shadow-[-4px_0_20px_rgba(0,0,0,0.3)] rounded-l-xl hover:bg-[#0A2D5C] hover:px-3 transition-all duration-300 z-50 flex items-center justify-center no-print border-l-4 border-y-2 border-kku-gold group hidden sm:flex"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          title="Official Feedback"
        >
          <span className="tracking-[0.25em] uppercase text-[15px] group-hover:-translate-y-1 transition-transform">
            Feedback
          </span>
        </a>
      )}
    </div>
  );
};
