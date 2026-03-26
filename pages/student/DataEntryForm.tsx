import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentFormData, EducationalDetail, DataEntryRecord, PersonDomain } from '../../types';
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
  // 🔑 Brought in secureStudentSubmission instead of addSubmission
  const { secureStudentSubmission, generateRefNo } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 🔑 Added dob to the state
  const [formData, setFormData] = useState<Partial<StudentFormData & { dob: string }>>({
    name: '',
    fatherName: '',
    motherName: '',
    enrollmentNo: '',
    dob: '', 
    programme: 'B.Ed.',
    session: '',
    year: '',
    semester: '',
    mobile: '',
    whatsapp: '',
    email: '',
    address: '',
    pinCode: '',
    city: '',
    state: '',
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

  // --- PIN CODE AUTO-DETECT LOGIC ---
  useEffect(() => {
    const fetchLocationData = async () => {
      if (formData.pinCode && formData.pinCode.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pinCode}`);
          const data = await response.json();

          if (data[0].Status === "Success") {
            const location = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: location.District,
              state: location.State
            }));
          } else {
            console.warn("Invalid PIN Code entered");
            setFormData(prev => ({ ...prev, city: '', state: '' }));
          }
        } catch (error) {
          console.error("Failed to fetch PIN code data", error);
        }
      } else if (formData.pinCode && formData.pinCode.length < 6) {
         setFormData(prev => ({ ...prev, city: '', state: '' }));
      }
    };

    fetchLocationData();
  }, [formData.pinCode]);

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
    
    // 🔑 STRICT VALIDATION: Every single field is compulsory
    if (!formData.name || !formData.fatherName || !formData.motherName || !formData.enrollmentNo || !formData.dob || !formData.mobile || !formData.email || !formData.address || !formData.pinCode || !formData.photoUrl) {
      alert("Institutional Mandate: All fields, including your Date of Birth and Photo, are completely mandatory. Please fill in all empty fields.");
      return;
    }

    if (!window.confirm("Verify Digital Registry? Once submitted, your records will be permanently locked and synchronized with the master SOETR database.")) return;

    setIsSaving(true);
    
    // Construct the Master Record exactly as the database expects it
    const secureRecord: DataEntryRecord = {
      id: '', // The backend will inject the correct ID automatically
      domain: PersonDomain.STUDENT,
      isFullySubmitted: true,
      basicInfo: {
        enrollmentNo: formData.enrollmentNo,
        dob: formData.dob,
        name: formData.name,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        programme: formData.programme || '',
        session: formData.session || '',
        year: formData.year || '',
        semester: formData.semester || '',
        contact1: formData.mobile,
        whatsapp: formData.whatsapp || formData.mobile,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
        pinCode: formData.pinCode,
        photoUrl: formData.photoUrl,
        eduDetails: formData.eduDetails || []
      },
      // Empty arrays to satisfy the record structure
      attendance1: [], attendance2: [], practical1: [], practical2: [],
      communityOutreach1: [], examinations1: [], sports: [], qualifications: [],
      academicAchievements: {} as any, adminWork: {} as any, evaluation: {} as any,
      technicalAchievements: {} as any, otherResponsibilities: []
    };

    // 🔑 THE HANDSHAKE: Call the secure submission
    const result = await secureStudentSubmission(formData.enrollmentNo, formData.dob, secureRecord);

    setIsSaving(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      // This will alert them if the DOB is wrong or if they are already locked!
      alert(result.message); 
    }
  };

  const downloadWord = () => {
    // We construct an HTML string so Word can render styles and the massive watermark!
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Registry Record</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="position: relative; max-width: 800px; margin: 0 auto; border: 3px solid #001F3F; padding: 40px; background: #fff; overflow: hidden;">
          
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; z-index: 0; opacity: 0.10; text-align: center; pointer-events: none;">
             <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/K.K._University_logo.png/220px-K.K._University_logo.png" style="width: 100%; height: auto; object-fit: contain;" alt="Watermark" />
          </div>

          <div style="position: relative; z-index: 10;">
            <div style="text-align: center; border-bottom: 4px solid #001F3F; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #001F3F; margin: 0; font-size: 26px;">K.K. UNIVERSITY - SOETR</h1>
              <h2 style="margin: 10px 0; font-size: 16px;">DATA ENTRY REGISTRY</h2>
              <p style="font-size: 11px; color: #666; font-weight: bold;">Reference ID: ${currentRefNo}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left; width: 30%;">Name</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold;">${formData.name}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Admission ID</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold;">${formData.enrollmentNo}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Date of Birth</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold;">${formData.dob}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Programme</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold;">${formData.programme} (${formData.session})</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Contact</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold;">${formData.mobile} | ${formData.email}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Address</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold;">${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}</td></tr>
            </table>

            <h3 style="margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px;">Educational Details</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
              <tr><th style="border: 1px solid #000; padding: 5px; background: #f0f0f0;">Programme</th><th style="border: 1px solid #000; padding: 5px; background: #f0f0f0;">Year</th><th style="border: 1px solid #000; padding: 5px; background: #f0f0f0;">Board</th><th style="border: 1px solid #000; padding: 5px; background: #f0f0f0;">Result</th></tr>
              ${formData.eduDetails?.map(edu => {
                if(!edu.year) return '';
                return `<tr><td style="border: 1px solid #000; padding: 5px;">${edu.programme}</td><td style="border: 1px solid #000; padding: 5px;">${edu.year}</td><td style="border: 1px solid #000; padding: 5px;">${edu.board}</td><td style="border: 1px solid #000; padding: 5px;">${edu.result}%</td></tr>`;
              }).join('')}
            </table>
          </div>
        </div>
      </body>
      </html>
    `;

    // \ufeff is the BOM (Byte Order Mark) that forces Word to read it as UTF-8
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
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
      
      {/* --- NEW BACK TO HOME BUTTON --- */}
      <div className="w-full max-w-full md:max-w-[210mm] flex justify-start mb-4 px-4 md:px-0 no-print">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#001F3F] font-black uppercase text-[10px] tracking-widest hover:text-kku-gold transition-colors bg-white px-5 py-2.5 rounded-full shadow-md border-2 border-black/5 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Return to Institutional Hub
        </button>
      </div>

      {/* High-Impact Digital Form Container */}
      <div className="bg-white shadow-2xl border-[1.5mm] border-[#001F3F] p-4 md:p-[10mm] w-full max-w-full md:max-w-[210mm] min-h-[297mm] box-border relative overflow-hidden">
      {/* --- OFFICIAL PNG BACKGROUND WATERMARK --- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <img 
            src="../components/logo.jpg" 
            alt="University Watermark"
            className="w-full max-w-[85%] object-contain opacity-30" 
          />
        </div>
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

        <div className="h-[2mm] bg-[#001F3F] w-full mb-10 shadow-sm"></div>

        <form onSubmit={handleVerifyAndSave} className="space-y-12">
          {/* Section A: Basic Information */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#001F3F] text-white px-5 py-1 text-[11pt] font-black uppercase tracking-widest shadow-lg">Section : A</div>
              <h3 className="text-[16pt] font-black uppercase underline tracking-[0.1em] text-kku-blue">Basic Information</h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 grid grid-cols-1 gap-6">
                <div><label className={labelCls}>Name of Candidate</label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="ENTER FULL LEGAL NAME" /></div>
                <div><label className={labelCls}>Father's Name</label><input required value={formData.fatherName || ''} onChange={e => setFormData({...formData, fatherName: e.target.value})} className={inputCls} placeholder="ENTER FATHER'S NAME" /></div>
                <div><label className={labelCls}>Mother's Name</label><input required value={formData.motherName || ''} onChange={e => setFormData({...formData, motherName: e.target.value})} className={inputCls} placeholder="ENTER MOTHER'S NAME" /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                  <div><label className={labelCls}>Student Admission ID</label><input required value={formData.enrollmentNo || ''} onChange={e => setFormData({...formData, enrollmentNo: e.target.value})} className={inputCls} placeholder="KKU/SOETR/XXXX" /></div>
                  {/* 🔑 THE CALENDAR DATE OF BIRTH INPUT */}
                  <div><label className={labelCls}>Date of Birth (Security Key)</label><input type="date" required value={formData.dob || ''} onChange={e => setFormData({...formData, dob: e.target.value})} className={inputCls} /></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
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
               
               <div className="md:col-span-2 grid grid-cols-3 gap-4">
                 <div>
                   <label className={labelCls}>Pin Code</label>
                   <input required maxLength={6} value={formData.pinCode || ''} onChange={e => setFormData({...formData, pinCode: e.target.value.replace(/\D/g, '')})} className={inputCls} placeholder="6-DIGIT PIN" />
                 </div>
                 <div>
                   <label className={labelCls}>City / District</label>
                   <input readOnly value={formData.city || ''} className={`${inputCls} bg-gray-100 cursor-not-allowed text-gray-500`} placeholder="AUTO-DETECT" />
                 </div>
                 <div>
                   <label className={labelCls}>State</label>
                   <input readOnly value={formData.state || ''} className={`${inputCls} bg-gray-100 cursor-not-allowed text-gray-500`} placeholder="AUTO-DETECT" />
                 </div>
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
                            required={idx < 2} // At least 10th and 12th are required!
                            value={edu.year} 
                            onChange={e => handleEduChange(idx, 'year', e.target.value)} 
                            className="w-full p-1.5 text-center font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="YYYY"
                          />
                        </td>
                        <td className="p-2 border-r border-black/5">
                          <input 
                            required={idx < 2}
                            value={edu.subject} 
                            onChange={e => handleEduChange(idx, 'subject', e.target.value)} 
                            className="w-full p-1.5 font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="STREAM"
                          />
                        </td>
                        <td className="p-2 border-r border-black/5">
                          <input 
                            required={idx < 2}
                            value={edu.board} 
                            onChange={e => handleEduChange(idx, 'board', e.target.value)} 
                            className="w-full p-1.5 font-black bg-transparent border-b border-black/10 outline-none focus:border-kku-blue" 
                            placeholder="BOARD NAME"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            required={idx < 2}
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
                   Verify & Lock Registry
                   <svg className="w-8 h-8 transition-transform group-hover:translate-x-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                 </>
               )}
             </button>
             <p className="mt-10 text-[9pt] font-black uppercase text-gray-400 tracking-widest italic text-center max-w-2xl leading-relaxed opacity-100">System Verification: Upon clicking, your particulars will be assigned Reference ID {currentRefNo} and locked in the Super Admin Secure Archive. You will not be able to modify these details again.</p>
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