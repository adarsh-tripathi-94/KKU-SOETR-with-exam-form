
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentFormData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PROGRAMMES } from '../../constants';
import { A4FormWrapper } from '../../components/A4FormWrapper';

export const FeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    programme: 'B.Ed.'
  });
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const { addSubmission, generateRefNo } = useAuth();
  const [currentRefNo, setCurrentRefNo] = useState('');

  useEffect(() => {
    setCurrentRefNo(generateRefNo());
    const draft = localStorage.getItem('draft_FeedbackForm');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.feedback) setFeedback(parsed.feedback);
      } catch (e) {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !feedback) {
      alert("Please fill all mandatory fields.");
      return;
    }

    if (!window.confirm("Initialize Quality Assurance Review? Your feedback is valuable for institutional growth.")) return;
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    addSubmission({
      id: currentRefNo,
      date: new Date().toLocaleDateString(),
      enrollmentNo: formData.enrollmentNo || '',
      name: formData.name || '',
      programme: formData.programme || '',
      formType: 'Feedback',
      data: { ...formData, feedback, refNo: currentRefNo }
    });

    setIsSaving(false);
    alert('Institutional Review Registered!');
    localStorage.removeItem('draft_FeedbackForm');
    navigate('/');
  };

  const FormContent = () => (
    <div className="font-serif space-y-10">
      <div className="border-b-2 border-black pb-4">
        <h2 className="text-xl font-black uppercase underline text-center">Institutional Quality Feedback Record</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
         <div><span className="font-black">STUDENT IDENTITY:</span> <span className="uppercase">{formData.name}</span></div>
         <div><span className="font-black">ADMISSION ID:</span> <span className="uppercase">{formData.enrollmentNo}</span></div>
         <div><span className="font-black">PROGRAMME:</span> <span className="uppercase">{formData.programme}</span></div>
         <div><span className="font-black">RECORD ID:</span> <span className="uppercase">{currentRefNo}</span></div>
      </div>
      <div className="mt-10 p-8 border-2 border-black bg-gray-50 min-h-[400px] whitespace-pre-wrap leading-relaxed italic text-[11pt]">
        {feedback}
      </div>
      <div className="mt-20 flex justify-end">
         <div className="text-center w-64 border-t border-black pt-2 font-black uppercase text-[10pt]">Complainant/Reviewer Signature</div>
      </div>
    </div>
  );

  if (isPrintMode) {
    return (
      <A4FormWrapper title="Quality Assurance Artifact" pages={[{ title: "Official Institutional Review", content: <FormContent />, refNo: currentRefNo }]}>
        <button onClick={() => setIsPrintMode(false)} className="no-print fixed bottom-10 right-10 bg-kku-blue text-white px-10 py-4 rounded-3xl font-black uppercase shadow-2xl">Exit Hub</button>
      </A4FormWrapper>
    );
  }

  const labelCls = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white border-2 border-black rounded-[4rem] shadow-[40px_40px_0_rgba(0,31,63,1)] overflow-hidden">
        <div className="bg-green-700 text-white p-10 md:p-14 border-b-8 border-black flex justify-between items-center relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-serif font-black uppercase tracking-tighter">Quality Hub</h1>
            <p className="text-green-100 font-bold uppercase text-[10px] mt-4 tracking-[0.3em]">Institutional Improvement Portal</p>
          </div>
          <button onClick={() => setIsPrintMode(true)} className="bg-white/10 border-2 border-white/20 px-8 py-3 rounded-2xl font-black text-xs uppercase hover:bg-white hover:text-green-700 transition-all">Print Record</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div><label className={labelCls}>Legal Name</label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="soetr-input" /></div>
             <div><label className={labelCls}>Admission ID</label><input required value={formData.enrollmentNo || ''} onChange={e => setFormData({...formData, enrollmentNo: e.target.value})} className="soetr-input" /></div>
             <div><label className={labelCls}>Programme</label><select value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className="soetr-input">{PROGRAMMES.map(p => <option key={p}>{p}</option>)}</select></div>
             <div><label className={labelCls}>Reference</label><input disabled value={currentRefNo} className="soetr-input bg-gray-50 border-dashed text-gray-400" /></div>
          </div>
          <div><label className={labelCls}>Institutional Narrative</label><textarea required value={feedback} onChange={e => setFeedback(e.target.value)} className="soetr-input h-64 normal-case p-10 leading-relaxed shadow-xl" placeholder="Detailed feedback/review..." /></div>
          <div className="mt-20 flex flex-col items-center">
            <button type="submit" disabled={isSaving} className="w-full max-w-2xl py-10 bg-green-700 text-white font-black uppercase tracking-[0.3em] border-4 border-white hover:bg-black transition-all shadow-2xl text-xl flex items-center justify-center gap-4">
              {isSaving && <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {isSaving ? 'Submitting...' : 'Register Institutional Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
