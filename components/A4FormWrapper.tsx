
import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Logo } from './Logo';

export interface A4Page {
  title?: string;
  copyType?: string;
  content: ReactNode;
  refNo?: string;
}

interface A4FormWrapperProps {
  children?: ReactNode;
  title?: string;
  pages?: A4Page[];
  validate?: () => string[] | null;
}

export const A4FormWrapper: React.FC<A4FormWrapperProps> = ({ children, title, pages, validate }) => {
  const navigate = useNavigate();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 850) {
        const a4WidthInPx = 794; 
        const padding = 16;
        const scale = (screenWidth - padding) / a4WidthInPx;
        setMobileScale(Math.min(scale, 1));
      } else {
        setMobileScale(1);
      }
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleDownload = async () => {
    if (validate && validate()?.length) {
      alert("Please fix form errors before downloading.");
      return;
    }
    const wrapper = document.getElementById('pdf-content');
    if (!wrapper) return;

    try {
      setIsGeneratingPdf(true);
      wrapper.classList.add('export-mode');
      const pagesNodes = document.querySelectorAll('.a4-print-container');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      
      for (let i = 0; i < pagesNodes.length; i++) {
        if (i > 0) pdf.addPage();
        const canvas = await html2canvas(pagesNodes[i] as HTMLElement, { 
          scale: 3, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          windowWidth: 794,
          logging: false
        });
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      pdf.save(`${title?.replace(/\s+/g, '_') || 'SOETR_Official_Form'}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      wrapper.classList.remove('export-mode');
      setIsGeneratingPdf(false);
    }
  };

  const pagesToRender = pages || [{ title: title, content: children }];

  const renderA4 = (page: A4Page, index: number) => (
    <div 
      key={index}
      className="a4-print-container relative bg-white flex flex-col mb-10 print:mb-0"
      style={{ 
        width: '210mm', 
        height: '297mm', 
        padding: '0mm', 
        boxSizing: 'border-box', 
        pageBreakAfter: 'always',
        fontFamily: '"Times New Roman", Times, serif'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg] z-0">
         <span className="text-[100px] font-black uppercase whitespace-nowrap">K.K. UNIVERSITY</span>
      </div>

      <div className="flex-1 flex flex-col w-full h-full relative z-10 p-[10mm] pb-[2mm] border-[1.5mm] border-[#001F3F] box-border bg-white opacity-100">
        {page.copyType && (
          <div className="absolute top-[4mm] right-[4mm] border border-black bg-white px-2 py-0.5 text-[7.5pt] font-black uppercase tracking-widest z-30 opacity-100">
            {page.copyType}
          </div>
        )}

        {/* Header Section - 20% Reduction */}
        <div className="border-b-[3px] border-[#001F3F] pb-3 mb-3 flex items-center relative w-full shrink-0 opacity-100">
          <Logo className="w-[72px] h-[72px] absolute left-0" />
          <div className="text-center w-full px-24">
            <h1 className="text-[25pt] font-black tracking-tight uppercase text-[#001F3F] leading-none m-0">K.K. University</h1>
            <div className="h-[1px] bg-[#001F3F]/20 w-1/4 mx-auto my-1"></div>
            <h2 className="text-[10pt] font-black text-black leading-tight m-0 uppercase tracking-wide">
              School of Education Training & Research
            </h2>
            <p className="text-[9pt] font-black text-[#001F3F] mt-0.5 m-0 tracking-[0.15em]">(SOETR)</p>
            <div className="h-[0.5px] bg-black w-1/2 mx-auto my-1"></div>
            <p className="text-[7pt] text-black font-black m-0 uppercase tracking-[0.12em]">NCTE Approved | UGC Recognized</p>
            <p className="text-[6pt] text-gray-900 font-bold mt-0.5 m-0 italic">Berauti, Nepura, Nalanda, Bihar – 803115</p>
          </div>
        </div>

        {page.refNo && (
          <div className="flex justify-start mb-1.5 opacity-100">
             <span className="text-[8.5pt] font-black uppercase text-[#001F3F]">REF NO: <span className="underline">{page.refNo}</span></span>
          </div>
        )}

        {page.title && (
          <div className="flex justify-center mb-4 shrink-0 relative opacity-100">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[0.5px] bg-black opacity-40"></div>
            <h3 className="relative text-center font-black text-[10.5pt] px-6 py-1 border-[1.2px] border-black uppercase text-black tracking-[0.1em] bg-white z-10 shadow-sm">
              {page.title}
            </h3>
          </div>
        )}

        {/* Body Content - 10% Reduction (10.8pt) */}
        <div className="text-[10.8pt] leading-relaxed text-black flex-1 w-full overflow-hidden font-medium opacity-100 text-justify" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          {page.content}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 py-6 md:py-10 flex flex-col items-center">
      {!isPreviewMode && (
        <div className="w-full max-w-[210mm] mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 no-print bg-white p-6 rounded-2xl shadow-2xl border-2 border-[#001F3F]">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="bg-gray-100 text-black px-6 py-2 rounded-xl font-black text-xs uppercase border-2 border-black hover:bg-black hover:text-white transition transform active:scale-95 shadow-md">Return</button>
             <div className="text-left hidden md:block">
                <p className="text-[10px] font-black uppercase text-gray-400 leading-tight">Official Record Pack</p>
                <p className="text-[11px] font-black uppercase text-kku-blue leading-tight">{title}</p>
             </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setIsPreviewMode(true)} className="flex-1 sm:flex-initial bg-white border-2 border-kku-blue text-kku-blue px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-blue-50 transition transform active:scale-95 shadow-md">Full Preview</button>
            <button 
              onClick={handleDownload} 
              disabled={isGeneratingPdf} 
              className="flex-1 sm:flex-initial bg-red-700 text-white px-8 py-2 rounded-xl font-black text-xs uppercase border-2 border-black hover:bg-black transition transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
              {isGeneratingPdf ? 'Processing...' : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
      <div id="pdf-content" className="origin-top transition-transform duration-300 w-full flex flex-col items-center pb-20" style={{ transform: `scale(${mobileScale})` }}>
        {pagesToRender.map((p, i) => renderA4(p, i))}
      </div>

      {isPreviewMode && (
        <div className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto flex flex-col items-center py-10 no-print-override backdrop-blur-md">
          <div className="fixed top-6 right-6 z-[110] flex gap-4">
            <button onClick={() => setIsPreviewMode(false)} className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase text-xs border-2 border-black shadow-2xl hover:bg-gray-100 transition transform active:scale-95">Exit Preview</button>
            <button onClick={() => window.print()} className="px-10 py-3 bg-kku-blue text-white rounded-2xl font-black uppercase text-xs border-2 border-black shadow-2xl hover:bg-black transition transform active:scale-95">Print Form</button>
          </div>
          <div className="bg-white shadow-2xl scale-[0.85] origin-top rounded-lg">{pagesToRender.map((p, i) => renderA4(p, i))}</div>
        </div>
      )}
    </div>
  );
};
