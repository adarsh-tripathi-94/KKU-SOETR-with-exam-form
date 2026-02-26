
export const PROGRAMMES = [
  "D.El.Ed.",
  "B.Ed.",
  "B.A.B.Ed.",
  "B.Sc.B.Ed.",
  "B.Com.B.Ed.",
  "M.Ed.",
  "Ph.D."
];

export const SESSIONS_STANDARD = ["2024-2026", "2025-2027", "2026-2028", "2027-2029", "2028-2030", "2030-2032"];
export const SESSIONS_INTEGRATED = ["2030-2034", "2031-2035", "2032-2036"];

// Added missing SESSIONS export to resolve import errors in multiple files
export const SESSIONS = [...SESSIONS_STANDARD, ...SESSIONS_INTEGRATED];

export const getSessionsForProgramme = (programme: string): string[] => {
  if (["B.A.B.Ed.", "B.Sc.B.Ed.", "B.Com.B.Ed."].includes(programme)) {
    return SESSIONS_INTEGRATED;
  }
  return SESSIONS_STANDARD;
};

export const getYearsForProgramme = (programme: string): string[] => {
  if (["B.A.B.Ed.", "B.Sc.B.Ed.", "B.Com.B.Ed."].includes(programme)) {
    return ["First Year", "Second Year", "Third Year", "Fourth Year"];
  }
  return ["First Year", "Second Year"];
};

export const getSemestersForProgramme = (programme: string): string[] => {
  if (["B.A.B.Ed.", "B.Sc.B.Ed.", "B.Com.B.Ed."].includes(programme)) {
    return ["First Semester", "Second Semester", "Third Semester", "Fourth Semester", "Fifth Semester", "Six Semester", "Seventh Semester", "Eighth Semester"];
  }
  return ["First Semester", "Second Semester", "Third Semester", "Fourth Semester"];
};

// Helper to determine if a programme/session combo uses Semesters
export const isSemesterSystem = (programme: string, session: string): boolean => {
  if (programme === "D.El.Ed.") return false;
  if (programme === "B.Ed." && session === "2024-2026") return false;
  if (programme === "M.Ed." || programme.includes("B.Ed.")) return true;
  return false;
};

export const EXAM_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const EXAM_YEARS = Array.from({ length: 26 }, (_, i) => (2025 + i).toString());
export const EXAM_NATURES = ["Annual Examination", "Odd Semester Examination", "Even Semester Examination", "Backlog Examination", "Special Examination"];

