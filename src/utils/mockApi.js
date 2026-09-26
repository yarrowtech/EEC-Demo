// Frontend-only demo mode: there is no backend, so every `/api/...` call is
// intercepted here and answered with plausible canned data instead of hitting
// the network. Specific, realistic fixtures are provided for the main screen
// of each portal; anything else falls back to a generic-but-valid shape so
// components that read arrays/objects defensively just render empty states
// instead of crashing.

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Diya', 'Ananya', 'Ishaan', 'Myra', 'Kabir', 'Saanvi', 'Reyansh', 'Anika', 'Advait', 'Riya', 'Arjun', 'Kiara', 'Vihaan', 'Sara'];
const LAST_NAMES = ['Sharma', 'Verma', 'Iyer', 'Reddy', 'Nair', 'Gupta', 'Khan', 'Das', 'Menon', 'Chatterjee'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Hindi'];
const CLASSES = ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
const SECTIONS = ['A', 'B', 'C'];

const name = () => `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

const makeStudentList = (count = 24) => Array.from({ length: count }, (_, i) => ({
  _id: `stu-${i + 1}`,
  id: `stu-${i + 1}`,
  name: name(),
  roll: i + 1,
  rollNo: i + 1,
  admissionNo: `ADM-${1000 + i}`,
  class: pick(CLASSES),
  grade: pick(CLASSES),
  section: pick(SECTIONS),
  email: `student${i + 1}@demoschool.edu`,
  mobile: `9${rand(100000000, 999999999)}`,
  parentName: name(),
  attendance: rand(78, 99),
  averageGrade: rand(60, 98),
  status: 'Active',
  studentPortalUser: Math.random() > 0.3,
}));

const makeTeacherList = (count = 16) => Array.from({ length: count }, (_, i) => ({
  _id: `tch-${i + 1}`,
  id: `tch-${i + 1}`,
  name: name(),
  email: `teacher${i + 1}@demoschool.edu`,
  mobile: `9${rand(100000000, 999999999)}`,
  subject: pick(SUBJECTS),
  subjectsAssigned: [pick(SUBJECTS), pick(SUBJECTS)],
  classTeacherOf: i < 6 ? `${pick(CLASSES)} ${pick(SECTIONS)}` : '',
  experience: rand(1, 20),
  rating: (rand(38, 50) / 10).toFixed(1),
  status: i < 14 ? 'Active' : 'Archived',
}));

const makeStaffList = (count = 12) => Array.from({ length: count }, (_, i) => ({
  _id: `staff-${i + 1}`,
  id: `staff-${i + 1}`,
  name: name(),
  employeeCode: `EMP-${100 + i}`,
  email: `staff${i + 1}@demoschool.edu`,
  mobile: `9${rand(100000000, 999999999)}`,
  position: pick(['Accountant', 'Librarian', 'Lab Assistant', 'Receptionist', 'Transport Coordinator', 'IT Support']),
  department: pick(['Administration', 'Finance', 'Library', 'IT', 'Transport']),
  qualification: pick(['B.Com', 'B.Sc', 'MBA', 'Diploma', 'M.A.']),
  joiningDate: new Date(Date.now() - rand(200, 1500) * 86400000).toISOString(),
  salary: rand(18000, 45000),
  status: 'Active',
}));

const makeParentList = (count = 20) => Array.from({ length: count }, (_, i) => ({
  _id: `parent-${i + 1}`,
  id: `parent-${i + 1}`,
  name: name(),
  email: `parent${i + 1}@demoschool.edu`,
  mobile: `9${rand(100000000, 999999999)}`,
  childName: name(),
  status: 'Active',
}));

const makeNotices = (count = 6) => Array.from({ length: count }, (_, i) => ({
  _id: `notice-${i + 1}`,
  id: `notice-${i + 1}`,
  title: pick(['Annual Sports Day', 'PTA Meeting', 'Exam Schedule Released', 'Holiday Notice', 'Fee Due Reminder', 'Science Fair']),
  message: 'Please check the notice board for full details regarding this update.',
  date: new Date(Date.now() - i * 86400000).toISOString(),
  priority: pick(['normal', 'high', 'low']),
}));

const makeNotifications = (count = 6) => Array.from({ length: count }, (_, i) => ({
  _id: `notif-${i + 1}`,
  id: `notif-${i + 1}`,
  title: pick(['New assignment posted', 'Attendance marked', 'Fee payment received', 'Result published', 'Meeting scheduled']),
  message: 'Tap to view more information.',
  read: i > 2,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

// ---------------------------------------------------------------------------
// Portal-specific rich fixtures
// ---------------------------------------------------------------------------

const studentDashboard = () => ({
  success: true,
  data: {
    student: { name: 'Aarav Sharma', class: 'Grade 8', section: 'A', rollNo: 12, points: 1280 },
    attendance: { percentage: 94, present: 172, absent: 11, total: 183 },
    performance: { averageGrade: 87, trend: 'up', subjects: SUBJECTS.map((s) => ({ subject: s, score: rand(70, 98) })) },
    upcomingAssignments: Array.from({ length: 4 }, (_, i) => ({
      id: `asg-${i}`, title: `${pick(SUBJECTS)} Assignment ${i + 1}`, dueDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(), status: 'pending',
    })),
    schedule: SUBJECTS.slice(0, 5).map((s, i) => ({ period: i + 1, subject: s, time: `${9 + i}:00 - ${10 + i}:00` })),
    notices: makeNotices(4),
  },
});

const teacherDashboardPayload = () => ({
  success: true,
  data: {
    teacher: { name: 'Priya Nair', subject: 'Mathematics', classesAssigned: 4, isClassTeacher: true, rating: 4.7 },
    stats: { totalStudents: 156, classesToday: 5, pendingGrading: 12, attendanceMarked: true, avgClassScore: 82 },
    deadlines: Array.from({ length: 4 }, (_, i) => ({ id: `task-${i}`, title: `Grade ${pick(CLASSES)} homework`, dueDate: new Date(Date.now() + i * 86400000).toISOString() })),
    classes: CLASSES.slice(0, 4).map((c) => ({ class: c, section: pick(SECTIONS), studentCount: rand(28, 42) })),
    recentAssignments: makeAssignments(4),
    upcomingExams: makeExamsList(3),
    notices: makeNotices(3),
    notifications: makeNotifications(4),
  },
});

const parentDashboardPayload = () => ({
  success: true,
  data: {
    child: { name: 'Ananya Verma', class: 'Grade 6', section: 'B', rollNo: 7 },
    attendance: { percentage: 96 },
    performance: { averageGrade: 91, subjects: SUBJECTS.map((s) => ({ subject: s, score: rand(75, 99) })) },
    fees: { due: 4500, paid: 45000, nextDueDate: new Date(Date.now() + 15 * 86400000).toISOString() },
    notices: makeNotices(4),
  },
});

const principalOverview = () => ({
  success: true,
  data: {
    students: { total: 1247, newAdmissions: 38, trend: 4.2 },
    staff: { total: 123, teaching: 98, nonTeaching: 25 },
    academic: {
      averagePerformance: 82,
      gradeDistribution: [
        { grade: 'A', count: 320 }, { grade: 'B', count: 410 }, { grade: 'C', count: 300 }, { grade: 'D', count: 150 }, { grade: 'F', count: 67 },
      ],
      trend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, score: rand(75, 90) })),
    },
    attendance: {
      overall: 93.5,
      trend: Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, value: rand(88, 98) })),
    },
    finance: { revenue: 2400000, revenueGrowth: 8.3, budgetUtilization: 78.5, expenses: 1680000 },
    facilities: { classrooms: 45, labs: 8, buses: 12, hvacOperational: 95 },
  },
});

// Consumed directly as `stats` in admin/Dashboard.jsx — raw object, not wrapped.
const adminDashboardStats = () => ({
  students: { total: 1247, recent: 38 },
  teachers: { total: 98, recent: 4 },
  parents: { total: 1180, recent: 22 },
  totalUsers: 2649,
  recentTotal: 64,
});

// Consumed directly (data.totals / data.monthlyTrend) in admin/Dashboard.jsx.
const feesAdminSummary = () => ({
  academicYearName: '2025-2026',
  monthlyTrend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, collected: rand(150000, 300000) })),
  totals: { totalCollected: 1884000, totalOutstanding: 516000, overdueAmount: 96000 },
});

const academicHierarchy = () => ({
  years: [{ _id: 'year-2025-26', name: '2025-2026', isActive: true }],
  classes: CLASSES.map((c, i) => ({ _id: `class-${i}`, name: c, academicYearId: 'year-2025-26' })),
  sections: SECTIONS.map((s, i) => ({ _id: `sec-${i}`, name: s })),
});

const adminAnalytics = () => ({
  success: true,
  data: {
    summary: { score: rand(70, 95), trend: 'up' },
    trend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, value: rand(60, 95) })),
    items: Array.from({ length: 6 }, () => ({ name: name(), value: rand(50, 99) })),
  },
});

// --- Teacher portal fixtures -------------------------------------------------

const makeAssignments = (count = 10) => Array.from({ length: count }, (_, i) => ({
  _id: `assign-${i + 1}`,
  id: `assign-${i + 1}`,
  title: `${pick(SUBJECTS)} - ${pick(['Worksheet', 'Homework', 'Project', 'Chapter Review'])} ${i + 1}`,
  class: pick(CLASSES),
  section: pick(SECTIONS),
  subject: pick(SUBJECTS),
  dueDate: new Date(Date.now() + (i - 3) * 86400000).toISOString(),
  submissions: rand(10, 40),
  totalStudents: 42,
  status: i % 3 === 0 ? 'graded' : i % 3 === 1 ? 'pending' : 'open',
}));

const makeLessonPlans = (count = 8) => Array.from({ length: count }, (_, i) => ({
  _id: `lp-${i + 1}`,
  id: `lp-${i + 1}`,
  title: `${pick(SUBJECTS)} - Unit ${i + 1}`,
  class: pick(CLASSES),
  section: pick(SECTIONS),
  date: new Date(Date.now() + i * 86400000).toISOString(),
  status: pick(['draft', 'approved', 'submitted']),
  objectives: 'Students will understand and apply key concepts covered in this unit.',
}));

const makeExamsList = (count = 5) => Array.from({ length: count }, (_, i) => ({
  _id: `exam-${i + 1}`,
  id: `exam-${i + 1}`,
  name: pick(['Unit Test', 'Mid-Term', 'Final Exam', 'Class Test', 'Surprise Test']),
  subject: pick(SUBJECTS),
  class: pick(CLASSES),
  date: new Date(Date.now() + i * 5 * 86400000).toISOString(),
  totalMarks: 100,
  studentsAppeared: rand(30, 42),
  averageScore: rand(55, 85),
}));

const makeClassStudentRoster = (count = 30) => Array.from({ length: count }, (_, i) => ({
  _id: `stu-${i + 1}`,
  id: `stu-${i + 1}`,
  name: name(),
  rollNo: i + 1,
  attendance: rand(70, 100),
  lastScore: rand(45, 99),
  present: Math.random() > 0.1,
}));

const makeExcuseLetters = (count = 5) => Array.from({ length: count }, (_, i) => ({
  _id: `excuse-${i + 1}`,
  id: `excuse-${i + 1}`,
  studentName: name(),
  class: pick(CLASSES),
  reason: pick(['Medical leave', 'Family function', 'Travel', 'Fever', 'Dental appointment']),
  date: new Date(Date.now() - i * 86400000).toISOString(),
  status: pick(['pending', 'approved', 'rejected']),
}));

const makeObservations = (count = 6) => Array.from({ length: count }, (_, i) => ({
  _id: `obs-${i + 1}`,
  id: `obs-${i + 1}`,
  studentName: name(),
  category: pick(['Behavior', 'Participation', 'Wellbeing', 'Academic']),
  note: 'Showed great improvement and active participation in class this week.',
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

const makeChatContacts = (count = 10) => Array.from({ length: count }, (_, i) => ({
  _id: `contact-${i + 1}`,
  id: `contact-${i + 1}`,
  name: name(),
  role: pick(['Student', 'Parent']),
  lastMessage: 'Thank you for the update!',
  unread: i < 2 ? rand(1, 3) : 0,
  lastActive: new Date(Date.now() - i * 3600000).toISOString(),
}));

const teacherAnalytics = () => ({
  success: true,
  data: {
    classAverage: 82,
    atRiskCount: 6,
    topPerformers: Array.from({ length: 5 }, () => ({ name: name(), score: rand(90, 99) })),
    trend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, average: rand(70, 90) })),
  },
});

const teacherHoliday = () => ({
  success: true,
  data: Array.from({ length: 6 }, (_, i) => ({
    _id: `hol-${i + 1}`,
    name: pick(['Independence Day', 'Diwali', 'Winter Break', 'Republic Day', 'Summer Vacation', 'Founders Day']),
    date: new Date(Date.now() + (i + 1) * 15 * 86400000).toISOString(),
  })),
});

// ---------------------------------------------------------------------------
// Route table — matched in order, first match wins
// ---------------------------------------------------------------------------

const routes = [
  { test: /\/api\/student\/dashboard/, get: studentDashboard },
  { test: /\/api\/teacher\/dashboard\/allocations/, get: () => ({ success: true, data: CLASSES.slice(0, 4).map((c) => ({ class: c, section: pick(SECTIONS), subject: pick(SUBJECTS) })) }) },
  { test: /\/api\/teacher\/dashboard/, get: teacherDashboardPayload },
  { test: /\/api\/academic\/hierarchy/, get: academicHierarchy },
  { test: /\/api\/academic\/active-year/, get: () => ({ success: true, data: { _id: 'year-2025-26', name: '2025-2026', isActive: true } }) },
  // Raw arrays — most admin screens call `res.json()` and expect the array directly.
  { test: /\/api\/academic\/years/, get: () => [{ _id: 'year-2025-26', name: '2025-2026', isActive: true }] },
  { test: /\/api\/academic\/classes/, get: () => CLASSES.map((c, i) => ({ _id: `class-${i}`, name: c, academicYearId: 'year-2025-26' })) },
  { test: /\/api\/academic\/sections/, get: () => SECTIONS.map((s, i) => ({ _id: `sec-${i}`, name: s })) },
  { test: /\/api\/academic\/subjects/, get: () => SUBJECTS.map((s, i) => ({ _id: `sub-${i}`, name: s })) },
  { test: /\/api\/academic\/buildings|\/api\/academic\/floors|\/api\/academic\/rooms/, get: () => [] },
  { test: /\/api\/admin\/users\/dashboard-stats/, get: adminDashboardStats },
  { test: /\/api\/admin\/users\/get-students/, get: () => makeStudentList() },
  { test: /\/api\/admin\/users\/get-teachers/, get: () => makeTeacherList() },
  { test: /\/api\/admin\/users\/get-staff/, get: () => makeStaffList() },
  { test: /\/api\/admin\/users\/get-parents/, get: () => makeParentList() },
  { test: /\/api\/admin\/users\/get-principals/, get: () => [{ _id: 'principal-1', name: 'Dr. Rajesh Kumar', email: 'principal@demoschool.edu', status: 'Active' }] },
  { test: /\/api\/admin\/users\/teacher-attendance/, get: () => ({ success: true, data: makeTeacherList(20).map((t) => ({ ...t, present: Math.random() > 0.08 })) }) },
  { test: /\/api\/admin\/users\/teachers\/archived/, get: () => makeTeacherList(4).map((t) => ({ ...t, status: 'Archived' })) },
  { test: /\/api\/admin-analytics/, get: adminAnalytics },
  { test: /\/api\/departments/, get: () => ({ success: true, data: ['Administration', 'Finance', 'Library', 'IT', 'Transport'].map((d, i) => ({ _id: `dept-${i}`, name: d })) }) },
  { test: /\/api\/audit-logs/, get: () => ({ success: true, data: Array.from({ length: 8 }, (_, i) => ({ _id: `log-${i}`, action: pick(['Login', 'Updated record', 'Created student', 'Deleted notice', 'Fee payment recorded']), user: name(), timestamp: new Date(Date.now() - i * 3600000).toISOString() })) }) },
  { test: /\/api\/promotion\/preview|\/api\/promotion\/history/, get: () => ({ success: true, data: makeStudentList(15) }) },
  { test: /\/api\/promotion\/leaving-students/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/teacher-allocations/, get: () => ({ success: true, data: makeTeacherList(10).map((t) => ({ ...t, class: pick(CLASSES), section: pick(SECTIONS), subject: pick(SUBJECTS) })) }) },
  { test: /\/api\/timetable\/all/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/holidays\/admin/, get: teacherHoliday },
  { test: /\/api\/reports\/summary/, get: () => ({ success: true, data: { totalReports: 24, generatedThisMonth: 6 } }) },
  { test: /\/api\/exam\/groups/, get: () => Array.from({ length: 6 }, (_, i) => ({
    _id: `group-${i + 1}`,
    name: `${pick(['Unit Test', 'Mid-Term', 'Final', 'Class Test'])} ${i + 1}`,
    examType: pick(['Unit Test', 'Term Exam', 'Final Exam']),
    classId: { _id: `class-${i}`, name: pick(CLASSES) },
    sectionId: { _id: `sec-${i % 3}`, name: pick(SECTIONS) },
    startDate: new Date(Date.now() + i * 5 * 86400000).toISOString(),
    status: pick(['scheduled', 'completed', 'draft']),
  })) },
  { test: /\/api\/exam\/fetch/, get: () => makeExamsList(10) },
  { test: /\/api\/exam\/seating-plans/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/exam\/auto-schedule-settings|\/api\/exam\/creation-drafts/, get: () => ({ success: true, data: {} }) },
  { test: /\/api\/admin\/feedback/, get: () => ({ success: true, data: Array.from({ length: 6 }, (_, i) => ({ _id: `fb-${i}`, from: name(), message: pick(['Great platform, very intuitive.', 'Would like more report options.', 'App runs smoothly, thanks!', 'Please add dark mode.']), rating: rand(3, 5), date: new Date(Date.now() - i * 86400000).toISOString() })) }) },
  { test: /\/api\/support\/requests/, get: () => ({ success: true, data: Array.from({ length: 5 }, (_, i) => ({ _id: `ticket-${i}`, subject: pick(['Login issue', 'Fee receipt not generated', 'Unable to upload marks', 'App crashing on upload']), status: pick(['open', 'resolved', 'in-progress']), raisedBy: name(), date: new Date(Date.now() - i * 86400000).toISOString() })) }) },
  { test: /\/api\/support\/settings/, get: () => ({ success: true, data: { supportEmail: 'support@demoschool.edu', supportPhone: '+91 98765 43210' } }) },
  { test: /\/api\/schools\/registrations/, get: () => ({ success: true, data: Array.from({ length: 4 }, (_, i) => ({ _id: `reg-${i}`, schoolName: `Demo School ${i + 1}`, contactEmail: `admin${i}@demoschool.edu`, status: pick(['pending', 'approved']), date: new Date(Date.now() - i * 86400000).toISOString() })) }) },
  { test: /\/api\/schools/, get: () => ({ success: true, data: Array.from({ length: 8 }, (_, i) => ({ _id: `sch-${i}`, name: `Demo School ${i + 1}`, students: rand(300, 1500) })) }) },
  { test: /\/api\/attendance\/admin/, get: () => ({ success: true, data: { overall: rand(88, 97), byClass: CLASSES.map((c) => ({ class: c, percentage: rand(85, 99) })) } }) },
  { test: /\/api\/settings\/payment/, get: () => ({ success: true, data: { gateway: 'Razorpay', mode: 'test', enabled: true } }) },
  { test: /\/api\/parent-dashboard|\/api\/parent\//, get: parentDashboardPayload },
  { test: /\/api\/principal\/overview/, get: principalOverview },
  { test: /\/api\/principal\/academic\/years/, get: () => ({ success: true, data: [{ _id: 'year-2025-26', name: '2025-2026' }] }) },
  { test: /\/api\/principal\/auth\/profile/, get: () => ({ success: true, data: { name: 'Dr. Rajesh Kumar', role: 'Principal', email: 'principal@demo.school' } }) },
  { test: /\/api\/fees\/admin\/summary/, get: feesAdminSummary },
  { test: /\/api\/fees\/admin/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/fees\/structures/, get: () => ({ success: true, data: CLASSES.map((c, i) => ({ _id: `fs-${i}`, class: c, amount: rand(15000, 45000) })) }) },
  { test: /\/api\/fees\/invoices|\/api\/fees\/invoice/, get: () => makeStudentList(15).map((s, i) => ({ _id: `inv-${i}`, studentName: s.name, class: s.class, amount: rand(5000, 25000), status: pick(['paid', 'pending', 'overdue']), dueDate: new Date(Date.now() + i * 86400000).toISOString() })) },
  { test: /\/api\/fees\/parent/, get: () => ({ success: true, data: { due: 4500, paid: 45000, invoices: [] } }) },
  { test: /\/api\/fees/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/nif\/students/, get: () => ({ success: true, data: makeStudentList() }) },
  { test: /\/api\/attendance\/teacher/, get: () => ({ success: true, data: makeClassStudentRoster() }) },
  { test: /\/api\/attendance/, get: () => ({ success: true, data: { percentage: rand(85, 98), present: rand(150, 180), absent: rand(2, 15) } }) },
  { test: /\/api\/assignment\/teacher/, get: () => ({ success: true, data: makeAssignments() }) },
  { test: /\/api\/assignment/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/lesson-plans\/teacher/, get: () => ({ success: true, data: makeLessonPlans() }) },
  { test: /\/api\/lesson-plans/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/exam\/results/, get: () => ({ success: true, data: SUBJECTS.map((s) => ({ subject: s, score: rand(60, 98), grade: pick(['A+', 'A', 'B+', 'B']) })) }) },
  { test: /\/api\/exam\/teacher|\/api\/exam\/groups/, get: () => ({ success: true, data: makeExamsList() }) },
  { test: /\/api\/reports\/report-cards/, get: () => ({ success: true, data: SUBJECTS.map((s) => ({ subject: s, score: rand(60, 98), grade: pick(['A+', 'A', 'B+', 'B']) })) }) },
  { test: /\/api\/exam/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/excuse-letters/, get: () => ({ success: true, data: makeExcuseLetters() }) },
  { test: /\/api\/observations/, get: () => ({ success: true, data: makeObservations() }) },
  { test: /\/api\/teacher-analytics/, get: teacherAnalytics },
  { test: /\/api\/holidays/, get: teacherHoliday },
  { test: /\/api\/notifications\/user|\/api\/notifications\/teacher/, get: () => ({ success: true, data: makeNotifications() }) },
  { test: /\/api\/notifications/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/alcove\/posts|notice/i, get: () => ({ success: true, data: makeNotices() }) },
  { test: /\/api\/chat\/contacts|\/api\/chat\/students|\/api\/chat\/parents/, get: () => ({ success: true, data: makeChatContacts() }) },
  { test: /\/api\/chat\/threads/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/tenant/, get: () => ({ organization: { name: 'Electronic Educare Demo School', primaryColor: '#2563eb', secondaryColor: '#0f172a' }, isMainDomain: true }) },
  { test: /\/api\/super-admin\/overview/, get: () => ({ success: true, data: { schools: 12, activeUsers: 4300, revenue: 890000 } }) },
  { test: /\/api\/super-admin\/schools/, get: () => ({ success: true, data: Array.from({ length: 8 }, (_, i) => ({ _id: `sch-${i}`, name: `Demo School ${i + 1}`, students: rand(300, 1500) })) }) },
];

const genericFallback = () => ({ success: true, data: [], message: 'Demo mode: no backend connected' });

const isApiUrl = (url) => typeof url === 'string' && url.includes('/api/');

export const installMockApi = () => {
  if (typeof window === 'undefined' || window.__mockApiInstalled) return;
  window.__mockApiInstalled = true;
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (!isApiUrl(url)) return realFetch(input, init);

    const method = (init?.method || 'GET').toUpperCase();
    const path = url.replace(/^https?:\/\/[^/]+/, '');

    // Non-GET requests: pretend the write succeeded.
    if (method !== 'GET') {
      await new Promise((r) => setTimeout(r, 150));
      return json({ success: true, message: 'Saved (demo mode)' });
    }

    const route = routes.find((r) => r.test.test(path));
    const payload = route ? route.get(path) : genericFallback();
    await new Promise((r) => setTimeout(r, 150));
    return json(payload);
  };
};
