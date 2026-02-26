
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MockSubmission, UploadedContent, GoverningBodyMember, OfficialSignatures, DataEntryRecord, GalleryImage, PersonDomain } from '../../types';
import { PROGRAMMES } from '../../constants';
import * as XLSX from 'xlsx';
import { Logo } from '../../components/Logo';

const SUBMISSION_CATEGORIES = [
  { id: 'Data Entry', label: 'Incoming Registry' },
  { id: 'Exam Form', label: 'Exam Enrollment' },
  { id: 'Internship Letter', label: 'SIP Allotments' },
  { id: 'Leave Application', label: 'Attendance Audit' },
  { id: 'Grievance', label: 'Case Redressal' },
  { id: 'Feedback', label: 'Institutional Review' }
];

const REPOSITORY_CATEGORIES = [
  { id: 'Notice', label: 'Official Notice' },
  { id: 'Assignment', label: 'Assignment Question' },
  { id: 'Time-Table', label: 'Academic Time-Table' },
  { id: 'Question Bank', label: 'Subject Question Bank' },
  { id: 'Study', label: 'Study Material' },
  { id: 'Results', label: 'Examination Results' }
];

const NAV_ITEMS = [
  { id: 'overview', label: 'Infrastructure', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'personnel', label: 'Personnel Hub', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'registry', label: 'Registry Hub', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'upload', label: 'Repository Sync', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { id: 'credentials', label: 'Signature Lab', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { id: 'gallery', label: 'Gallery Assets', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'governing', label: 'Chancellor Hub', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'timeline', label: 'Portal Control', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }
];

export const AdminDashboard: React.FC = () => {
  const { 
    logout, submissions, deleteSubmission, 
    uploadedContent, publishContent, deleteContent, 
    governingBody, addGoverningMember, updateGoverningMember, deleteGoverningMember,
    formTimelines, updateFormTimeline, updateAllFormTimelines,
    officialSignatures, updateOfficialSignatures,
    dataRecords, deleteDataRecord,
    galleryImages, addGalleryImage, deleteGalleryImage
  } = useAuth();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [dbCategory, setDbCategory] = useState('Data Entry');
  const [viewingSubmission, setViewingSubmission] = useState<MockSubmission | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [uploadData, setUploadData] = useState<Partial<UploadedContent>>({ category: 'Notice', programme: 'All Programmes', year: 'All Years', semester: 'All Semesters' });
  const [galleryInput, setGalleryInput] = useState<Partial<GalleryImage>>({ title: '', description: '', url: '' });
  const [govInput, setGovInput] = useState<Partial<GoverningBodyMember>>({ name: '', title: '', description: '', image: '' });
  const [editingGovId, setEditingGovId] = useState<string | null>(null);

  const handleLogout = () => { logout(); navigate('/'); };

  const onPublishArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.fileData) return alert("Validation Error: Please provide a title and document artifact.");
    setIsActionLoading(true);
    publishContent({ 
      ...uploadData, 
      id: Date.now().toString(), 
      datePublished: new Date().toLocaleDateString('en-GB') 
    } as UploadedContent);
    setIsActionLoading(false);
    alert("Repository Synchronized: Artifact is now visible to students.");
    setUploadData({ category: 'Notice', programme: 'All Programmes', year: 'All Years', semester: 'All Semesters' });
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryInput.url) return alert("Please select an image artifact.");
    addGalleryImage({ ...galleryInput, id: `gal_${Date.now()}` } as GalleryImage);
    setGalleryInput({ title: '', description: '', url: '' });
    alert("Slider Asset Synchronized.");
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govInput.name || !govInput.title || !govInput.image) return alert("All fields are mandatory for leadership profile.");
    
    if (editingGovId) {
      updateGoverningMember({ ...govInput, id: editingGovId } as GoverningBodyMember);
      alert("Institutional Leadership Record Updated.");
    } else {
      addGoverningMember({ ...govInput, id: `gov_${Date.now()}` } as GoverningBodyMember);
      alert("New Institutional Leader Synchronized.");
    }
    setGovInput({ name: '', title: '', description: '', image: '' });
    setEditingGovId(null);
  };

  const exportRegistry = () => {
    const filtered = submissions.filter(s => s.formType === dbCategory);
    if (filtered.length === 0) return alert("Registry Empty: No records found in this category.");
    const ws = XLSX.utils.json_to_sheet(filtered.map(s => ({ 
      REFERENCE_ID: s.id, 
      TIMESTAMP: s.date, 
      ADMISSION_ID: s.enrollmentNo, 
      FULL_NAME: s.name, 
      PROGRAMME: s.programme 
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Master_Registry");
    XLSX.writeFile(wb, `SOETR_${dbCategory.replace(/\s+/g, '_')}_Registry.xlsx`);
  };

  const renderSubmissionArtifact = (sub: MockSubmission) => {
    const d = sub.data;
    return (
      <div className="bg-white p-12 w-full max-w-[210mm] border-4 border-kku-blue rounded-3xl shadow-2xl opacity-100 font-serif">
         <div className="flex justify-between items-center border-b-4 border-kku-gold pb-6 mb-8">
            <Logo className="w-20 h-20" />
            <div className="text-right">
               <h1 className="text-2xl font-black uppercase text-kku-blue m-0">Institutional Artifact</h1>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub.formType} | {sub.id}</p>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            {Object.entries(d || {}).map(([k, v]) => (
              <div key={k} className="border-b border-gray-100 pb-2">
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">{k}</label>
                {typeof v === 'string' && v.startsWith('data:image') ? (
                  <img src={v} className="h-20 border border-black rounded shadow-sm" />
                ) : (
                  <span className="font-black uppercase text-kku-blue text-sm">{String(v)}</span>
                )}
              </div>
            ))}
         </div>
      </div>
    );
  };

  const btnCls = (isActive: boolean) => `w-full flex items-center gap-6 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all mb-4 ${isActive ? 'bg-kku-gold text-kku-blue shadow-[0_20px_50px_rgba(212,175,55,0.3)] scale-[1.05] z-10 border-2 border-white' : 'hover:bg-white/10 text-white/50 hover:text-white border-2 border-transparent'}`;
  const inputCls = "w-full border-2 border-black p-3 font-bold uppercase rounded-xl focus:ring-4 focus:ring-kku-gold/20 outline-none text-xs bg-white text-black";
  const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden opacity-100">
      <aside className="bg-[#000F1F] text-white w-80 shrink-0 border-r-8 border-kku-gold flex flex-col z-[60] shadow-[15px_0_60px_rgba(0,0,0,0.5)]">
        <div className="p-10 text-center border-b border-white/5 bg-black/20">
          <Logo className="w-16 h-16 mb-4 mx-auto" />
          <h1 className="text-kku-gold font-serif text-2xl font-black uppercase tracking-tighter">Admin Hub</h1>
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.4em]">SOETR v10.0 MASTER</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={btnCls(activeTab === item.id)}>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 bg-black/20 border-t border-white/5">
          <button onClick={handleLogout} className="w-full bg-red-800/20 text-red-500 border-2 border-red-800/30 py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-800 hover:text-white transition-all shadow-xl">Secure Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b-4 border-gray-100 px-12 py-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-kku-blue">{activeTab} Environment</h2>
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Authorized Command Center Gateway</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[9px] font-black uppercase text-green-700">Database Live</span>
             </div>
          </div>
        </header>

        <div className="p-12 space-y-12 pb-32">
          {activeTab === 'overview' && (
            <div className="animate-fadeIn space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[ 
                    { label: 'Personnel Records', count: dataRecords.length, color: 'text-blue-600', sub: 'Verified Entities' },
                    { label: 'Registry Submissions', count: submissions.length, color: 'text-green-600', sub: 'Student Inbound' },
                    { label: 'Infrastructure Artifacts', count: uploadedContent.length, color: 'text-kku-gold', sub: 'Digital Repository' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border-4 border-black p-10 rounded-[3rem] shadow-[20px_20px_0_rgba(0,31,63,0.05)] transform transition hover:-translate-y-2 hover:shadow-[30px_30px_0_rgba(0,31,63,0.1)]">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{stat.label}</p>
                      <h3 className={`text-7xl font-black ${stat.color} leading-none mb-4`}>{stat.count}</h3>
                      <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest">{stat.sub}</p>
                    </div>
                  ))}
               </div>
               <div className="bg-kku-blue/5 border-4 border-black rounded-[4rem] p-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-kku-blue opacity-[0.03] rounded-full -mr-32 -mt-32"></div>
                  <h3 className="text-4xl font-serif font-black uppercase text-kku-blue mb-8 border-b-2 border-kku-gold pb-4 inline-block">Institutional Protocol</h3>
                  <p className="text-gray-600 font-bold text-xl max-w-4xl leading-relaxed">
                    Welcome to the SOETR Master Hub. This environment facilitates enterprise-grade management of digital signatures, portal visibility, and academic repositories. All actions performed within this workspace are logged for institutional security compliance.
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'personnel' && (
            <div className="animate-fadeIn space-y-10">
               <div className="flex justify-between items-center bg-gray-50 p-10 rounded-[3rem] border-2 border-black/5">
                  <div>
                    <h3 className="text-3xl font-black uppercase text-kku-blue">Personnel Hub</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Master Records Synchronization</p>
                  </div>
                  <button onClick={() => navigate('/admin/data-entry')} className="bg-kku-blue text-white px-12 py-5 rounded-[2.5rem] font-black uppercase text-xs shadow-2xl border-4 border-white hover:bg-black transition-all">+ New Personnel Registry</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dataRecords.map(rec => (
                    <div key={rec.id} className="bg-white border-2 border-black p-8 rounded-[3rem] shadow-xl group hover:shadow-2xl transition-all relative">
                       <div className="flex justify-between mb-8">
                          <span className="bg-kku-blue text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{rec.domain}</span>
                          <button onClick={() => {if(window.confirm('Delete record?')) deleteDataRecord(rec.id);}} className="text-red-700 text-xs font-black uppercase hover:underline opacity-40 group-hover:opacity-100 transition-all">Erase Archive</button>
                       </div>
                       <h4 className="text-2xl font-black uppercase text-kku-blue leading-tight mb-2">{rec.basicInfo.name}</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l-4 border-kku-gold pl-3">{rec.basicInfo.enrollmentNo}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'registry' && (
            <div className="animate-fadeIn space-y-8">
              <div className="bg-gray-50 p-12 rounded-[4rem] border-4 border-black/5 flex flex-wrap gap-6 items-center shadow-inner">
                <div className="flex flex-wrap gap-3">
                  {SUBMISSION_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setDbCategory(cat.id)} className={`px-8 py-4 font-black uppercase text-[10px] border-2 rounded-[1.5rem] transition-all tracking-widest ${dbCategory === cat.id ? 'bg-kku-blue text-white border-kku-gold shadow-2xl scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-black'}`}>{cat.label}</button>
                  ))}
                </div>
                <button onClick={exportRegistry} className="bg-green-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase border-4 border-white shadow-2xl ml-auto hover:bg-black transition-all">Export (.XLSX)</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {submissions.filter(s => s.formType === dbCategory).map(sub => (
                  <div key={sub.id} className="bg-white border-2 border-black p-10 rounded-[3.5rem] shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden">
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <span className="text-[9px] font-black text-kku-gold uppercase bg-kku-blue px-4 py-1.5 rounded-full shadow-md">{sub.id}</span>
                        <span className="text-[9px] font-black text-gray-300">{sub.date}</span>
                     </div>
                     <h3 className="text-2xl font-black text-kku-blue uppercase mb-3 relative z-10 leading-none">{sub.name}</h3>
                     <p className="text-[10px] font-bold text-gray-500 uppercase mb-10 border-l-4 border-kku-gold pl-3 relative z-10">{sub.programme}</p>
                     <div className="flex gap-4 relative z-10">
                        <button onClick={() => setViewingSubmission(sub)} className="flex-1 bg-gray-100 border-2 border-black text-black py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all shadow-md">Inspect Packet</button>
                        <button onClick={() => {if(window.confirm('Erase packet?')) deleteSubmission(sub.id);}} className="px-6 border-2 border-red-800 text-red-800 rounded-2xl font-black uppercase text-[10px] hover:bg-red-800 hover:text-white transition-all">Delete</button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
               <div className="bg-white border-4 border-black rounded-[4rem] p-16 shadow-2xl">
                  <h3 className="text-4xl font-serif font-black uppercase text-kku-blue mb-10 border-b-4 border-kku-gold pb-4 inline-block">Repository Management</h3>
                  <form onSubmit={onPublishArtifact} className="space-y-12">
                    <div className="grid grid-cols-2 gap-10">
                       <div><label className={labelCls}>Artifact Category</label><select value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})} className={inputCls}>{REPOSITORY_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
                       <div><label className={labelCls}>Target Programme</label><select value={uploadData.programme} onChange={e => setUploadData({...uploadData, programme: e.target.value})} className={inputCls}><option>All Programmes</option>{PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    </div>
                    <div><label className={labelCls}>Artifact Title</label><input required value={uploadData.title || ''} onChange={e => setUploadData({...uploadData, title: e.target.value})} className={inputCls} placeholder="ENTER SECURE TITLE" /></div>
                    <div className="p-20 border-4 border-dashed border-gray-100 rounded-[4rem] text-center relative group hover:border-kku-blue transition-all bg-gray-50/50">
                       <svg className="w-16 h-16 mx-auto mb-6 text-gray-200 group-hover:text-kku-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                       <p className="font-black text-gray-400 uppercase text-[12px] tracking-[0.3em]">{uploadData.fileName || 'Select PDF/DOCX Artifact'}</p>
                       <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onload=(ev)=>setUploadData({...uploadData, fileName:f.name, fileData:ev.target?.result as string, fileSize:(f.size/1024).toFixed(1)+'KB'}); r.readAsDataURL(f); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <button type="submit" disabled={isActionLoading} className="w-full py-12 bg-kku-blue text-white font-black uppercase rounded-[3rem] shadow-2xl hover:bg-black transition-all text-xl tracking-[0.4em] border-4 border-white flex items-center justify-center gap-10 group">
                       {isActionLoading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                         <>
                           Publish to Repository
                           <svg className="w-8 h-8 transition-transform group-hover:translate-x-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                         </>
                       )}
                    </button>
                  </form>
               </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="animate-fadeIn max-w-5xl mx-auto">
               <div className="bg-white border-4 border-black rounded-[4rem] p-16 shadow-2xl">
                 <h3 className="text-4xl font-serif font-black uppercase text-kku-blue mb-4 border-b-4 border-kku-gold pb-4 inline-block">Credentials Lab</h3>
                 <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-20">Secure Digital Seals for Registry Artifacts</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                   {[ { label: "Dean (SOETR) Official Seal", key: "deanSign" }, { label: "SIP Coordinator Official Seal", key: "internshipCoordSign" } ].map(cred => (
                     <div key={cred.key} className="space-y-8 text-center">
                        <label className={labelCls}>{cred.label}</label>
                        <div className="w-full h-64 border-4 border-dashed border-gray-100 rounded-[4rem] flex items-center justify-center bg-gray-50 relative overflow-hidden group transition-all hover:bg-white hover:border-kku-blue shadow-inner">
                           {officialSignatures[cred.key as keyof OfficialSignatures] ? <img src={officialSignatures[cred.key as keyof OfficialSignatures]} className="h-full object-contain p-10 group-hover:scale-105 transition-all" /> : <div className="text-center opacity-30"><p className="text-xs font-black uppercase tracking-widest">Seal Artifact Empty</p></div>}
                           <input type="file" onChange={(e) => { if(e.target.files?.[0]) { const r = new FileReader(); r.onload=(ev)=>updateOfficialSignatures({[cred.key]: ev.target?.result as string}); r.readAsDataURL(e.target.files[0]); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <p className="text-[9px] font-black uppercase text-kku-gold italic tracking-widest">Security String: Synchronized across active nodes.</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'governing' && (
            <div className="animate-fadeIn max-w-5xl mx-auto space-y-12">
               <div className="bg-white border-4 border-black rounded-[4rem] p-16 shadow-2xl">
                  <h3 className="text-4xl font-serif font-black uppercase text-kku-blue mb-10 border-b-4 border-kku-gold pb-4 inline-block">{editingGovId ? 'Modify Identity' : 'Institutional Leadership Hub'}</h3>
                  <form onSubmit={handleGovSubmit} className="space-y-12">
                    <div className="flex flex-col md:flex-row gap-16">
                      <div className="w-64 h-80 border-4 border-black rounded-[4rem] overflow-hidden bg-gray-50 relative shrink-0 shadow-2xl group transition-all hover:scale-105">
                         {govInput.image ? <img src={govInput.image} className="w-full h-full object-cover" /> : null}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><span className="text-white font-black uppercase text-[10px] tracking-widest">Update Portrait</span></div>
                         <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onload=(ev)=>setGovInput({...govInput, image:ev.target?.result as string}); r.readAsDataURL(f); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="flex-1 space-y-10">
                        <div><label className={labelCls}>Full Legal Name</label><input required value={govInput.name || ''} onChange={e => setGovInput({...govInput, name: e.target.value})} className={inputCls} /></div>
                        <div><label className={labelCls}>Official Portfolio Title</label><input required value={govInput.title || ''} onChange={e => setGovInput({...govInput, title: e.target.value})} className={inputCls} /></div>
                      </div>
                    </div>
                    <div><label className={labelCls}>Leadership Narrative / Message</label><textarea required value={govInput.description || ''} onChange={e => setGovInput({...govInput, description: e.target.value})} className={`${inputCls} h-56 normal-case p-12 italic text-xl leading-relaxed shadow-inner`} /></div>
                    <div className="flex gap-8">
                       <button type="submit" className="flex-1 py-10 bg-kku-blue text-white font-black uppercase rounded-[3rem] shadow-2xl hover:bg-black transition-all tracking-[0.4em] border-4 border-white">{editingGovId ? 'Save Protocol' : 'Synchronize Identity'}</button>
                       {editingGovId && <button type="button" onClick={() => { setEditingGovId(null); setGovInput({ name: '', title: '', description: '', image: '' }); }} className="px-16 bg-gray-100 text-black font-black uppercase rounded-[3rem] border-2 border-black">Cancel</button>}
                    </div>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {governingBody.map(member => (
                    <div key={member.id} className="bg-white border-2 border-black p-12 rounded-[5rem] shadow-2xl flex gap-10 items-start group hover:-translate-y-2 transition-all">
                       <div className="w-32 h-40 rounded-[3rem] overflow-hidden border-4 border-black shrink-0 shadow-2xl"><img src={member.image} className="w-full h-full object-cover" /></div>
                       <div className="flex-1">
                          <h4 className="font-black uppercase text-kku-blue text-2xl leading-none mb-2">{member.name}</h4>
                          <p className="text-[11px] font-black text-kku-gold uppercase tracking-[0.3em] mb-8">{member.title}</p>
                          <div className="flex gap-8">
                             <button onClick={() => { setGovInput(member); setEditingGovId(member.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-kku-blue font-black uppercase text-[11px] hover:underline tracking-widest">Edit Hub</button>
                             <button onClick={() => deleteGoverningMember(member.id)} className="text-red-700 font-black uppercase text-[11px] hover:underline tracking-widest">Erase</button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
               <div className="bg-white border-4 border-black rounded-[4rem] p-16 shadow-2xl">
                  <h3 className="text-4xl font-serif font-black uppercase text-kku-blue mb-10 border-b-4 border-kku-gold pb-4 inline-block">Environment Governance</h3>
                  <div className="mb-20 bg-kku-blue/5 p-16 rounded-[4rem] border-4 border-dashed border-kku-blue/20">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div>
                           <h4 className="text-3xl font-black uppercase text-kku-blue mb-3">Master Override Hub</h4>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global authorization toggle for all student features</p>
                        </div>
                        <div className="flex gap-6 w-full md:w-auto">
                           <button onClick={() => updateAllFormTimelines(true)} className="flex-1 px-12 py-6 bg-green-700 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-black transition-all border-4 border-white/20 tracking-widest">Authorize All</button>
                           <button onClick={() => updateAllFormTimelines(false)} className="flex-1 px-12 py-6 bg-red-700 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-black transition-all border-4 border-white/20 tracking-widest">Restrict All</button>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8">
                    {formTimelines.map(tl => (
                      <div key={tl.formId} className="p-12 bg-gray-50 rounded-[3.5rem] border-2 border-black/5 flex items-center justify-between group hover:bg-white hover:border-kku-blue/40 transition-all shadow-xl hover:shadow-2xl">
                        <div className="flex items-center gap-10">
                           <div className={`w-8 h-8 rounded-full ${tl.isActive ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,1)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]'}`}></div>
                           <div>
                             <span className="font-black uppercase text-2xl text-kku-blue block leading-none mb-2">{tl.formName}</span>
                             <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Protocol Status: {tl.isActive ? 'AUTHORIZED ACCESS' : 'ENVIRONMENT LOCKED'}</span>
                           </div>
                        </div>
                        <button onClick={() => updateFormTimeline({...tl, isActive: !tl.isActive})} className={`px-14 py-6 rounded-[2.5rem] font-black uppercase text-[11px] border-4 transition-all shadow-2xl tracking-widest ${tl.isActive ? 'bg-green-700 text-white border-white/20 hover:bg-black' : 'bg-red-700 text-white border-white/20 hover:bg-black'}`}>
                          {tl.isActive ? 'ACTIVE' : 'LOCKED'}
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {viewingSubmission && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center py-20 px-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-[210mm] mb-16 flex justify-between items-center bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-kku-blue no-print">
            <div><h3 className="text-kku-blue font-black uppercase text-3xl tracking-tighter">Security Audit: {viewingSubmission.id}</h3><p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.5em] mt-2">Master Archive Entry</p></div>
            <div className="flex gap-8"><button onClick={() => window.print()} className="bg-kku-blue text-white px-14 py-5 rounded-[2.5rem] font-black uppercase text-xs shadow-2xl border-4 border-white hover:bg-black transition-all">Download Artifact</button><button onClick={() => setViewingSubmission(null)} className="bg-red-700 text-white px-14 py-5 rounded-[2.5rem] font-black uppercase text-xs shadow-2xl border-4 border-white hover:bg-black transition-all">Close Access</button></div>
          </div>
          <div className="opacity-100">{renderSubmissionArtifact(viewingSubmission)}</div>
        </div>
      )}
    </div>
  );
};
