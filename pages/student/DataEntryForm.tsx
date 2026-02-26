
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentFormData, EducationalDetail } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  PROGRAMMES, 
  getSessionsForProgramme, 
  getYearsForProgramme, 
  getSemestersForProgramme 
} from '../../constants';
import { Logo } from '../../components/Logo';

const INITIAL_EDU_DETAILS: EducationalDetail[] = [
  { programme: 'High School (10th)', year: '', subject: '', board: '', result: '' },
  { programme: 'Intermediate (12th)', year: '', subject: '', board: '', result: '' },
  { programme: 'Graduation (B.A./B.Sc./B.Com)', year: '', subject: '', board: '', result: '' },
  { programme: 'Post Graduation', year: '', subject: '', board: '', result: '' }
];

export const DataEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const { addSubmission, generateRefNo } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    name: '',
    fatherName: '',
    motherName: '',
    enrollmentNo: '',
    programme: 'B.Ed.',
    session: '',
    year: '',
    semester: '',
    mobile: '',
    whatsapp: '',
    email: '',
    address: '',
    pinCode: '',
    photoUrl: '',
    eduDetails: INITIAL_EDU_DETAILS
  });

  useEffect(() => {
    setCurrentRefNo(generateRefNo());
  }, []);

  // Sync session, year, and semester when programme changes
  useEffect(() => {
    if (formData.programme) {
      const sessions = getSessionsForProgramme(formData.programme);
      const years = getYearsForProgramme(formData.programme);
      const semesters = getSemestersForProgramme(formData.programme);
      
      setFormData(prev => ({
        ...prev,
        session: sessions[0],
        year: years[0],
        semester: semesters[0]
      }));
    }
  }, [formData.programme]);

  const availableSessions = useMemo(() => getSessionsForProgramme(formData.programme || 'B.Ed.'), [formData.programme]);
  const availableYears = useMemo(() => getYearsForProgramme(formData.programme || 'B.Ed.'), [formData.programme]);
  const availableSemesters = useMemo(() => getSemestersForProgramme(formData.programme || 'B.Ed.'), [formData.programme]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const r = new FileReader();
      r.onload = ev => setFormData({ ...formData, photoUrl: ev.target?.result as string });
      r.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEduChange = (index: number, field: keyof EducationalDetail, value: string) => {
    const updated = [...(formData.eduDetails || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, eduDetails: updated });
  };

  const handleVerifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.enrollmentNo || !formData.photoUrl) {
      alert("Institutional Mandate: Student Name, Admission ID, and Photo are mandatory for registry synchronization.");
      return;
    }

    if (!window.confirm("Verify Digital Registry? All particulars will be synchronized with the master SOETR database.")) return;

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 2000));

    addSubmission({
      id: currentRefNo,
      date: new Date().toLocaleDateString('en-GB'),
      enrollmentNo: formData.enrollmentNo || '',
      name: formData.name || '',
      programme: formData.programme || '',
      formType: 'Data Entry',
      data: { ...formData, refNo: currentRefNo, timestamp: new Date().toISOString() }
    });

    setIsSaving(false);
    setIsSubmitted(true);
  };

  const downloadWord = () => {
    let content = `K.K. UNIVERSITY - SOETR DATA ENTRY REGISTRY\n`;
    content += `Reference ID: ${currentRefNo}\n\n`;
    content += `SECTION A: BASIC INFORMATION\n`;
    content += `Name: ${formData.name}\n`;
    content += `Father's Name: ${formData.fatherName}\n`;
    content += `Mother's Name: ${formData.motherName}\n`;
    content += `Admission ID: ${formData.enrollmentNo}\n`;
    content += `Programme: ${formData.programme}\n`;
    content += `Session: ${formData.session}\n`;
    content += `Year: ${formData.year}\n`;
    content += `Semester: ${formData.semester}\n`;
    content += `Contact: ${formData.mobile}\n`;
    content += `WhatsApp: ${formData.whatsapp}\n`;
    content += `Email: ${formData.email}\n`;
    content += `Address: ${formData.address}\n\n`;
    content += `SECTION 2: EDUCATIONAL DETAILS\n`;
    formData.eduDetails?.forEach(edu => {
      content += `${edu.programme}: Year ${edu.year}, Subject ${edu.subject}, Board ${edu.board}, Result ${edu.result}%\n`;
    });

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOETR_Registry_${formData.enrollmentNo}.doc`;
    link.click();
  };

  const labelCls = "block text-[10pt] font-black uppercase tracking-widest text-black mb-1";
  const inputCls = "w-full border-2 border-black/30 p-2.5 font-bold uppercase rounded-xl outline-none focus:border-kku-blue bg-white text-black opacity-100 placeholder-gray-300";

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 py-20 flex flex-col items-center animate-fadeIn">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-kku-blue max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-4xl font-serif font-black uppercase text-kku-blue mb-4">Registry Secured</h2>
          <p className="font-bold text-gray-500 uppercase tracking-widest mb-10">Archive Reference: <span className="text-kku-gold">{currentRefNo}</span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <button onClick={() => window.print()} className="bg-kku-blue text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all border-2 border-white">Download PDF</button>
            <button onClick={downloadWord} className="bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all border-2 border-white">Download Word</button>
          </div>
          
          <button onClick={() => navigate('/')} className="text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-kku-blue transition-colors underline">Return to Institutional Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-10 flex flex-col items-center font-serif text-black overflow-x-hidden">
      {/* High-Impact Digital Form Container */}
      <div className="bg-white shadow-2xl border-[1.5mm] border-[#001F3F] p-[10mm] w-[210mm] min-h-[297mm] box-border relative">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-[1mm] border-[#001F3F] p-1 bg-white flex items-center justify-center shadow-lg overflow-hidden">
                <Logo className="w-full h-full" />
              </div>
              <div className="text-left">
                <h1 className="text-[26pt] font-black uppercase tracking-tight m-0 leading-none text-[#001F3F]">K.K. University</h1>
                <h2 className="text-[12pt] font-bold uppercase tracking-widest mt-1 m-0 text-black">School of Education Training and Research</h2>
              </div>
           </div>
           <div className="text-right flex flex-col items-end">
              <span className="bg-kku-gold text-kku-blue px-4 py-1 text-[8pt] font-black uppercase tracking-widest mb-1 shadow-md border border-kku-blue/10">Registry Portal</span>
              <span className="text-[7pt] font-black uppercase text-gray-400">Ref: {currentRefNo}</span>
           </div>
        </div>

        {/* 2MM Line Divider */}
        <div className="h-[2mm] bg-[#001F3F] w-full mb-10 shadow-sm"></div>

        <form onSubmit={handleVerifyAndSave} className="space-y-12">
          {/* Section A: Basic Information */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#001F3F] text-white px-5 py-1 text-[11pt] font-black uppercase tracking-widest shadow-lg">Section : A</div>
              <h3 className="text-[16pt] font-black uppercase underline tracking-[0.1em] text-kku-blue">Basic Information</h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column Fields */}
              <div className="flex-1 grid grid-cols-1 gap-6">
                <div><label className={labelCls}>Name of Candidate</label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="ENTER FULL LEGAL NAME" /></div>
                <div><label className={labelCls}>Father's Name</label><input required value={formData.fatherName || ''} onChange={e => setFormData({...formData, fatherName: e.target.value})} className={inputCls} placeholder="ENTER FATHER'S NAME" /></div>
                <div><label className={labelCls}>Mother's Name</label><input required value={formData.motherName || ''} onChange={e => setFormData({...formData, motherName: e.target.value})} className={inputCls} placeholder="ENTER MOTHER'S NAME" /></div>
                <div><label className={labelCls}>Student Admission ID</label><input required value={formData.enrollmentNo || ''} onChange={e => setFormData({...formData, enrollmentNo: e.target.value})} className={inputCls} placeholder="KKU/SOETR/XXXX" /></div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className={labelCls}>Programme</label>
                     <select value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className={inputCls}>
                       {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className={labelCls}>Academic Session</label>
                     <select value={formData.session} onChange={e => setFormData({...formData, session: e.target.value})} className={inputCls}>
                       {availableSessions.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className={labelCls}>Academic Year</label>
                     <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className={inputCls}>
                       {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className={labelCls}>Semester / Term</label>
                     <select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className={inputCls}>
                       {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                </div>
              </div>

              {/* Right Column / Identity Node */}
              <div className="w-full lg:w-64 flex flex-col items-center">
                 <div className="w-48 h-64 border-2 border-black rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-xl group transition-transform hover:scale-[1.02]">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} className="w-full h-full object-cover" alt="Passport Portrait" />
                    ) : (
                      <div className="text-center p-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-4 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <p className="text-[7pt] font-black text-gray-400 uppercase tracking-widest leading-tight">Passport Size Photo<br/>(4x6 cm)</p>
                      </div>
                    )}
                    <input type="file" required onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                 </div>
                 <p className="text-[8pt] font-black uppercase text-kku-blue mt-4 tracking-widest text-center">Portrait Identity Artifact</p>

                 <div className="w-full mt-10 space-y-6">
                    <div><label className={labelCls}>Mobile No</label><input required value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className={inputCls} placeholder="10-DIGIT MOBILE" /></div>
                    <div><label className={labelCls}>WhatsApp No</label><input required value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className={inputCls} placeholder="WHATSAPP NUMBER" /></div>
                 </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-2">
                 <label className={labelCls}>Email Identity</label>
                 <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputCls} normal-case`} placeholder="student@kkuniversity.ac.in" />
               </div>
               <div className="md:col-span-2">
                 <label className={labelCls}>Residential Postal Address</label>
                 <textarea required value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className={`${inputCls} h-24 normal-case p-4`} placeholder="COMPLETE PHYSICAL ADDRESS..." />
               </div>
               <div>
                 <label className={labelCls}>Pin Code</label>
                 <input required maxLength={6} value={formData.pinCode || ''} onChange={e => setFormData({...formData, pinCode: e.target.value})} className={inputCls} placeholder="6-DIGIT PIN" />
               </div>
            </div>
          </section>

          {/* Section 2: Educational Details */}
          <section>
            <div className="flex items-center gap-4 mb-8 mt-10">
              <div className="bg-[#001F3F] text-white px-5 py-1 text-[11pt] font-black uppercase tracking-widest shadow-lg">Section : 2</div>
              <h3 className="text-[16pt] font-black uppercase underline tracking-[0.1em] text-kku-blue">Educational Details</h3>
            </div>

            <div className="border-[1mm] border-[#001F3F] rounded-2xl overflow-hidden shadow-xl bg-white">
              <table className="w-full border-collapse text-black text-[10pt]">
                <thead className="bg-[#001F3F] text-white font-black uppercase text-[9pt] tracking-[0.1em]">
                   <tr>
                     <th className="p-3 border-r border-white/20 w-12 text-center">S.N.</th>
                     <th className="p-3 border-r border-white/20 text-left">Academic Programme</th>
                     <th className="p-3 border-r border-white/20 w-24 text-center">Year</th>
                     <th className="p-3 border-r border-white/20 text-left">Subject / Stream</th>
                     <th className="p-3 border-r border-white/20 text-left">Board / University</th>
                     <th className="p-3 text-center w-24">Result (%)</th>
                   </tr>
                </thead>
                <tbody className="font-bold uppercase divide-y-2 divide-black/5">
                   {formData.eduDetails?.map((edu, idx) => (
                     <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-3 text-center border-r border-black/5 text-[11pt] font-black">{idx + 1}.</td>
                        <td className="p-3 border-r border-black/5 font-black text-kku-blue text-[10.5pt] leading-tight">{edu.programme}</td>
                        <td className="p-2 border-r border-black/5">
                          <input 
                            value={edu.year} 
                            onChange={e => handleEduChange(idx, 'year', e.target.value)} 
                            className="w-full p-1.5 text-center font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="YYYY"
                          />
                        </td>
                        <td className="p-2 border-r border-black/5">
                          <input 
                            value={edu.subject} 
                            onChange={e => handleEduChange(idx, 'subject', e.target.value)} 
                            className="w-full p-1.5 font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="STREAM"
                          />
                        </td>
                        <td className="p-2 border-r border-black/5">
                          <input 
                            value={edu.board} 
                            onChange={e => handleEduChange(idx, 'board', e.target.value)} 
                            className="w-full p-1.5 font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="BOARD NAME"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            value={edu.result} 
                            onChange={e => handleEduChange(idx, 'result', e.target.value)} 
                            className="w-full p-1.5 text-center font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="00.00"
                          />
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Audit Node */}
          <div className="mt-20 pt-10 border-t-[1mm] border-dotted border-[#001F3F] flex flex-col items-center">
             <button 
               type="submit" 
               disabled={isSaving}
               className="w-full max-w-4xl py-12 bg-[#001F3F] text-white rounded-[4rem] font-black uppercase tracking-[0.4em] shadow-[0_30px_80px_rgba(0,31,63,0.3)] border-[2mm] border-white hover:bg-black transition-all transform active:scale-95 text-[20pt] flex items-center justify-center gap-10 group"
             >
               {isSaving ? <div className="w-10 h-10 border-[1.5mm] border-white/30 border-t-white rounded-full animate-spin"></div> : (
                 <>
                   Verify & Synchronize Registry
                   <svg className="w-8 h-8 transition-transform group-hover:translate-x-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                 </>
               )}
             </button>
             <p className="mt-10 text-[9pt] font-black uppercase text-gray-400 tracking-widest italic text-center max-w-2xl leading-relaxed opacity-100">System Verification: Upon clicking, your particulars will be assigned Reference ID {currentRefNo} and stored in the Super Admin Secure Archive. Data integrity is audited by SOETR Governance.</p>
          </div>
        </form>

        {/* Official Watermark Footer */}
        <div className="mt-auto pt-10 flex justify-between items-end border-t border-black/5 opacity-40">
           <div className="text-[7pt] font-black uppercase tracking-tighter">Digital ID Generation System v10.0</div>
           <div className="text-[7pt] font-black uppercase tracking-tighter">School of Education Training and Research</div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
