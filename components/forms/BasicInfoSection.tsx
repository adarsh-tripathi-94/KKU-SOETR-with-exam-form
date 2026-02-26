
import React, { useState } from 'react';
import { PROGRAMMES, SESSIONS } from '../../constants';
import { StudentFormData } from '../../types';
import { SignatureUpload } from './SignatureUpload';

export const validateBasicInfo = (data: Partial<StudentFormData>): string[] => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;

  if (!data.enrollmentNo?.trim()) errors.push('Admission/Enrollment Number is mandatory.');
  if (!data.name?.trim()) errors.push('Legal Full Name is mandatory.');
  if (!data.fatherName?.trim()) errors.push("Father's Name is mandatory.");
  if (!data.motherName?.trim()) errors.push("Mother's Name is mandatory.");
  if (!data.programme) errors.push('Academic Programme must be selected.');
  if (!data.session) errors.push('Batch Session must be selected.');
  if (!data.year) errors.push('Current Academic Year is required.');
  if (!data.photoUrl) errors.push('Passport size photo (4x6cm) is required for identity verification.');
  
  if (!data.mobile?.trim()) errors.push('Primary Contact Number is mandatory.');
  else if (!mobileRegex.test(data.mobile)) errors.push('Contact Number must be a valid 10-digit numeric sequence.');
  
  if (!data.whatsapp?.trim()) errors.push('WhatsApp Contact Number is mandatory.');
  else if (!mobileRegex.test(data.whatsapp)) errors.push('WhatsApp Number must be a valid 10-digit numeric sequence.');
  
  if (!data.email?.trim()) errors.push('Official Email Identity is mandatory.');
  else if (!emailRegex.test(data.email)) errors.push('Please enter a valid email format (e.g., student@example.com).');

  return errors;
};

interface Props {
  data: Partial<StudentFormData>;
  onChange: (data: Partial<StudentFormData>) => void;
  readOnly?: boolean;
  printMode?: boolean;
}

