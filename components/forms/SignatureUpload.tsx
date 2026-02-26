
import React from 'react';

interface SignatureUploadProps {
  label: string;
  value?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

export const SignatureUpload: React.FC<SignatureUploadProps> = ({ label, value, onChange, readOnly = false }) => {
  return (
    <div className="flex flex-col items-center opacity-100 w-full">
      <div className={`w-full h-14 border-[1.5px] border-black ${readOnly ? 'border-solid' : 'border-dashed bg-white'} flex items-center justify-center relative group transition opacity-100`}>
        {value ? (
          <img src={value} alt="Signature preview" className="h-full max-w-full object-contain opacity-100" />
        ) : (
          <div className="flex flex-col items-center no-print px-1">
            {!readOnly && (
              <>
                <svg className="w-4 h-4 text-gray-400 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                <span className="text-[7pt] text-black font-black italic opacity-100 uppercase tracking-tighter text-center">Click to Upload Signature</span>
              </>
            )}
            {readOnly && <span className="text-[8pt] text-gray-300 font-bold italic">NOT PROVIDED</span>}
          </div>
        )}
        {!readOnly && onChange && (
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer no-print"
            title={`Upload ${label}`}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => onChange(e.target?.result as string);
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        )}
        {!readOnly && value && onChange && (
          <button 
            type="button"
            className="absolute -top-2 -right-2 bg-red-700 border-2 border-white text-white font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg hover:bg-black no-print text-[10px] z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(''); }}
            title="Remove"
          >
            ×
          </button>
        )}
      </div>
      <div className="w-full mt-1 border-t-[1px] border-black border-dotted pt-0.5">
        <span className="text-[7.5pt] font-black text-black opacity-100 text-center block uppercase tracking-tighter leading-none">{label}</span>
      </div>
    </div>
  );
};
