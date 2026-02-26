
export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  DB_ADMIN = 'DB_ADMIN'
}

export enum PersonDomain {
  STUDENT = 'Student',
  SCHOLAR = 'Scholar',
  FACULTY = 'Faculty',
  NON_TEACHING = 'Non-Teaching Staff'
}

export interface User {
  role: Role;
  email?: string;
  studentId?: string;
  adminRole?: AdminRole;
}

export interface EducationalDetail {
  programme: string;
  year: string;
  subject: string;
  board: string;
  result: string;
}

export interface StudentFormData {
  name: string;
  enrollmentNo: string;
  fatherName: string;
  motherName: string;
  programme: string;
  session: string;
  year: string;
  semester: string;
  email: string;
  address: string;
  pinCode: string;
  photoUrl: string;
  studentSignatureUrl: string;
  mobile: string;
  whatsapp: string;
  formDate?: string;
  examNature?: string;
  examMonth?: string;
  examYear?: string;
  leaveTo?: string;
  leaveSubject?: string;
  leaveReason?: string;
  internshipSchool?: string;
  internshipObserver?: string;
  internshipStartDate?: string;
  internshipEndDate?: string;
  eduDetails?: EducationalDetail[];
}

export interface DataEntryRecord {
  id: string;
  domain: PersonDomain;
  basicInfo: {
    enrollmentNo: string;
    name: string;
    fatherName: string;
    motherName: string;
    programme: string;
    session: string;
    year: string;
    photoUrl: string;
    contact1: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  attendance1?: AttendanceRecord[];
  attendance2?: AttendanceRecord[];
  practical1?: PracticalFileStatus[];
  practical2?: PracticalFileStatus[];
  assignments?: PracticalFileStatus[];
  communityOutreach1?: ParticipationStatus[];
  communityOutreach2?: ParticipationStatus[];
  culturalContribution?: ParticipationStatus[];
  academicPerformance?: ParticipationStatus[];
  examinations1?: ParticipationStatus[];
  examinations2?: ParticipationStatus[];
  sports?: ParticipationStatus[];
  qualifications?: ParticipationStatus[];
  academicAchievements?: {
    researchPapers: string;
    workshops: string;
    booksWritten: string;
    educationalApps: string;
  };
  adminWork?: {
    academicContribution: string;
    mentor: string;
    coCurricular: string;
    examination: string;
  };
  evaluation?: {
    practicalFiles: string;
    ctScripts: string;
    yearlyScripts: string;
    assignments: string;
    studentRegisters: string;
    facultyRegisters: string;
  };
  syllabusContribution?: {
    syllabus: string;
    officialReports: string;
    questionBank: string;
  };
  technicalAchievements?: string;
  otherResponsibilities?: ParticipationStatus[];
}

export interface AttendanceRecord {
  month: string;
  workingDays: number;
  presentDays: number;
  percentage: number;
}

export interface PracticalFileStatus {
  name: string;
  submitted: 'Submitted' | 'Not Submitted';
}

export interface ParticipationStatus {
  name: string;
  status: 'Participated' | 'Not Participated' | 'Attended' | 'Not Attended' | 'Present' | 'Absent' | 'Filled' | 'Not Filled' | 'Pass' | 'Failed' | 'Yes' | 'No';
}

export interface FormTimeline {
  formId: string;
  formName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UploadedContent {
  id: string;
  category: string;
  programme: string;
  year: string;
  semester: string;
  title: string;
  description: string;
  datePublished: string;
  fileName: string;
  fileSize: string;
  fileData?: string; 
}

export interface MockSubmission {
  id: string;
  date: string;
  enrollmentNo: string;
  name: string;
  programme: string;
  formType: string;
  school?: string; 
  data?: any; 
  isRead?: boolean; 
}

export interface AdminUser {
  id: string;
  email: string;
  password?: string;
  role: AdminRole;
}

export interface GoverningBodyMember {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

export interface OfficialSignatures {
  deanSign?: string;
  progCoordSign?: string;
  internshipCoordSign?: string;
}
