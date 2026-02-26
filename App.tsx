
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Role, UploadedContent } from './types';
import { Layout } from './components/Layout';
import { Home } from './pages/student/Home';
import { DataEntryForm as StudentDataEntry } from './pages/student/DataEntryForm';
import { ExamForm } from './pages/student/ExamForm';
import { LeaveApplication } from './pages/student/LeaveApplication';
import { InternshipLetter } from './pages/student/InternshipLetter';
import { FeedbackForm } from './pages/student/FeedbackForm';
import { GrievanceForm } from './pages/student/GrievanceForm';
import { StudyMaterials } from './pages/student/StudyMaterials';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DataEntryForm as AdminDataEntry } from './pages/admin/DataEntryForm';
import { SearchPortal } from './pages/student/SearchPortal';
import { getSessionsForProgramme, getYearsForProgramme, getSemestersForProgramme, PROGRAMMES, isSemesterSystem } from './constants';

const DataDrivenView = ({ title, category }: { title: string, category: string }) => {
  const navigate = useNavigate();
  const { uploadedContent } = useAuth();
  const [programme, setProgramme] = useState('');
  const [session, setSession] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const availableSessions = programme ? getSessionsForProgramme(programme) : [];
  const availableYears = programme ? getYearsForProgramme(programme) : [];
  const availableSemesters = programme ? getSemestersForProgramme(programme) : [];
  
  const isSemMode = useMemo(() => {
    return programme && session ? isSemesterSystem(programme, session) : false;
  }, [programme, session]);

  const filteredContent = uploadedContent.filter(c => {
    const catMatch = c.category === category;
    const progMatch = !programme || c.programme === programme || c.programme === 'All Programmes';
    const yearMatch = !year || c.year === year || c.year === 'All Years';
    const semMatch = !isSemMode || !semester || c.semester === semester || c.semester === 'All Semesters';
    return catMatch && progMatch && yearMatch && semMatch;
  });

  const triggerDownload = (item: UploadedContent) => {
    if (item.fileData) {
      const link = document.createElement('a');
      link.href = item.fileData;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Retrieving secure artifact: ${item.fileName}...`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[70vh]">
      <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-kku-blue overflow-hidden">
        <div className="bg-kku-blue text-white p-12 border-b-8 border-kku-gold flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-widest uppercase">{title}</h1>
            <p className="text-kku-gold mt-3 text-sm font-black uppercase tracking-[0.2em]">Institutional Artifact Repository</p>
          </div>
          <button onClick={() => navigate(-1)} className="bg-white text-kku-blue px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-white transition shadow-xl">Exit Hub</button>
        </div>

        <div className="p-10 bg-gray-50 border-b-2 border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Academic Programme</label>
              <select value={programme} onChange={e => { setProgramme(e.target.value); setYear(''); setSession(''); setSemester(''); }} className="soetr-input">
                <option value="">-- ALL COURSES --</option>
                {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Admission Session</label>
              <select value={session} onChange={e => setSession(e.target.value)} disabled={!programme} className="soetr-input">
                <option value="">-- ALL SESSIONS --</option>
                {availableSessions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Track Year</label>
              <select value={year} onChange={e => { setYear(e.target.value); setSemester(''); }} disabled={!programme} className="soetr-input">
                <option value="">-- ALL YEARS --</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {isSemMode && (
              <div className="animate-fadeIn">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Active Semester</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!year} className="soetr-input">
                  <option value="">-- ALL SEMESTERS --</option>
                  {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="p-12 min-h-[400px]">
          {filteredContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-300">
              <h3 className="text-3xl font-serif font-black uppercase tracking-widest text-center">Repository Empty for Selection</h3>
              <p className="mt-4 font-black uppercase text-[10px] tracking-[0.4em] opacity-60">Curricular sync required for selection matrix.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredContent.map(item => (
                <div key={item.id} className="group bg-white border-4 border-black rounded-[3rem] p-10 hover:shadow-[20px_20px_0_rgba(0,31,63,0.1)] transition-all transform hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
                  <div className="bg-kku-gold/10 text-kku-gold text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-kku-gold/20 tracking-widest self-start mb-6">{item.category}</div>
                  <h4 className="text-2xl font-black text-kku-blue leading-tight mb-4 group-hover:text-black transition-colors">{item.title}</h4>
                  <p className="text-[11px] font-bold text-gray-500 mb-8 line-clamp-3 italic leading-relaxed">{item.description}</p>
                  <div className="mt-auto pt-8 border-t-2 border-black/5 flex justify-between items-end">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-tight">
                      <div>STAMP: {item.datePublished}</div>
                      <div className="text-kku-gold mt-1">{item.fileSize} | VERIFIED</div>
                    </div>
                    <button onClick={() => triggerDownload(item)} className="bg-kku-blue text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-2xl border-2 border-white/20">Fetch Document</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProtectedAdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== Role.ADMIN) return <Navigate to="/admin-login" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portal/search" element={<SearchPortal />} />
        <Route path="/form/data-entry" element={<StudentDataEntry />} />
        <Route path="/form/exam" element={<ExamForm />} />
        <Route path="/form/leave" element={<LeaveApplication />} />
        <Route path="/form/internship" element={<InternshipLetter />} />
        <Route path="/form/feedback" element={<FeedbackForm />} />
        <Route path="/form/grievance" element={<GrievanceForm />} />
        
        <Route path="/view/notice-board" element={<DataDrivenView title="Official Notice Board" category="Notice" />} />
        <Route path="/view/assignments" element={<DataDrivenView title="Assignment Questions" category="Assignment" />} />
        <Route path="/view/timetable" element={<DataDrivenView title="Academic Calendar" category="Time-Table" />} />
        <Route path="/view/question-bank" element={<DataDrivenView title="Question Bank Hub" category="Question Bank" />} />
        <Route path="/view/study-materials" element={<StudyMaterials />} />
        <Route path="/view/result" element={<DataDrivenView title="Examination Statistics" category="Results" />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/data-entry" element={<ProtectedAdminRoute><AdminDataEntry /></ProtectedAdminRoute>} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}
