
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PersonDomain, DataEntryRecord, AttendanceRecord, PracticalFileStatus, ParticipationStatus } from '../../types';
import { PROGRAMMES, SESSIONS, MONTHS } from '../../constants';
import { A4FormWrapper } from '../../components/A4FormWrapper';

export const DataEntryForm: React.FC = () => {
  const { addDataRecord } = useAuth();
  const navigate = useNavigate();
  const [domain, setDomain] = useState<PersonDomain>(PersonDomain.STUDENT);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // SECTION A: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    enrollmentNo: '', 
    name: '', 
    fatherName: '', 
    motherName: '',
    programme: 'B.Ed.', 
    session: '2024-2026',
    year: '1st Year',
    photoUrl: '', 
    contact1: '', 
    whatsapp: '', 
    email: '', 
    address: ''
  });

  // STUDENT SPECIFIC STATES
  const [att1, setAtt1] = useState<AttendanceRecord[]>(MONTHS.map(m => ({ month: m.name, workingDays: m.days, presentDays: 0, percentage: 0 })));
  const [att2, setAtt2] = useState<AttendanceRecord[]>(MONTHS.map(m => ({ month: m.name, workingDays: m.days, presentDays: 0, percentage: 0 })));
  const [prac1, setPrac1] = useState<PracticalFileStatus[]>([]);
  const [prac2, setPrac2] = useState<PracticalFileStatus[]>([]);
  const [outreach, setOutreach] = useState<ParticipationStatus[]>([
    { name: 'Literacy Campaign', status: 'Not Attended' },
    { name: 'Hygiene Campaign', status: 'Not Attended' },
    { name: 'Anti-Discrimination', status: 'Not Attended' },
    { name: 'Plantation Campaign', status: 'Not Attended' }
  ]);
  const [exams, setExams] = useState<ParticipationStatus[]>([
    { name: 'CT-1', status: 'Absent' }, { name: 'CT-2', status: 'Absent' }, { name: 'CT-3', status: 'Absent' },
    { name: 'Exam Form Filled', status: 'Not Filled' }, { name: 'Practical Exam', status: 'Absent' }, { name: 'Result Status', status: 'Failed' }
  ]);
  const [sports, setSports] = useState<ParticipationStatus[]>([
    { name: 'Cricket', status: 'Not Participated' }, { name: 'Volleyball', status: 'Not Participated' }, { name: 'Basketball', status: 'Not Participated' },
    { name: 'Badminton', status: 'Not Participated' }, { name: 'Table Tennis', status: 'Not Participated' }, { name: 'Chess', status: 'Not Participated' }, { name: 'Athletics', status: 'Not Participated' }
  ]);

  // FACULTY STATES
  const [qualifications, setQualifications] = useState<ParticipationStatus[]>([{ name: 'M.A.', status: 'No' }, { name: 'M.Sc.', status: 'No' }, { name: 'M.Ed.', status: 'No' }, { name: 'NET', status: 'No' }, { name: 'Ph.D.', status: 'No' }]);
  const [achievements, setAchievements] = useState({ researchPapers: '0', workshops: '0', booksWritten: '0', apps: '0' });
  const [adminWorks, setAdminWorks] = useState({ contribution: 'None', mentor: 'None', coCurricular: 'None', examContr: 'None' });
  const [evalData, setEvalData] = useState({ practicalFiles: '0', ctScripts: '0', yearlyScripts: '0', assignments: '0', studentRegisters: '0', facultyRegisters: '0' });

  // NON-TEACHING STATES
  const [ntQuals, setNtQuals] = useState<ParticipationStatus[]>([{ name: '12th Pass', status: 'No' }, { name: 'B.A.', status: 'No' }, { name: 'M.A.', status: 'No' }]);
  const [ntTechnical, setNtTechnical] = useState('Others');
  const [ntResponsibilities, setNtResponsibilities] = useState<ParticipationStatus[]>([{ name: 'Marksheet Distribution', status: 'No' }, { name: 'Exam Form Support', status: 'No' }, { name: 'Practical File Collection', status: 'No' }, { name: 'Typing Works', status: 'No' }]);

  // DRAFT LOGIC
  useEffect(() => {
    const draft = localStorage.getItem('soetr_admin_entry_draft');
    if (draft) {
      try {
        const p = JSON.parse(draft);
        if (p.basicInfo) setBasicInfo(p.basicInfo);
        if (p.domain) setDomain(p.domain);
        if (p.att1) setAtt1(p.att1);
        if (p.att2) setAtt2(p.att2);
      } catch (e) {}
    }
  }, []);

  const saveDraft = () => {
    const draft = { basicInfo, domain, att1, att2, prac1, prac2, outreach, exams, sports, qualifications, achievements, adminWorks, evalData, ntQuals, ntTechnical, ntResponsibilities };
    localStorage.setItem('soetr_admin_entry_draft', JSON.stringify(draft));
    alert("Draft saved successfully to local storage.");
  };

  useEffect(() => {
    if (domain === PersonDomain.STUDENT) {
      const p1 = basicInfo.programme === "D.El.Ed." ? [{ name: 'Action Research', submitted: 'Not Submitted' }, { name: 'Micro-teaching', submitted: 'Not Submitted' }, { name: 'Lesson Plan', submitted: 'Not Submitted' }] : [{ name: 'Action Research', submitted: 'Not Submitted' }, { name: 'Psychological Test', submitted: 'Not Submitted' }, { name: 'Drama and Art', submitted: 'Not Submitted' }, { name: 'Reading & Reflecting', submitted: 'Not Submitted' }, { name: 'Micro-teaching', submitted: 'Not Submitted' }, { name: 'Lesson Plan', submitted: 'Not Submitted' }];
      const p2 = basicInfo.programme === "D.El.Ed." ? [{ name: 'Community Work', submitted: 'Not Submitted' }, { name: 'Peer Observation', submitted: 'Not Submitted' }, { name: 'Task and Education', submitted: 'Not Submitted' }, { name: 'School Diary', submitted: 'Not Submitted' }, { name: 'Art Integrated Education', submitted: 'Not Submitted' }, { name: 'Lesson Plan', submitted: 'Not Submitted' }] : [{ name: 'School Diary', submitted: 'Not Submitted' }, { name: 'Achievement Test', submitted: 'Not Submitted' }, { name: 'Peer Observation', submitted: 'Not Submitted' }, { name: 'Lesson Plan', submitted: 'Not Submitted' }, { name: 'Understanding Self', submitted: 'Not Submitted' }, { name: 'ICT', submitted: 'Not Submitted' }];
      setPrac1(p1 as any); setPrac2(p2 as any);
    }
  }, [basicInfo.programme, domain]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = ev => setBasicInfo({...basicInfo, photoUrl: ev.target?.result as string});
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const validate = () => {
    const errs: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicInfo.enrollmentNo) errs.push("Admission ID / Enrollment No is required.");
    if (!basicInfo.name) errs.push("Full Name is mandatory.");
    if (!basicInfo.email || !emailRegex.test(basicInfo.email)) errs.push("Valid institutional email is required.");
    if (!basicInfo.contact1 || basicInfo.contact1.length < 10) errs.push("Primary contact must be 10 digits.");
    if (!basicInfo.address) errs.push("Postal address is required.");
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (errs.length > 0) {
      setValidationErrors(errs);
      window.scrollTo(0, 0);
      return;
    }

    if (!window.confirm("Verify Master Data Integrity? This action will permanently synchronize the institutional repository for this personnel.")) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const record: DataEntryRecord = {
      id: Date.now().toString(), domain,
      basicInfo: { ...basicInfo },
      attendance1: att1, attendance2: att2, practical1: prac1, practical2: prac2,
      communityOutreach1: outreach, examinations1: exams, sports, qualifications,
      academicAchievements: { researchPapers: achievements.researchPapers, workshops: achievements.workshops, booksWritten: achievements.booksWritten, educationalApps: achievements.apps },
      adminWork: { academicContribution: adminWorks.contribution, mentor: adminWorks.mentor, coCurricular: adminWorks.coCurricular, examination: adminWorks.examContr },
      evaluation: { practicalFiles: evalData.practicalFiles, ctScripts: evalData.ctScripts, yearlyScripts: evalData.yearlyScripts, assignments: evalData.assignments, studentRegisters: evalData.studentRegisters, facultyRegisters: evalData.facultyRegisters },
      technicalAchievements: ntTechnical, otherResponsibilities: ntResponsibilities
    };

    addDataRecord(record);
    localStorage.removeItem('soetr_admin_entry_draft');
    setIsSaving(false);
    alert("Database Synchronized Successfully.");
    navigate('/admin-dashboard');
  };

  const inputCls = "mt-1 block w-full border-2 border-black p-3 font-black uppercase focus:ring-4 focus:ring-kku-gold/20 outline-none rounded-2xl text-sm bg-white shadow-sm transition-all";
  const labelCls = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1";
  const sectionTitle = (t: string) => <h2 className="text-2xl font-black uppercase mb-10 border-l-8 border-kku-gold pl-6 text-kku-blue mt-20 tracking-widest">{t}</h2>;

  const MasterFormContent = () => (
    <div className="space-y-12 p-4">
      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2 mb-4"><span className="text-[10px] font-black text-kku-gold uppercase tracking-widest">Section I: Particulars</span></div>
          <div><label className={labelCls}>Enrollment No</label><div className="font-black text-lg text-kku-blue uppercase">{basicInfo.enrollmentNo || 'N/A'}</div></div>
          <div><label className={labelCls}>Name</label><div className="font-black text-lg text-kku-blue uppercase">{basicInfo.name || 'N/A'}</div></div>
          <div><label className={labelCls}>Programme</label><div className="font-black text-lg text-kku-blue uppercase">{basicInfo.programme}</div></div>
          <div><label className={labelCls}>Session</label><div className="font-black text-lg text-kku-blue uppercase">{basicInfo.session}</div></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-32 h-44 border-2 border-black overflow-hidden bg-gray-50 shadow-xl mb-4">
             {basicInfo.photoUrl ? <img src={basicInfo.photoUrl} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[10px] font-black text-gray-200">PHOTO</div>}
          </div>
          <div className="text-center"><label className={labelCls}>Security Clearance</label><div className="bg-kku-blue text-white px-6 py-1 rounded-full font-black uppercase text-[10px]">{domain}</div></div>
        </div>
      </div>
      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200">
         <h4 className="font-black uppercase text-[11px] mb-4 text-gray-400 tracking-widest">Statistical Overview</h4>
         <p className="text-xs text-justify leading-relaxed italic text-gray-600">Generated for institutional audit purposes. This document contains full academic and co-curricular metrics registered in the K.K. University SOETR Master Hub.</p>
      </div>
    </div>
  );

  if (isPrintMode) {
    return (
      <A4FormWrapper title="Official Personnel Archive Record" pages={[{ title: "Master Hub Entry artifact", content: <MasterFormContent />, refNo: `ADM/${Date.now()}` }]}>
        <button onClick={() => setIsPrintMode(false)} className="no-print fixed bottom-10 right-10 bg-kku-blue text-white px-10 py-4 rounded-3xl font-black uppercase text-xs shadow-2xl border-4 border-white hover:bg-black transition-all">Exit Print Portal</button>
      </A4FormWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-12 font-sans no-print">
      <div className="max-w-7xl mx-auto bg-white border-2 border-black shadow-[40px_40px_0_rgba(0,31,63,1)] rounded-[5rem] overflow-hidden">
        
        {/* Gateway Header */}
        <div className="bg-kku-blue text-white p-12 md:p-20 border-b-8 border-kku-gold flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full -mr-64 -mt-64 blur-[100px]"></div>
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter leading-none">Master Hub</h1>
            <p className="text-kku-gold font-bold uppercase text-[12px] mt-6 tracking-[0.4em] bg-white/10 px-8 py-2 rounded-full inline-block">Official Institutional Gateway</p>
          </div>
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
             <button onClick={() => setIsPrintMode(true)} className="bg-white/10 border-2 border-white/20 px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-kku-blue transition-all flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
               Print Gateway
             </button>
             <button onClick={saveDraft} className="bg-white/10 border-2 border-white/20 px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-kku-gold hover:text-kku-blue transition-all flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
               Save Draft
             </button>
             <button onClick={() => navigate('/admin-dashboard')} className="bg-red-700/80 border-2 border-white/20 px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Close Entry</button>
          </div>
        </div>

        <div className="p-8 md:p-24 space-y-16">
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border-l-8 border-red-700 p-10 rounded-[3rem] shadow-xl animate-fadeIn">
              <h3 className="text-red-700 font-black uppercase text-sm mb-4 tracking-widest flex items-center gap-2">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                 Audit Failures Detected:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {validationErrors.map((err, i) => <li key={i} className="text-red-900 font-bold uppercase text-[11px] list-disc ml-6">{err}</li>)}
              </ul>
            </div>
          )}

          <div className="bg-gray-50/50 p-12 rounded-[4rem] border-2 border-black/5 shadow-inner">
            <label className={labelCls}>Primary Clearance Domain</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {Object.values(PersonDomain).map(d => (
                <button key={d} onClick={() => setDomain(d)} className={`py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] border-2 transition-all shadow-xl ${domain === d ? 'bg-kku-blue text-white border-kku-gold scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-kku-blue'}`}>{d}</button>
              ))}
            </div>
          </div>

          {sectionTitle("Section A: Basic Identity Archive")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 items-start">
            <div className="space-y-6">
              <div><label className={labelCls}>Enrollment No (Admission ID)</label><input value={basicInfo.enrollmentNo} onChange={e => setBasicInfo({...basicInfo, enrollmentNo: e.target.value})} className={inputCls} placeholder="KKU/SOETR/..." /></div>
              <div><label className={labelCls}>Full Legal Name</label><input value={basicInfo.name} onChange={e => setBasicInfo({...basicInfo, name: e.target.value})} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelCls}>Father's Name</label><input value={basicInfo.fatherName} onChange={e => setBasicInfo({...basicInfo, fatherName: e.target.value})} className={inputCls} /></div>
                <div><label className={labelCls}>Mother's Name</label><input value={basicInfo.motherName} onChange={e => setBasicInfo({...basicInfo, motherName: e.target.value})} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelCls}>Programme</label><select value={basicInfo.programme} onChange={e => setBasicInfo({...basicInfo, programme: e.target.value})} className={inputCls}>{PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label className={labelCls}>Session</label><select value={basicInfo.session} onChange={e => setBasicInfo({...basicInfo, session: e.target.value})} className={inputCls}>{SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
            </div>
            <div className="space-y-6">
               <div className="flex flex-col items-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] relative shadow-inner group transition-colors hover:border-kku-blue/30">
                  <div className="w-40 h-52 border-4 border-black overflow-hidden bg-white shadow-2xl relative transition-transform group-hover:scale-105">
                    {basicInfo.photoUrl ? <img src={basicInfo.photoUrl} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[10px] font-black text-gray-200 uppercase tracking-widest leading-tight">Portrait Identity<br/>(4 x 6 cm)</div>}
                    <input type="file" onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  </div>
                  <p className="mt-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Institutional Digital Asset</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div><label className={labelCls}>Mobile No</label><input value={basicInfo.contact1} onChange={e => setBasicInfo({...basicInfo, contact1: e.target.value})} className={inputCls} /></div>
                  <div><label className={labelCls}>WhatsApp ID</label><input value={basicInfo.whatsapp} onChange={e => setBasicInfo({...basicInfo, whatsapp: e.target.value})} className={inputCls} /></div>
               </div>
               <div><label className={labelCls}>Official Email ID</label><input type="email" value={basicInfo.email} onChange={e => setBasicInfo({...basicInfo, email: e.target.value})} className={inputCls} /></div>
               <div><label className={labelCls}>Postal Record Address</label><textarea value={basicInfo.address} onChange={e => setBasicInfo({...basicInfo, address: e.target.value})} className={`${inputCls} h-32 normal-case rounded-[2.5rem]`} /></div>
            </div>
          </div>

          {domain === PersonDomain.STUDENT && (
            <>
              {sectionTitle("Section B: Attendance Synchronization")}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 {['First Year Cycle', 'Second Year Cycle'].map((label, yIdx) => (
                   <div key={label} className="bg-white border-2 border-black p-8 rounded-[3rem] shadow-xl">
                     <h4 className="font-black uppercase text-xs mb-6 text-kku-gold tracking-[0.3em] flex items-center gap-3"><span className="w-2 h-2 bg-kku-gold rounded-full"></span> {label} (AUG - JUL)</h4>
                     <table className="w-full border-2 border-black text-[10px] font-black uppercase overflow-hidden rounded-xl shadow-lg">
                       <thead className="bg-kku-blue text-white"><tr><th className="p-4 border-r border-white/20">Month</th><th className="p-4 border-r border-white/20">W-Days</th><th className="p-4 border-r border-white/20">Presence</th><th className="p-4">%</th></tr></thead>
                       <tbody>
                         {(yIdx === 0 ? att1 : att2).map((m, i) => (
                           <tr key={m.month} className="border-b border-black/10 hover:bg-gray-50 transition-colors">
                             <td className="p-4 bg-gray-50 border-r border-black/10">{m.month}</td>
                             <td className="p-4 text-center border-r border-black/10">{m.workingDays}</td>
                             <td className="p-0 border-r border-black/10"><input type="number" value={m.presentDays} onChange={e => { const arr = yIdx === 0 ? [...att1] : [...att2]; const val = Math.min(Number(e.target.value), m.workingDays); arr[i].presentDays = val; arr[i].percentage = Math.round((val / m.workingDays) * 100); yIdx === 0 ? setAtt1(arr) : setAtt2(arr); }} className="w-full h-full p-4 text-center font-black outline-none bg-blue-50/20" /></td>
                             <td className="p-4 text-center text-kku-blue font-black">{m.percentage}%</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 ))}
              </div>

              {sectionTitle("Section C: Practical Training Repositories")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {[1, 2].map(year => (
                   <div key={year} className="bg-gray-50 p-12 rounded-[4rem] border-2 border-black shadow-inner">
                     <h4 className="font-black uppercase text-[12px] mb-8 tracking-[0.25em] text-gray-500 border-b border-gray-200 pb-4">Year {year} Practical Compliance</h4>
                     <div className="space-y-5">
                       {(year === 1 ? prac1 : prac2).map((p, i) => (
                         <div key={p.name} className="flex justify-between items-center p-5 bg-white border-2 border-black/5 rounded-3xl shadow-sm hover:border-kku-blue/30 transition-colors">
                           <span className="font-black uppercase text-[11px] tracking-tight">{p.name}</span>
                           <select value={p.submitted} onChange={e => { const arr = year === 1 ? [...prac1] : [...prac2]; arr[i].submitted = e.target.value as any; year === 1 ? setPrac1(arr) : setPrac2(arr); }} className="px-6 py-2.5 rounded-2xl border-2 border-black font-black uppercase text-[10px] outline-none shadow-md focus:ring-4 focus:ring-kku-gold/10">
                             <option>Submitted</option><option>Not Submitted</option>
                           </select>
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
              </div>

              {sectionTitle("Section G: Institutional Examination Matrix")}
              <div className="bg-white border-2 border-black p-12 rounded-[4rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10">
                 {exams.map((ex, i) => (
                   <div key={ex.name} className="flex items-center justify-between border-b-2 border-gray-50 pb-6">
                     <span className="font-black uppercase text-[12px] tracking-[0.1em] text-kku-blue">{ex.name} Status</span>
                     <select value={ex.status} onChange={e => { const n = [...exams]; n[i].status = e.target.value as any; setExams(n); }} className="px-8 py-3 rounded-2xl border-2 border-black font-black uppercase text-[11px] outline-none shadow-lg focus:ring-4 focus:ring-kku-gold/20">
                       {['Present', 'Absent', 'Filled', 'Not Filled', 'Pass', 'Failed'].map(o => <option key={o}>{o}</option>)}
                     </select>
                   </div>
                 ))}
              </div>
            </>
          )}

          {domain === PersonDomain.FACULTY && (
             <>
               {sectionTitle("Section B: Qualification Matrix")}
               <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {qualifications.map((q, i) => (
                    <div key={q.name} className="p-6 bg-white border-2 border-black rounded-3xl flex justify-between items-center shadow-md">
                      <span className="font-black uppercase text-xs">{q.name} Holder</span>
                      <select value={q.status} onChange={e => { const n = [...qualifications]; n[i].status = e.target.value as any; setQualifications(n); }} className="p-2 border-2 border-black rounded-xl font-black uppercase text-[10px]">
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                  ))}
               </div>

               {sectionTitle("Section C: Academic Achievement Log")}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  <div><label className={labelCls}>Research Papers</label><input type="number" value={achievements.researchPapers} onChange={e => setAchievements({...achievements, researchPapers: e.target.value})} className={inputCls} /></div>
                  <div><label className={labelCls}>Workshops Attended</label><input type="number" value={achievements.workshops} onChange={e => setAchievements({...achievements, workshops: e.target.value})} className={inputCls} /></div>
                  <div><label className={labelCls}>Books Published</label><input type="number" value={achievements.booksWritten} onChange={e => setAchievements({...achievements, booksWritten: e.target.value})} className={inputCls} /></div>
                  <div><label className={labelCls}>Educational Apps</label><input type="number" value={achievements.apps} onChange={e => setAchievements({...achievements, apps: e.target.value})} className={inputCls} /></div>
               </div>
             </>
          )}

          {domain === PersonDomain.NON_TEACHING && (
            <>
               {sectionTitle("Section B: Qualification Records")}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {ntQuals.map((q, i) => (
                    <div key={q.name} className="flex justify-between items-center p-6 bg-white border-2 border-black rounded-3xl">
                       <span className="font-black uppercase text-xs">{q.name}</span>
                       <select value={q.status} onChange={e => { const n = [...ntQuals]; n[i].status = e.target.value as any; setNtQuals(n); }} className="p-2 border-2 border-black rounded-xl font-black text-[10px]">
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                  ))}
               </div>

               {sectionTitle("Section D: Operational Responsibilities")}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {ntResponsibilities.map((r, i) => (
                    <div key={r.name} className="flex justify-between items-center p-6 bg-white border-2 border-black rounded-3xl">
                       <span className="font-black uppercase text-xs">{r.name}</span>
                       <select value={r.status} onChange={e => { const n = [...ntResponsibilities]; n[i].status = e.target.value as any; setNtResponsibilities(n); }} className="p-2 border-2 border-black rounded-xl font-black text-[10px]">
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                  ))}
               </div>
            </>
          )}

          <div className="mt-32 pt-20 border-t-8 border-kku-blue flex flex-col items-center gap-10 pb-40">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full max-w-4xl py-12 bg-green-700 text-white rounded-[4rem] font-black uppercase tracking-[0.4em] shadow-[0_30px_100px_rgba(21,128,61,0.4)] border-4 border-white hover:bg-black transition-all transform active:scale-95 text-2xl flex items-center justify-center gap-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving && <div className="w-10 h-10 border-8 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {isSaving ? 'Synchronizing Archive...' : 'Verify & Synchronize Record'}
            </button>
            <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.25em] text-center max-w-2xl leading-relaxed italic">By finalizing, you acknowledge the accuracy of all particulars for institutional governance audits.</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
