
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role, AdminRole, DataEntryRecord, AdminUser, OfficialSignatures, UploadedContent, FormTimeline, GalleryImage, GoverningBodyMember, MockSubmission } from '../types';

const INITIAL_TIMELINES: FormTimeline[] = [
  { formId: 'notice-board', formName: 'Notice Board', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'assignments', formName: 'Assignments', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'timetable', formName: 'Time-Table', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'question-bank', formName: 'Question Bank', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'study-materials', formName: 'Study Materials', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'result', formName: 'Exam Results', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'data-entry', formName: 'Data Entry Form', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'exam', formName: 'Fill Examination Form', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'grievance', formName: 'Fill Grievance', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'internship', formName: 'Internship Letter', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'leave', formName: 'Leave Application', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'feedback', formName: 'Feedback', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true },
  { formId: 'governing-body', formName: 'Leadership Section', startDate: '01-01-2024', endDate: '31-12-2030', isActive: true }
];

const DEFAULT_GOVERNING: GoverningBodyMember[] = [
  { 
    id: 'gb1', 
    name: "Er. Ravi Chaudhary", 
    title: "Hon'ble Chancellor", 
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300", 
    description: "Our mission is to cultivate a learning environment where innovation meets tradition. We are dedicated to producing educators who will inspire, lead, and contribute meaningfully to the global academic landscape." 
  }
];

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: 'gal1', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600&h=800', title: 'Micro-Teaching Sessions', description: 'Developing core pedagogical competencies through structured peer-teaching cycles.' },
  { id: 'gal2', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600&h=800', title: 'Interactive Group Discussions', description: 'Fostering collaborative learning and critical analysis of educational theories.' },
  { id: 'gal3', url: 'https://images.unsplash.com/photo-1475721027466-2c6ee078fd2f?auto=format&fit=crop&q=80&w=1600&h=800', title: 'Seminar Presentations', description: 'Building professional confidence and mastery through scholarly academic discourse.' }
];

interface AuthContextType {
  user: User | null;
  login: (role: Role, email?: string, adminRole?: AdminRole) => void;
  logout: () => void;
  dataRecords: DataEntryRecord[];
  addDataRecord: (record: DataEntryRecord) => void;
  deleteDataRecord: (id: string) => void;
  adminUsers: AdminUser[];
  uploadedContent: UploadedContent[];
  publishContent: (content: UploadedContent) => void;
  deleteContent: (id: string) => void;
  formTimelines: FormTimeline[];
  updateFormTimeline: (timeline: FormTimeline) => void;
  updateAllFormTimelines: (active: boolean) => void;
  isFormOpen: (formId: string) => boolean;
  officialSignatures: OfficialSignatures;
  updateOfficialSignatures: (signs: Partial<OfficialSignatures>) => void;
  galleryImages: GalleryImage[];
  addGalleryImage: (img: GalleryImage) => void;
  deleteGalleryImage: (id: string) => void;
  governingBody: GoverningBodyMember[];
  addGoverningMember: (member: GoverningBodyMember) => void;
  updateGoverningMember: (member: GoverningBodyMember) => void;
  deleteGoverningMember: (id: string) => void;
  submissions: MockSubmission[];
  addSubmission: (submission: MockSubmission) => void;
  deleteSubmission: (id: string) => void;
  markSubmissionAsRead: (id: string) => void;
  generateRefNo: () => string;
  getSchoolEnrollmentCount: (schoolName: string) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({ role: Role.STUDENT });
  const [dataRecords, setDataRecords] = useState<DataEntryRecord[]>([]);
  const [adminUsers] = useState<AdminUser[]>([
    { id: 'admin-1', email: 'soe.bkt1980@gmail.com', password: 'brijesh@1980', role: AdminRole.SUPER_ADMIN }
  ]);
  const [uploadedContent, setUploadedContent] = useState<UploadedContent[]>([]);
  const [formTimelines, setFormTimelines] = useState<FormTimeline[]>(INITIAL_TIMELINES);
  const [officialSignatures, setOfficialSignatures] = useState<OfficialSignatures>({});
  const [governingBody, setGoverningBody] = useState<GoverningBodyMember[]>(DEFAULT_GOVERNING);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(DEFAULT_GALLERY);
  const [submissions, setSubmissions] = useState<MockSubmission[]>([]);
  const [refCounter, setRefCounter] = useState(1);

