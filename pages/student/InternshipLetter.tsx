
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentFormData } from '../../types';
import { BED_MED_SCHOOLS, DELED_INT_SCHOOLS, SchoolMapping, PROGRAMMES, SESSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { A4FormWrapper } from '../../components/A4FormWrapper';
import { Logo } from '../../components/Logo';

const MAX_CAPACITY = 20;

export const InternshipLetter: React.FC = () => {
  const navigate = useNavigate();
  const { addSubmission, generateRefNo, getSchoolEnrollmentCount, officialSignatures } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');
  const [view, setView] = useState<'entry' | 'verify' | 'success'>('entry');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    programme: 'B.Ed.',
    session: '2024-2026',
    year: 'First Year',
    semester: 'First Semester',
    internshipStartDate: '',
    internshipEndDate: '',
    photoUrl: '',
    name: '',
    enrollmentNo: '',
    mobile: '',
    internshipSchool: '',
    internshipObserver: ''
  });
  
  const [activeSchoolList, setActiveSchoolList] = useState<SchoolMapping[]>([]);

  useEffect(() => {
    setCurrentRefNo(generateRefNo());
  }, []);

  useEffect(() => {
    const list = (formData.programme === "B.Ed." || formData.programme === "M.Ed.") 
      ? BED_MED_SCHOOLS 
      : DELED_INT_SCHOOLS;
    setActiveSchoolList(list);
    // Reset school on programme change
    setFormData(prev => ({ ...prev, internshipSchool: '', internshipObserver: '' }));
  }, [formData.programme]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const r = new FileReader();
      r.onload = ev => setFormData({...formData, photoUrl: ev.target?.result as string});
      r.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSchoolChange = (schoolName: string) => {
    const mapping = activeSchoolList.find(s => s.name === schoolName);
    const supervisor = mapping && mapping.supervisors.length > 0 ? mapping.supervisors[0] : 'Pending Allotment';
    setFormData(prev => ({ ...prev, internshipSchool: schoolName, internshipObserver: supervisor }));
  };

  const handleInitialVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.enrollmentNo || !formData.internshipSchool || !formData.photoUrl || !formData.internshipStartDate) {
      alert("Institutional Mandate: All identity particulars and school selections are required.");
      return;
    }
    const count = getSchoolEnrollmentCount(formData.internshipSchool!);
    if (count >= MAX_CAPACITY) {
      alert("Capacity Alert: This school reached regulatory limits. Select another institution.");
      return;
    }
    setView('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    addSubmission({ 
      id: currentRefNo, 
      date: new Date().toLocaleDateString('en-GB'), 
      enrollmentNo: formData.enrollmentNo || '', 
      name: formData.name || '', 
      programme: formData.programme || '', 
      formType: 'Internship Letter',
      school: formData.internshipSchool,
      data: { ...formData, refNo: currentRefNo }
    });
    
    setIsSaving(false);
    setView('success');
  };

  const downloadWord = () => {
    const content = `
K.K. UNIVERSITY (SOETR) - SIP ALLOTMENT REGISTRY
------------------------------------------------
Ref ID: ${currentRefNo}
Date: ${new Date().toLocaleDateString()}

STUDENT PARTICULARS:
Name: ${formData.name}
ID: ${formData.enrollmentNo}
Academic: ${formData.programme} (${formData.session})

ALLOTMENT DETAILS:
Target School: ${formData.internshipSchool}
Observer: ${formData.internshipObserver}
Tenure: ${formData.internshipStartDate} to ${formData.internshipEndDate}

This is a digitally synchronized official association letter.
    `;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SIP_Letter_${formData.enrollmentNo}.doc`;
    link.click();
  };

  const LetterTemplate = () => (
    <div className="font-serif text-black opacity-100 p-4">
      <div className="flex justify-between font-black uppercase text-[8pt] mb-8 border-b-2 border-black pb-1">
        <span>REF NO: {currentRefNo}</span>
        <span>DATE: {new Date().toLocaleDateString()}</span>
      </div>
      <h2 className="text-center font-black uppercase underline text-[16pt] mb-12 tracking-widest text-kku-blue">Internship Allotment Order</h2>
      <div className="mb-10">
        <p className="m-0 uppercase font-black text-[11pt]">To,</p>
        <p className="m-0 uppercase font-black text-[11pt]">The Principal / Head of Institution,</p>
        <p className="m-0 uppercase font-black text-[14pt] text-kku-blue mt-2 border-b border-dotted border-black inline-block">{formData.internshipSchool || '[PENDING]'}</p>
      </div>
      <p className="mb-10 font-black border-l-8 border-kku-blue pl-6 bg-gray-50 py-5 text-[12pt] uppercase shadow-sm">Subject: Mandatory School Internship Programme (SIP) Allotment – {formData.name}</p>
      <div className="mb-10 text-[11.5pt] text-justify leading-relaxed">
        Dear Sir / Madam, we hereby officially associate the under-mentioned student-teacher from K.K. University (SOETR) with your institution for the mandatory internship phase as per NCTE regulatory norms.
      </div>
      <div className="border-4 border-kku-blue rounded-[2rem] mb-10 shadow-xl overflow-hidden bg-white">
         <div className="bg-kku-blue text-white px-8 py-3 font-black uppercase text-[10pt] tracking-widest">Digital Allotment Matrix</div>
         <div className="p-8 space-y-4">
            {[ { l: "Candidate Name", v: formData.name }, { l: "Admission ID", v: formData.enrollmentNo }, { l: "Academic Course", v: `${formData.programme} (${formData.session})` }, { l: "Internship Tenure", v: `${formData.internshipStartDate} to ${formData.internshipEndDate}` }, { l: "Faculty Observer", v: formData.internshipObserver } ].map(r => (
              <div key={r.l} className="flex justify-between border-b border-black/5 pb-2"><span className="font-black uppercase text-[9pt] text-gray-500">{r.l}:</span><span className="font-black uppercase text-[11pt] text-kku-blue">{r.v}</span></div>
            ))}
         </div>
      </div>
      <div className="flex justify-between items-end mt-24 px-10">
        <div className="text-center w-64">
          <div className="h-12 border-b-2 border-black flex items-center justify-center mb-2">{officialSignatures.internshipCoordSign && <img src={officialSignatures.internshipCoordSign} className="h-full object-contain" />}</div>
          <p className="text-[10pt] font-black uppercase text-kku-blue">SIP Coordinator</p>
        </div>
        <div className="text-center w-64">
          <div className="h-12 border-b-2 border-black flex items-center justify-center mb-2">{officialSignatures.deanSign && <img src={officialSignatures.deanSign} className="h-full object-contain" />}</div>
          <p className="text-[10pt] font-black uppercase text-kku-blue">Office of the Dean</p>
        </div>
      </div>
    </div>
  );

  if (view === 'verify' || view === 'success') {
    return (
      <div className="min-h-screen bg-gray-200 py-10 flex flex-col items-center px-4 animate-fadeIn">
        {view === 'verify' && (
          <div className="w-full max-w-[210mm] mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-kku-gold sticky top-4 z-50">
             <div><h3 className="text-2xl font-black uppercase text-kku-blue">SIP Record Verification</h3><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review school association and tenure cycles</p></div>
             <div className="flex gap-4 mt-6 md:mt-0"><button onClick={() => setView('entry')} className="bg-gray-100 text-black px-8 py-3 rounded-2xl font-black uppercase text-xs border-2 border-black">Modify</button><button onClick={handleFinalSubmit} disabled={isSaving} className="bg-green-700 text-white px-10 py-3 rounded-2xl font-black uppercase text-xs border-2 border-white shadow-xl flex items-center gap-4">{isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Register SIP'}</button></div>
          </div>
        )}
        {view === 'success' && (
          <div className="w-full max-w-[210mm] mb-8 flex flex-col md:flex-row justify-between items-center bg-green-700 text-white p-10 rounded-[3rem] shadow-2xl border-4 border-white sticky top-4 z-50">
             <div className="text-center md:text-left"><h3 className="text-4xl font-serif font-black uppercase">SIP Allotment Secured</h3><p className="text-green-100 font-bold uppercase text-[11px] tracking-[0.4em] mt-2">REFERENCE ID: {currentRefNo}</p></div>
             <div className="flex gap-4 mt-8 md:mt-0"><button onClick={() => window.print()} className="bg-white text-green-800 px-10 py-4 rounded-3xl font-black uppercase text-xs border-2 border-green-800 shadow-xl flex items-center gap-3"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4 4V4" /></svg> Download PDF</button><button onClick={downloadWord} className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black uppercase text-xs border-2 border-white shadow-xl">Word (.doc)</button><button onClick={() => navigate('/')} className="bg-black/20 text-white px-8 py-4 rounded-3xl font-black uppercase text-xs hover:bg-white hover:text-green-800 transition">Hub Home</button></div>
          </div>
        )}
        <A4FormWrapper title="Official SIP Allotment Registry" pages={[{ title: "SIP Allotment Artifact", content: <LetterTemplate />, refNo: currentRefNo, copyType: "Official Letter" }]} />
      </div>
    );
  }

  const labelCls = "block text-[10px] font-black uppercase tracking-widest text-black mb-1.5 opacity-100";
  const inputCls = "w-full border-2 border-black p-3 font-bold uppercase rounded-xl outline-none focus:ring-4 focus:ring-kku-gold/10 bg-white text-black opacity-100 placeholder-gray-400 shadow-sm transition-all hover:border-kku-blue";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black rounded-[5rem] shadow-[40px_40px_0_rgba(0,31,63,1)] overflow-hidden">
        <div className="bg-kku-blue text-white p-12 md:p-20 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left"><h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter leading-none m-0">SIP Allotment</h1><p className="text-kku-gold font-bold uppercase text-[11px] mt-6 tracking-[0.4em] bg-white/10 px-8 py-2 rounded-full inline-block">Official Internship Gateway</p></div>
          <button onClick={() => navigate('/')} className="relative z-10 bg-white/10 border-2 border-white/20 px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all">Cancel Application</button>
        </div>

        <form onSubmit={handleInitialVerify} className="p-8 md:p-24 space-y-16">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 space-y-10">
               <div><label className={labelCls}>Name of Candidate (Legal)</label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="ENTER FULL NAME" /></div>
               <div className="grid grid-cols-2 gap-8">
                  <div><label className={labelCls}>Admission ID</label><input required value={formData.enrollmentNo || ''} onChange={e => setFormData({...formData, enrollmentNo: e.target.value})} className={inputCls} placeholder="KKU/SOETR/XXXX" /></div>
                  <div><label className={labelCls}>Academic Course</label><select value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className={inputCls}>{PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
               </div>
               <div className="bg-kku-blue/5 p-10 rounded-[3rem] border-2 border-dashed border-kku-blue/20">
                  <h4 className="text-sm font-black uppercase text-kku-blue mb-6 tracking-widest">Active School Association</h4>
                  <div className="space-y-6">
                    <div><label className={labelCls}>Target Internship Institution</label><select required value={formData.internshipSchool || ''} onChange={e => handleSchoolChange(e.target.value)} className={inputCls}><option value="">-- SELECT INSTITUTION --</option>{activeSchoolList.map(s => { const c = getSchoolEnrollmentCount(s.name); return <option key={s.name} value={s.name} disabled={c >= MAX_CAPACITY}>{s.name} ({MAX_CAPACITY-c} Slots Available)</option> })}</select></div>
                    <div className="flex justify-between items-center bg-white p-5 rounded-2xl border-2 border-black/5 shadow-inner"><span className="text-[10px] font-black text-gray-400 uppercase">Faculty Observer:</span><span className="font-black text-kku-blue uppercase tracking-widest">{formData.internshipObserver || 'AUTOMATIC ALLOTMENT'}</span></div>
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-80 flex flex-col items-center">
               <div className="w-56 h-72 border-4 border-black rounded-[2rem] overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-2xl group transition-transform hover:scale-105">
                  {formData.photoUrl ? <img src={formData.photoUrl} className="w-full h-full object-cover" /> : <div className="text-center p-6"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-4 text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><p className="text-[8pt] font-black text-gray-400 uppercase tracking-widest">Identity Artifact<br/>(4x6 cm)</p></div>}
                  <input type="file" required onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
               </div>
               <div className="mt-12 space-y-8 w-full">
                  <div><label className={labelCls}>Internship Commencement</label><input type="date" required value={formData.internshipStartDate || ''} onChange={e => setFormData({...formData, internshipStartDate: e.target.value})} className={inputCls} /></div>
                  <div><label className={labelCls}>Internship Conclusion</label><input type="date" required value={formData.internshipEndDate || ''} onChange={e => setFormData({...formData, internshipEndDate: e.target.value})} className={inputCls} /></div>
               </div>
            </div>
          </div>
          <div className="mt-32 pt-20 border-t-8 border-dotted border-gray-100 flex flex-col items-center">
             <button type="submit" className="w-full max-w-4xl py-12 bg-kku-blue text-white rounded-[4rem] font-black uppercase tracking-[0.4em] shadow-[0_30px_80px_rgba(0,31,63,0.3)] border-[2mm] border-white hover:bg-black transition-all text-[20pt] flex items-center justify-center gap-10 group transform active:scale-95">Verify & Generate Registry Entry<svg className="w-8 h-8 transition-transform group-hover:translate-x-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></button>
             <p className="mt-12 text-[11px] font-black uppercase text-gray-400 text-center tracking-widest leading-relaxed max-w-2xl">Upon verification, your SIP allotment will be synchronized with the master database and an official letter artifact will be generated with authorized seals.</p>
          </div>
        </form>
      </div>
    </div>
  );
};
