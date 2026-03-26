import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DataEntryRecord, PersonDomain } from '../../types';
import { Logo } from '../../components/Logo';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const SearchPortal: React.FC = () => {
  const { adminUsers, dataRecords } = useAuth();
  const navigate = useNavigate();
  const [loginStep, setLoginStep] = useState<'selection' | 'login' | 'lookup'>('selection');
  const [loginMode, setLoginMode] = useState<'admin' | 'user'>('admin');
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [enrollmentId, setEnrollmentId] = useState('');
  const [foundRecord, setFoundRecord] = useState<DataEntryRecord | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMode === 'admin') {
      if (credentials.id === 'soe.bkt1980@gmail.com' && credentials.password === 'brijesh@1980') {
        setLoginStep('lookup');
      } else {
        alert("Invalid Admin Credentials");
      }
    } else {
      const user = adminUsers.find(u => u.email === credentials.id && u.password === credentials.password);
      if (user) setLoginStep('lookup');
      else alert("Invalid User/Staff Credentials");
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const record = dataRecords.find(r => r.basicInfo.enrollmentNo === enrollmentId);
    if (record) setFoundRecord(record);
    else alert("No record found for this Enrollment ID");
  };

  const getAttendanceTotalPercent = (attArray: any[]) => {
    if (!attArray || attArray.length === 0) return 0;
    let working = 0;
    let present = 0;
    attArray.forEach(m => {
      if (m.presentDays !== 'N/A' && m.presentDays !== undefined && m.presentDays !== '') {
        working += Number(m.workingDays) || 0;
        present += Number(m.presentDays) || 0;
      }
    });
    return working > 0 ? Math.round((present / working) * 100) : 0;
  };

  // --- PDF DOWNLOAD LOGIC ---
  const downloadPDF = async () => {
    const element = document.getElementById('search-portal-record');
    if (!element || !foundRecord) return;
    
    try {
      setIsDownloadingPdf(true);
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SOETR_Record_${foundRecord.basicInfo.enrollmentNo}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // --- WORD DOWNLOAD LOGIC (Matching the Portal Design) ---
  const downloadWord = () => {
    if (!foundRecord) return;

    let examsHtml = '';
    let prac1Html = '';
    let prac2Html = '';

    if (foundRecord.domain === PersonDomain.STUDENT) {
      examsHtml = `
        <h3 style="margin-top: 30px; border-bottom: 2px solid #001F3F; padding-bottom: 5px; color: #001F3F; text-transform: uppercase;">Institutional Examination Matrix</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 20px;">
          <tr>
            ${foundRecord.examinations1?.map(ex => `<th style="border: 1px solid #000; padding: 8px; background: #f0f0f0; font-size: 10px;">${ex.name}</th>`).join('')}
          </tr>
          <tr>
            ${foundRecord.examinations1?.map(ex => {
              const color = (ex.status === 'Pass' || ex.status === 'Present' || ex.status === 'Filled') ? 'green' : 'red';
              return `<td style="border: 1px solid #000; padding: 8px; font-weight: bold; color: ${color};">${ex.status}</td>`;
            }).join('')}
          </tr>
        </table>
      `;

      prac1Html = foundRecord.practical1?.map(p => `<tr><td style="border: 1px solid #000; padding: 5px;">${p.name}</td><td style="border: 1px solid #000; padding: 5px; font-weight: bold; color: ${p.submitted === 'Submitted' ? 'green' : 'red'};">${p.submitted}</td></tr>`).join('') || '';
      prac2Html = foundRecord.practical2?.map(p => `<tr><td style="border: 1px solid #000; padding: 5px;">${p.name}</td><td style="border: 1px solid #000; padding: 5px; font-weight: bold; color: ${p.submitted === 'Submitted' ? 'green' : 'red'};">${p.submitted}</td></tr>`).join('') || '';
    }

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>SOETR Record</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="position: relative; max-width: 800px; margin: 0 auto; border: 4px solid #001F3F; padding: 40px; background: #fff; overflow: hidden;">
          
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; z-index: 0; opacity: 0.08; text-align: center; pointer-events: none;">
             <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/K.K._University_logo.png/220px-K.K._University_logo.png" style="width: 100%; height: auto; object-fit: contain;" alt="Watermark" />
          </div>

          <div style="position: relative; z-index: 10;">
            
            <div style="text-align: center; border-bottom: 4px solid #001F3F; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="color: #001F3F; margin: 0; font-size: 28px; text-transform: uppercase;">K.K. UNIVERSITY</h1>
              <h2 style="margin: 5px 0; font-size: 14px; color: #333; text-transform: uppercase; letter-spacing: 1px;">School of Education Training & Research (SOETR)</h2>
              <p style="font-size: 10px; color: #666; margin: 0; font-weight: bold;">Nalanda, Bihar – 803115 | Official Digital Record</p>
            </div>
            
            <h2 style="text-align: center; font-size: 18px; color: #001F3F; text-decoration: underline; text-transform: uppercase; margin-bottom: 20px;">Digital Cumulative Academic Record</h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left; width: 35%;">Admission ID</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #001F3F;">${foundRecord.basicInfo.enrollmentNo}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Legal Name</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #001F3F;">${foundRecord.basicInfo.name}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Father's Name</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #001F3F;">${foundRecord.basicInfo.fatherName}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Programme / Session</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #001F3F;">${foundRecord.basicInfo.programme} (${foundRecord.basicInfo.session})</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Communication</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #001F3F;">${foundRecord.basicInfo.email} | ${foundRecord.basicInfo.contact1}</td></tr>
              <tr><th style="padding: 10px; border: 1px solid #000; background: #f0f0f0; text-align: left;">Address</th><td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #001F3F;">${foundRecord.basicInfo.address}</td></tr>
            </table>

            ${foundRecord.domain === PersonDomain.STUDENT ? `
              <h3 style="margin-top: 30px; border-bottom: 2px solid #001F3F; padding-bottom: 5px; color: #001F3F; text-transform: uppercase;">Synchronized Attendance Statistics</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 20px;">
                <tr>
                  <th style="border: 1px solid #000; padding: 10px; background: #f0f0f0;">First Year Metric</th>
                  <th style="border: 1px solid #000; padding: 10px; background: #f0f0f0;">Second Year Metric</th>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 20px; font-size: 24px; font-weight: bold; color: #001F3F;">${getAttendanceTotalPercent(foundRecord.attendance1)}%</td>
                  <td style="border: 1px solid #000; padding: 20px; font-size: 24px; font-weight: bold; color: #001F3F;">${getAttendanceTotalPercent(foundRecord.attendance2)}%</td>
                </tr>
              </table>

              <h3 style="margin-top: 30px; border-bottom: 2px solid #001F3F; padding-bottom: 5px; color: #001F3F; text-transform: uppercase;">Practical Training Compliance</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <h4 style="margin-bottom: 5px; color: #555;">First Year Files</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">${prac1Html}</table>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <h4 style="margin-bottom: 5px; color: #555;">Second Year Files</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">${prac2Html}</table>
                  </td>
                </tr>
              </table>

              ${examsHtml}
            ` : ''}

            <div style="margin-top: 40px; padding: 15px; border: 2px solid #000; background-color: #f8f9fa; font-style: italic; text-align: justify; font-size: 12px; font-weight: bold;">
              "This record has been officially verified and generated by the SOETR Student Help Desk System. All particulars have been cross-referenced with the primary university database."
            </div>

            <table style="width: 100%; margin-top: 60px; text-align: center; font-size: 12px; font-weight: bold; color: #001F3F; text-transform: uppercase;">
              <tr>
                <td style="width: 50%;">
                   <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 5px auto; padding-bottom: 20px; color: #999; font-style: italic;">System Verified</div>
                   Digital Audit Signature
                </td>
                <td style="width: 50%;">
                   <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 5px auto; padding-bottom: 20px; font-style: italic;">DR. BRIJESH KUMAR</div>
                   Dean (SOETR)
                </td>
              </tr>
            </table>

          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOETR_Record_${foundRecord.basicInfo.enrollmentNo}.doc`;
    link.click();
  };

  const labelCls = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1";
  const inputCls = "w-full border-2 border-black p-3 font-bold uppercase rounded-xl focus:ring-4 focus:ring-kku-gold/20 outline-none";

  if (foundRecord) {
    return (
      <div className="min-h-screen bg-gray-200 py-10 md:py-20 flex flex-col items-center px-4">
        
        {/* --- DOWNLOAD ACTION BAR --- */}
        <div className="fixed top-8 right-8 flex flex-wrap justify-end gap-3 no-print z-50">
          <button 
            onClick={downloadPDF} 
            disabled={isDownloadingPdf}
            className="bg-red-700 text-white px-6 py-3 rounded-xl font-black uppercase text-xs shadow-xl border-2 border-white hover:bg-black transition-all flex items-center gap-2"
          >
            {isDownloadingPdf ? 'Generating...' : 'Download PDF'}
          </button>
          <button 
            onClick={downloadWord} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs shadow-xl border-2 border-white hover:bg-black transition-all flex items-center gap-2"
          >
            Download Word
          </button>
          <button onClick={() => window.print()} className="bg-kku-blue text-white px-6 py-3 rounded-xl font-black uppercase text-xs shadow-xl border-2 border-white hover:bg-black transition-all">Print</button>
          <button onClick={() => setFoundRecord(null)} className="bg-white border-2 border-black text-black px-6 py-3 rounded-xl font-black uppercase text-xs shadow-xl hover:bg-gray-100 transition-all">New Search</button>
          <button onClick={() => navigate('/')} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-black uppercase text-xs shadow-xl border-2 border-white hover:bg-black transition-all">Exit</button>
        </div>

        {/* A4 High-Contrast Digital Record */}
        <div id="search-portal-record" className="bg-white shadow-2xl border-[6px] border-kku-blue flex flex-col items-center overflow-hidden relative" style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}>
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
             <img 
               src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/K.K._University_logo.png/220px-K.K._University_logo.png" 
               alt="University Watermark"
               className="w-full max-w-[85%] object-contain opacity-[0.05]" 
             />
          </div>

          {/* A4 Header */}
          <div className="w-full flex justify-between items-center border-b-4 border-kku-blue pb-6 mb-10 relative z-10">
            <Logo className="w-28 h-28" />
            <div className="text-center flex-1 px-4">
              <h1 className="text-4xl font-serif font-black uppercase text-kku-blue leading-none m-0">K.K. University</h1>
              <p className="font-black text-[12pt] uppercase tracking-widest mt-2 text-black">School of Education Training & Research</p>
              <p className="text-[10pt] font-black text-kku-gold uppercase tracking-[0.1em] mt-1">(SOETR)</p>
              <p className="text-[8pt] font-bold text-gray-500 uppercase mt-2">Nalanda, Bihar – 803115 | Official Digital Record</p>
            </div>
            <div className="w-28 h-36 border-2 border-black overflow-hidden bg-gray-50 flex items-center justify-center shadow-lg relative">
              {foundRecord.basicInfo.photoUrl ? (
                <img src={foundRecord.basicInfo.photoUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9pt] font-black text-gray-300 uppercase italic">Digital Identity</span>
              )}
            </div>
          </div>

          <div className="w-full relative z-10">
            <h2 className="text-center font-black uppercase underline text-2xl mb-12 tracking-[0.15em] text-kku-blue">Digital Cumulative Academic Record</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10">
              {[
                { l: "Admission ID", v: foundRecord.basicInfo.enrollmentNo },
                { l: "Legal Name", v: foundRecord.basicInfo.name },
                { l: "Father's Name", v: foundRecord.basicInfo.fatherName },
                { l: "Academic Session", v: foundRecord.basicInfo.session },
                { l: "Programme / Course", v: foundRecord.basicInfo.programme },
                { l: "Email Identity", v: foundRecord.basicInfo.email },
                { l: "Person Domain", v: foundRecord.domain },
                { l: "Communication Address", v: foundRecord.basicInfo.address },
              ].map(item => (
                <div key={item.l} className="border-b-[1.5px] border-black/20 pb-1.5 flex flex-col">
                  <span className="text-[9pt] font-black text-kku-gold uppercase leading-none mb-1.5">{item.l}</span>
                  <span className="text-[13pt] font-black uppercase text-kku-blue leading-tight">{item.v || 'N/A'}</span>
                </div>
              ))}
            </div>

            {foundRecord.domain === PersonDomain.STUDENT && (
              <>
                {/* 1. ATTENDANCE */}
                <div className="mb-12">
                  <h3 className="font-black uppercase text-[11pt] tracking-widest text-white bg-kku-blue px-4 py-2 mb-6 border-l-8 border-kku-gold">Synchronized Attendance Statistics</h3>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-black/10 flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase text-gray-400 mb-2">First Year Metric</span>
                      <div className="text-5xl font-black text-kku-blue">{getAttendanceTotalPercent(foundRecord.attendance1)}%</div>
                      <p className="text-[9pt] font-bold text-gray-500 mt-2 uppercase tracking-tighter">Institutional Presence</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-black/10 flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase text-gray-400 mb-2">Second Year Metric</span>
                      <div className="text-5xl font-black text-kku-blue">{getAttendanceTotalPercent(foundRecord.attendance2)}%</div>
                      <p className="text-[9pt] font-bold text-gray-500 mt-2 uppercase tracking-tighter">Institutional Presence</p>
                    </div>
                  </div>
                </div>

                {/* 2. PRACTICAL FILE COMPLIANCE */}
                <div className="mb-12 flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="font-black uppercase text-[11pt] tracking-widest text-white bg-kku-blue px-4 py-2 mb-4 border-l-8 border-kku-gold">First Year Files</h3>
                    <div className="bg-white border border-black/10 p-5 rounded-2xl shadow-sm">
                      <ul className="space-y-3">
                        {foundRecord.practical1?.map(p => (
                          <li key={p.name} className="flex justify-between text-[9pt] font-bold border-b border-gray-100 pb-1.5">
                            <span className="uppercase text-kku-blue">{p.name}</span>
                            <span className={`${p.submitted === 'Submitted' ? 'text-green-600' : 'text-red-600'} uppercase font-black`}>{p.submitted}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black uppercase text-[11pt] tracking-widest text-white bg-kku-blue px-4 py-2 mb-4 border-l-8 border-kku-gold">Second Year Files</h3>
                    <div className="bg-white border border-black/10 p-5 rounded-2xl shadow-sm">
                      <ul className="space-y-3">
                        {foundRecord.practical2?.map(p => (
                          <li key={p.name} className="flex justify-between text-[9pt] font-bold border-b border-gray-100 pb-1.5">
                            <span className="uppercase text-kku-blue">{p.name}</span>
                            <span className={`${p.submitted === 'Submitted' ? 'text-green-600' : 'text-red-600'} uppercase font-black`}>{p.submitted}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. EXAMINATIONS */}
                <div className="mb-12">
                  <h3 className="font-black uppercase text-[11pt] tracking-widest text-white bg-kku-blue px-4 py-2 mb-6 border-l-8 border-kku-gold">Institutional Examination Matrix</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {foundRecord.examinations1?.map(ex => (
                      <div key={ex.name} className="bg-gray-50 border border-black/10 p-4 rounded-xl text-center shadow-sm">
                        <div className="text-[8pt] font-black uppercase text-gray-400 tracking-tight">{ex.name}</div>
                        <div className={`text-[11pt] font-black uppercase mt-1 ${ex.status === 'Pass' || ex.status === 'Present' || ex.status === 'Filled' ? 'text-green-600' : 'text-red-600'}`}>
                          {ex.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="border-[1.5px] border-black p-5 mt-10 bg-blue-50/30 rounded-2xl italic text-[11pt] font-bold text-justify leading-snug">
               "This record has been officially verified and generated by the SOETR Student Help Desk System. All particulars have been cross-referenced with the primary university database."
            </div>
          </div>

          <div className="w-full mt-auto pt-20 flex justify-between items-end relative z-10">
             <div className="text-center">
                <div className="w-64 border-b-2 border-black h-12 flex items-center justify-center italic text-gray-300">System Verified</div>
                <p className="text-[9pt] font-black uppercase mt-2 tracking-widest text-kku-blue">Digital Audit Signature</p>
             </div>
             <div className="text-center">
                <div className="w-64 border-b-2 border-black h-12 flex items-center justify-center">
                   <span className="text-kku-blue font-black uppercase text-sm italic tracking-widest">DR. BRIJESH KUMAR</span>
                </div>
                <p className="text-[9pt] font-black uppercase mt-2 tracking-widest text-kku-blue">Dean (SOETR)</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kku-blue flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 0 L100 100 L100 0 Z" fill="currentColor" /></svg>
      </div>
      
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.6)] border-4 border-kku-gold overflow-hidden p-12 relative z-10 transition-all hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-12">
           <Logo className="w-28 h-28 mb-6" />
           <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-widest text-kku-blue text-center leading-none">Security Access Hub</h2>
           <p className="text-[11px] font-black uppercase tracking-[0.25em] text-kku-gold mt-3 bg-kku-blue/5 px-6 py-1 rounded-full">Official Academic Registry</p>
        </div>

        {loginStep === 'selection' && (
          <div className="space-y-8 animate-fadeIn">
            <p className="text-center font-black text-gray-400 uppercase text-xs tracking-widest">Select Authorization Method</p>
            <div className="grid grid-cols-2 gap-8">
              <button 
                onClick={() => { setLoginMode('admin'); setLoginStep('login'); }}
                className="p-10 bg-gray-50 rounded-[2.5rem] border-2 border-black hover:bg-kku-blue hover:text-white transition-all transform hover:-translate-y-2 group shadow-xl"
              >
                <div className="w-12 h-12 mx-auto mb-5 text-kku-blue group-hover:text-kku-gold transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="font-black uppercase text-[11px] tracking-[0.2em] block text-center">Admin ID</span>
              </button>
              <button 
                onClick={() => { setLoginMode('user'); setLoginStep('login'); }}
                className="p-10 bg-gray-50 rounded-[2.5rem] border-2 border-black hover:bg-kku-blue hover:text-white transition-all transform hover:-translate-y-2 group shadow-xl"
              >
                <div className="w-12 h-12 mx-auto mb-5 text-kku-blue group-hover:text-kku-gold transition-colors">
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <span className="font-black uppercase text-[11px] tracking-[0.2em] block text-center">User ID</span>
              </button>
            </div>
            <button onClick={() => navigate('/')} className="w-full text-center text-xs font-black uppercase text-gray-400 hover:text-kku-blue transition-colors underline tracking-widest">Back to Portal Home</button>
          </div>
        )}

        {loginStep === 'login' && (
          <form onSubmit={handleLogin} className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h3 className="font-black uppercase text-sm tracking-[0.15em] border-b-4 border-kku-gold inline-block pb-1 text-kku-blue">Verify {loginMode} Credentials</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Identity String (Email)</label>
                <input type="email" required value={credentials.id} onChange={e => setCredentials({...credentials, id: e.target.value})} className={inputCls} placeholder="staff@kkuniversity.ac.in" />
              </div>
              <div>
                <label className={labelCls}>Encrypted Password</label>
                <input type="password" required value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} className={inputCls} placeholder="••••••••" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
              <button type="button" onClick={() => setLoginStep('selection')} className="w-full p-5 border-2 border-black font-black uppercase text-xs rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
              <button type="submit" className="w-full p-5 bg-kku-blue text-white font-black uppercase text-xs rounded-2xl shadow-2xl hover:bg-black transition-all border-2 border-kku-blue">Authorize</button>
            </div>
          </form>
        )}

        {loginStep === 'lookup' && (
          <form onSubmit={handleLookup} className="space-y-10 animate-fadeIn">
            <div className="bg-green-700 p-8 rounded-[2.5rem] border-4 border-white shadow-2xl text-center transform scale-105">
               <p className="text-[10px] font-black text-green-100 uppercase tracking-[0.3em] mb-2">Access Granted</p>
               <h4 className="text-2xl font-black uppercase text-white tracking-widest">Secure Lookup Session</h4>
            </div>
            <div>
              <label className={labelCls}>Student Admission ID / Enrollment No.</label>
              <input 
                type="text" 
                required
                value={enrollmentId} 
                onChange={e => setEnrollmentId(e.target.value)} 
                className={`${inputCls} text-3xl text-center h-20 tracking-[0.1em] border-kku-blue`} 
                placeholder="KKU/SOETR/XXXX" 
                autoFocus
              />
            </div>
            <button type="submit" className="w-full py-8 bg-kku-blue text-white rounded-[2.5rem] font-black uppercase tracking-[0.25em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-black border-4 border-white transition-all transform active:scale-95 text-lg">Initialize Fetch</button>
            <button type="button" onClick={() => { setLoginStep('selection'); setCredentials({id:'', password:''}); }} className="w-full text-center text-xs font-black uppercase text-red-600 hover:underline tracking-widest">Invalidate Session & Exit</button>
          </form>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};