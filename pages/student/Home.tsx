
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SERVICE_BUTTONS = [
  { id: 'notice-board', label: 'Notice Board', path: '/view/notice-board', category: 'Notice', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'assignments', label: 'Assignment Questions', path: '/view/assignments', category: 'Assignment', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'timetable', label: 'Academic Time-Table', path: '/view/timetable', category: 'Time-Table', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z' },
  { id: 'question-bank', label: 'Question Bank', path: '/view/question-bank', category: 'Question Bank', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { id: 'study-materials', label: 'Study Materials', path: '/view/study-materials', category: 'Study', icon: 'M12 6.03V12m0 0h4.17M12 12v4.17M12 12H7.83m10.17 0a8 8 0 11-16 0 8 8 0 0116 0z' },
  { id: 'result', label: 'Exam Results', path: '/view/result', category: 'Results', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const FORM_BUTTONS = [
  { id: 'data-entry', label: 'Data Entry Form', path: '/form/data-entry', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { id: 'exam', label: 'Examination Form', path: '/form/exam', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'internship', label: 'Internship Letter', path: '/form/internship', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z' },
  { id: 'leave', label: 'Leave Application', path: '/form/leave', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'grievance', label: 'Fill Grievance', path: '/form/grievance', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

const ACADEMIC_PLATFORMS = [
  { name: "NCERT Hub", url: "https://www.youtube.com/@ncertofficial", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color: "text-blue-600" },
  { name: "NIOS", url: "https://www.youtube.com/@NIOSLearning", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "text-orange-600" },
  { name: "SWAYAM", url: "https://www.youtube.com/@swayamprabha-mhrd", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "text-purple-600" },
  { name: "IGNOU", url: "https://www.youtube.com/@IGNOU", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "text-indigo-600" },
  { name: "UGC Hub", url: "https://www.youtube.com/@UGC_India", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", color: "text-teal-600" }
];

const CAREER_PLATFORMS = [
  { name: "Sarkari Result", url: "https://www.sarkariresult.com", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-green-700" },
  { name: "UPSC Hub", url: "https://www.upsc.gov.in", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v6m0 0l4-2.25M12 20l-4-2.25", color: "text-blue-900" },
  { name: "BPSC Portal", url: "https://www.bpsc.bih.nic.in", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "text-red-800" },
  { name: "UGC-NET", url: "https://ugcnet.nta.nic.in", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-indigo-800" },
  { name: "CTET Hub", url: "https://ctet.nic.in", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z", color: "text-sky-800" }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isFormOpen, galleryImages, governingBody, uploadedContent } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!galleryImages || galleryImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % galleryImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [galleryImages]);

  const activeGallery = galleryImages && galleryImages.length > 0 ? galleryImages : [];
  const isLeadershipVisible = isFormOpen('governing-body');

  const getArtifactCount = (category: string) => {
    return uploadedContent.filter(c => c.category === category).length;
  };

  const visibleFormButtons = FORM_BUTTONS.filter(btn => isFormOpen(btn.id));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 w-full no-print font-sans">
      <div className="relative w-full h-[315px] md:h-[480px] overflow-hidden shadow-2xl border-b-8 border-kku-gold bg-kku-blue">
        {activeGallery.length > 0 ? activeGallery.map((img, idx) => (
          <div key={img.id} className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${img.url}")` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
              <div className="absolute bottom-12 left-6 md:left-24 text-white max-w-5xl animate-fadeIn">
                <span className="bg-kku-gold text-kku-blue px-6 py-1 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block rounded-full shadow-lg">SOETR Academic Hub</span>
                <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight leading-none drop-shadow-2xl">{img.title}</h2>
                <p className="text-xs md:text-lg font-bold text-gray-300 mt-4 tracking-wide max-w-3xl leading-relaxed">{img.description}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <span className="text-2xl font-black uppercase tracking-[0.5em]">SOETR Institutional Hub</span>
          </div>
        )}
        
        {activeGallery.length > 1 && (
          <div className="absolute bottom-6 right-6 md:right-12 flex gap-2 z-30 flex-wrap justify-end max-w-[200px] md:max-w-none">
            {activeGallery.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all border border-white/50 ${i === currentSlide ? 'bg-kku-gold w-8 ring-2 ring-kku-gold/30 shadow-lg' : 'bg-white/20 w-2 hover:bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full -mt-14 relative z-20">
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <button onClick={() => navigate('/portal/search')} className="flex flex-col items-center p-8 bg-white border-2 border-kku-blue rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-kku-blue text-kku-gold flex items-center justify-center mb-4 rounded-3xl group-hover:bg-kku-gold group-hover:text-kku-blue transition-all"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
            <h3 className="text-xl font-black uppercase tracking-widest text-kku-blue text-center">Security Portal</h3>
            <p className="text-[9px] font-black uppercase text-gray-400 mt-2 tracking-[0.2em]">Official Record Lookup</p>
          </button>
          <a href="https://www.youtube.com/@K.K.UniversityS.O.E.R.T" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-8 bg-red-700 text-white rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-white text-red-700 flex items-center justify-center mb-4 rounded-3xl"><svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
            <h3 className="text-xl font-black uppercase tracking-widest text-center">YouTube Hub</h3>
            <p className="text-[9px] font-black uppercase text-red-100 mt-2 tracking-[0.2em]">Lecture Archives</p>
          </a>
          <a href="https://kkuniversity.ac.in/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-8 bg-kku-blue text-white rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-kku-gold text-kku-blue flex items-center justify-center mb-4 rounded-3xl"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>
            <h3 className="text-xl font-black uppercase tracking-widest text-kku-gold text-center">Main Website</h3>
            <p className="text-[9px] font-black uppercase text-white mt-2 tracking-[0.2em]">University Portal</p>
          </a>
        </div>

        {/* Leadership Section */}
        {isLeadershipVisible && governingBody.length > 0 && (
          <div className="mb-24 animate-fadeIn">
            <div className="flex flex-col items-center mb-12 text-center">
              <h2 className="text-4xl font-serif font-black text-kku-blue uppercase tracking-[0.4em]">Institutional Leadership</h2>
              <div className="h-1.5 w-32 bg-kku-gold mt-4 rounded-full"></div>
              <p className="text-[11px] font-black uppercase text-gray-400 mt-3 tracking-widest">Office of the Excellence</p>
            </div>
            <div className="space-y-12">
              {governingBody.map((member, idx) => (
                <div key={member.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 bg-white border-4 border-kku-blue rounded-[4rem] p-12 shadow-[0_40px_100px_rgba(0,31,63,0.1)] hover:-translate-y-2 transition-all group`}>
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] border-8 border-gray-50 overflow-hidden shadow-2xl ring-8 ring-kku-gold/10 shrink-0">
                    <img src="./ChancellorSir.png" alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className={`flex-1 flex flex-col items-center ${idx % 2 === 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} text-center`}>
                    <span className="bg-kku-blue text-white px-6 py-1.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mb-4">Master Authority</span>
                    <h3 className="text-4xl font-black uppercase tracking-tight text-kku-blue mb-1">{member.name}</h3>
                    <p className="text-lg font-black uppercase text-kku-gold tracking-[0.2em] mb-8">{member.title}</p>
                    <p className="text-lg font-serif font-bold text-gray-700 leading-relaxed italic border-l-4 border-kku-gold/40 pl-6">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic Infrastructure Master Group */}
        <div className="mb-24 space-y-16">
          <div>
            <h2 className="text-3xl font-serif font-black text-kku-blue uppercase tracking-[0.3em] border-l-8 border-kku-gold pl-8 mb-12">Academic Infrastructure</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {SERVICE_BUTTONS.map(btn => {
                const count = getArtifactCount(btn.category);
                const isOpen = isFormOpen(btn.id);
                if (!isOpen) return null;
                return (
                  <button key={btn.id} onClick={() => navigate(btn.path)} className="flex flex-col items-center justify-center p-10 bg-white border border-black rounded-[2.5rem] shadow-xl hover:bg-kku-blue hover:text-white transition-all transform hover:-translate-y-1 group relative overflow-hidden">
                    {count > 0 && <div className="absolute top-4 right-4 bg-kku-gold text-kku-blue text-[9px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">{count} New</div>}
                    <div className="w-12 h-12 mb-6 text-kku-gold group-hover:text-white transition-colors"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon}></path></svg></div>
                    <span className="text-[11px] font-black uppercase text-center tracking-widest leading-tight">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Hub Row - Horizontal Grid style */}
          <div>
            <h4 className="text-xl font-serif font-black text-red-700 uppercase tracking-[0.3em] border-l-4 border-red-700 pl-6 mb-8">Educational Hub</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {ACADEMIC_PLATFORMS.map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-10 bg-white border border-black rounded-[2.5rem] shadow-xl hover:bg-red-700 hover:text-white transition-all transform hover:-translate-y-1 group">
                  <div className={`w-12 h-12 mb-6 ${p.color} group-hover:text-white transition-colors`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={p.icon}></path></svg>
                  </div>
                  <span className="text-[11px] font-black uppercase text-center tracking-widest leading-tight">{p.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Career Portals Row - Horizontal Grid style */}
          <div>
            <h4 className="text-xl font-serif font-black text-blue-900 uppercase tracking-[0.3em] border-l-4 border-blue-900 pl-6 mb-8">Career Search Portals</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {CAREER_PLATFORMS.map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-10 bg-white border border-black rounded-[2.5rem] shadow-xl hover:bg-blue-900 hover:text-white transition-all transform hover:-translate-y-1 group">
                  <div className={`w-12 h-12 mb-6 ${p.color} group-hover:text-white transition-colors`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={p.icon}></path></svg>
                  </div>
                  <span className="text-[11px] font-black uppercase text-center tracking-widest leading-tight">{p.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Registrations - Placed strictly below Infrastructure */}
        {visibleFormButtons.length > 0 && (
          <div className="mb-24 animate-fadeIn">
            <h2 className="text-3xl font-serif font-black text-blue-900 uppercase tracking-[0.3em] border-l-8 border-red-700 pl-8 mb-12">Institutional Registrations</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {visibleFormButtons.map(btn => (
                <button key={btn.id} onClick={() => navigate(btn.path)} className="flex flex-col items-center justify-center p-10 border-2 border-blue-900 bg-white rounded-[2.5rem] transition-all shadow-xl hover:-translate-y-1 hover:bg-blue-900 hover:text-white group">
                  <div className="w-12 h-12 mb-6"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full text-blue-900 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon}></path></svg></div>
                  <span className="text-[11px] font-black uppercase text-center tracking-widest leading-tight">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
