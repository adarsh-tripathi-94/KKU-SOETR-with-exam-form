
import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-kku-blue text-white mt-auto border-t-4 border-kku-gold no-print relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
        </defs>
      </div>

      <div className="container mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
              <Logo className="w-10 h-10" />
              <div>
                <h4 className="text-kku-gold font-serif font-black text-sm leading-tight uppercase tracking-tight">K.K. University</h4>
                <p className="text-[8px] font-bold text-gray-300 tracking-widest uppercase">School of Education (SOETR)</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-snug italic">
              Empowering next-gen educators through innovation and research in the heart of Nalanda.
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-kku-gold font-black uppercase text-[10px] tracking-[0.2em] mb-3 border-b border-kku-gold/30 pb-1 inline-block">Contact</h4>
            <ul className="space-y-2 text-[9px] font-bold">
              <li className="flex items-start gap-2 group">
                <svg className="w-3 h-3 text-kku-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-gray-300 group-hover:text-white transition-colors uppercase">Berauti, Nepura, Bihar – 803115</span>
              </li>
              <li className="flex items-center gap-2 group">
                <svg className="w-3 h-3 text-kku-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span className="text-gray-300 group-hover:text-white transition-colors">soe.bkt1980@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-kku-gold font-black uppercase text-[10px] tracking-[0.2em] mb-3 border-b border-kku-gold/30 pb-1 inline-block">Portals</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "Main Site", url: "https://kkuniversity.ac.in/" },
                { name: "Admission", url: "https://kkuniversity.ac.in/admission" }
              ].map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-kku-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-kku-gold/40 rounded-full"></span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Regulatory Column */}
          <div>
            <h4 className="text-kku-gold font-black uppercase text-[10px] tracking-[0.2em] mb-3 border-b border-kku-gold/30 pb-1 inline-block">Regulatory</h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-center">
                 <p className="text-[9px] font-black uppercase text-white">NCTE</p>
              </div>
              <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-center">
                 <p className="text-[9px] font-black uppercase text-white">UGC</p>
              </div>
              <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-center">
                 <p className="text-[9px] font-black uppercase text-white">NCERT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-3 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-500">
            © {new Date().getFullYear()} K.K. University SOETR v10.0
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-black uppercase tracking-widest text-kku-gold bg-white/5 px-3 py-1 rounded-full border border-kku-gold/20">
              Secured Environment
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