export const MOCK_CURRICULUM: any = {
  "B.Ed.": {
    "2024-2026": {
      "First Year": [
        { type: "C.C.", code: "ERBD1101", name: "Childhood and Growing Up", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1102", name: "Contemporary India & Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1103", name: "Learning and Teaching", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1104", name: "Language across the Curriculum", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "C.C.", code: "ERBD1105", name: "Understanding Discipline & Subject", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "C.C.", code: "ERPC1124", name: "School Internship Programme - I (4 week)", credit: 2, ie: 50, ee: 0, mm: 50 },
        { type: "O.E.C.", code: "ERBD1105/25", name: "Select Any One (OEC)", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Gender, School and Society", "Value and Peace Education"] },
        { type: "D.S.E.C", code: "DSEC-B24", name: "Pedagogy of School Subject Part-I", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Pedagogy of Hindi", "Pedagogy of English", "Pedagogy of Urdu", "Pedagogy of Sanskrit", "Pedagogy of Mathematics", "Pedagogy of Physical Science", "Pedagogy of Biological Science", "Pedagogy of History", "Pedagogy of Civics", "Pedagogy of Geography", "Pedagogy of Economics", "Pedagogy of Social Science", "Pedagogy of Computer Science", "Pedagogy of Home Science", "Pedagogy of Commerce"] },
        { type: "A.E.C.C", code: "ERBD1126", name: "Environmental Science", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "A.E.C.C", code: "ERBD1127", name: "Hindi Communication", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "S.E.C.", code: "ERPC1122", name: "Reading and Reflecting on Texts", credit: 2, ie: 50, ee: 0, mm: 50 },
        { type: "S.E.C.", code: "ERPC1123", name: "Drama and Art in Education", credit: 2, ie: 50, ee: 0, mm: 50 }
      ],
      "Second Year": [
        { type: "C.C.", code: "ERBD1201", name: "Knowledge and Curriculum", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1202", name: "Assessment for Learning", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1203", name: "Creating an Inclusive School", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "C.C.", code: "ERPC1224", name: "School Internship Programme-II (16 week)", credit: 8, ie: 100, ee: 100, mm: 200 },
        { type: "O.E.C.", code: "OEC-Y2", name: "Select Any One (OEC)", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Health, Yoga and Physical Education", "Guidance and Counselling", "Understanding School Management and leadership", "Teacher Education"] }
      ]
    },
    "2025-2027": {
      "First Semester": [
        { type: "C.C.", code: "ERBD1101", name: "Childhood and Growing Up", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1102", name: "Contemporary India & Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1105", name: "Understanding Discipline & Subject", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "C.C.", code: "ERBD1106", name: "Gender, School and Society", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "O.E.C.", code: "OEC-S1", name: "Open Elective (Select One)", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Value and Peace Education", "Educational Techonology", "Human Right Education"] },
        { type: "A.E.C.C.", code: "ERBD1126", name: "Environmental Science", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "S.E.C.", code: "ERPC1122", name: "Reading and Reflecting on Texts", credit: 2, ie: 50, ee: 0, mm: 50 },
        { type: "S.E.C.", code: "ERPC1123", name: "Drama & Art in Education", credit: 2, ie: 50, ee: 0, mm: 50 }
      ],
      "Second Semester": [
        { type: "C.C.", code: "ERBD1103", name: "Learning and Teaching", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1104", name: "Language across the Curriculum", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "C.C.", code: "ERPC1124", name: "School Internship Programme-I (4 week)", credit: 4, ie: 100, ee: 0, mm: 100 },
        { type: "O.E.C.", code: "OEC-S2", name: "Open Elective (Select One)", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Population Education", "Leadership and Policy Studies", "Education for Sustainable development"] },
        { type: "D.S.E.C", code: "DSEC-S2", name: "Pedagogy Part-I (Select Any Two)", credit: 4, ie: 30, ee: 70, mm: 100, isElective: true, isMultiSelect: true, maxSelection: 2, options: ["Pedagogy of Hindi", "Pedagogy of English", "Pedagogy of Urdu", "Pedagogy of Sanskrit", "Pedagogy of Mathematics", "Pedagogy of Physical Science", "Pedagogy of Biological Science", "Pedagogy of History", "Pedagogy of Civics", "Pedagogy of Geography", "Pedagogy of Economics", "Pedagogy of Social Science", "Pedagogy of Computer Science", "Pedagogy of Home Science", "Pedagogy of Commerce"] },
        { type: "A.E.C.C", code: "ERBD1127", name: "Hindi Communication", credit: 4, ie: 30, ee: 70, mm: 100 }
      ],
      "Third Semester": [
        { type: "C.C.", code: "ERBD1201", name: "Knowledge and Curriculum", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C.", code: "ERBD1202", name: "Assessment for Learning", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "O.E.C.", code: "OEC-S3", name: "Open Elective (Select One)", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Guidance and Counselling", "Teacher Education", "Cultural Competency in Education"] },
        { type: "A.E.C.C.", code: "ERBD1226", name: "Emotional Intelligence", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "S.E.C.", code: "ERPC1222", name: "Creatical Understanding of ICT", credit: 2, ie: 50, ee: 0, mm: 50 },
        { type: "S.E.C.", code: "ERPC1223", name: "Understanding the Self", credit: 2, ie: 50, ee: 0, mm: 50 }
      ],
      "Fourth Semester": [
        { type: "C.C.", code: "ERBD1203", name: "Creating an Inclusive School", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "C.C.", code: "ERPC1224", name: "School Internship Programme-II (16 week)", credit: 12, ie: 200, ee: 100, mm: 300 },
        { type: "O.E.C.", code: "OEC-S4", name: "Open Elective (Select One)", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Health, Yoga and Physical Education", "Understanding School Management and leadership", "Langauge Culture and Education"] },
        { type: "D.S.E.C", code: "DSEC-S4", name: "Pedagogy Part-II (Select Any Two)", credit: 4, ie: 30, ee: 70, mm: 100, isElective: true, isMultiSelect: true, maxSelection: 2, options: ["Pedagogy of Hindi", "Pedagogy of English", "Pedagogy of Urdu", "Pedagogy of Sanskrit", "Pedagogy of Mathematics", "Pedagogy of Physical Science", "Pedagogy of Biological Science", "Pedagogy of History", "Pedagogy of Civics", "Pedagogy of Geography", "Pedagogy of Economics", "Pedagogy of Social Science", "Pedagogy of Computer Science", "Pedagogy of Home Science", "Pedagogy of Commerce"] },
        { type: "A.E.C.C", code: "ERBD1227", name: "English Communication", credit: 3, ie: 30, ee: 70, mm: 100 }
      ]
    }
  },
  "M.Ed.": {
    "All": {
      "First Semester": [
        { type: "C.C. 1", code: "ERMD:1301", name: "Psychology of learning & development", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 2", code: "ERMD:1302", name: "Historical / political economy perspectives", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 3", code: "ERMD:1303", name: "Relevance of teachers Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 4", code: "ERMD:1304", name: "Fundamentals of Educational research", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "EPC-1", code: "EPC:1305", name: "Communication and expository writing", credit: 2, ie: 50, ee: 0, mm: 50 }
      ],
      "Second Semester": [
        { type: "C.C. 5", code: "ERMD:1306", name: "Sociological & philosophical perspectives", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 6", code: "ERMD:1307", name: "Teacher Education – issues and challenges", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 7", code: "ERMD:1308", name: "Curriculum studies", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 8", code: "ERMD:1309", name: "Innovative teaching-learning", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 9", code: "ERMD:1310", name: "Dissertation (1/2)", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "EPC-2", code: "EPC:1311", name: "Internship in a teacher Education institution", credit: 4, ie: 50, ee: 50, mm: 100 }
      ],
      "Third Semester": [
        { type: "O.E.C.", code: "OEC-M3-1", name: "Open Elective (Select One)", credit: 4, ie: 30, ee: 70, mm: 100, isElective: true, options: ["Elementary Education for differently abled", "Secondary Education for differently abled"] },
        { type: "O.E.C.", code: "OEC-M3-2", name: "Open Elective (Select One)", credit: 4, ie: 30, ee: 70, mm: 100, isElective: true, options: ["Curriculum pedagogy and assessment (Elementary)", "Curriculum pedagogy and assessment (Secondary)"] },
        { type: "C.C. 10", code: "ERMD:1405", name: "Advanced research methodology", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 11", code: "ERMD:1406", name: "Creativity & value Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "EPC-3", code: "EPC:1407", name: "Internship", credit: 4, ie: 50, ee: 0, mm: 50 },
        { type: "C.C. 12", code: "ERMD:1408", name: "Dissertation (1/2) & Env Education", credit: 4, ie: 30, ee: 70, mm: 100 }
      ],
      "Fourth Semester": [
        { type: "O.E.C.", code: "OEC-M4-1", name: "Open Elective (Select One)", credit: 4, ie: 30, ee: 70, mm: 100, isElective: true, options: ["Policy, economics and planning (Elementary)", "Policy, economics and planning (Secondary)"] },
        { type: "O.E.C.", code: "OEC-M4-2", name: "Open Elective (Select One)", credit: 4, ie: 30, ee: 70, mm: 100, isElective: true, options: ["Educational management and administration (Elementary)", "Educational management and administration (Secondary)"] },
        { type: "C.C. 13", code: "ERMD:1413", name: "Educational technology & ICT", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "C.C. 14", code: "ERMD:1414", name: "Dissertation Final", credit: 4, ie: 100, ee: 0, mm: 100 },
        { type: "EPC-4", code: "EPC:1415", name: "Seminar/Workshop (16 weeks)", credit: 4, ie: 100, ee: 0, mm: 100 }
      ]
    }
  },
  "D.El.Ed.": {
    "All": {
      "First Year": [
        { type: "I", code: "06020101", name: "Understanding Society, Education and Curriculum", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "II", code: "06020102", name: "Childhood and Development of Children", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "III", code: "06020103", name: "Early Childhood Care and Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "IV", code: "06020104", name: "School culture, change and Teacher Development", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "V", code: "06020105", name: "Understanding Language and Early Language Dev", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "VI", code: "06020106", name: "Gender and Inclusive Perspectives", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "VII", code: "06020107", name: "Pedagogy of Mathematics-I (Primary)", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "VIII", code: "06020108", name: "Pedagogy of Hindi-I (Primary)", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "IX", code: "06020109", name: "Proficiency in English", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "X", code: "06020110", name: "Pedagogy of Environmental Studies", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "XI", code: "06020111", name: "Art Integrated Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "XII", code: "06020112", name: "Information and Communication Technology", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "XIII", code: "SEP-I", name: "School Experience Programme– I (4 week)", credit: 4, ie: 100, ee: 0, mm: 100 }
      ],
      "Second Year": [
        { type: "I", code: "06020201", name: "Education in Contemporary Indian Society", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "II", code: "06020202", name: "Cognition, Learning and Development", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "III", code: "06020203", name: "Task and Education", credit: 2, ie: 50, ee: 0, mm: 50 },
        { type: "IV", code: "06020204", name: "Understanding the Self", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "V", code: "06020205", name: "Health, Yoga and Physical Education", credit: 4, ie: 30, ee: 70, mm: 100 },
        { type: "VI", code: "06020206", name: "Pedagogy of English (Primary)", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "VII", code: "06020207", name: "Pedagogy of Mathematics-II (Primary)", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "VIII", code: "06020208", name: "Pedagogy of Hindi-II (Primary)", credit: 2, ie: 15, ee: 35, mm: 50 },
        { type: "IX", code: "06020209", name: "Upper Primary level any one", credit: 2, ie: 15, ee: 35, mm: 50, isElective: true, options: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit", "Urdu"] },
        { type: "X", code: "SEP-2", name: "School Experience Programme-II (16 Week)", credit: 16, ie: 300, ee: 100, mm: 400 }
      ]
    }
  }
};

export const MONTHS = [
  { name: 'August', days: 24 }, { name: 'September', days: 23 }, { name: 'October', days: 19 },
  { name: 'November', days: 22 }, { name: 'December', days: 24 }, { name: 'January', days: 23 },
  { name: 'February', days: 22 }, { name: 'March', days: 21 }, { name: 'April', days: 24 },
  { name: 'May', days: 25 }, { name: 'June', days: 20 }, { name: 'July', days: 26 }
];

export const SIDEBAR_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Data Entry Form', path: '/form/data-entry' },
  { label: 'Notice Board', path: '/view/notice-board' },
  { label: 'Study Materials', path: '/view/study-materials' },
  { label: 'Leave Application', path: '/form/leave' },
  { label: 'Assignment Questions', path: '/view/assignments' },
  { label: 'Fill Exam Form', path: '/form/exam' },
  { label: 'Time-Table', path: '/view/timetable' },
  { label: 'Question Bank', path: '/view/question-bank' },
  { label: 'Internship Letter', path: '/form/internship' },
  { label: 'Result', path: '/view/result' },
  { label: 'Grievance', path: '/form/grievance' },
  { label: 'Feedback', path: 'https://6984b4fa129d0152d3f722cf--precious-treacle-692682.netlify.app/' },
];

export interface SchoolMapping {
  name: string;
  supervisors: string[];
}

export const BED_MED_SCHOOLS: SchoolMapping[] = [
  { name: 'K.K. High School, Berauti', supervisors: ['Dr. A. Sharma'] },
  { name: 'Government High School, Biharsharif', supervisors: ['Mr. C. Singh'] },
  { name: 'S.S. Academy, Nalanda', supervisors: ['Ms. E. Verma'] },
  { name: 'Model High School, Rajgir', supervisors: ['Mr. R. Yadav'] },
  { name: 'St. Mary School, Nalanda', supervisors: ['Dr. P. Jha'] },
  { name: 'Dav Public School, Biharsharif', supervisors: ['Mr. S. Kumar'] }
];

export const DELED_INT_SCHOOLS: SchoolMapping[] = [
  { name: 'Primary School, Berauti', supervisors: ['Mr. G. Ram'] },
  { name: 'Middle School, Nepura', supervisors: ['Dr. I. Prasad'] },
  { name: 'K.K. Public School', supervisors: ['Ms. L. Das'] },
  { name: 'Zila School, Biharsharif', supervisors: ['Mr. V. Tiwari'] },
  { name: 'Basic School, Nalanda', supervisors: ['Dr. K. Singh'] }
];
