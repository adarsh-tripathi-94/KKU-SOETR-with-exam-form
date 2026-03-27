import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import { Logo } from '../../components/Logo'; // Adjust path if needed

export const NoticeBoard: React.FC = () => {
  const { notices } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notices based on search
  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (n.message && n.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadFile = (fileData: string, title: string) => {
    // Extract the mime type from the base64 string to give it the correct extension
    const mimeType = fileData.split(';')[0].match(/jpeg|png|gif|pdf/)?.[0] || 'pdf';
    const extension = mimeType === 'pdf' ? 'pdf' : mimeType;
    
    const link = document.createElement('a');
    link.href = fileData;
    link.download = `SOETR_Notice_${title.replace(/\s+/g, '_')}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#001F3F] text-white p-8 md:p-12 border-b-8 border-kku-gold relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <Logo className="w-16 h-16 md:w-20 md:h-20" />
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white">Official Notice Board</h1>
              <p className="text-kku-gold font-bold uppercase tracking-[0.3em] text-[10px] mt-2">SOETR 30-Day Active Circulars</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/10 hover:bg-white hover:text-[#001F3F] border-2 border-white/20 transition-colors px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest"
          >
            Return to Hub
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        <div className="mb-10">
          <input 
            type="text" 
            placeholder="Search circulars by title or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-5 rounded-2xl border-4 border-black/5 focus:border-kku-blue focus:ring-0 outline-none text-lg font-bold uppercase shadow-sm transition-all text-gray-700"
          />
        </div>

        {filteredNotices.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-gray-200 text-center shadow-inner">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h3 className="text-2xl font-black uppercase text-gray-400 tracking-widest">No Active Circulars</h3>
            <p className="text-gray-400 font-bold mt-2">There are no official notices issued within the last 30 days.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="bg-white border-l-8 border-kku-blue p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
                
                {/* Notice Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-red-100 text-red-700 font-black uppercase text-[10px] px-4 py-1.5 rounded-full tracking-widest">Official</span>
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                      {new Date(notice.created_at || '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-[#001F3F] uppercase leading-tight mb-4">{notice.title}</h2>
                  
                  {notice.message && (
                    <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed mb-6 whitespace-pre-wrap border-l-4 border-gray-100 pl-4">
                      {notice.message}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    <span>Issued By: {notice.issuer}</span>
                    <span>•</span>
                    <span>Target: {notice.target_programme}</span>
                  </div>
                </div>

                {/* Download Button Action */}
                {notice.fileData && (
                  <div className="w-full md:w-auto shrink-0 md:border-l-2 border-gray-100 md:pl-8 flex flex-col items-center justify-center">
                    <button 
                      onClick={() => downloadFile(notice.fileData!, notice.title)}
                      className="w-full md:w-auto bg-[#001F3F] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-kku-gold hover:text-[#001F3F] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-transparent hover:border-[#001F3F]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download Attached File
                    </button>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-4 text-center">Secure Digital Artifact</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};