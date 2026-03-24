
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import chancellorImg from './ChancellorSir.png';
import proChancellorImg from './PC.png';
import vcImg from './VC.png';
import pvcImg from './PVC.png';
import registrarImg from './registrar.png';

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
  { name: "NCERT", url: "https://www.youtube.com/@ncertofficial", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color: "text-blue-600" },
  { name: "NIOS", url: "https://www.youtube.com/@NIOSLearning", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "text-orange-600" },
  { name: "SWAYAM", url: "https://www.youtube.com/@swayamprabha-mhrd", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "text-purple-600" },
  { name: "IGNOU", url: "https://www.youtube.com/@IGNOU", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "text-indigo-600" },
  { name: "UGC", url: "https://www.youtube.com/@UGC_India", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", color: "text-teal-600" }
];

const OFFICIAL_LINKS = [
  { name: "NCERT", url: "https://ncert.nic.in/", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { name: "NIOS", url: "https://www.nios.ac.in/", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { name: "SWAYAM", url: "https://swayam.gov.in/", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { name: "IGNOU", url: "http://ignou.ac.in/", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { name: "UGC", url: "https://www.ugc.gov.in/", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" }
];

const CAREER_PORTALS = [
  { id: 'kvs', agency: 'Kendriya Vidyalaya', label: 'KVS Recruitment', url: 'https://kvsangathan.nic.in/', color: 'bg-[#DC3545]', shadow: 'border-[#B02A37]' },
  { id: 'nvs', agency: 'Navodaya Vidyalaya', label: 'NVS Recruitment', url: 'https://navodaya.gov.in/', color: 'bg-[#28589C]', shadow: 'border-[#1E4377]' },
  { id: 'awes', agency: 'Army Welfare Education', label: 'Army School (AWES)', url: 'https://www.awesindia.com/', color: 'bg-[#0088C2]', shadow: 'border-[#006691]' },
  { id: 'dav', agency: 'DAV Management', label: 'DAV Schools', url: 'http://davcmc.net.in/', color: 'bg-[#0039A6]', shadow: 'border-[#002875]' },
  { id: 'dps', agency: 'DPS Society', label: 'Delhi Public School', url: 'https://www.dpsfamily.org/', color: 'bg-[#FF9900]', shadow: 'border-[#CC7A00]' },
  { id: 'sarkari', agency: 'Govt. Job Updates', label: 'Sarkari Result', url: 'https://www.sarkariresult.com/', color: 'bg-[#E50000]', shadow: 'border-[#B30000]' },
  { id: 'naukri', agency: 'Corporate Careers', label: 'Naukri.com', url: 'https://www.naukri.com/', color: 'bg-[#2740C3]', shadow: 'border-[#1D3093]' },
  { id: 'linkedin', agency: 'Professional Network', label: 'LinkedIn', url: 'https://www.linkedin.com/', color: 'bg-[#0077B5]', shadow: 'border-[#005582]' },
  { id: 'bpsc', agency: 'Bihar Public Service', label: 'BPSC Official', url: 'https://www.bpsc.bih.nic.in/', color: 'bg-[#FF5722]', shadow: 'border-[#CC461B]' },
  { id: 'ctet', agency: 'Teacher Eligibility', label: 'CTET Portal', url: 'https://ctet.nic.in/', color: 'bg-[#008B38]', shadow: 'border-[#00682A]' }
];

const LEADERSHIP = [
  {
    name: "Er. Ravi Chaudhary",
    title: "Founder & Hon'ble Chancellor",
    image: chancellorImg,
    message: "Our mission is to cultivate a learning environment where innovation meets tradition. We are dedicated to producing educators who will inspire, lead, and contribute meaningfully to the global academic landscape."
  },
  {
    name: "Er. Richee Ravi", 
    title: "Pro Chancellor",
    image: proChancellorImg,
    message: "We are committed to bridging the gap between academia and industry, fostering a culture of research, and equipping our students with the strategic skills required to navigate a rapidly evolving global ecosystem."
  },
  {
    name: "Prof. (Dr.) Badiadka Narayana",
    title: "Vice Chancellor",
    image: vcImg,
    message: "Academic rigor and student welfare are the cornerstones of our operations. We strive to provide a holistic, transformative educational experience that shapes not just successful careers, but exceptional character."
  },
  {
    name: "Prof. (Dr) Rumki Bandyopadhyay",
    title: "Pro Vice Chancellor",
    image: pvcImg,  
    message: "Through continuous curriculum innovation and active campus engagement, we ensure that our pedagogical approaches remain at the absolute cutting edge of modern educational and technological standards.",
  },
  {
    name: "Dr. Kaushlendra Pathak",
    title: "Registrar",
    image: registrarImg,
    message: "Ensuring administrative excellence and seamless academic operations to support our students, faculty, and institutional growth in achieving their highest potential."
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isFormOpen, galleryImages, uploadedContent, buttonLocks, liveUpdatesText } = useAuth();
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
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 w-full no-print font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-[315px] md:h-[480px] overflow-hidden shadow-2xl border-b-8 border-kku-gold bg-kku-blue">
        {activeGallery.length > 0 ? activeGallery.map((img, idx) => (
          <div key={img.id} className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${img.url}")` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
              <div className="absolute bottom-16 md:bottom-20 left-4 md:left-24 text-white max-w-[90%] md:max-w-5xl animate-fadeIn pr-4">
                <span className="bg-kku-gold text-kku-blue px-4 md:px-6 py-1 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 inline-block rounded-full shadow-lg">SOETR Academic Hub</span>
                <h2 className="text-2xl md:text-5xl font-serif font-black uppercase tracking-tight leading-none drop-shadow-2xl break-words">{img.title}</h2>
                <p className="text-xs md:text-lg font-bold text-gray-300 mt-2 md:mt-4 tracking-wide max-w-3xl leading-relaxed line-clamp-2 md:line-clamp-none">{img.description}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-center px-4">
            <span className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.5em]">SOETR Institutional Hub</span>
          </div>
        )}
        
        {activeGallery.length > 1 && (
          <div className="absolute bottom-12 md:bottom-16 right-4 md:right-12 flex gap-2 z-30 flex-wrap justify-end">
            {activeGallery.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all border border-white/50 ${i === currentSlide ? 'bg-kku-gold w-6 md:w-8 ring-2 ring-kku-gold/30 shadow-lg' : 'bg-white/20 w-2 hover:bg-white/40'}`} />
            ))}
          </div>
        )}

        {/* INTEGRATED PREMIUM NEWS TICKER (Bulletproof Loop + Live Updates Badge) */}
        <div className="absolute bottom-0 left-0 w-full h-10 md:h-12 bg-black/90 backdrop-blur-md border-t-2 border-kku-gold z-40 flex items-center overflow-hidden shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
           <style>
              {`
                 @keyframes true-infinite-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                 }
                 .animate-marquee-block {
                    display: flex;
                    flex-shrink: 0;
                    align-items: center;
                    white-space: nowrap;
                    /* 25s controls the speed. Lower = faster! */
                    animation: true-infinite-marquee 25s linear infinite;
                 }
                 .ticker-wrapper:hover .animate-marquee-block {
                    animation-play-state: paused;
                 }
              `}
           </style>
           
           {/* Fixed "Live Updates" Badge on the left */}
           <div className="bg-gradient-to-r from-kku-gold to-yellow-500 h-full flex items-center justify-center px-4 md:px-8 z-50 relative shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.8)] border-r-2 border-yellow-300">
              <span className="text-kku-blue font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 drop-shadow-sm">
                 <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-red-600 animate-pulse border border-red-900 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
                 LIVE UPDATES
              </span>
           </div>

           {/* The Scrolling Text Area */}
           <div className="ticker-wrapper flex flex-1 overflow-hidden h-full relative">
              {/* --- COPY 1 --- */}
              <div className="animate-marquee-block text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] pr-12">
                 <span className="mr-8">{liveUpdatesText}</span>
                 <span className="text-red-500 mx-4 text-sm">●</span>
                 <span className="mr-8">OFFICIAL ACADEMIC NOTICE: EXAMINATION FORMS FOR THE CURRENT SEMESTER ARE NOW AVAILABLE FOR ALL DEPARTMENTS. ENSURE YOUR DATA ENTRY FORM IS COMPLETED AND APPROVED.</span>
                 
                 <span className="text-kku-gold mx-4 text-sm">★</span>
                 <span className="text-red-500 mx-4 text-sm">●</span>
                 <span className="mr-8">WELCOME TO THE K.K. UNIVERSITY SOETR ACADEMIC HUB. PLEASE CHECK THE OFFICIAL NOTICE BOARD FOR THE LATEST CIRCULARS.</span>
              </div>
              
              {/* --- COPY 2 (The Seamless Loop) --- */}
              <div className="animate-marquee-block text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] pr-12" aria-hidden="true">
                 <span className="mr-8">{liveUpdatesText}</span>
                 <span className="text-red-500 mx-4 text-sm">●</span>
                 <span className="mr-8">OFFICIAL ACADEMIC NOTICE: EXAMINATION FORMS FOR THE CURRENT SEMESTER ARE NOW AVAILABLE FOR ALL DEPARTMENTS. ENSURE YOUR DATA ENTRY FORM IS COMPLETED AND APPROVED.</span>
                 
                 <span className="text-kku-gold mx-4 text-sm">★</span>
                 <span className="text-red-500 mx-4 text-sm">●</span>
                 <span className="mr-8">WELCOME TO THE K.K. UNIVERSITY SOETR ACADEMIC HUB. PLEASE CHECK THE OFFICIAL NOTICE BOARD FOR THE LATEST CIRCULARS.</span>
              </div>
           </div>
        </div>
      </div>

      {/* Changed negative margins (-mt-8) to positive margins (mt-8) to push the buttons down safely */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full mt-8 md:mt-12 relative z-20">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          <button onClick={() => navigate('/portal/search')} className="flex flex-col items-center p-6 md:p-8 bg-white border-2 border-kku-blue rounded-[2rem] md:rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-kku-blue text-kku-gold flex items-center justify-center mb-4 rounded-3xl group-hover:bg-kku-gold group-hover:text-kku-blue transition-all"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-kku-blue text-center">Security Portal</h3>
            <p className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 mt-2 tracking-[0.2em] text-center">Official Record Lookup</p>
          </button>
          <a href="https://youtube.com/@drajaya2aeduzone96?si=hGYdBsD-l0HEk87J" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-6 md:p-8 bg-red-700 text-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-red-700 flex items-center justify-center mb-4 rounded-3xl"><svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-center">YouTube Hub</h3>
            <p className="text-[8px] md:text-[9px] font-black uppercase text-red-100 mt-2 tracking-[0.2em] text-center">Lecture Archives</p>
          </a>
          <a href="https://kkuniversity.ac.in/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-6 md:p-8 bg-kku-blue text-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-kku-gold text-kku-blue flex items-center justify-center mb-4 rounded-3xl"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-kku-gold text-center">Main Website</h3>
            <p className="text-[8px] md:text-[9px] font-black uppercase text-white mt-2 tracking-[0.2em] text-center">University Portal</p>
          </a>
        </div>

        {/* Leadership Section */}
        {isLeadershipVisible && LEADERSHIP.length > 0 && (
          <div className="mb-16 md:mb-24 animate-fadeIn">
            <div className="flex flex-col items-center mb-8 md:mb-12 text-center px-2">
              <h2 className="text-2xl md:text-4xl font-serif font-black text-kku-blue uppercase tracking-[0.2em] md:tracking-[0.4em] break-words">Institutional Leadership</h2>
              <div className="h-1.5 w-24 md:w-32 bg-kku-gold mt-4 rounded-full"></div>
            </div>
            
            {/* 1. THE BIG CHANCELLOR SECTION */}
            <div className="bg-white border-4 border-kku-blue rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-10 flex flex-col md:flex-row group hover:-translate-y-2 transition-all">
              <div className="md:w-2/5 h-[400px] md:h-auto relative border-b-4 md:border-b-0 md:border-r-4 border-kku-gold overflow-hidden shrink-0">
                <img 
                  src={LEADERSHIP[0].image} 
                  alt={LEADERSHIP[0].title} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F] via-[#001F3F]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                  <h3 className="text-3xl md:text-5xl font-black uppercase text-white leading-none drop-shadow-2xl mb-2">{LEADERSHIP[0].name}</h3>
                  <p className="text-sm md:text-lg font-black tracking-[0.3em] text-kku-gold uppercase drop-shadow-md">{LEADERSHIP[0].title}</p>
                </div>
              </div>
              <div className="md:w-3/5 p-10 md:p-16 flex flex-col justify-center bg-gray-50 relative">
                <span className="text-8xl md:text-[10rem] text-kku-gold/10 absolute top-0 left-4 font-serif leading-none">"</span>
                <p className="text-lg md:text-3xl font-bold text-gray-700 italic leading-relaxed relative z-10">
                  {LEADERSHIP[0].message}
                </p>
                <span className="text-8xl md:text-[10rem] text-kku-gold/10 absolute bottom-0 right-8 font-serif transform rotate-180 leading-none">"</span>
              </div>
            </div>

            {/* 2. THE 4-COLUMN GRID FOR THE REST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {LEADERSHIP.slice(1).map((leader, index) => (
                <div key={index} className="bg-white border-4 border-kku-blue rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group flex flex-col hover:-translate-y-2">
                  <div className="h-64 overflow-hidden relative border-b-4 border-kku-gold shrink-0">
                    <img 
                      src={leader.image} 
                      alt={leader.title} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/90 via-[#001F3F]/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h3 className="text-xl font-black uppercase text-white leading-tight drop-shadow-lg">{leader.name}</h3>
                      <p className="text-[10px] font-black tracking-widest text-kku-gold uppercase mt-1 drop-shadow-md">{leader.title}</p>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col items-center text-center bg-gray-50 relative">
                    <span className="text-6xl text-kku-gold/20 absolute -top-2 left-4 font-serif leading-none">"</span>
                    <p className="text-sm font-bold text-gray-700 italic leading-relaxed relative z-10">
                      {leader.message}
                    </p>
                    <span className="text-6xl text-kku-gold/20 absolute bottom-0 right-4 font-serif transform rotate-180 leading-none">"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic Infrastructure Master Group */}
        <div className="mb-16 md:mb-24 space-y-12 md:space-y-16">
          <div>
            <h2 className="text-xl md:text-3xl font-serif font-black text-kku-blue uppercase tracking-[0.1em] md:tracking-[0.3em] border-l-4 md:border-l-8 border-kku-gold pl-4 md:pl-8 mb-8 md:mb-12">Academic Infrastructure</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {SERVICE_BUTTONS.map(btn => {
                const count = getArtifactCount(btn.category);
                const isOpen = isFormOpen(btn.id);
                const isLocked = buttonLocks[btn.id] === true; 
                
                if (!isOpen) return null;
                
                return (
                  <button 
                    key={btn.id} 
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        alert(`🔒 The ${btn.label} portal is currently locked by the Administrator.`);
                        return;
                      }
                      navigate(btn.path);
                    }} 
                    className={`flex flex-col items-center justify-center p-4 md:p-10 bg-white border border-black rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl transition-all transform group relative overflow-hidden ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-kku-blue hover:text-white hover:-translate-y-1'}`}
                  >
                    {count > 0 && !isLocked && <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-kku-gold text-kku-blue text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">{count} New</div>}
                    <div className="w-8 h-8 md:w-12 md:h-12 mb-4 md:mb-6 text-kku-gold group-hover:text-white transition-colors"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon}></path></svg></div>
                    <span className="text-[9px] md:text-[11px] font-black uppercase text-center tracking-wider md:tracking-widest leading-tight">{btn.label} {isLocked && ' (Locked)'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EDUCATIONAL HUB (Red YouTube Design - Ultra Mobile Responsive) */}
          <div className="mb-12 md:mb-16">
            <h4 className="text-lg md:text-xl font-serif font-black text-red-700 uppercase tracking-[0.1em] md:tracking-[0.3em] border-l-4 border-red-700 pl-4 md:pl-6 mb-6 md:mb-8">Educational Hub - Official YouTube Channels</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
              {ACADEMIC_PLATFORMS.map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 bg-white border border-gray-300 rounded-[1.2rem] md:rounded-[2.5rem] shadow-md hover:shadow-xl hover:bg-red-700 hover:border-red-700 hover:text-white transition-all transform hover:-translate-y-1 group w-full min-h-[90px] md:min-h-[120px] overflow-hidden">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 mb-1.5 md:mb-4 flex-none shrink-0 ${p.color} group-hover:text-white transition-colors`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={p.icon}></path></svg>
                  </div>
                  <span className="text-[8.5px] sm:text-[9px] md:text-[11px] font-black uppercase text-center tracking-tight md:tracking-widest leading-tight break-words w-full px-0.5">{p.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* OFFICIAL LINKS (Blue Outline Design - Ultra Mobile Responsive) */}
          <div className="mb-12 md:mb-16">
            <h4 className="text-lg md:text-xl font-serif font-black text-blue-900 uppercase tracking-[0.1em] md:tracking-[0.3em] border-l-4 border-blue-900 pl-4 md:pl-6 mb-6 md:mb-8">Educational Hub - Official Links</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
              {OFFICIAL_LINKS.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 border-2 border-blue-900 bg-white rounded-[1.2rem] md:rounded-[2.5rem] transition-all shadow-md hover:shadow-xl hover:-translate-y-1 hover:bg-blue-900 hover:text-white group w-full min-h-[90px] md:min-h-[120px] overflow-hidden">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 mb-1.5 md:mb-4 flex-none shrink-0 text-blue-900 group-hover:text-white transition-colors">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon}></path></svg>
                  </div>
                  <span className="text-[8.5px] sm:text-[9px] md:text-[11px] font-black uppercase text-center tracking-tight md:tracking-widest leading-tight break-words w-full px-0.5 text-blue-900 group-hover:text-white">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* CAREER & RECRUITMENT PORTALS (Custom 3D Design) */}
          <div className="mb-16 md:mb-24 pt-8">
            <div className="flex flex-col items-center mb-8 md:mb-12 text-center px-2">
              <h2 className="text-xl md:text-3xl font-serif font-black text-kku-blue uppercase tracking-[0.2em] break-words">Career & Recruitment Portals</h2>
              <div className="h-1 w-full max-w-lg bg-kku-gold mt-4"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {CAREER_PORTALS.map(p => (
                <a 
                  key={p.id} 
                  href={p.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`relative flex flex-col items-center justify-between p-4 md:p-6 ${p.color} border-b-[8px] ${p.shadow} rounded-[2rem] text-white transition-all overflow-hidden group min-h-[160px] md:min-h-[180px] hover:-translate-y-1 hover:brightness-110 active:translate-y-2 active:border-b-0`}
                >
                  {/* Faint Background Briefcase Icon */}
                  <svg className="absolute -bottom-6 -right-6 w-32 h-32 text-black opacity-[0.08] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                  </svg>

                  {/* Text Content */}
                  <div className="relative z-10 w-full text-center flex-1 flex flex-col justify-center">
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-white/80 mb-1.5 md:mb-2">{p.agency}</span>
                    <span className="text-sm md:text-lg font-black uppercase leading-tight drop-shadow-md px-1">{p.label}</span>
                  </div>

                  {/* Connect Pill Button */}
                  <div className="relative z-10 mt-4 bg-black/20 rounded-full px-4 py-1.5 md:py-2 flex items-center justify-center gap-2 w-[85%] backdrop-blur-sm border border-white/10 group-hover:bg-black/30 transition-colors">
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Connect</span>
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        {visibleFormButtons.length > 0 && (
          <div className="mb-16 md:mb-24 animate-fadeIn">
            <h2 className="text-xl md:text-3xl font-serif font-black text-blue-900 uppercase tracking-[0.1em] md:tracking-[0.3em] border-l-4 md:border-l-8 border-red-700 pl-4 md:pl-8 mb-8 md:mb-12">Institutional Registrations</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {visibleFormButtons.map(btn => {
                const isLocked = buttonLocks[btn.id] === true; 
                return (
                  <button 
                    key={btn.id} 
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        alert(`🔒 The ${btn.label} is currently locked by the Administrator.`);
                        return;
                      }
                      navigate(btn.path);
                    }} 
                    className={`flex flex-col items-center justify-center p-4 md:p-10 border-2 border-blue-900 bg-white rounded-[1.5rem] md:rounded-[2.5rem] transition-all shadow-xl group ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1 hover:bg-blue-900 hover:text-white'}`}
                  >
                    <div className="w-8 h-8 md:w-12 md:h-12 mb-4 md:mb-6"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`w-full h-full ${isLocked ? 'text-gray-400' : 'text-blue-900 group-hover:text-white'}`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon}></path></svg></div>
                    <span className="text-[9px] md:text-[11px] font-black uppercase text-center tracking-wider md:tracking-widest leading-tight">{btn.label} {isLocked && ' (Locked)'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};