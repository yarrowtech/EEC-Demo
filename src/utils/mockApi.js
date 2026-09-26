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
  rollNo: i + 1,
  class: pick(CLASSES),
  section: pick(SECTIONS),
  attendance: rand(78, 99),
  averageGrade: rand(60, 98),
  status: 'active',
}));

const makeTeacherList = (count = 16) => Array.from({ length: count }, (_, i) => ({
  _id: `tch-${i + 1}`,
  id: `tch-${i + 1}`,
  name: name(),
  subject: pick(SUBJECTS),
  experience: rand(1, 20),
  rating: (rand(38, 50) / 10).toFixed(1),
  status: 'active',
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
    teacher: { name: 'Priya Nair', subject: 'Mathematics', classesAssigned: 4 },
    stats: { totalStudents: 156, classesToday: 5, pendingGrading: 12, attendanceMarked: true },
    deadlines: Array.from({ length: 4 }, (_, i) => ({ id: `task-${i}`, title: `Grade ${pick(CLASSES)} homework`, dueDate: new Date(Date.now() + i * 86400000).toISOString() })),
    classes: CLASSES.slice(0, 4).map((c) => ({ class: c, section: pick(SECTIONS), studentCount: rand(28, 42) })),
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

const adminStats = () => ({
  success: true,
  data: {
    students: { total: 1247, active: 1198, ptc: 78.5 },
    teachers: { total: 98, active: 95 },
    staff: { total: 123 },
    attendanceToday: 93.2,
    feesCollectedThisMonth: 512000,
  },
});

const financialSummary = () => ({
  success: true,
  data: {
    totals: { revenue: 2400000, collected: 1884000, pending: 516000 },
    trend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, collected: rand(150000, 300000) })),
  },
});

// ---------------------------------------------------------------------------
// Route table — matched in order, first match wins
// ---------------------------------------------------------------------------

const routes = [
  { test: /\/api\/student\/dashboard/, get: studentDashboard },
  { test: /\/api\/teacher\/dashboard\/allocations/, get: () => ({ success: true, data: CLASSES.slice(0, 4).map((c) => ({ class: c, section: pick(SECTIONS), subject: pick(SUBJECTS) })) }) },
  { test: /\/api\/teacher\/dashboard/, get: teacherDashboardPayload },
  { test: /\/api\/academic\/active-year/, get: () => ({ success: true, data: { _id: 'year-2025-26', name: '2025-2026', isActive: true } }) },
  { test: /\/api\/academic\/years/, get: () => ({ success: true, data: [{ _id: 'year-2025-26', name: '2025-2026', isActive: true }] }) },
  { test: /\/api\/academic\/classes/, get: () => ({ success: true, data: CLASSES.map((c, i) => ({ _id: `class-${i}`, name: c })) }) },
  { test: /\/api\/academic\/sections/, get: () => ({ success: true, data: SECTIONS.map((s, i) => ({ _id: `sec-${i}`, name: s })) }) },
  { test: /\/api\/academic\/subjects/, get: () => ({ success: true, data: SUBJECTS.map((s, i) => ({ _id: `sub-${i}`, name: s })) }) },
  { test: /\/api\/parent-dashboard|\/api\/parent\//, get: parentDashboardPayload },
  { test: /\/api\/principal\/overview/, get: principalOverview },
  { test: /\/api\/principal\/academic\/years/, get: () => ({ success: true, data: [{ _id: 'year-2025-26', name: '2025-2026' }] }) },
  { test: /\/api\/principal\/auth\/profile/, get: () => ({ success: true, data: { name: 'Dr. Rajesh Kumar', role: 'Principal', email: 'principal@demo.school' } }) },
  { test: /\/api\/fees\/admin\/summary/, get: financialSummary },
  { test: /\/api\/fees\/parent/, get: () => ({ success: true, data: { due: 4500, paid: 45000, invoices: [] } }) },
  { test: /\/api\/fees/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/admin\/users\/stats|\/api\/admin\/dashboard/, get: adminStats },
  { test: /\/api\/admin\/users/, get: () => ({ success: true, data: makeTeacherList(20) }) },
  { test: /\/api\/nif\/students|\/api\/admin\/students/, get: () => ({ success: true, data: makeStudentList() }) },
  { test: /\/api\/attendance/, get: () => ({ success: true, data: { percentage: rand(85, 98), present: rand(150, 180), absent: rand(2, 15) } }) },
  { test: /\/api\/exam\/results|\/api\/reports\/report-cards/, get: () => ({ success: true, data: SUBJECTS.map((s) => ({ subject: s, score: rand(60, 98), grade: pick(['A+', 'A', 'B+', 'B']) })) }) },
  { test: /\/api\/exam/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/notifications\/user/, get: () => ({ success: true, data: makeNotifications() }) },
  { test: /\/api\/notifications/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/alcove\/posts|notice/i, get: () => ({ success: true, data: makeNotices() }) },
  { test: /\/api\/chat\/threads|\/api\/chat\/contacts/, get: () => ({ success: true, data: [] }) },
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
