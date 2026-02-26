
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentFormData } from '../../types';
import { 
  MOCK_CURRICULUM, 
  PROGRAMMES, 
  EXAM_MONTHS, 
  EXAM_YEARS, 
  EXAM_NATURES, 
  getSessionsForProgramme, 
  getYearsForProgramme, 
  getSemestersForProgramme,
  isSemesterSystem 
} from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { A4FormWrapper } from '../../components/A4FormWrapper';
import { BasicInfoSection, validateBasicInfo } from '../../components/forms/BasicInfoSection';

type FormView = 'entry' | 'verify' | 'success';

export const ExamForm: React.FC = () => {
  const navigate = useNavigate();
  const { addSubmission, generateRefNo } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');
  const [view, setView] = useState<FormView>('entry');
  const [isSaving, setIsSaving] = useState(false);
  const [isAligning, setIsAligning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    programme: 'B.Ed.',
    session: '2024-2026',
    year: 'First Year',
    semester: 'First Semester',
    examNature: 'Annual Examination',
    examMonth: 'January',
    examYear: '2025',
    formDate: new Date().toISOString().split('T')[0],
    enrollmentNo: '',
    name: '',
    fatherName: '',
    motherName: '',
    email: '',
    mobile: '',
    whatsapp: '',
    address: '',
    photoUrl: '',
    studentSignatureUrl: ''
  });

  const [selectedElectives, setSelectedElectives] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    setCurrentRefNo(generateRefNo());
  }, []);

  // Use updated isSemesterSystem logic from constants
  const isSemSystem = useMemo(() => {
    return isSemesterSystem(formData.programme || '', formData.session || '');
  }, [formData.programme, formData.session]);

  // Curricular Reset: Wipe electives when course structure changes
  useEffect(() => {
    setSelectedElectives({});
    setIsAligning(true);
    const timer = setTimeout(() => setIsAligning(false), 400);
    return () => clearTimeout(timer);
  }, [formData.programme, formData.session, formData.year, formData.semester]);

  useEffect(() => {
    const sessions = getSessionsForProgramme(formData.programme || '');
    setFormData(prev => ({ ...prev, session: sessions[0] }));
  }, [formData.programme]);

  useEffect(() => {
    const years = getYearsForProgramme(formData.programme || '');
    const sems = getSemestersForProgramme(formData.programme || '');
    setFormData(prev => ({ 
      ...prev, 
      year: years.includes(prev.year!) ? prev.year : years[0],
      semester: sems.includes(prev.semester!) ? prev.semester : sems[0],
      examNature: isSemSystem ? 'Odd Semester Examination' : 'Annual Examination'
    }));
  }, [formData.programme, formData.session, isSemSystem]);

  const availableSessions = useMemo(() => getSessionsForProgramme(formData.programme || ''), [formData.programme]);
  const availableYears = useMemo(() => getYearsForProgramme(formData.programme || ''), [formData.programme]);
  const availableSemesters = useMemo(() => getSemestersForProgramme(formData.programme || ''), [formData.programme]);

  const currentSubjects = useMemo(() => {
    if (!formData.programme || !formData.session || !formData.year) return [];
    
    const progData = MOCK_CURRICULUM[formData.programme!];
    if (!progData) return [];

    let sessionKey = formData.session || "";
    // Handle "All" session logic for M.Ed/DElEd if needed, or stick to provided structure
    if (formData.programme === "M.Ed." || formData.programme === "D.El.Ed.") {
      sessionKey = "All";
    }

    const sessionData = progData[sessionKey];
    if (!sessionData) return [];

    const lookupKey = !isSemSystem ? formData.year! : formData.semester!;
    return sessionData[lookupKey] || [];
  }, [formData.programme, formData.session, formData.year, formData.semester, isSemSystem]);

  const handleElectiveChange = (code: string, value: string, isMulti: boolean) => {
    if (isMulti) {
      const current = (selectedElectives[code] as string[]) || [];
      if (current.includes(value)) {
        setSelectedElectives({ ...selectedElectives, [code]: current.filter(v => v !== value) });
      } else {
        const max = currentSubjects.find(s => s.code === code)?.maxSelection || 2;
        if (current.length < max) {
          setSelectedElectives({ ...selectedElectives, [code]: [...current, value] });
        }
      }
    } else {
      setSelectedElectives({ ...selectedElectives, [code]: value });
    }
  };

  const handleInitialVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBasicInfo(formData);
    if (!formData.address?.trim()) validationErrors.push("Audit Alert: Correspondence address is mandatory.");
    if (!formData.studentSignatureUrl) validationErrors.push("Identity Alert: Digital signature artifact is mandatory.");
    
    currentSubjects.forEach((s: any) => {
      if (s.isElective) {
        const val = selectedElectives[s.code];
        if (!val || (Array.isArray(val) && val.length < (s.maxSelection || 1))) {
          validationErrors.push(`Curricular Error: Choice selection pending for ${s.name}.`);
        }
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors([]);
    setView('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const processedSubjects = currentSubjects.map((s: any) => ({
      ...s,
      selectedTitle: s.isElective 
        ? (Array.isArray(selectedElectives[s.code]) 
          ? (selectedElectives[s.code] as string[]).join(' & ') 
          : selectedElectives[s.code])
        : s.name
    }));

    addSubmission({ 
      id: currentRefNo, 
      date: new Date().toLocaleDateString(), 
      enrollmentNo: formData.enrollmentNo || '', 
      name: formData.name || '', 
      programme: formData.programme || '', 
      formType: 'Exam Form',
      data: { ...formData, subjects: processedSubjects, refNo: currentRefNo }
    });
    setIsSaving(false);
    setView('success');
  };

  const ExamPage1Content = () => (
    <div className="space-y-6 text-[10.5pt] font-serif p-2">
      <div className="bg-gray-100 border-2 border-black p-5 rounded-2xl mb-4">
        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
          <div><label className="text-[8pt] font-black uppercase text-gray-500 block">Examination Nature</label><div className="font-black text-kku-blue uppercase text-[11pt]">{formData.examNature}</div></div>
          <div><label className="text-[8pt] font-black uppercase text-gray-500 block">Academic Session</label><div className="font-black text-kku-blue uppercase text-[11pt]">{formData.session}</div></div>
          <div><label className="text-[8pt] font-black uppercase text-gray-500 block">Exam Cycle</label><div className="font-black text-black uppercase text-[11pt]">{formData.examMonth} {formData.examYear}</div></div>
          <div><label className="text-[8pt] font-black uppercase text-gray-500 block">Academic Track</label><div className="font-black text-black uppercase text-[11pt]">{formData.year} {isSemSystem && `| ${formData.semester}`}</div></div>
        </div>
      </div>
      <BasicInfoSection data={formData} onChange={() => {}} printMode />
      <div className="mt-8">
        <h4 className="font-black uppercase text-[9pt] text-gray-400 tracking-widest border-b border-black/10 pb-1 mb-3">Residential Correspondence Address</h4>
        <div className="p-5 border-2 border-black bg-gray-50 text-[11pt] uppercase font-black leading-relaxed min-h-[100px]">{formData.address}</div>
      </div>
    </div>
  );

  const ExamPage2Content = () => (
    <div className="space-y-8 text-[10.5pt] font-serif p-2">
      <h4 className="font-black uppercase text-center bg-kku-blue text-white py-2 border-2 border-black mb-4 text-[10pt] tracking-[0.2em]">OFFICIAL COURSE ALIGNMENT MATRIX</h4>
      <table className="w-full border-collapse border-2 border-black text-[8.5pt]">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-2 border-black p-1.5 uppercase">S.N.</th>
            <th className="border-2 border-black p-1.5 uppercase">Type</th>
            <th className="border-2 border-black p-1.5 uppercase">Code</th>
            <th className="border-2 border-black p-1.5 uppercase text-left pl-3">Subject Title</th>
            <th className="border-2 border-black p-1.5 uppercase">I.E.</th>
            <th className="border-2 border-black p-1.5 uppercase">E.E.</th>
            <th className="border-2 border-black p-1.5 uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentSubjects.map((s: any, i: number) => {
            const displayTitle = s.isElective 
              ? (Array.isArray(selectedElectives[s.code]) ? (selectedElectives[s.code] as string[]).join(' & ') : selectedElectives[s.code] || 'PENDING SELECTION')
              : s.name;
            return (
              <tr key={i}>
                <td className="border-2 border-black p-1 text-center font-bold">{i + 1}</td>
                <td className="border-2 border-black p-1 text-center font-black text-[7.5pt]">{s.type}</td>
                <td className="border-2 border-black p-1 text-center font-bold text-[8pt]">{s.code}</td>
                <td className="border-2 border-black p-1.5 uppercase font-black text-[9.5pt] leading-tight">
                  {s.isElective && <span className="text-[7pt] text-kku-gold block mb-0.5 tracking-tighter">CHOICE ALIGNED:</span>}
                  {displayTitle}
                </td>
                <td className="border-2 border-black p-1 text-center">{s.ie || '0'}</td>
                <td className="border-2 border-black p-1 text-center">{s.ee || '0'}</td>
                <td className="border-2 border-black p-1 text-center font-black">{s.mm}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={6} className="border-2 border-black p-2 text-right font-black uppercase text-[8pt] pr-6 tracking-widest">Cumulative Marks Aggregate</td>
            <td className="border-2 border-black p-2 text-center font-black text-kku-blue text-[11pt]">{currentSubjects.reduce((acc: number, curr: any) => acc + (curr.mm || 0), 0)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="grid grid-cols-1 gap-12 mt-12">
        <div className="flex justify-between items-end border-b border-black/10 pb-6">
          <div className="flex flex-col"><span className="text-[8pt] font-black uppercase text-gray-400 mb-1">Date of Submission</span><div className="text-[11pt] font-black border-b-2 border-black w-44 text-center">{formData.formDate}</div></div>
          <div className="flex flex-col items-center">
            <div className="w-56 h-14 border-2 border-dashed border-black/20 flex items-center justify-center overflow-hidden bg-white mb-1">
              {formData.studentSignatureUrl && <img src={formData.studentSignatureUrl} className="h-full object-contain" />}
            </div>
            <span className="text-[8pt] font-black uppercase text-kku-blue tracking-tighter">Digital Student Seal</span>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col"><span className="text-[8pt] font-black uppercase text-gray-400 mb-1">Validation Hub Signature</span><div className="text-[11pt] font-black border-b-2 border-black w-44 text-center">___/___/_____</div></div>
          <div className="flex flex-col items-center"><div className="w-56 h-12 border-b-2 border-black italic text-gray-200 mb-1 text-center">(Authorized Seal)</div><span className="text-[8pt] font-black uppercase text-kku-blue tracking-tighter">Verified: Dean (SOETR)</span></div>
        </div>
      </div>
    </div>
  );

  if (view === 'verify' || view === 'success') {
    return (
      <div className="min-h-screen bg-gray-200 py-10 flex flex-col items-center px-4 animate-fadeIn">
        {view === 'verify' && (
          <div className="w-full max-w-[210mm] mb-8 flex justify-between items-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-kku-gold sticky top-4 z-50">
             <div><h3 className="text-2xl font-black uppercase text-kku-blue">Verify Artifact Content</h3><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Confirm curricular alignment and identity particulars</p></div>
             <div className="flex gap-4"><button onClick={() => setView('entry')} className="bg-gray-100 text-black px-8 py-3 rounded-2xl font-black uppercase text-xs border-2 border-black hover:bg-black hover:text-white transition">Modify</button><button onClick={handleFinalSubmit} disabled={isSaving} className="bg-green-700 text-white px-10 py-3 rounded-2xl font-black uppercase text-xs border-2 border-white shadow-xl hover:bg-black transition flex items-center gap-4">{isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Register Data'}</button></div>
          </div>
        )}
        {view === 'success' && (
          <div className="w-full max-w-[210mm] mb-8 flex flex-col md:flex-row justify-between items-center bg-green-700 text-white p-10 rounded-[3rem] shadow-2xl border-4 border-white sticky top-4 z-50">
             <div className="text-center md:text-left"><h3 className="text-4xl font-serif font-black uppercase">Archive Synchronized</h3><p className="text-green-100 font-bold uppercase text-[11px] tracking-[0.4em] mt-2">SECURE ID: {currentRefNo}</p></div>
             <div className="flex gap-4 mt-6 md:mt-0"><button onClick={() => window.print()} className="bg-white text-green-800 px-10 py-4 rounded-3xl font-black uppercase text-xs shadow-xl border-2 border-green-800 flex items-center gap-3"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4 4V4" /></svg> Download PDF Artifact</button><button onClick={() => navigate('/')} className="bg-black/20 text-white border-2 border-white/30 px-8 py-4 rounded-3xl font-black uppercase text-xs hover:bg-white hover:text-green-800 transition">Portal Home</button></div>
          </div>
        )}
        <A4FormWrapper title="Examination Registry Artifact" pages={[{ title: "Official Registry - Form A", content: <ExamPage1Content />, refNo: currentRefNo, copyType: "Office Archive" }, { title: "Course Alignment - Form B", content: <ExamPage2Content />, refNo: currentRefNo, copyType: "Student Archive" }]} />
      </div>
    );
  }

  const labelCls = "block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black rounded-[4rem] shadow-[30px_30px_0_rgba(0,31,63,1)] overflow-hidden">
        <div className="bg-kku-blue text-white p-12 md:p-16 border-b-8 border-kku-gold flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left"><h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter leading-none m-0">Examination</h1><p className="text-kku-gold font-bold uppercase text-[11px] mt-6 tracking-[0.4em] bg-white/10 px-8 py-2 rounded-full inline-block">Official Enrollment Hub</p></div>
          <button onClick={() => navigate('/')} className="relative z-10 bg-white/10 border-2 border-white/20 px-8 py-3 rounded-2xl font-black text-xs uppercase hover:bg-red-700 transition shadow-lg">Cancel Registry</button>
        </div>

        <form onSubmit={handleInitialVerify} className="p-8 md:p-24 space-y-16">
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-8 border-red-700 p-10 rounded-[3rem] shadow-xl animate-fadeIn">
              <h3 className="text-red-700 font-black uppercase text-xs mb-4 tracking-widest">Audit Alerts:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">{errors.map((err, i) => <li key={i} className="text-red-900 font-bold uppercase text-[10px] list-disc ml-6">{err}</li>)}</ul>
            </div>
          )}

          <div className="bg-gray-50/50 p-12 md:p-20 rounded-[4rem] border-2 border-black/5 shadow-inner relative">
             {isAligning && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[4rem] transition-all"><div className="flex flex-col items-center gap-4"><div className="w-10 h-10 border-4 border-kku-blue/30 border-t-kku-blue rounded-full animate-spin"></div><span className="text-[10px] font-black uppercase tracking-[0.3em] text-kku-blue">Syncing Curricular Matrix...</span></div></div>}
             <h2 className="text-3xl font-black uppercase mb-16 border-l-8 border-kku-gold pl-10 text-kku-blue tracking-[0.2em]">Institutional Selection</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div><label className={labelCls}>Academic Programme</label><select value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className="soetr-input">{PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label className={labelCls}>Batch Session</label><select value={formData.session} onChange={e => setFormData({...formData, session: e.target.value})} className="soetr-input">{availableSessions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className={labelCls}>Academic Year</label><select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="soetr-input">{availableYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                {isSemSystem && <div className="animate-fadeIn"><label className={labelCls}>Term / Semester</label><select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="soetr-input">{availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}</select></div>}
                <div><label className={labelCls}>Exam Nature</label><select value={formData.examNature} onChange={e => setFormData({...formData, examNature: e.target.value})} className="soetr-input">{EXAM_NATURES.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Month</label><select value={formData.examMonth} onChange={e => setFormData({...formData, examMonth: e.target.value})} className="soetr-input">{EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                  <div><label className={labelCls}>Year</label><select value={formData.examYear} onChange={e => setFormData({...formData, examYear: e.target.value})} className="soetr-input">{EXAM_YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                </div>
             </div>
          </div>

          <div className="bg-gray-50/50 p-12 md:p-20 rounded-[4rem] border-2 border-black/5 shadow-inner">
             <h2 className="text-3xl font-black uppercase mb-16 border-l-8 border-kku-blue pl-10 text-kku-blue tracking-[0.2em]">Identity Matrix</h2>
             <BasicInfoSection data={formData} onChange={d => setFormData(prev => ({ ...prev, ...d }))} />
             <div className="mt-12 space-y-4"><label className={labelCls}>Residential Address for Correspondence</label><textarea required value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="soetr-input h-32 normal-case rounded-[2.5rem] leading-relaxed p-6" placeholder="FULL POSTAL ADDRESS..." /></div>
          </div>

          <div className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <h3 className="font-black uppercase text-xs text-kku-gold tracking-[0.4em] flex items-center gap-4"><span className="w-4 h-4 bg-kku-gold rounded-full"></span>Course Alignment Matrix</h3>
                <span className="text-[9px] font-black uppercase bg-gray-100 px-4 py-1 rounded-full text-gray-400">Verified NCTE/NCERT Compliant Structure</span>
             </div>
             <div className="divide-y-2 divide-gray-100">
                {currentSubjects.length === 0 ? (
                  <div className="py-20 text-center text-gray-300 font-black uppercase tracking-widest italic bg-gray-50 rounded-3xl">Curricular data pending alignment for selected criteria.</div>
                ) : currentSubjects.map((s: any) => (
                  <div key={s.code} className="py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 group hover:bg-blue-50/30 transition-all px-4 rounded-2xl">
                    <div className="flex-1">
                       <div className="flex items-center gap-4 mb-2"><span className="bg-kku-blue text-white px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">{s.type}</span><span className="font-black uppercase text-lg text-kku-blue group-hover:text-black transition-colors">{s.name}</span></div>
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">{s.code} • Max {s.mm} Marks (Theory: {s.ee} | Internals: {s.ie})</p>
                    </div>
                    {s.isElective ? (
                      <div className="w-full lg:w-96">
                         {s.isMultiSelect ? (
                           <div className="grid grid-cols-1 gap-2">
                             <p className="text-[10px] font-black text-kku-gold uppercase mb-1">Select {s.maxSelection} Options:</p>
                             {s.options.map((opt: string) => {
                               const isSelected = (selectedElectives[s.code] as string[])?.includes(opt);
                               return (
                                 <label key={opt} className={`cursor-pointer px-5 py-2.5 rounded-xl border-2 font-black text-[10px] uppercase transition-all flex items-center justify-between gap-4 ${ isSelected ? 'bg-kku-blue text-white border-kku-blue shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-kku-blue' }`}>
                                   <input type="checkbox" className="hidden" onChange={() => handleElectiveChange(s.code, opt, true)} /> {opt}
                                   {isSelected && <svg className="w-4 h-4 text-kku-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                 </label>
                               );
                             })}
                           </div>
                         ) : (
                           <select required value={selectedElectives[s.code] as string || ''} onChange={e => handleElectiveChange(s.code, e.target.value, false)} className="soetr-input text-[11px] border-kku-gold/40 shadow-lg">
                             <option value="">-- SELECT SPECIALIZATION --</option>
                             {s.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                           </select>
                         )}
                      </div>
                    ) : (
                      <div className="bg-green-50 text-green-700 px-8 py-3 rounded-2xl font-black text-[10px] uppercase border-2 border-green-100 shadow-sm">Foundation Core</div>
                    )}
                  </div>
                ))}
             </div>
          </div>

          <div className="mt-40 pt-20 border-t-8 border-gray-50 flex flex-col items-center">
             <button type="submit" className="w-full max-w-4xl py-14 bg-kku-blue text-white font-black uppercase tracking-[0.5em] border-4 border-white hover:bg-black transition-all shadow-[0_40px_100px_rgba(0,31,63,0.3)] text-3xl rounded-[4rem] flex items-center justify-center gap-10 group">
               Generate official Artifacts
               <svg className="w-10 h-10 transition-transform group-hover:translate-x-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </button>
             <p className="mt-12 text-[12px] font-black uppercase text-gray-400 tracking-widest italic text-center max-w-3xl leading-relaxed">System Verification: Enrollment in official audit log initiates the eligibility sequence for Admit Card issuance.</p>
          </div>
        </form>
      </div>
    </div>
  );
};
