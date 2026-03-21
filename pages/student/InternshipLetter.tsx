import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { A4FormWrapper, A4Page } from '../../components/A4FormWrapper';
import { StudentFormData } from '../../types';
import { 
  BED_MED_SCHOOLS, 
  DELED_INT_SCHOOLS, 
  SchoolMapping, 
  PROGRAMMES, 
  getSessionsForProgramme, 
  getYearsForProgramme, 
  getSemestersForProgramme 
} from '../../constants';
import { useAuth } from '../../context/AuthContext';

const MAX_CAPACITY = 25;

const PreAffixedSign = ({ label, signUrl }: { label: string; signUrl?: string }) => (
  <div className="flex flex-col items-center font-serif opacity-100">
    <div className="w-48 h-10 border-b-[1.5px] border-black flex items-end justify-center pb-1 text-center relative bg-white">
      {signUrl ? (
        <img src={signUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-100" alt="Official Signature" />
      ) : (
        <span className="italic text-gray-400 text-[10pt] font-bold">Authorized Seal</span>
      )}
    </div>
    <span className="text-[8.5pt] font-black text-black uppercase mt-1 text-center whitespace-pre-wrap leading-tight">{label}</span>
  </div>
);

const formatDate = (val: string) => {
  let v = val.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0, 2) + '-' + v.slice(2);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 9);
  return v;
};

