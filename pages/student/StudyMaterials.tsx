
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PROGRAMMES, getYearsForProgramme, getSemestersForProgramme } from '../../constants';
import { UploadedContent } from '../../types';

export const StudyMaterials: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedContent } = useAuth();
  
  const [programme, setProgramme] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [previewItem, setPreviewItem] = useState<UploadedContent | null>(null);

  const availableYears = programme ? getYearsForProgramme(programme) : [];
  // Fix: getSemestersForProgramme only takes 1 argument
  const availableSemesters = programme && year ? getSemestersForProgramme(programme) : [];

  // Logic to hide semester for yearly programmes (D.El.Ed)
  const isSemesterHidden = programme === "D.El.Ed.";

  const staticResources: UploadedContent[] = [
    { id: 'static-1', category: 'Study', programme: 'All Programmes', year: 'All Years', semester: 'All Semesters', title: 'NCTE Regulation & Ordinances 2024', description: 'Official regulatory guidelines for Teacher Education.', datePublished: '01-01-2024', fileName: 'NCTE_Ordinance.pdf', fileSize: '1.2 MB' },
    { id: 'static-2', category: 'Study', programme: 'All Programmes', year: 'All Years', semester: 'All Semesters', title: 'Standard Lesson Plan Format', description: 'Universal template for classroom teaching sessions.', datePublished: '05-01-2024', fileName: 'Lesson_Plan_Format.pdf', fileSize: '450 KB' },
  ];

  const allContent = useMemo(() => {
    const dynamicStudy = uploadedContent.filter(c => c.category === 'Study');
    return [...dynamicStudy, ...staticResources];
  }, [uploadedContent]);

  const filteredAndSortedContent = useMemo(() => {
    let filtered = allContent.filter(item => {
      const progMatch = !programme || item.programme === programme || item.programme === 'All Programmes';
      const yearMatch = !year || item.year === year || item.year === 'All Years';
      const semMatch = isSemesterHidden || !semester || item.semester === semester || item.semester === 'All Semesters';
      const searchMatch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return progMatch && yearMatch && semMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      const parseDate = (d: string) => {
        const p = d.split('-');
        return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])).getTime();
      };
      return parseDate(b.datePublished) - parseDate(a.datePublished);
    });
  }, [allContent, programme, year, semester, searchQuery, sortBy, isSemesterHidden]);

  const handleDownload = (item: UploadedContent) => {
    if (item.fileData) {
      const link = document.createElement('a');
      link.href = item.fileData;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Initializing Secure Hub Download for ${item.fileName}...`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans bg-gray-50">
      <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-kku-blue overflow-hidden">
        <div className="bg-kku-blue text-white p-8 md:p-12 border-b-4 border-kku-gold relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-black tracking-widest uppercase">Study Materials</h1>
                <p className="text-kku-gold mt-2 font-black uppercase tracking-[0.2em] text-sm opacity-90">Official Academic Repository</p>
              </div>
              <button onClick={() => navigate(-1)} className="bg-white text-kku-blue px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-kku-gold hover:text-white transition-all transform active:scale-95 shadow-xl border-2 border-white">Back to Hub</button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-100 border-b-2 border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Search Material</label>
              <div className="relative">
                <input type="text" placeholder="Keywords..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-2xl font-black text-xs uppercase outline-none shadow-sm" />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Academic Programme</label>
              <select value={programme} onChange={e => { setProgramme(e.target.value); setYear(''); setSemester(''); }} className="w-full p-3 border-2 border-black rounded-2xl font-black text-xs uppercase outline-none shadow-sm">
                <option value="">-- All Courses --</option>
                {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Year</label>
                <select value={year} onChange={e => { setYear(e.target.value); setSemester(''); }} disabled={!programme} className="w-full p-3 border-2 border-black rounded-2xl font-black text-xs uppercase outline-none shadow-sm disabled:bg-gray-200">
                  <option value="">Any Year</option>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {!isSemesterHidden && (
                <div className="flex-1 animate-fadeIn">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Semester</label>
                  <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!year} className="w-full p-3 border-2 border-black rounded-2xl font-black text-xs uppercase outline-none shadow-sm disabled:bg-gray-200">
                    <option value="">Any Sem</option>
                    {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Sort Artifacts</label>
              <div className="flex bg-white rounded-2xl border-2 border-black p-1 shadow-sm overflow-hidden">
                <button onClick={() => setSortBy('date')} className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${sortBy === 'date' ? 'bg-kku-blue text-white' : 'text-gray-400'}`}>Newest</button>
                <button onClick={() => setSortBy('title')} className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${sortBy === 'title' ? 'bg-kku-blue text-white' : 'text-gray-400'}`}>A-Z</button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {filteredAndSortedContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <h3 className="text-2xl font-serif font-black uppercase tracking-widest">No Materials Synchronized</h3>
              <p className="mt-2 text-xs font-black uppercase tracking-tighter opacity-60">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedContent.map(item => (
                <div key={item.id} className="group bg-white border-2 border-black rounded-[2.5rem] p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-kku-gold/10 text-kku-gold text-[9px] font-black px-3 py-1 rounded-full uppercase border border-kku-gold/20 tracking-widest">{item.category}</div>
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{item.datePublished}</div>
                  </div>
                  <h4 className="text-xl font-black text-kku-blue leading-tight mb-3 group-hover:text-black transition-colors">{item.title}</h4>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed italic line-clamp-3 mb-8 flex-1">{item.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="text-[8px] font-black text-gray-400 uppercase mb-1">Target</div>
                      <div className="text-[10px] font-black text-kku-blue uppercase truncate">{item.programme}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="text-[8px] font-black text-gray-400 uppercase mb-1">File Info</div>
                      <div className="text-[10px] font-black text-kku-blue uppercase">{item.fileSize} | SECURE</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {item.fileData && <button onClick={() => setPreviewItem(item)} className="flex-1 bg-gray-100 text-black py-3 rounded-2xl font-black uppercase text-[10px] border-2 border-black hover:bg-black hover:text-white transition-all">Preview</button>}
                    <button onClick={() => handleDownload(item)} className="flex-1 py-3 rounded-2xl font-black uppercase text-[10px] border-2 border-black shadow-lg bg-kku-blue text-white hover:bg-black transition-all flex items-center justify-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4 4V4"></path></svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] border-4 border-black shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-kku-blue p-6 flex justify-between items-center border-b-4 border-kku-gold text-white">
              <h3 className="text-lg font-black uppercase tracking-widest">{previewItem.title}</h3>
              <button onClick={() => setPreviewItem(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all font-black text-xl">×</button>
            </div>
            <div className="flex-1 bg-gray-200 relative">
              {previewItem.fileData?.startsWith('data:image/') ? <div className="w-full h-full flex items-center justify-center p-8 bg-gray-900"><img src={previewItem.fileData} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" /></div> : <iframe src={previewItem.fileData} className="w-full h-full border-none" title="PDF Preview" />}
            </div>
            <div className="p-6 bg-white border-t-2 border-black flex justify-end gap-4">
               <button onClick={() => handleDownload(previewItem)} className="bg-kku-blue text-white px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-black transition-all">Download Artifact</button>
               <button onClick={() => setPreviewItem(null)} className="bg-white border-2 border-black px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