export const BasicInfoSection: React.FC<Props> = ({ data, onChange, readOnly = false, printMode = false }) => {
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'success' | 'warning'>('idle');
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);

  const hndChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ [e.target.name]: e.target.value });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const ratio = img.width / img.height;
        const targetRatio = 4 / 6; // 0.666...
        const deviation = Math.abs(ratio - targetRatio);
        
        if (deviation > 0.08) {
          setPhotoStatus('warning');
          setPhotoFeedback("Aspect ratio mismatch detected. The image might appear distorted in official records. 4x6 cm (Vertical) recommended.");
        } else {
          setPhotoStatus('success');
          setPhotoFeedback("Photo aspect ratio verified for institutional 4x6 cm standard.");
        }
        
        const reader = new FileReader();
        reader.onload = ev => onChange({ photoUrl: ev.target?.result as string });
        reader.readAsDataURL(file);
      };
    }
  };

  const inputCls = "mt-1 block w-full border-[1.5px] border-black bg-white text-black font-bold py-2.5 px-4 text-[11pt] focus:ring-4 focus:ring-kku-gold/20 outline-none rounded-2xl transition-all uppercase placeholder-gray-300 shadow-sm hover:border-kku-blue";
  const labelCls = "block text-[9pt] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1";
  const valueCls = "mt-1 block w-full border-b-2 border-kku-blue/30 text-kku-blue font-black py-2 px-1 text-[12pt] uppercase tracking-wide bg-blue-50/10";

  const renderField = (label: string, value: string, name: string, type: 'text' | 'select' | 'email' = 'text', options: string[] = []) => {
    if (printMode || readOnly) {
      return (
        <div className="mb-3">
          <label className={labelCls}>{label}</label>
          <div className={valueCls}>{value || 'NOT PROVIDED'}</div>
        </div>
      );
    }
    
    if (type === 'select') {
      return (
        <div className="mb-3">
          <label className={labelCls}>{label}</label>
          <select name={name} value={value} onChange={hndChange} className={inputCls}>
            <option value="">-- SELECT {label.toUpperCase()} --</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <label className={labelCls}>{label}</label>
        <input type={type} name={name} value={value} onChange={hndChange} className={inputCls} placeholder={`ENTER ${label.toUpperCase()}`} />
      </div>
    );
  };

  return (
    <div className="font-serif opacity-100 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <div className="space-y-4">
          <h3 className="text-kku-blue font-black uppercase text-[11px] tracking-[0.25em] border-b-2 border-kku-gold/30 pb-3 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-kku-gold rounded-full"></span>
            Identity Matrix
          </h3>
          {renderField("Enrollment Number", data.enrollmentNo || '', "enrollmentNo")}
          {renderField("Name of Student", data.name || '', "name")}
          {renderField("Father's Name", data.fatherName || '', "fatherName")}
          {renderField("Mother's Name", data.motherName || '', "motherName")}
          {renderField("Academic Programme", data.programme || '', "programme", "select", PROGRAMMES)}
          {renderField("Session", data.session || '', "session", "select", SESSIONS)}
        </div>

        <div className="space-y-4">
          <h3 className="text-kku-blue font-black uppercase text-[11px] tracking-[0.25em] border-b-2 border-kku-gold/30 pb-3 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-kku-gold rounded-full"></span>
            Contact & Asset Profile
          </h3>
          {renderField("Current Year", data.year || '', "year", "select", ["1st Year", "2nd Year", "3rd Year", "4th Year"])}
          
          <div className="flex flex-col items-center py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] relative shadow-inner group transition-all hover:bg-white hover:border-kku-blue/40">
             <div className={`relative border-4 overflow-hidden bg-white shadow-2xl transition-all duration-500 rounded-xl ${photoStatus === 'warning' ? 'border-orange-500 rotate-1' : photoStatus === 'success' ? 'border-green-600' : 'border-black'} group-hover:scale-105`} style={{ width: '4cm', height: '6cm' }}>
               {data.photoUrl ? (
                 <img src={data.photoUrl} className="w-full h-full object-cover" alt="Student Official Portrait" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-[7.5pt] font-black text-gray-400 uppercase tracking-widest leading-tight">Institutional<br/>Portrait Photo<br/>(4 x 6 cm)</span>
                 </div>
               )}
               {!readOnly && !printMode && <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-30" onChange={handlePhoto} />}
               
               {!readOnly && !printMode && (
                 <div className="absolute inset-0 bg-kku-blue/0 group-hover:bg-kku-blue/5 transition-colors pointer-events-none z-10"></div>
               )}
             </div>
             
             {!readOnly && !printMode && (
               <div className="mt-6">
                 <label className="bg-kku-blue text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black transition-all shadow-xl active:scale-95 border-2 border-white/20">
                   Capture / Upload Photo
                   <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                 </label>
               </div>
             )}

             {photoFeedback && !printMode && (
               <div className={`mt-4 px-6 py-2 rounded-2xl text-[8.5px] font-black uppercase tracking-tighter shadow-md border ${photoStatus === 'warning' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-green-50 text-green-700 border-green-100'} animate-bounce-short`}>
                 {photoFeedback}
               </div>
             )}
             <p className="mt-3 text-[10pt] font-black uppercase text-gray-300 tracking-tighter opacity-70">Verified Digital Identity Artifact</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderField("Primary Contact", data.mobile || '', "mobile")}
            {renderField("WhatsApp Identity", data.whatsapp || '', "whatsapp")}
          </div>
          {renderField("Email Identity", data.email || '', "email", "email")}
        </div>
      </div>

      <div className="mt-16 pt-10 border-t-2 border-gray-100 flex justify-end">
        <div className="w-56 text-center">
          <SignatureUpload 
            label="Verified Student Seal" 
            value={data.studentSignatureUrl} 
            onChange={v => onChange({ studentSignatureUrl: v })} 
            readOnly={readOnly || printMode}
          />
        </div>
      </div>
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short { animation: bounce-short 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