export const InternshipLetter: React.FC = () => {
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    programme: 'B.Ed.',
    formDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
  });
  const [enrollmentError, setEnrollmentError] = useState<string>('');
  const { addSubmission, officialSignatures, generateRefNo, getSchoolEnrollmentCount, verifyStudentExists } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');
  const [activeSchoolList, setActiveSchoolList] = useState<SchoolMapping[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentRefNo(generateRefNo());
  }, []);

  useEffect(() => {
    if (formData.programme === "B.Ed." || formData.programme === "M.Ed.") {
      setActiveSchoolList(BED_MED_SCHOOLS);
    } else {
      setActiveSchoolList(DELED_INT_SCHOOLS);
    }
    if (formData.internshipSchool) {
      const list = (formData.programme === "B.Ed." || formData.programme === "M.Ed." ? BED_MED_SCHOOLS : DELED_INT_SCHOOLS);
      const found = list.find(s => s.name === formData.internshipSchool);
      if (!found) setFormData(prev => ({ ...prev, internshipSchool: '', internshipObserver: '' }));
    }
  }, [formData.programme]);

  const availableSessions = getSessionsForProgramme(formData.programme || 'B.Ed.');
  const availableYears = getYearsForProgramme(formData.programme || 'B.Ed.');
  const availableSemesters = getSemestersForProgramme(formData.programme || 'B.Ed.');

  const handleSchoolChange = (schoolName: string) => {
    const mapping = activeSchoolList.find(s => s.name === schoolName);
    const supervisor = mapping ? mapping.supervisors[0] : '';
    setFormData({ ...formData, internshipSchool: schoolName, internshipObserver: supervisor });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: keyof StudentFormData) => {
    if (e.target.files?.[0]) {
      const r = new FileReader();
      r.onload = ev => setFormData(prev => ({ ...prev, [field]: ev.target?.result as string }));
      r.readAsDataURL(e.target.files[0]);
    }
  };

  const validate = (): string[] | null => {
    const errs: string[] = [];
    if (!formData.name) errs.push("Student Name is mandatory.");
    if (!formData.enrollmentNo) errs.push("Admission ID is mandatory.");
    if (!formData.photoUrl) errs.push("Passport Photo is mandatory.");
    if (!formData.studentSignatureUrl) errs.push("Student Signature is mandatory.");
    if (!formData.internshipSchool) errs.push("School selection is mandatory.");
    if (!formData.internshipStartDate || formData.internshipStartDate.length < 10) errs.push("Valid start date required.");
    return errs.length > 0 ? errs : null;
  };

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollmentError(''); // Clear previous errors on new attempt

    const errs = validate();
    if (errs) {
      alert("Missing Requirements:\n\n" + errs.join("\n"));
      return;
    }
    
    // --- NEW: DATABASE VERIFICATION STEP ---
    const isVerified = await verifyStudentExists(formData.enrollmentNo!);
    if (!isVerified) {
      setEnrollmentError('Enrollment No. not found in master registry.');
      return; // Stop the submission completely
    }
    // ---------------------------------------

    const count = getSchoolEnrollmentCount(formData.internshipSchool!);
    if (count >= MAX_CAPACITY) {
      alert(`This school has reached its maximum capacity of ${MAX_CAPACITY} students.`);
      return;
    }

    addSubmission({ 
      id: currentRefNo, 
      date: formData.formDate || new Date().toLocaleDateString('en-GB'), 
      enrollmentNo: formData.enrollmentNo || '', 
      name: formData.name || '', 
      programme: formData.programme || '', 
      session: formData.session || '',
      year: formData.year || '',
      semester: formData.semester || '',
      formType: 'Internship Letter',
      school: formData.internshipSchool,
      data: { ...formData }
    });
    
    alert(`SIP Allocation Verified & Saved to Database! Ref: ${currentRefNo}`);
    window.print();
    setTimeout(() => navigate('/'), 1500);
  };

  const inputCls = "w-full border-[1.5px] border-black bg-transparent text-black font-bold py-1 px-2 text-[10.5pt] outline-none h-[32px] uppercase";
  const labelCls = "block text-[8pt] font-black text-black uppercase tracking-tight mb-0.5 mt-2";

  // FIXED BUG 1: Changed from a React Component to a direct render function to prevent input focus loss.
  const renderFormContent = (isInteractive: boolean) => (
    <div className="font-serif opacity-100 w-full overflow-hidden">
      
      {/* Top Grid Area (Inputs + Photo/Signature) */}
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-4">
        {/* Left Side: Inputs */}
        <div className="flex-[3] min-w-0">
          <div className="w-full">
            <label className={labelCls}>Name of Student (In Block Letters)</label>
            <input readOnly={!isInteractive} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="AS PER MATRICULATION RECORDS" />
          </div>
          
          <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Admission / Enrollment No.</label>
              <input 
                readOnly={!isInteractive} 
                value={formData.enrollmentNo || ''} 
                onChange={e => {
                  setFormData({...formData, enrollmentNo: e.target.value});
                  setEnrollmentError(''); // Clears the red error as soon as they start typing to fix it
                }} 
                className={`${inputCls} ${enrollmentError ? 'border-red-600 bg-red-50' : ''}`} 
              />
              {/* This renders the red error text directly below the box if it fails */}
              {enrollmentError && (
                <p className="text-[9px] font-black text-red-600 uppercase mt-1 animate-pulse tracking-widest">
                  {enrollmentError}
                </p>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Academic Session (YYYY-YYYY)</label>
              {isInteractive ? (
                <select value={formData.session || ''} onChange={e => setFormData({...formData, session: e.target.value})} className={inputCls}>
                  <option value="">-- Choose Session --</option>
                  {availableSessions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : <div className={inputCls}>{formData.session}</div>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Father's Name</label>
              <input readOnly={!isInteractive} value={formData.fatherName || ''} onChange={e => setFormData({...formData, fatherName: e.target.value})} className={inputCls} />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>WhatsApp / Contact No.</label>
              <input readOnly={!isInteractive} value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className={inputCls} />
            </div>
          </div>

          <div className="w-full">
            <label className={labelCls}>Academic Programme / Course</label>
            {isInteractive ? (
              <select value={formData.programme || ''} onChange={e => setFormData({...formData, programme: e.target.value})} className={inputCls}>
                <option value="">-- Select Programme --</option>
                {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            ) : <div className={inputCls}>{formData.programme}</div>}
          </div>

          <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Year</label>
              {isInteractive ? (
                <select value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className={inputCls}>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : <div className={inputCls}>{formData.year}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Semester</label>
              {isInteractive ? (
                <select value={formData.semester || ''} onChange={e => setFormData({...formData, semester: e.target.value})} className={inputCls}>
                  {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : <div className={inputCls}>{formData.semester}</div>}
            </div>
            <div className="flex-[2] min-w-0">
              <label className={labelCls}>Official Email ID</label>
              <input readOnly={!isInteractive} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputCls} normal-case`} />
            </div>
          </div>

          <div className="w-full">
            <label className={labelCls}>Permanent Communication Address</label>
            <input readOnly={!isInteractive} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className={inputCls} />
          </div>
        </div>

        {/* Right Side: Photo and Signature */}
        <div className="flex-[1] w-full md:max-w-[3.6cm] shrink-0 flex flex-col items-center md:items-start gap-2 mt-6 md:mt-0">
          <div className="w-full h-[4.5cm] border-[1.5px] border-black flex items-center justify-center relative bg-white overflow-hidden hover:bg-gray-50 transition-colors">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} className="w-full h-full object-cover" alt="Student Photo" />
            ) : (
              <span className="text-[7pt] font-black text-gray-400 text-center leading-tight">AFFIX<br/>RECENT<br/>PASSPORT<br/>PHOTO</span>
            )}
            {isInteractive && <input type="file" onChange={e => handleFile(e, 'photoUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />}
          </div>
          <div className="text-[6.5pt] font-black text-center mt-[-4px]">PHOTO (3.6X4.5 CM)</div>

          <div className="w-full h-[1.2cm] border-[1.5px] border-black border-dashed flex items-center justify-center relative bg-white overflow-hidden hover:bg-gray-50 transition-colors mt-2">
            {formData.studentSignatureUrl ? (
              <img src={formData.studentSignatureUrl} className="w-full h-full object-contain" alt="Student Signature" />
            ) : (
              <span className="text-[6pt] font-black text-gray-400">UPLOAD SIGNATURE</span>
            )}
            {isInteractive && <input type="file" onChange={e => handleFile(e, 'studentSignatureUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />}
          </div>
          <div className="text-[6.5pt] font-black text-center mt-[-4px] border-t-[1.5px] border-black border-dotted pt-0.5">STUDENT SIGNATURE</div>
        </div>
      </div>

      <div className="w-full h-[1.5px] bg-black my-6"></div>

      {/* Internship Allotment Section */}
      <h4 className="text-center font-black text-[12pt] uppercase underline mb-5 tracking-wide">Internship Allotment & Placement Details</h4>
      
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8 mb-4">
        <div className="flex-1 min-w-0">
          <label className={labelCls}>Allotted Host School (Max 25)</label>
          {isInteractive ? (
            <select value={formData.internshipSchool || ''} onChange={e => handleSchoolChange(e.target.value)} className={inputCls}>
              <option value="">-- Select Institution --</option>
              {activeSchoolList.map(school => {
                const count = getSchoolEnrollmentCount(school.name);
                return <option key={school.name} value={school.name} disabled={count >= MAX_CAPACITY}>{school.name} {count >= MAX_CAPACITY ? "[LOCKED]" : ""}</option>;
              })}
            </select>
          ) : <div className={`${inputCls} text-center overflow-hidden`}>{formData.internshipSchool || '_______________________'}</div>}
        </div>
        <div className="flex-1 min-w-0">
          <label className={labelCls}>Assigned Academic Supervisor</label>
          <div className="border-b-[1.5px] border-black text-[12pt] font-bold h-[32px] flex items-center justify-center bg-gray-50 overflow-hidden">
            {formData.internshipObserver || (isInteractive ? 'Auto-assigned' : '_______________________')}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8 mb-6">
        <div className="flex-1 min-w-0">
          <label className={labelCls}>Commencement Date</label>
          <input readOnly={!isInteractive} type="text" maxLength={10} placeholder="DD-MM-YYYY" value={formData.internshipStartDate || ''} onChange={e => setFormData({...formData, internshipStartDate: formatDate(e.target.value)})} className={`${inputCls} text-center`} />
        </div>
        <div className="flex-1 min-w-0">
          <label className={labelCls}>Completion Date</label>
          <input readOnly={!isInteractive} type="text" maxLength={10} placeholder="DD-MM-YYYY" value={formData.internshipEndDate || ''} onChange={e => setFormData({...formData, internshipEndDate: formatDate(e.target.value)})} className={`${inputCls} text-center`} />
        </div>
      </div>

      <div className="border-[1.5px] border-black p-4 bg-white text-[10.5pt] italic text-center font-bold leading-tight mb-8">
        "I hereby solemnly declare to abide by the institutional norms of the allotted school."
      </div>

      {/* Footer Signatures */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 mt-12 px-2 md:px-6">
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <div className="w-[3.6cm] h-[1.2cm] border-[1.5px] border-black border-dashed flex items-center justify-center relative bg-white overflow-hidden">
              {formData.studentSignatureUrl ? (
                <img src={formData.studentSignatureUrl} className="w-full h-full object-contain" alt="Student Signature" />
              ) : (
                <span className="text-[6pt] font-black text-gray-400">UPLOAD SIGNATURE</span>
              )}
              {isInteractive && <input type="file" onChange={e => handleFile(e, 'studentSignatureUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />}
            </div>
            <div className="text-[8pt] font-black border-t-[1.5px] border-black pt-0.5 mt-1 uppercase">Signature of Candidate</div>
          </div>
          <div className="text-center">
            <input readOnly={!isInteractive} type="text" maxLength={10} placeholder="DD-MM-YYYY" value={formData.formDate || ''} onChange={e => setFormData({...formData, formDate: formatDate(e.target.value)})} className="w-28 border-b-[1.5px] border-black font-bold text-[11pt] pb-1 focus:outline-none text-center bg-transparent" />
            <p className="text-[9pt] font-black uppercase mt-1">Date</p>
          </div>
        </div>
        <div className="flex flex-col space-y-6 md:space-y-10">
          <PreAffixedSign label={"INTERNSHIP COORDINATOR"} signUrl={officialSignatures.internshipCoordSign} />
          <PreAffixedSign label={"DEAN (SOETR)"} signUrl={officialSignatures.deanSign} />
        </div>
      </div>
    </div>
  );

  const pages: A4Page[] = [
    { title: "SIP Allotment - Student Copy", copyType: "Page 1 of 3", refNo: currentRefNo, content: (
      <div className="relative w-full h-full flex flex-col justify-between">
        {renderFormContent(true)}
        
        {/* FIXED BUG 2: Added a robust Save & Submit Button pinned perfectly inside the document flow */}
        <div className="mt-6 flex justify-center no-print w-full pb-4">
           <button type="button" onClick={handleSub} className="w-[90%] py-3 bg-[#001F3F] text-white rounded-[1rem] font-black uppercase tracking-widest shadow-lg border-2 border-black hover:bg-black transition-all text-[11px] md:text-[14px] flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              Submit & Save Registry
           </button>
        </div>
      </div>
    )},
    { title: "SIP Allotment - Institute Copy", copyType: "Page 2 of 3", refNo: currentRefNo, content: (
      renderFormContent(false)
    )},
    { title: "Internship School Principal Copy", copyType: "Page 3 of 3", refNo: currentRefNo, content: (
      <div className="font-serif leading-relaxed px-6 pt-4 text-[12pt] font-bold opacity-100">
        <div className="flex justify-between font-black border-b-[1.5px] border-black mb-10 pb-1">
          <span>REF: {currentRefNo}</span>
          <span>DATE: {formData.formDate || 'DD-MM-YYYY'}</span>
        </div>
        <div className="mb-10">
          <p className="font-black text-[13pt] uppercase mb-1">To,</p>
          <p className="font-black text-[12pt] uppercase underline mb-1">The Principal / Headmaster,</p>
          <p className="text-[16pt] font-black uppercase text-blue-900 leading-tight mb-1">{formData.internshipSchool || '_______________________'}</p>
          <p className="text-[10pt] font-black uppercase text-gray-500 italic">Subject: Internship Placement Request</p>
        </div>
        <h3 className="text-center text-[14pt] font-black underline my-10 uppercase tracking-tight">Subject: Request for School Internship (SIP) Permission</h3>
        <p className="mb-8">Respected Sir/Madam,</p>
        <div className="space-y-8 text-justify leading-relaxed mb-12">
          <p className="indent-12">The School of Education Training & Research (SOETR), K.K. University, introduces our trainee-student <span className="border-b-[1.5px] border-black px-4 uppercase font-black text-blue-900">{formData.name || '________________'}</span> pursuing {formData.programme || '_______'} for the session {formData.session || '_______'}.</p>
          <p className="indent-12">As per NCTE norms, the student is required to complete SIP in a recognized school. We have allotted this student to your institution from <b>{formData.internshipStartDate || 'DD-MM-YYYY'}</b> to <b>{formData.internshipEndDate || 'DD-MM-YYYY'}</b>. We request you to kindly provide the necessary guidance and facilities to the student during this period.</p>
        </div>
        <div className="mt-24 flex justify-between items-end">
          <div className="text-center">
             <div className="w-[3.6cm] h-[1.2cm] border-[1.5px] border-black border-dashed flex items-center justify-center relative bg-white overflow-hidden mx-auto mb-1">
                {formData.studentSignatureUrl ? <img src={formData.studentSignatureUrl} className="w-full h-full object-contain" /> : <span className="text-[6pt] font-black text-gray-400">SIGNATURE</span>}
             </div>
             <p className="text-[8pt] font-black uppercase mt-1 border-t-[1.5px] border-black pt-0.5">Signature of Student</p>
             <div className="mt-10 border-2 border-black border-dashed p-4 w-48 h-24 flex items-center justify-center text-center">
                <p className="text-[8pt] font-black uppercase text-gray-400">Official Seal of Host School</p>
             </div>
          </div>
          <div className="flex flex-col space-y-10">
             <PreAffixedSign label={"Internship Coordinator"} signUrl={officialSignatures.internshipCoordSign} />
             <PreAffixedSign label={"DEAN (SOETR)"} signUrl={officialSignatures.deanSign} />
          </div>
        </div>
      </div>
    )}
  ];

  return (
    <div className="relative pb-10 w-full overflow-x-hidden">
       <A4FormWrapper validate={validate} pages={pages} title="SIP_Dispatch_Letter_Pack" />
    </div>
  );
};