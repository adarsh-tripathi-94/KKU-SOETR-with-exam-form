
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role, AdminRole, DataEntryRecord, AdminUser, OfficialSignatures, UploadedContent, FormTimeline, GalleryImage, GoverningBodyMember, MockSubmission } from '../types';
import { supabase } from '../supabaseClient';
import seminarImg from '../pages/student/seminar.png';

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


const DEFAULT_GALLERY: GalleryImage[] = [
  { id: 'gal1', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600&h=800', title: 'Micro-Teaching Sessions', description: 'Developing core pedagogical competencies through structured peer-teaching cycles.' },
  { id: 'gal2', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600&h=800', title: 'Interactive Group Discussions', description: 'Fostering collaborative learning and critical analysis of educational theories.' },
  { id: 'gal3', url: seminarImg, title: 'Seminar Presentations', description: 'Building professional confidence and mastery through scholarly academic discourse.' }
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
  verifyStudentExists: (enrollmentNo: string) => Promise<boolean>;
  updateDataRecord: (id: string, record: DataEntryRecord) => Promise<void>;
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
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(DEFAULT_GALLERY);
  const [submissions, setSubmissions] = useState<MockSubmission[]>([]);
  const [refCounter, setRefCounter] = useState(1);

  useEffect(() => {
    const fetchLiveDatabase = async () => {
    try {
      // 1. Fetch Master Student Records
      const { data: studentsData, error: studentError } = await supabase.from('students_registry').select('*');
      if (studentError) throw studentError;
      
      if (studentsData) {
        const mappedStudents: DataEntryRecord[] = studentsData.map(dbRow => ({
          id: dbRow.id,
          domain: dbRow.domain || 'Student',
          basicInfo: {
            enrollmentNo: dbRow.enrollment_no || '',
            name: dbRow.name || '',
            fatherName: dbRow.father_name || '',
            motherName: dbRow.mother_name || '',
            programme: dbRow.programme || '',
            session: dbRow.academic_session || '',
            year: dbRow.academic_year || '',
            semester: dbRow.semester || '',
            contact1: dbRow.mobile || '',
            whatsapp: dbRow.whatsapp || '',
            email: dbRow.email || '',
            address: dbRow.address || '',
            pinCode: dbRow.pin_code || '',
            photoUrl: dbRow.photo_url || '',
            eduDetails: dbRow.edu_details || []
          },
          ...(dbRow.extended_data || {}) // Safely expands attendance & practicals!
        }));
        setDataRecords(mappedStudents);
      }

      // 2. Fetch Form Submissions (Grievance, Leaves, etc.)
      const { data: submissionsData, error: subError } = await supabase.from('form_submissions').select('*');
      if (!subError && submissionsData) {
        const mappedSubs: MockSubmission[] = submissionsData.map(row => ({
          id: row.ref_id,
          date: new Date(row.created_at).toLocaleDateString('en-GB'),
          enrollmentNo: row.enrollment_no,
          name: row.student_name,
          programme: row.programme,
          formType: row.form_type,
          data: row.payload || {},
          isRead: row.is_read || false
        }));
        setSubmissions(mappedSubs);
      }

      // 3. Fetch Uploaded Study Materials
      const { data: uploadsData, error: upError } = await supabase.from('uploaded_content').select('*');
      if (!upError && uploadsData) {
        const mappedUploads: UploadedContent[] = uploadsData.map(row => ({
          id: row.id,
          category: row.category,
          programme: row.programme,
          year: row.year,
          semester: row.semester,
          title: row.title,
          description: row.description,
          datePublished: new Date(row.created_at).toLocaleDateString('en-GB'),
          fileName: row.file_name,
          fileSize: row.file_size,
          fileData: row.file_data
        }));
        setUploadedContent(mappedUploads);
      }
    } catch (err: any) {
      console.error("Failed to fetch live database:", err.message);
    }
  };
  fetchLiveDatabase();
  }, []);

  const isFormOpen = (formId: string): boolean => {
    const timeline = formTimelines.find(t => t.formId === formId);
    if (!timeline || !timeline.isActive) return false;
    return true; 
  };

  const updateFormTimeline = async (timeline: FormTimeline) => {
    const updatedTimelines = formTimelines.map(t => t.formId === timeline.formId ? timeline : t);
    try {
      const { error } = await supabase
        .from('system_configurations')
        .update({ config_payload: updatedTimelines })
        .eq('config_key', 'form_timelines');
        
      if (error) throw error;
      setFormTimelines(updatedTimelines);
    } catch (err: any) {
      console.error("Failed to update timeline:", err.message);
    }
   };

  const updateAllFormTimelines = async (active: boolean) => {
    const updatedTimelines = formTimelines.map(t => ({ ...t, isActive: active }));
    try {
      const { error } = await supabase
        .from('system_configurations')
        .update({ config_payload: updatedTimelines })
        .eq('config_key', 'form_timelines');
        
      if (error) throw error;
      setFormTimelines(updatedTimelines);
    } catch (err: any) {
      console.error("Failed to update all timelines:", err.message);
    }
  };

  const login = (role: Role, email?: string, adminRole?: AdminRole) => {
    setUser({ role, email, adminRole: adminRole || AdminRole.SUPER_ADMIN });
  };

  const logout = () => {
    setUser({ role: Role.STUDENT });
  };

  const addDataRecord = async (record: DataEntryRecord) => {
    try {
      const { error } = await supabase
        .from('students_registry')
        .insert([{
          enrollment_no: record.basicInfo.enrollmentNo,
          name: record.basicInfo.name,
          father_name: record.basicInfo.fatherName,
          mother_name: record.basicInfo.motherName,
          programme: record.basicInfo.programme,
          academic_session: record.basicInfo.session,
          academic_year: record.basicInfo.year,
          semester: record.basicInfo.semester,
          mobile: record.basicInfo.contact1,
          whatsapp: record.basicInfo.whatsapp,
          email: record.basicInfo.email,
          address: record.basicInfo.address,
          pin_code: record.basicInfo.pinCode,
          photo_url: record.basicInfo.photoUrl,
          edu_details: record.basicInfo.eduDetails,
          extended_data: {
            attendance1: record.attendance1,
            attendance2: record.attendance2,
            practical1: record.practical1,
            practical2: record.practical2,
            communityOutreach1: record.communityOutreach1,
            examinations1: record.examinations1,
            sports: record.sports,
            qualifications: record.qualifications,
            academicAchievements: record.academicAchievements,
            adminWork: record.adminWork,
            evaluation: record.evaluation,
            technicalAchievements: record.technicalAchievements,
            otherResponsibilities: record.otherResponsibilities
          }
        }]);
        const updateDataRecord = async (id: string, record: DataEntryRecord) => {
    try {
      const { error } = await supabase.from('students_registry').update({
          enrollment_no: record.basicInfo.enrollmentNo,
          name: record.basicInfo.name,
          father_name: record.basicInfo.fatherName,
          mother_name: record.basicInfo.motherName,
          programme: record.basicInfo.programme,
          academic_session: record.basicInfo.session,
          academic_year: record.basicInfo.year,
          semester: record.basicInfo.semester,
          mobile: record.basicInfo.contact1,
          whatsapp: record.basicInfo.whatsapp,
          email: record.basicInfo.email,
          address: record.basicInfo.address,
          pin_code: record.basicInfo.pinCode,
          photo_url: record.basicInfo.photoUrl,
          edu_details: record.basicInfo.eduDetails,
          extended_data: {
            attendance1: record.attendance1, attendance2: record.attendance2,
            practical1: record.practical1, practical2: record.practical2,
            communityOutreach1: record.communityOutreach1, examinations1: record.examinations1,
            sports: record.sports, qualifications: record.qualifications,
            academicAchievements: record.academicAchievements, adminWork: record.adminWork,
            evaluation: record.evaluation, technicalAchievements: record.technicalAchievements,
            otherResponsibilities: record.otherResponsibilities
          }
      }).eq('id', id);

      if (error) throw error;
      setDataRecords(prev => prev.map(r => r.id === id ? record : r));
    } catch (err: any) {
      alert("Failed to update master registry.");
    }
  };

      if (error) throw error;

      setDataRecords(prev => [record, ...prev]);

    } catch (err: any) {
      console.error("Master Registry Sync Failed:", err.message);
      alert("Failed to save student data to the master registry.");
    }
  };

  const deleteDataRecord = async (id: string) => {
    try {
      const { error } = await supabase.from('students_registry').delete().eq('id', id);
      if (error) throw error;
      setDataRecords(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error("Delete Failed:", err.message);
      alert("Failed to delete student from registry.");
    }
  };

  const publishContent = async (content: UploadedContent) => {
    try {
      const { error } = await supabase.from('academic_repository').insert([{
        category: content.category,
        programme: content.programme,
        academic_year: content.year,
        semester: content.semester,
        title: content.title,
        description: content.description,
        file_name: content.fileName,
        file_size: content.fileSize,
        file_url: content.fileData, 
        date_published: new Date().toISOString()
      }]);

      if (error) throw error;
      
      setUploadedContent(prev => [content, ...prev]);
    } catch (err: any) {
      console.error("Publish Failed:", err.message);
      alert("Failed to publish content to repository.");
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase.from('academic_repository').delete().eq('id', id);
      if (error) throw error;
      setUploadedContent(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error("Delete Failed:", err.message);
      alert("Failed to delete artifact.");
    }
  };

  const updateOfficialSignatures = async (signs: Partial<OfficialSignatures>) => {
    const updatedSigns = { ...officialSignatures, ...signs };
    try {
      const { error } = await supabase
        .from('system_configurations')
        .update({ config_payload: updatedSigns })
        .eq('config_key', 'official_signatures');
        
      if (error) throw error;
      setOfficialSignatures(updatedSigns);
    } catch (err: any) {
      console.error("Failed to update signatures:", err.message);
    }
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

  // --- ENROLLMENT VERIFICATION LOGIC ---
  const verifyStudentExists = async (enrollmentNo: string): Promise<boolean> => {
    try {
      // Replace 'student_records' with your actual master student table name in Supabase
      const { data, error } = await supabase
        .from('students_registry') 
        .select('enrollment_no')
        .eq('enrollment_no', enrollmentNo)
        .single();

      if (error || !data) {
        return false;
      }
      return true;
    } catch (err) {
      console.error("Verification failed:", err);
      return false;
    }
  };

  const addSubmission = async (submission: MockSubmission) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .insert([{
          ref_id: submission.id,
          form_type: submission.formType,
          enrollment_no: submission.enrollmentNo,
          student_name: submission.name,
          programme: submission.programme,
          payload: submission.data,
          is_read: false
        }]);

      if (error) throw error;

      setSubmissions(prev => [submission, ...prev]);
      
    } catch (err: any) {
      console.error("Database Synchronization Failed:", err.message);
      alert("Failed to save record to the server. Please try again.");
    }
   };
  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase.from('form_submissions').delete().eq('ref_id', id);
      if (error) throw error;
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      console.error("Delete Failed:", err.message);
      alert("Failed to delete record from database.");
    }
  };

  const markSubmissionAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ is_read: true })
        .eq('ref_id', id);

      if (error) throw error;

      setSubmissions(prev => {
        const updated = prev.map(s => s.id === id ? { ...s, isRead: true } : s);
        return updated;
      });
    } catch (err: any) {
      console.error("Failed to mark as read:", err.message);
    }
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
      submissions, addSubmission, deleteSubmission, markSubmissionAsRead, generateRefNo, getSchoolEnrollmentCount, verifyStudentExists
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