  useEffect(() => {
    const load = (key: string, setter: Function, defaultValue: any) => {
      const s = localStorage.getItem(key);
      if (s) {
        try { 
          const parsed = JSON.parse(s);
          if (parsed && (Array.isArray(parsed) || typeof parsed === 'object' || typeof parsed === 'number')) {
            setter(parsed);
          } else {
            setter(defaultValue);
          }
        } catch(e) {
          setter(defaultValue);
        }
      } else {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        setter(defaultValue);
      }
    };

    load('soetr_data_records', setDataRecords, []);
    load('soetr_timelines', setFormTimelines, INITIAL_TIMELINES);
    load('soetr_uploads', setUploadedContent, []);
    load('official_signatures', setOfficialSignatures, {});
    load('soetr_governance', setGoverningBody, DEFAULT_GOVERNING);
    load('soetr_gallery', setGalleryImages, DEFAULT_GALLERY);
    load('soetr_submissions', setSubmissions, []);
    load('soetr_ref_counter', setRefCounter, 1);
  }, []);

  const isFormOpen = (formId: string): boolean => {
    const timeline = formTimelines.find(t => t.formId === formId);
    if (!timeline || !timeline.isActive) return false;
    return true; 
  };

  const updateFormTimeline = (timeline: FormTimeline) => {
    setFormTimelines(prev => {
      const updated = prev.map(t => t.formId === timeline.formId ? timeline : t);
      localStorage.setItem('soetr_timelines', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAllFormTimelines = (active: boolean) => {
    setFormTimelines(prev => {
      const updated = prev.map(t => ({ ...t, isActive: active }));
      localStorage.setItem('soetr_timelines', JSON.stringify(updated));
      return updated;
    });
  };

  const login = (role: Role, email?: string, adminRole?: AdminRole) => {
    setUser({ role, email, adminRole: adminRole || AdminRole.SUPER_ADMIN });
  };

  const logout = () => {
    setUser({ role: Role.STUDENT });
  };

  const addDataRecord = (record: DataEntryRecord) => {
    setDataRecords(prev => {
      const updated = [record, ...prev];
      localStorage.setItem('soetr_data_records', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDataRecord = (id: string) => {
    setDataRecords(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('soetr_data_records', JSON.stringify(updated));
      return updated;
    });
  };

  const publishContent = (content: UploadedContent) => {
    setUploadedContent(prev => {
      const updated = [content, ...prev];
      localStorage.setItem('soetr_uploads', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteContent = (id: string) => {
    setUploadedContent(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('soetr_uploads', JSON.stringify(updated));
      return updated;
    });
  };

  const updateOfficialSignatures = (signs: Partial<OfficialSignatures>) => {
    setOfficialSignatures(prev => {
      const updated = { ...prev, ...signs };
      localStorage.setItem('official_signatures', JSON.stringify(updated));
      return updated;
    });
  };

  const addGalleryImage = (img: GalleryImage) => {
    setGalleryImages(prev => {
      const updated = [...prev, img];
      localStorage.setItem('soetr_gallery', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('soetr_gallery', JSON.stringify(updated));
      return updated;
    });
  };

  const addGoverningMember = (member: GoverningBodyMember) => {
    setGoverningBody(prev => {
      const updated = [member, ...prev];
      localStorage.setItem('soetr_governance', JSON.stringify(updated));
      return updated;
    });
  };

  const updateGoverningMember = (member: GoverningBodyMember) => {
    setGoverningBody(prev => {
      const updated = prev.map(m => m.id === member.id ? member : m);
      localStorage.setItem('soetr_governance', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteGoverningMember = (id: string) => {
    setGoverningBody(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('soetr_governance', JSON.stringify(updated));
      return updated;
    });
  };

  const addSubmission = (submission: MockSubmission) => {
    setSubmissions(prev => {
      const updated = [submission, ...prev];
      localStorage.setItem('soetr_submissions', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('soetr_submissions', JSON.stringify(updated));
      return updated;
    });
  };

  const markSubmissionAsRead = (id: string) => {
    setSubmissions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isRead: true } : s);
      localStorage.setItem('soetr_submissions', JSON.stringify(updated));
      return updated;
    });
  };

  const generateRefNo = () => {
    const year = new Date().getFullYear();
    const formatted = String(refCounter).padStart(3, '0');
    const newRef = `KKU/SOETR/${year}/${formatted}`;
    
    const nextVal = refCounter + 1;
    setRefCounter(nextVal);
    localStorage.setItem('soetr_ref_counter', JSON.stringify(nextVal));
    
    return newRef;
  };

  const getSchoolEnrollmentCount = (schoolName: string) => {
    return submissions.filter(s => s.formType === 'Internship Letter' && s.school === schoolName).length;
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      dataRecords, addDataRecord, deleteDataRecord,
      adminUsers,
      uploadedContent, publishContent, deleteContent,
      formTimelines, updateFormTimeline, updateAllFormTimelines, isFormOpen,
      officialSignatures, updateOfficialSignatures,
      galleryImages: galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY,
      addGalleryImage, deleteGalleryImage,
      governingBody, addGoverningMember, updateGoverningMember, deleteGoverningMember,
      submissions, addSubmission, deleteSubmission, markSubmissionAsRead, generateRefNo, getSchoolEnrollmentCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
