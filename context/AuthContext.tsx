
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role, AdminRole, DataEntryRecord, AdminUser, OfficialSignatures, UploadedContent, FormTimeline, GalleryImage, GoverningBodyMember, MockSubmission, Notice } from '../types';
import { supabase } from '../supabaseClient';
import seminarImg from '../pages/student/seminar.png';
import festsImg from '../pages/student/fests.png';
import farewellImg from '../pages/student/fresher.png'
import labImg from '../pages/student/lab.png'

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
  {id: 'gal3', url: labImg, title: 'Regular Lab Activities', description: 'For practical Experience'},
  { id: 'gal4', url: seminarImg, title: 'Seminar Presentations', description: 'Building professional confidence and mastery through scholarly academic discourse.' },
  { id: 'gal5', url: festsImg, title: 'Cultural & Sports Fests', description: 'Celebrating holistic development and community spirit through vibrant events.' },
  { id: 'gal6', url: farewellImg, title: 'Freshers & Farewell Gatherings', description: 'Cultivating social values and community spirit through vibrant events'}
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
  buttonLocks: Record<string, boolean>;
  toggleButtonLock: (buttonId: string, isLocked: boolean) => Promise<void>;
  liveUpdatesText: string;
  updateLiveUpdatesText: (text: string) => Promise<void>;
  secureStudentSubmission: (enrollmentNo: string, dob: string, fullRecord: DataEntryRecord) => Promise<{success: boolean, message: string}>;
  notices: Notice[];
  addNotice: (notice: Notice) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({ role: Role.STUDENT });
  const [dataRecords, setDataRecords] = useState<DataEntryRecord[]>([]);
  const [liveUpdatesText, setLiveUpdatesText] = useState<string>("Loading updates...");
  const [adminUsers] = useState<AdminUser[]>([
    { id: 'admin-1', email: 'soe.bkt1980@gmail.com', password: 'brijesh@1980', role: AdminRole.SUPER_ADMIN }
  ]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [uploadedContent, setUploadedContent] = useState<UploadedContent[]>([]);
  const [formTimelines, setFormTimelines] = useState<FormTimeline[]>(INITIAL_TIMELINES);
  const [officialSignatures, setOfficialSignatures] = useState<OfficialSignatures>({});
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(DEFAULT_GALLERY);
  const [submissions, setSubmissions] = useState<MockSubmission[]>([]);
  const [refCounter, setRefCounter] = useState(1);
  const [buttonLocks, setButtonLocks] = useState<Record<string, boolean>>({});

  // --- 📢 ADVANCED NOTICE BOARD LOGIC (WITH FILES) ---

  const fetchNotices = async () => {
    try {
      // 1. Calculate the exact date and time 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const cutoffDate = thirtyDaysAgo.toISOString();

      // 2. Ask Supabase for notices newer than 30 days
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .gte('created_at', cutoffDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // 3. Map the database snake_case to our React camelCase
      const formattedNotices: Notice[] = (data || []).map(n => ({
        id: n.id,
        created_at: n.created_at,
        title: n.title,
        message: n.message,
        fileData: n.file_data, // Pull the file string
        target_programme: n.target_programme,
        target_session: n.target_session,
        target_year: n.target_year,
        issuer: n.issuer
      }));

      setNotices(formattedNotices);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    }
  };

  const addNotice = async (notice: Notice) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .insert([{
          title: notice.title,
          message: notice.message,
          file_data: notice.fileData, // Push the file string
          target_programme: notice.target_programme,
          target_session: notice.target_session,
          target_year: notice.target_year,
          issuer: notice.issuer
        }])
        .select();

      if (error) throw error;
      
      // Map it back so the UI updates instantly
      if (data) {
        const newNotice: Notice = {
          id: data[0].id,
          created_at: data[0].created_at,
          title: data[0].title,
          message: data[0].message,
          fileData: data[0].file_data,
          target_programme: data[0].target_programme,
          target_session: data[0].target_session,
          target_year: data[0].target_year,
          issuer: data[0].issuer
        };
        setNotices(prev => [newNotice, ...prev]);
      }
      return true;
    } catch (err) {
      console.error("Failed to post notice:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    const fetchLiveDatabase = async () => {
      try {
        // 1. Fetch Master Student Records
        const { data: studentsData, error: studentError } = await supabase.from('students_registry').select('*');
        if (!studentError && studentsData) {
          const mappedStudents: DataEntryRecord[] = studentsData.map(dbRow => ({
            id: dbRow.id,
            domain: dbRow.domain || 'Student',
            isFullySubmitted: dbRow.is_fully_submitted || false,
            basicInfo: {
              enrollmentNo: dbRow.enrollment_no || '', dob: dbRow.dob || '', name: dbRow.name || '', fatherName: dbRow.father_name || '', motherName: dbRow.mother_name || '', programme: dbRow.programme || '', session: dbRow.academic_session || '', year: dbRow.academic_year || '', semester: dbRow.semester || '', contact1: dbRow.mobile || '', whatsapp: dbRow.whatsapp || '', email: dbRow.email || '', address: dbRow.address || '', pinCode: dbRow.pin_code || '', photoUrl: dbRow.photo_url || '', eduDetails: dbRow.edu_details || []
            },
            ...(dbRow.extended_data || {}) 
          }));
          setDataRecords(mappedStudents);
        }

        // 2. Fetch Form Submissions 
        const { data: submissionsData, error: subError } = await supabase.from('form_submissions').select('*');
        if (!subError && submissionsData) {
          const mappedSubs: MockSubmission[] = submissionsData.map(row => ({
            id: row.ref_id, date: new Date(row.created_at).toLocaleDateString('en-GB'), enrollmentNo: row.enrollment_no, name: row.student_name, programme: row.programme, formType: row.form_type, data: row.payload || {}, isRead: row.is_read || false
          }));
          setSubmissions(mappedSubs);
        }

        // 3. Fetch Uploaded Study Materials
        const { data: uploadsData, error: upError } = await supabase.from('uploaded_content').select('*');
        if (!upError && uploadsData) {
          const mappedUploads: UploadedContent[] = uploadsData.map(row => ({
            id: row.id, category: row.category, programme: row.programme, year: row.year, semester: row.semester, title: row.title, description: row.description, datePublished: new Date(row.created_at).toLocaleDateString('en-GB'), fileName: row.file_name, fileSize: row.file_size, fileData: row.file_data
          }));
          setUploadedContent(mappedUploads);
        }

        // 4. FETCH SYSTEM CONFIGURATIONS (Restored! This fixes the Environment Governance reset)
        const { data: configData, error: configError } = await supabase.from('system_configurations').select('*');
        if (!configError && configData) {
          configData.forEach(row => {
            if (row.config_key === 'form_timelines') setFormTimelines(row.config_payload);
            if (row.config_key === 'official_signatures') setOfficialSignatures(row.config_payload);
            if (row.config_key === 'live_updates') setLiveUpdatesText(row.config_payload);
          });
        }

        // 5. FETCH UI CONTROLS (Button Locks)
        const { data: lockData, error: lockError } = await supabase.from('ui_controls').select('*');
        if (!lockError && lockData) {
          const lockMap: Record<string, boolean> = {};
          lockData.forEach(row => {
            lockMap[row.button_id] = (row.is_locked === true || String(row.is_locked).toLowerCase() === 'true');
          });
          setButtonLocks(lockMap);
        }
      } catch (err: any) {
        console.error("Database sync error:", err.message);
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

  // 1. THE CREATE FUNCTION (With Auto-Update Hijack)
  const addDataRecord = async (record: DataEntryRecord) => {
    try {
      const cleanEnrollmentNo = record.basicInfo.enrollmentNo.trim();

      // 🛡️ THE BULLETPROOF SHIELD: Check the live database first!
      const { data: existingArray, error: searchError } = await supabase
        .from('students_registry')
        .select('id')
        .eq('enrollment_no', cleanEnrollmentNo)
        .limit(1);

      // If the student already exists, hijack the process and UPDATE instead!
      if (existingArray && existingArray.length > 0) {
        console.log("Existing student detected. Auto-routing to Update Mode...");
        await updateDataRecord(existingArray[0].id, record);
        return; // 🛑 Stop the function here so it doesn't try to insert!
      }

      // If they truly do not exist, proceed with standard INSERT
      const { error } = await supabase
        .from('students_registry')
        .insert([{
          enrollment_no: cleanEnrollmentNo,
          dob: record.basicInfo.dob,
          is_fully_submitted: record.isFullySubmitted || false,
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

      if (error) throw error;
      
      setDataRecords(prev => [record, ...prev]);

    } catch (err: any) {
      console.error("Master Registry Sync Failed:", err.message);
      alert("Failed to save student data to the master registry.");
    }
  };
  // 🔴 LOOK HERE: This closing brace fully ends addDataRecord!


  // 2. THE UPDATE FUNCTION (Now completely free and separate!)
  const updateDataRecord = async (id: string, record: DataEntryRecord) => {
    try {
      const { error } = await supabase.from('students_registry').update({
          enrollment_no: record.basicInfo.enrollmentNo,
          dob: record.basicInfo.dob,
          is_fully_submitted: record.isFullySubmitted || false,
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

  const secureStudentSubmission = async (enrollmentNo: string, dob: string, fullRecord: DataEntryRecord): Promise<{success: boolean, message: string}> => {
    try {
      // 1. Check if the record exists and matches the DOB
      const { data: existingData, error: fetchError } = await supabase
        .from('students_registry')
        .select('id, dob, is_fully_submitted')
        .eq('enrollment_no', enrollmentNo)
        .single();

      if (fetchError || !existingData) return { success: false, message: "Invalid Enrollment Number." };
      if (existingData.dob !== dob) return { success: false, message: "Authentication Failed: Date of Birth does not match our records." };
      if (existingData.is_fully_submitted) return { success: false, message: "Data Locked: You have already submitted your final registry details." };

      // 2. If it matches and isn't locked, UPDATE the existing record and LOCK it
      const { error: updateError } = await supabase.from('students_registry').update({
          name: fullRecord.basicInfo.name,
          father_name: fullRecord.basicInfo.fatherName,
          mother_name: fullRecord.basicInfo.motherName,
          programme: fullRecord.basicInfo.programme,
          academic_session: fullRecord.basicInfo.session,
          academic_year: fullRecord.basicInfo.year,
          semester: fullRecord.basicInfo.semester,
          mobile: fullRecord.basicInfo.contact1,
          whatsapp: fullRecord.basicInfo.whatsapp,
          email: fullRecord.basicInfo.email,
          address: fullRecord.basicInfo.address,
          pin_code: fullRecord.basicInfo.pinCode,
          photo_url: fullRecord.basicInfo.photoUrl,
          edu_details: fullRecord.basicInfo.eduDetails,
          is_fully_submitted: true,
          extended_data: { ...fullRecord }  
      }).eq('id', existingData.id);

      if (updateError) throw updateError;

      // Update local state
      fullRecord.id = existingData.id;
      fullRecord.isFullySubmitted = true;
      setDataRecords(prev => prev.map(r => r.id === existingData.id ? fullRecord : r));

      return { success: true, message: "Registry updated and locked successfully." };
    } catch (err: any) {
      console.error("Secure Submission Error:", err);
      return { success: false, message: "Server error during submission." };
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
   const toggleButtonLock = async (buttonId: string, isLocked: boolean) => {
    try {
      const { error } = await supabase
        .from('ui_controls')
        .upsert(
          { button_id: buttonId, is_locked: isLocked, last_updated: new Date().toISOString() },
          { onConflict: 'button_id' } // 🔑 THIS IS THE CRITICAL FIX
        );
      
      if (error) {
        console.error("Supabase Database Error:", error);
        throw error;
      }
      
      // Update local memory instantly
      setButtonLocks(prev => ({ ...prev, [buttonId]: isLocked }));
    } catch (err: any) {
      console.error("Failed to toggle button lock:", err.message);
      alert("Failed to update button lock status in the database! Check console.");
    }
  };

  const updateLiveUpdatesText = async (text: string) => {
    try {
      const { error } = await supabase
        .from('system_configurations')
        .upsert({ config_key: 'live_updates', config_payload: text }, { onConflict: 'config_key' });
      
      if (error) throw error;
      setLiveUpdatesText(text); // Update UI instantly
      alert("Live Updates Ticker successfully updated!");
    } catch (err: any) {
      console.error("Failed to update ticker:", err.message);
      alert("Failed to update ticker text.");
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
      notices, addNotice,
      dataRecords, addDataRecord, deleteDataRecord,
      adminUsers,
      buttonLocks, toggleButtonLock,
      uploadedContent, publishContent,  deleteContent, updateDataRecord,
      formTimelines, updateFormTimeline, updateAllFormTimelines, isFormOpen,
      officialSignatures, updateOfficialSignatures,
      galleryImages: galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY,
      addGalleryImage, deleteGalleryImage,
      liveUpdatesText, updateLiveUpdatesText,
      submissions, addSubmission, deleteSubmission, markSubmissionAsRead, generateRefNo, getSchoolEnrollmentCount, verifyStudentExists,
      secureStudentSubmission
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
