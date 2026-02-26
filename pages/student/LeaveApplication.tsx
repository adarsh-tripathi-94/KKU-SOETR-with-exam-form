
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentFormData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PROGRAMMES } from '../../constants';
import { A4FormWrapper } from '../../components/A4FormWrapper';

export const LeaveApplication: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    programme: 'B.Ed.',
    leaveTo: 'Dean (SOETR)',
    name: '',
    enrollmentNo: '',
    email: '',
    mobile: '',
    leaveSubject: '',
    leaveReason: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const { addSubmission, generateRefNo } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');

  useEffect(() => {
    setCurrentRefNo(generateRefNo());
    const draft = localStorage.getItem('draft_Leave');
    if (draft) try { setFormData(JSON.parse(draft)); } catch (e) {}
  }, []);

  const handleVerifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.enrollmentNo || !formData.leaveReason) return alert("Missing required particulars.");
    if (!window.confirm("Verify Application? This request will be digitally synchronized with the institutional attendance hub.")) return;

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    addSubmission({ 
      id: currentRefNo, 
      date: new Date().toLocaleDateString(), 
      enrollmentNo: formData.enrollmentNo || '', 
      name: formData.name || '', 
      programme: formData.programme || '', 
      formType: 'Leave Application', 
      data: { ...formData, refNo: currentRefNo } 
    });
    setIsSaving(false);
    alert(`Application Synchronized! Ref: ${currentRefNo}`);
    localStorage.removeItem('draft_Leave');
    navigate('/');
  };

  const labelCls = "block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2";

  const FormContent = () => (
    <div className="space-y-8 font-serif p-4">
      <div className="flex justify-between border-b-2 border-black pb-3 mb-10">
         <span className="font-black uppercase">STUDENT: {formData.name}</span>
         <span className="font-black uppercase">ADMISSION ID: {formData.enrollmentNo}</span>
      </div>
      <p className="text-[12pt] font-black m-0">To,</p>
      <p className="text-[12pt] font-black m-0 uppercase">{formData.leaveTo}</p>
      <p className="text-[12pt] font-black m-0">K.K. UNIVERSITY (SOETR)</p>
      
      <p className="text-[12pt] font-black border-l-4 border-black pl-4 py-2 bg-gray-50 mt-10 uppercase">
        Subject: {formData.leaveSubject || 'Formal Request for Leave of Absence'}
      </p>

      <p className="text-[11pt] font-bold mt-8">Respected Sir / Madam,</p>
      <div className="text-[11pt] text-justify leading-relaxed whitespace-pre-wrap min-h-[450px] font-medium border-t border-black/5 pt-6">
        {formData.leaveReason}
      </div>

      <div className="mt-20 pt-10 border-t-2 border-black flex justify-between items-end">
         <div className="text-center w-52">
            <div className="h-10 border-b border-black mb-2"></div>
            <p className="text-[9pt] font-black uppercase">Student Seal</p>
         </div>
         <div className="text-center w-52">
            <div className="h-10 border-b border-black mb-2"></div>
            <p className="text-[9pt] font-black uppercase tracking-widest">Office of the Dean</p>
         </div>
      </div>
    </div>
  );

  if (isPrintMode) {
    return (
      <A4FormWrapper title="Leave Authorization Registry" pages={[{ title: "Official Absence Statement", content: <FormContent />, refNo: currentRefNo }]}>
        <button onClick={() => setIsPrintMode(false)} className="no-print fixed bottom-10 right-10 bg-kku-blue text-white px-10 py-4 rounded-3xl font-black uppercase text-xs shadow-2xl">Exit Hub</button>
      </A4FormWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white border-2 border-black rounded-[4rem] shadow-[40px_40px_0_rgba(0,31,63,1)] overflow-hidden">
        <div className="bg-kku-blue text-white p-12 md:p-20 flex justify-between items-center relative">
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter">Absence Hub</h1>
            <p className="text-kku-gold font-bold uppercase text-[10px] mt-6 tracking-[0.4em] bg-white/10 px-8 py-2 rounded-full inline-block">Official Leave Submission</p>
          </div>
          <button onClick={() => setIsPrintMode(true)} className="bg-white/10 border-2 border-white/20 px-8 py-3 rounded-2xl font-black text-xs uppercase hover:bg-white hover:text-kku-blue transition-all shadow-xl">Print Form</button>
        </div>

        <form onSubmit={handleVerifyAndSave} className="p-8 md:p-24 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div><label className={labelCls}>Legal Name</label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="soetr-input" /></div>
            <div><label className={labelCls}>Admission ID</label><input required value={formData.enrollmentNo || ''} onChange={e => setFormData({...formData, enrollmentNo: e.target.value})} className="soetr-input" placeholder="KKU/SOETR/XXXX" /></div>
            <div><label className={labelCls}>Course</label><select value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className="soetr-input">{PROGRAMMES.map(p => <option key={p}>{p}</option>)}</select></div>
            <div><label className={labelCls}>Recipient Official</label><select value={formData.leaveTo} onChange={e => setFormData({...formData, leaveTo: e.target.value})} className="soetr-input"><option>Dean (SOETR)</option><option>Programme Coordinator</option><option>HOD (Education)</option></select></div>
          </div>
          <div><label className={labelCls}>Official Statement of Reason</label><textarea required value={formData.leaveReason || ''} onChange={e => setFormData({...formData, leaveReason: e.target.value})} className="soetr-input h-80 normal-case leading-relaxed p-10 text-justify" placeholder="Detail the reasons for absence..." /></div>
          <div className="pt-10 flex flex-col items-center">
            <button type="submit" disabled={isSaving} className="w-full max-w-4xl py-12 bg-kku-blue text-white font-black uppercase tracking-[0.4em] border-4 border-white hover:bg-black transition-all shadow-2xl text-2xl flex items-center justify-center gap-6">
              {isSaving && <div className="w-10 h-10 border-8 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {isSaving ? 'Processing Gateway...' : 'Verify & Submit Official Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
