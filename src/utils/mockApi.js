// Frontend-only demo mode: there is no backend, so every `/api/...` call is
// intercepted here and answered with plausible canned data instead of hitting
// the network. Specific, realistic fixtures are provided for the main screen
// of each portal; anything else falls back to a generic-but-valid shape so
// components that read arrays/objects defensively just render empty states
// instead of crashing.
//
// A handful of screens (AssignmentPortal, ParentMeetings, TeacherAchievements,
// Assignment/AssignmentHub) call the backend with `axios` instead of `fetch`.
// Patching `window.fetch` alone does not intercept those — axios's browser
// default adapter is XHR, not fetch — so `installMockApi` also forces axios
// onto its `fetch` adapter, which then flows through the same patched fetch.
import axios from 'axios';

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

// Consumed by StudentAnalyticsPortal.jsx's Progress tab — a raw array (not
// wrapped in {success,data}), each entry shaped as `studentId: {...}`.
const makeProgressStudents = (count = 22) => Array.from({ length: count }, (_, i) => {
  const averageScore = rand(38, 97);
  return {
    _id: `prog-stu-${i + 1}`,
    studentId: {
      _id: `prog-stu-${i + 1}`,
      name: name(),
      grade: pick(CLASSES),
      section: pick(SECTIONS),
      roll: i + 1,
    },
    progressMetrics: [{
      averageScore,
      attendanceRate: rand(70, 99),
      completedAssignments: rand(4, 10),
      totalAssignments: 10,
      testPerformance: rand(35, 98),
    }],
    submissions: [],
    overallGrade: averageScore >= 90 ? 'A+' : averageScore >= 75 ? 'A' : averageScore >= 60 ? 'B' : 'C',
    improvementTrend: pick(['improving', 'stable', 'declining']),
  };
});

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

// Consumed by admin/pages/NoticeManagement.jsx (and NoticeDetail.jsx) via
// `/api/notifications` — raw array, richer shape than makeNotices() above
// (category/priority/audience/pin/scoping), scoped to class-0/sec-0-0 for the
// two class-specific notices so the "Visible to" class/section labels resolve.
const makeAdminNotices = (count = 16) => Array.from({ length: count }, (_, i) => {
  const category = pick(['general', 'academic', 'exam', 'events', 'fee', 'transport']);
  const titleByCategory = {
    general: 'School Reopens Monday',
    academic: 'Mid-Term Syllabus Released',
    exam: 'Exam Hall Ticket Available',
    events: 'Annual Sports Day',
    fee: 'Fee Payment Due Reminder',
    transport: 'Bus Route Change Notice',
  };
  const isClassScoped = i % 5 === 0;
  return {
    _id: `admin-notice-${i + 1}`,
    title: `${titleByCategory[category]}${i > 5 ? ` (${i + 1})` : ''}`,
    message: 'Please check the full notice for complete details. Contact the school office for any queries regarding this update.',
    type: category === 'exam' ? 'exam' : category === 'fee' ? 'fee' : 'notice',
    typeLabel: titleByCategory[category],
    category,
    priority: pick(['high', 'medium', 'low']),
    isPinned: i < 2,
    audience: pick(['All', 'Student', 'Parent', 'Teacher']),
    classId: isClassScoped ? 'class-0' : null,
    sectionId: isClassScoped ? 'sec-0-0' : null,
    createdByType: pick(['admin', 'admin', 'super_admin']),
    createdByName: 'School Admin',
    createdAt: new Date(Date.now() - i * 43200000).toISOString(),
  };
});

const makeNotifications = (count = 6) => Array.from({ length: count }, (_, i) => ({
  _id: `notif-${i + 1}`,
  id: `notif-${i + 1}`,
  title: pick(['New assignment posted', 'Attendance marked', 'Fee payment received', 'Result published', 'Meeting scheduled']),
  message: 'Tap to view more information.',
  read: i > 2,
  isRead: i > 2,
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

// Consumed by TeacherDashboard.jsx (teacher Dashboard home) as a raw object —
// `setDashboardData(dashboardPayload)` stores the body as-is and every field
// below is read directly (`dashboardData?.stats`, `?.todaysClasses`, etc.),
// not under `.data`. ClassRoutine.jsx/HolidayList.jsx/AttendanceManagement.jsx
// also hit this same endpoint as a fallback and read `teacher`/`upcomingClasses`
// straight off the body too.
const teacherDashboardPayload = () => {
  const todaysClasses = [
    { id: 'tc-1', subject: 'Mathematics', class: 'Grade 5', section: 'A', room: 'Room 101', time: '08:00 - 08:45', status: 'Completed' },
    { id: 'tc-2', subject: 'Mathematics', class: 'Grade 6', section: 'B', room: 'Room 102', time: '09:30 - 10:15', status: 'Completed' },
    { id: 'tc-3', subject: 'Mathematics', class: 'Grade 5', section: 'A', room: 'Room 101', time: '11:15 - 12:00', status: 'In progress' },
    { id: 'tc-4', subject: 'Mathematics', class: 'Grade 7', section: 'C', room: 'Room 203', time: '13:30 - 14:15', status: 'Upcoming' },
  ];
  return {
    success: true,
    teacher: { name: 'Priya Nair', subject: 'Mathematics', classesAssigned: 4, isClassTeacher: true, rating: 4.7 },
    stats: {
      totalStudents: 156,
      classesToday: todaysClasses.length,
      pendingGrading: 12,
      pendingEvaluations: 12,
      attendanceMarked: true,
      attendanceRate: 94,
      avgClassScore: 82,
      upcomingEvents: 3,
    },
    todaysClasses,
    upcomingClasses: todaysClasses,
    nextClass: todaysClasses.find((c) => c.status === 'Upcoming') || null,
    performanceMetrics: SUBJECTS.slice(0, 3).map((subject) => ({ subject, average: rand(72, 92) })),
    upcomingDeadlines: Array.from({ length: 4 }, (_, i) => ({ id: `task-${i}`, title: `Grade ${pick(CLASSES)} homework`, class: pick(CLASSES), subject: pick(SUBJECTS), dueDate: new Date(Date.now() + i * 86400000).toISOString() })),
    recentActivities: [
      { id: 'act-1', message: 'Marked attendance for Grade 5-A', class: 'Grade 5-A', time: new Date(Date.now() - 1800000).toISOString() },
      { id: 'act-2', message: '8 assignments submitted for review', class: 'Grade 6-B', time: new Date(Date.now() - 3600000).toISOString() },
      { id: 'act-3', message: 'Parent-teacher meeting request received', class: 'Grade 7-C', time: new Date(Date.now() - 7200000).toISOString() },
      { id: 'act-4', message: 'Lesson plan for Fractions published', class: 'Grade 5-A', time: new Date(Date.now() - 18000000).toISOString() },
    ],
    // Legacy/back-compat fields some other screens may still read.
    deadlines: Array.from({ length: 4 }, (_, i) => ({ id: `task-${i}`, title: `Grade ${pick(CLASSES)} homework`, dueDate: new Date(Date.now() + i * 86400000).toISOString() })),
    classes: CLASSES.slice(0, 4).map((c) => ({ class: c, section: pick(SECTIONS), studentCount: rand(28, 42) })),
    recentAssignments: makeAssignments(4),
    upcomingExams: makeExamsList(3),
    notices: makeNotices(3),
    notifications: makeNotifications(4),
  };
};

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

// Consumed directly (data.totals / data.monthlyTrend) in admin/Dashboard.jsx,
// and in full by admin/pages/FeesDashboard.jsx (enrollment, outstandingSegments,
// classStudents, recentPayments).
const feesAdminSummary = () => {
  const classRoster = CLASSES.map((cls) => ({
    label: cls,
    rows: Array.from({ length: rand(18, 32) }, (_, i) => {
      const total = pick([15000, 18000, 22000, 25000, 30000]);
      const roll = Math.random();
      const paid = roll < 0.35 ? total : roll < 0.8 ? Math.round(total * (0.3 + Math.random() * 0.4)) : 0;
      const balanceAmount = total - paid;
      return {
        studentId: `${cls}-stu-${i + 1}`,
        name: name(),
        roll: i + 1,
        username: `student${rand(1000, 9999)}`,
        section: pick(SECTIONS),
        status: balanceAmount <= 0 ? 'paid' : paid > 0 ? 'partial' : 'due',
        balanceAmount,
      };
    }),
  }));

  const totalStudents = classRoster.reduce((sum, c) => sum + c.rows.length, 0);
  const classStudents = classRoster.reduce((acc, c) => { acc[c.label] = c.rows; return acc; }, {});

  const enrollment = classRoster.map((c) => ({
    label: c.label,
    students: c.rows.length,
    percentage: Math.round((c.rows.length / totalStudents) * 100),
  }));

  const outstandingByClass = classRoster.map((c) => ({
    label: c.label,
    amount: c.rows.reduce((sum, r) => sum + r.balanceAmount, 0),
  }));
  const totalOutstanding = outstandingByClass.reduce((sum, c) => sum + c.amount, 0);
  const outstandingSegments = outstandingByClass
    .map((c) => ({ ...c, percentage: totalOutstanding ? Math.round((c.amount / totalOutstanding) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const totalCollected = classRoster.reduce(
    (sum, c) => sum + c.rows.reduce((s, r) => s + (r.status !== 'due' ? 0 : 0), 0), 0
  );
  const totalInvoiced = totalStudents * 20000;
  const overdueInvoices = classRoster.reduce((sum, c) => sum + c.rows.filter((r) => r.status === 'due').length, 0);

  const recentPayments = Array.from({ length: 18 }, (_, i) => {
    const cls = pick(classRoster);
    const row = pick(cls.rows);
    const paidOn = new Date(Date.now() - i * 86400000 - rand(0, 20000000));
    return {
      studentName: row.name,
      username: row.username,
      admissionNo: `ADM-${1000 + i}`,
      className: cls.label,
      section: row.section,
      session: '2025-2026',
      amount: pick([5000, 8000, 10000, 15000, 18000]),
      paidOn: paidOn.toISOString(),
      paidOnLabel: paidOn.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      method: pick(['Online (Razorpay)', 'Cash', 'Bank Transfer', 'Cheque']),
      status: pick(['Paid', 'Paid', 'Paid', 'Partial']),
      invoiceStatus: pick(['Paid', 'Partial']),
      transactionId: `TXN${rand(100000, 999999)}`,
      gatewayPaymentId: `pay_demo_${rand(100000, 999999)}`,
      gatewayOrderId: `order_demo_${rand(100000, 999999)}`,
      notes: '',
    };
  });

  return {
    academicYearName: '2025-2026',
    monthlyTrend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, collected: rand(150000, 300000) })),
    totals: {
      totalCollected: 1884000,
      totalOutstanding,
      overdueAmount: 96000,
      totalInvoiced,
      totalStudents,
      overdueInvoices,
    },
    enrollment,
    outstandingSegments,
    classStudents,
    recentPayments,
  };
};

const academicHierarchy = () => ({
  years: [{ _id: 'year-2025-26', name: '2025-2026', isActive: true }],
  classes: CLASSES.map((c, i) => ({ _id: `class-${i}`, name: c, academicYearId: 'year-2025-26' })),
  sections: SECTIONS.map((s, i) => ({ _id: `sec-${i}`, name: s })),
});

// ---------------------------------------------------------------------------
// admin/Analytics.jsx — each /api/admin-analytics/<sub-route> has its own
// shape (checked against the consumer code), not the one generic fixture
// this used to share. All sized "huge" per the request: enough rows to
// exercise pagination, truncation ("Showing 30 of N"), and real-looking charts.
// ---------------------------------------------------------------------------

const adminAnalyticsMasteryMatrix = () => {
  const grades = CLASSES;
  const subjects = SUBJECTS;
  const matrix = {};
  grades.forEach((g) => {
    matrix[g] = {};
    subjects.forEach((s) => { matrix[g][s] = rand(40, 97); });
  });
  return { success: true, data: { grades, subjects, matrix } };
};

const adminAnalyticsTeacherEffectiveness = () => {
  const data = Array.from({ length: 42 }, (_, i) => {
    const avgClassMastery = rand(38, 96);
    const effectiveness = avgClassMastery >= 75 ? 'High' : avgClassMastery >= 55 ? 'Moderate' : avgClassMastery >= 1 ? 'Low' : 'No data';
    return {
      teacherId: `tch-${i + 1}`,
      name: name(),
      subject: pick(SUBJECTS),
      avgClassMastery,
      studentCount: rand(25, 48),
      topicsCovered: rand(8, 32),
      effectiveness,
    };
  });
  return { success: true, data };
};

const adminAnalyticsAiPath = () => ({
  success: true,
  data: SUBJECTS.map((subject) => {
    const totalTopics = rand(18, 36);
    const weakTopics = rand(1, Math.floor(totalTopics * 0.3));
    return {
      subject,
      studentCount: rand(80, 220),
      avgScore: rand(52, 94),
      strongTopics: totalTopics - weakTopics - rand(2, 5),
      weakTopics,
      totalTopics,
      totalAttempts: rand(400, 2200),
    };
  }),
});

const adminAnalyticsDropoutRisk = () => {
  const reasonBank = ['Attendance below 75%', 'Failed 2+ exams this term', 'No AI Tutor activity in 30 days', 'Multiple late fee reminders', 'Declining score trend across 3 assessments'];
  const data = Array.from({ length: 47 }, (_, i) => {
    const attendanceRate = rand(42, 96);
    const failedExams = rand(0, 4);
    const riskScore = (attendanceRate < 75 ? 1 : 0) + (failedExams >= 2 ? 1 : 0) + (Math.random() > 0.7 ? 1 : 0);
    const riskLevel = riskScore >= 2 ? 'High' : riskScore === 1 ? 'Medium' : 'Low';
    const reasons = [];
    if (attendanceRate < 75) reasons.push(reasonBank[0]);
    if (failedExams >= 2) reasons.push(reasonBank[1]);
    if (riskLevel !== 'Low' && Math.random() > 0.5) reasons.push(pick(reasonBank.slice(2)));
    return {
      studentId: `risk-stu-${i + 1}`,
      name: name(),
      grade: pick(CLASSES),
      section: pick(SECTIONS),
      attendanceRate,
      failedExams,
      riskLevel,
      reasons: reasons.length ? reasons : ['Minor fluctuation, monitor only'],
    };
  }).sort((a, b) => (b.riskLevel === 'High') - (a.riskLevel === 'High'));
  return { success: true, data };
};

const adminAnalyticsCohortTrend = () => ({
  success: true,
  data: {
    trend: Array.from({ length: 6 }, (_, i) => {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - (5 - i));
      return {
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        avgMarks: rand(64, 84) + i, // mild upward trend
        passRate: rand(78, 94) + Math.round(i * 0.8),
        studentCount: rand(1100, 1280),
      };
    }),
  },
});

const adminAnalyticsContentUsage = () => {
  const titles = ['Fractions Explained', 'Photosynthesis Deep Dive', 'Grammar Essentials', 'Local Government 101', 'Intro to Algorithms', 'Hindi Vyakaran Basics', 'Cell Structure Diagrams', 'Trigonometry Formulas', 'World War II Timeline', 'Chemical Bonding Basics'];
  const data = Array.from({ length: 34 }, (_, i) => {
    const totalViews = rand(120, 3400);
    return {
      id: `mat-${i + 1}`,
      title: `${pick(titles)} ${i % 3 === 0 ? '(Worksheet)' : ''}`.trim(),
      subject: pick(SUBJECTS),
      grade: pick(CLASSES),
      totalViews,
      uniqueViewers: Math.round(totalViews * (0.3 + Math.random() * 0.2)),
      downloads: rand(10, Math.round(totalViews * 0.4)),
      completions: rand(5, Math.round(totalViews * 0.25)),
    };
  }).sort((a, b) => b.totalViews - a.totalViews);
  return {
    success: true,
    data,
    summary: {
      totalMaterials: data.length,
      totalViews: data.reduce((sum, m) => sum + m.totalViews, 0),
      totalDownloads: data.reduce((sum, m) => sum + m.downloads, 0),
      totalCompletions: data.reduce((sum, m) => sum + m.completions, 0),
    },
  };
};

const adminAnalyticsSystemHealth = () => ({
  success: true,
  data: {
    database: { healthy: true, status: 'connected' },
    aiService: { status: 'ok', latencyMs: rand(180, 420), models: { chat: 'gpt-4o-mini', embeddings: 'text-embedding-3-small' } },
    checkedAt: new Date().toISOString(),
  },
});

const adminAnalyticsExamIntegrity = () => {
  const examTitles = ['Mid-Term Mathematics', 'Science Unit Test', 'English Grammar Quiz', 'Social Studies Final', 'Computer Science Assessment'];
  const data = Array.from({ length: 16 }, (_, i) => {
    const status = pick(['fast_submission', 'timed_out', 'fast_submission', 'flagged']);
    return {
      attemptId: `attempt-${i + 1}`,
      studentName: name(),
      grade: pick(CLASSES),
      examTitle: pick(examTitles),
      durationMin: status === 'timed_out' ? rand(60, 90) : rand(1, 4),
      score: rand(20, 98),
      status,
      issues: status === 'timed_out' ? ['Session exceeded allotted time'] : ['Submitted unusually fast', 'Low time-per-question ratio'],
    };
  });
  return {
    success: true,
    data,
    summary: {
      totalAttempts: rand(2200, 3400),
      flaggedCount: data.length,
      timedOutCount: data.filter((d) => d.status === 'timed_out').length,
      fastSubmissions: data.filter((d) => d.status !== 'timed_out').length,
    },
  };
};

const adminAnalyticsEquityMonitoring = () => {
  const male = { gender: 'male', sampleSize: rand(180, 260), meetsMinSample: true, avgScore: 0.74 + Math.random() * 0.1, needsReviewRate: 0.08 + Math.random() * 0.05 };
  const female = { gender: 'female', sampleSize: rand(180, 260), meetsMinSample: true, avgScore: 0.72 + Math.random() * 0.1, needsReviewRate: 0.1 + Math.random() * 0.05 };
  const gap = Math.abs(male.avgScore - female.avgScore);
  const higher = male.avgScore >= female.avgScore ? 'male' : 'female';
  const lower = higher === 'male' ? 'female' : 'male';
  const flags = gap > 0.05 ? [{ signal: 'avg_score_gap', higher, lower, gap }] : [];
  return {
    success: true,
    data: {
      dataStatus: 'available',
      minCohortSample: 10,
      flags,
      cohorts: [male, female],
    },
  };
};

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
  status: pick(['active', 'draft', 'graded', 'open']),
  topic: pick(['Fractions', 'Grammar', 'Algebra', 'Photosynthesis', 'Reading Comprehension']),
}));

// Consumed by AssignmentPortal.jsx's Evaluate view — raw array, each entry a
// student's submission for one assignment.
const makeAssignmentSubmissions = (count = 18) => Array.from({ length: count }, (_, i) => {
  const graded = Math.random() > 0.45;
  return {
    submissionId: `sub-${i + 1}`,
    studentId: `stu-${i + 1}`,
    studentName: name(),
    grade: pick(CLASSES).replace('Grade ', ''),
    assignmentId: `assign-${(i % 10) + 1}`,
    assignmentTitle: `${pick(SUBJECTS)} - ${pick(['Worksheet', 'Homework', 'Project', 'Chapter Review'])}`,
    type: 'Assignment',
    totalMarks: 20,
    submissionText: 'Demo submission text answering the assignment prompt.',
    attachmentUrl: '',
    status: graded ? 'graded' : 'submitted',
    score: graded ? rand(10, 20) : null,
    feedback: graded ? pick(['Good work!', 'Well explained.', 'Needs more detail.', 'Nice effort.']) : '',
    publishedByTeacher: graded,
    aiGradingStatus: 'skipped',
    submittedAt: new Date(Date.now() - i * 43200000).toISOString(),
  };
});

// Consumed by ClassRoutine.jsx (teacher Timetable page) — `schedule` keyed by
// weekday, each entry a period with subject/room/start-end time.
const makeTeacherRoutine = () => {
  const periodTimes = [
    ['08:00', '08:45'], ['08:45', '09:30'], ['09:30', '10:15'], ['10:15', '11:00'],
    ['11:15', '12:00'], ['12:00', '12:45'], ['13:30', '14:15'], ['14:15', '15:00'],
  ];
  const rooms = ['Room 101', 'Room 102', 'Room 203', 'Lab 1', 'Room 305'];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const classSections = CLASSES.slice(0, 4).map((c) => ({ className: c, sectionName: pick(SECTIONS) }));

  const schedule = {};
  weekdays.forEach((day) => {
    const periodsToday = rand(5, periodTimes.length);
    schedule[day] = periodTimes.slice(0, periodsToday).map(([startTime, endTime], i) => {
      const { className, sectionName } = pick(classSections);
      return {
        subject: pick(SUBJECTS),
        className,
        sectionName,
        classLabel: `${className} ${sectionName}`,
        room: pick(rooms),
        startTime,
        endTime,
        period: i + 1,
      };
    });
  });
  schedule.Saturday = [];
  schedule.Sunday = [];

  return {
    schedule,
    meta: { campusScoped: true, timetableCount: Object.values(schedule).flat().length, filterSource: 'campus', busiestDay: 'Monday' },
    teacher: { name: 'Priya Nair', subject: 'Mathematics' },
  };
};

// Consumed by admin/Routines.jsx via timetableApi.getAll() + transformTimetablesToRoutines
// — raw array of timetable docs, each with populated classId/sectionId and
// `entries` (dayOfWeek/startTime/endTime/subjectId/teacherId/period). Ids
// match the academic/classes|sections|subjects fixtures (class-0.., sec-0..,
// sub-0..) so cross-references resolve.
const makeTimetables = () => {
  const periodTimes = [
    ['08:00', '08:45'], ['08:45', '09:30'], ['09:30', '10:15'],
    ['10:15', '10:30', true], // short break
    ['10:30', '11:15'], ['11:15', '12:00'], ['12:00', '12:45'],
  ];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const teacherIds = Array.from({ length: 16 }, (_, i) => `tch-${i + 1}`);

  return CLASSES.slice(0, 4).flatMap((className, ci) =>
    SECTIONS.slice(0, 2).map((sectionName, si) => {
      const classId = `class-${ci}`;
      const sectionId = `sec-${si}`;
      const entries = weekdays.flatMap((day) =>
        periodTimes.map(([startTime, endTime, isBreak], pi) => (
          isBreak
            ? { dayOfWeek: day, startTime, endTime, isBreak: true, period: pi + 1 }
            : {
              dayOfWeek: day,
              startTime,
              endTime,
              isBreak: false,
              period: pi + 1,
              subjectId: { _id: `sub-${(pi + ci) % SUBJECTS.length}`, name: SUBJECTS[(pi + ci) % SUBJECTS.length] },
              teacherId: { _id: pick(teacherIds), name: name() },
              room: `Room ${100 + ci * 10 + pi}`,
            }
        ))
      );
      return {
        _id: `tt-${ci}-${si}`,
        classId: { _id: classId, name: className },
        sectionId: { _id: sectionId, name: sectionName },
        entries,
      };
    })
  );
};

// Consumed by AIPoweredTeaching.jsx (teacher Lesson Plan / AI Copilot page) —
// the class/section/subject dropdowns that gate everything else on the page.
// Ids match the teacher-allocations fixture above (class-0..3, sec-0..2, sub-0..5).
const makeLessonPlanOptions = () => ({
  classes: CLASSES.slice(0, 4).map((c, i) => ({ id: `class-${i}`, name: c })),
  sections: SECTIONS.map((s, i) => ({ id: `sec-${i}`, name: s })),
  subjects: SUBJECTS.map((s, i) => ({ subjectId: `sub-${i}`, subjectName: s })),
});

// Consumed by AIPoweredTeaching.jsx's loadChaptersForSelection — raw array of
// "plan" documents; each published plan holds one chapter under
// `plannerContent.chapters`. One subject-appropriate chapter per subject
// (sub-0..sub-5, matching makeLessonPlanOptions), under class-0/sec-0
// (Grade 5-A), so every subject the teacher picks shows a demo lesson —
// Mathematics gets a second chapter to also demo multi-chapter sidebar state.
const SUBJECT_CHAPTER_DEFS = {
  Mathematics: [
    {
      title: 'Introduction to Fractions',
      introductionText: 'Today we explore fractions as a way to describe parts of a whole, connecting to real examples like sharing a pizza.',
      learningObjectives: ['Identify numerator and denominator in a fraction', 'Represent a fraction visually using shapes', 'Compare two simple fractions'],
      explanation: 'A fraction represents a part of a whole, written as numerator/denominator. We will use pizza slices and number lines to build intuition before moving to symbolic notation.',
      recap: 'We covered what fractions represent, how to read numerator/denominator, and compared simple fractions using visual models.',
    },
    {
      title: 'Adding Fractions with Like Denominators',
      introductionText: 'Building on yesterday\'s lesson, we now learn to add fractions that share the same denominator.',
      learningObjectives: ['Add two fractions with the same denominator', 'Simplify the resulting fraction', 'Solve word problems involving fraction addition'],
      explanation: 'When denominators match, we simply add the numerators and keep the denominator the same, then simplify if possible.',
      recap: 'Students practiced adding like-denominator fractions and simplifying results, finishing with two word problems.',
    },
  ],
  Science: [{
    title: 'Photosynthesis: How Plants Make Food',
    introductionText: 'Today we discover how plants turn sunlight into food, exploring the role of leaves, sunlight, water, and carbon dioxide.',
    learningObjectives: ['Explain the process of photosynthesis in simple terms', 'Identify the inputs and outputs of photosynthesis', 'Describe why photosynthesis matters for life on Earth'],
    explanation: 'Plants use chlorophyll in their leaves to capture sunlight, combining it with water and carbon dioxide to produce glucose and oxygen.',
    recap: 'We learned what photosynthesis is, its key ingredients, and why it is essential for the oxygen we breathe.',
  }],
  English: [{
    title: 'Understanding Nouns and Verbs',
    introductionText: 'Today we build our grammar foundation by identifying nouns (naming words) and verbs (action words) in sentences.',
    learningObjectives: ['Identify nouns in a sentence', 'Identify verbs in a sentence', 'Construct a simple sentence using a noun and a verb'],
    explanation: 'A noun names a person, place, or thing; a verb describes an action or state. Every complete sentence needs at least one of each.',
    recap: 'We practiced spotting nouns and verbs in sentences and wrote our own simple sentences using both.',
  }],
  'Social Studies': [{
    title: 'Our Local Government',
    introductionText: 'Today we learn how local government works and who is responsible for services in our community.',
    learningObjectives: ['Name the key roles in local government', 'Explain one service the local government provides', 'Describe how citizens can participate in local decisions'],
    explanation: 'Local government handles community services like roads, water, and schools, led by elected representatives who citizens can engage with directly.',
    recap: 'We covered the roles in local government, the services it provides, and how citizens can get involved.',
  }],
  'Computer Science': [{
    title: 'Introduction to Algorithms',
    introductionText: 'Today we learn that an algorithm is simply a set of step-by-step instructions to solve a problem, just like a recipe.',
    learningObjectives: ['Define what an algorithm is', 'Write a simple algorithm for an everyday task', 'Identify sequence, selection, and repetition in an algorithm'],
    explanation: 'An algorithm breaks a problem into clear, ordered steps. We will practice writing algorithms for everyday tasks before connecting this to code.',
    recap: 'We defined algorithms, wrote one for an everyday task, and spotted sequence, selection, and repetition in it.',
  }],
  Hindi: [{
    title: 'वाक्य और शब्द भेद',
    introductionText: 'आज हम सीखेंगे कि वाक्य कैसे बनता है और उसमें संज्ञा व क्रिया की क्या भूमिका होती है।',
    learningObjectives: ['वाक्य में संज्ञा पहचानना', 'वाक्य में क्रिया पहचानना', 'सरल वाक्य बनाना'],
    explanation: 'संज्ञा किसी व्यक्ति, स्थान या वस्तु का नाम बताती है, और क्रिया किसी कार्य को दर्शाती है। हर पूर्ण वाक्य में दोनों आवश्यक हैं।',
    recap: 'आज हमने वाक्य में संज्ञा और क्रिया पहचानना सीखा और स्वयं सरल वाक्य बनाए।',
  }],
};

const makeLessonPlanChapters = () => {
  let planCounter = 0;
  return SUBJECTS.flatMap((subjectName, subjectIndex) => {
    const defs = SUBJECT_CHAPTER_DEFS[subjectName] || [];
    const base = { classId: 'class-0', sectionId: 'sec-0', subjectId: `sub-${subjectIndex}`, status: 'published', isDraft: false };
    return defs.map((def, i) => {
      planCounter += 1;
      return {
        _id: `lp-plan-${planCounter}`,
        ...base,
        createdAt: new Date(Date.now() - planCounter * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - planCounter * 86400000).toISOString(),
        plannerContent: {
          chapters: [{
            title: def.title,
            lessonDate: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
            introductionText: def.introductionText,
            learningObjectives: def.learningObjectives,
            explanation: def.explanation,
            recap: def.recap,
            instructionalFlow: [
              { id: 'hook', phase: 'THE HOOK', duration: '10', description: def.introductionText.slice(0, 100) },
              { id: 'instruct', phase: 'I DO', duration: '15', description: `Model one worked example of ${def.title.toLowerCase()}.` },
              { id: 'practice', phase: 'WE DO', duration: '20', description: `Work through a guided example of ${def.title.toLowerCase()} together.` },
              { id: 'synthesis', phase: 'YOU DO', duration: '15', description: 'Students practice independently while the teacher circulates.' },
            ],
          }],
        },
      };
    });
  });
};

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

// Consumed by AssignmentPortal.jsx's tryout-submissions tab — raw `{results}`.
const makeTryoutSubmissions = (count = 10) => ({
  results: Array.from({ length: count }, (_, i) => ({
    _id: `tryout-sub-${i + 1}`,
    studentId: `stu-${i + 1}`,
    studentName: name(),
    tryoutTitle: `${pick(SUBJECTS)} Tryout ${i + 1}`,
    score: rand(40, 100),
    totalMarks: 100,
    submittedAt: new Date(Date.now() - i * 43200000).toISOString(),
  })),
});

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

// ---------------------------------------------------------------------------
// admin/pages/Result.jsx — a small relational model: one subject-exam per
// subject, one exam group ("Mid-Term Examination") referencing them, and one
// result per student per subject. All scoped to Grade 5-A / 2025-2026 so the
// class/section/session filters on the page actually have matching data.
// ---------------------------------------------------------------------------

const EXAM_RESULT_SUBJECT_EXAMS = SUBJECTS.map((subject, i) => ({
  _id: `exam-sub-${i}`,
  name: `${subject} - Mid-Term`,
  subject,
  class: 'Grade 5',
  section: 'A',
  marks: 100,
  examType: 'Term Exam',
}));

const makeExamResultGroups = () => [{
  _id: 'exam-group-1',
  name: 'Mid-Term Examination',
  examType: 'Term Exam',
  classId: { _id: 'class-0', name: 'Grade 5', academicYearId: { _id: 'year-2025-26', name: '2025-2026' } },
  sectionId: { _id: 'sec-0', name: 'A' },
  startDate: new Date(Date.now() - 20 * 86400000).toISOString(),
  createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  status: 'completed',
  subjects: EXAM_RESULT_SUBJECT_EXAMS,
}];

const makeExamResults = () => {
  const students = Array.from({ length: 28 }, (_, i) => ({
    _id: `exam-result-stu-${i + 1}`,
    name: name(),
    roll: i + 1,
    grade: 'Grade 5',
    class: 'Grade 5',
    section: 'A',
    academicYear: '2025-2026',
  }));
  return students.flatMap((student) =>
    EXAM_RESULT_SUBJECT_EXAMS.map((exam, ei) => {
      const marks = rand(28, 98);
      const status = marks >= 40 ? 'pass' : 'fail';
      return {
        _id: `result-${student._id}-${exam._id}`,
        studentId: student,
        examId: exam,
        marks,
        grade: marks >= 90 ? 'A+' : marks >= 75 ? 'A' : marks >= 60 ? 'B+' : marks >= 40 ? 'B' : 'F',
        remarks: status === 'pass' ? pick(['Good performance', 'Keep it up', 'Well done']) : 'Needs improvement',
        status,
        published: ei < 4, // a couple of subjects still pending publish, for a realistic demo state
      };
    })
  );
};

const makeClassStudentRoster = (count = 30) => Array.from({ length: count }, (_, i) => ({
  _id: `stu-${i + 1}`,
  id: `stu-${i + 1}`,
  name: name(),
  rollNo: i + 1,
  attendance: rand(70, 100),
  lastScore: rand(45, 99),
  present: Math.random() > 0.1,
}));

// Consumed by teachers/ExcuseLetters.jsx and components/ExcuseLetter.jsx (student
// submission view) — same field names on both sides, raw array.
const makeExcuseLetters = (count = 5) => Array.from({ length: count }, (_, i) => {
  const dateFrom = new Date(Date.now() - i * 86400000);
  const dateTo = new Date(dateFrom.getTime() + rand(0, 2) * 86400000);
  return {
    _id: `excuse-${i + 1}`,
    id: `excuse-${i + 1}`,
    studentName: name(),
    className: pick(CLASSES),
    sectionName: pick(SECTIONS),
    rollNumber: i + 1,
    parentName: name(),
    parentPhone: `9${rand(100000000, 999999999)}`,
    parentEmail: `parent${i + 1}@demoschool.edu`,
    emergencyContact: `9${rand(100000000, 999999999)}`,
    reasonType: pick(['illness', 'family', 'personal', 'travel', 'appointment']),
    reason: pick(['Fever and needs rest', 'Family function out of town', 'Dental appointment', 'Travelling with family', 'Not feeling well']),
    dateFrom: dateFrom.toISOString().slice(0, 10),
    dateTo: dateTo.toISOString().slice(0, 10),
    additionalNotes: '',
    schoolName: 'Electronic Educare Demo School',
    schoolAddress: '123 Education Lane, Demo City',
    status: i === 0 ? 'pending' : pick(['pending', 'approved', 'rejected']),
    createdAt: dateFrom.toISOString(),
  };
});

// Consumed by TeacherFeedbackPortal.jsx — raw `{stats, feedback}` object.
const makeTeacherFeedback = () => {
  const feedback = Array.from({ length: 12 }, (_, i) => ({
    _id: `tfb-${i + 1}`,
    studentName: name(),
    className: pick(CLASSES),
    sectionName: pick(SECTIONS),
    subjectName: pick(SUBJECTS),
    overallRating: rand(3, 5),
    comment: pick(['Really enjoy the class!', 'Explanations are easy to follow.', 'Could use more practice problems.', 'Great teaching style.']),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  const ratingDistribution = feedback.reduce((acc, f) => { acc[f.overallRating] = (acc[f.overallRating] || 0) + 1; return acc; }, {});
  return {
    stats: {
      averageRating: feedback.reduce((sum, f) => sum + f.overallRating, 0) / feedback.length,
      totalFeedback: feedback.length,
      latestFeedbackDate: feedback[0].createdAt,
      ratingDistribution,
    },
    feedback,
  };
};

// Consumed by TeacherFeedbackPortal.jsx's complaints tab — raw `{complaints, stats}`.
const makeTeacherComplaints = () => {
  const statuses = ['open', 'in_progress', 'resolved'];
  const complaints = Array.from({ length: 8 }, (_, i) => ({
    id: `complaint-${i + 1}`,
    ticketNumber: `TCK-${1000 + i}`,
    priority: pick(['low', 'medium', 'high']),
    title: pick(['Bullying concern', 'Homework overload', 'Seating arrangement issue', 'Bus timing complaint', 'Noise in classroom']),
    description: 'Demo complaint description submitted by the parent for the teacher to review and act on.',
    status: statuses[i % statuses.length],
    parentName: name(),
    studentName: name(),
    studentGrade: pick(CLASSES),
    studentSection: pick(SECTIONS),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  return {
    complaints,
    stats: {
      open: complaints.filter((c) => c.status === 'open').length,
      inProgress: complaints.filter((c) => c.status === 'in_progress').length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
    },
  };
};

// Consumed by MyWorkPortal.jsx (teacher Settings page) ------------------------

const makeWorkAttendance = () => {
  const today = new Date();
  const records = Array.from({ length: 20 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    const status = date > today ? '' : pick(['Present', 'Present', 'Present', 'Late', 'Absent']);
    return {
      id: `att-${i + 1}`,
      date: date.toISOString().slice(0, 10),
      checkIn: status === 'Absent' || !status ? '-' : '09:0' + rand(0, 5),
      checkOut: status === 'Absent' || !status ? '-' : '17:0' + rand(0, 5),
      checkInAt: status === 'Absent' || !status ? null : date.toISOString(),
      checkOutAt: status === 'Absent' || !status ? null : date.toISOString(),
      status: status || 'Upcoming',
      workingMinutes: status === 'Present' ? rand(440, 480) : status === 'Late' ? rand(380, 440) : 0,
    };
  });
  const presentDays = records.filter((r) => r.status === 'Present').length;
  const lateDays = records.filter((r) => r.status === 'Late').length;
  const absentDays = records.filter((r) => r.status === 'Absent').length;
  const countedDays = presentDays + lateDays + absentDays;
  return {
    records,
    stats: { presentDays, lateDays, absentDays, attendanceRate: countedDays ? Math.round(((presentDays + lateDays) / countedDays) * 100) : 0 },
    today: { hasCheckedIn: true, hasCheckedOut: false, checkIn: '09:02', checkOut: '-', status: 'Present', workingMinutes: 180 },
    settings: { entryTime: '09:00', exitTime: '17:00' },
  };
};

const makeLeaveRequests = () => {
  const leaves = [
    { id: 'leave-1', type: 'Sick Leave', startDate: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10), endDate: new Date(Date.now() - 9 * 86400000).toISOString().slice(0, 10), reason: 'Fever and viral infection', status: 'approved', createdAt: new Date(Date.now() - 11 * 86400000).toISOString() },
    { id: 'leave-2', type: 'Casual Leave', startDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), endDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), reason: 'Family function', status: 'pending', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'leave-3', type: 'Casual Leave', startDate: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10), endDate: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10), reason: 'Personal work', status: 'rejected', adminRemarks: 'Insufficient notice given', createdAt: new Date(Date.now() - 32 * 86400000).toISOString() },
  ];
  return {
    leaves,
    leavePolicy: { casualLeaveDays: 12 },
    leaveStats: { totalAllowanceDays: 12, availableDays: 9, casualUsedDays: 2, approvedLeaveDays: 2, pendingLeaveDays: 1, absentDays: 0, usedDays: 3 },
  };
};

const makeTeacherExpenses = () => ({
  expenses: Array.from({ length: 6 }, (_, i) => ({
    id: `expense-${i + 1}`,
    category: pick(['Travel', 'Stationery', 'Teaching Material', 'Printing']),
    amount: rand(200, 2500),
    description: pick(['Auto fare for parent-teacher meeting', 'Chart papers and markers', 'Printed worksheets for class', 'Craft material for activity']),
    date: new Date(Date.now() - i * 5 * 86400000).toISOString().slice(0, 10),
    receiptName: '',
    receiptUrl: '',
    status: i === 0 ? 'pending' : pick(['approved', 'pending', 'rejected']),
  })),
});

const makeTeacherProfile = () => ({
  teacher: {
    name: 'Priya Nair',
    email: 'priya.nair@demoschool.edu',
    mobile: '9876543210',
    department: 'Mathematics',
    employeeCode: 'EMP-204',
    joiningDate: '2019-06-01',
    address: '45 Teachers Colony, Demo City',
    emergencyContact: '9123456780',
    profilePic: '',
  },
});

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

// ---------------------------------------------------------------------------
// Chat (teacher/parent/student/principal portals share these /api/chat/*
// routes). Fixed demo identities so contacts/threads/messages reference the
// same people consistently across separate fetches within a session.
// ---------------------------------------------------------------------------

const CHAT_DEMO_PEOPLE = [
  { userId: 'chat-contact-1', name: 'Ananya Verma', userType: 'Student' },
  { userId: 'chat-contact-2', name: 'Rohan Gupta (Parent)', userType: 'Parent' },
  { userId: 'chat-contact-3', name: 'Ishaan Khan', userType: 'Student' },
];

const chatMeIdentity = () => {
  const userType = String(localStorage.getItem('userType') || 'Teacher');
  const byType = {
    Teacher: { id: 'chat-me-teacher', name: 'Priya Nair', role: 'teacher' },
    Parent: { id: 'chat-me-parent', name: 'Rohan Gupta', role: 'parent' },
    Student: { id: 'chat-me-student', name: 'Ananya Verma', role: 'student' },
    Principal: { id: 'chat-me-principal', name: 'Dr. Rajesh Kumar', role: 'principal' },
  };
  return byType[userType] || byType.Teacher;
};

const makeChatThreads = () =>
  CHAT_DEMO_PEOPLE.map((person, i) => ({
    _id: `chat-thread-${i + 1}`,
    type: 'direct',
    otherParticipant: person,
    unreadCount: i === 0 ? 2 : 0,
    lastMessage: [
      'Could you share today\'s homework again please?',
      'Thank you for the update on the progress report!',
      'Will submit the assignment by tomorrow morning.',
    ][i] || 'Okay, noted.',
    lastMessageAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
  }));

const CHAT_THREAD_MESSAGES = {
  'chat-thread-1': [
    { text: 'Hi! Could you share today\'s homework again please?', fromMe: false },
    { text: 'Of course — it\'s Chapter 4, questions 1 to 10, due Friday.', fromMe: true },
    { text: 'Got it, thank you!', fromMe: false },
  ],
  'chat-thread-2': [
    { text: 'Hello, how is my child doing this term?', fromMe: false },
    { text: 'Doing well overall — strong in Math, could use a bit more practice in Science.', fromMe: true },
    { text: 'Thank you for the update on the progress report!', fromMe: false },
  ],
  'chat-thread-3': [
    { text: 'I\'m a bit stuck on the assignment, can I get an extra day?', fromMe: false },
    { text: 'Sure, you can submit by tomorrow morning instead.', fromMe: true },
    { text: 'Will submit the assignment by tomorrow morning.', fromMe: false },
  ],
};

const makeChatMessages = (threadId) => {
  const me = chatMeIdentity();
  const person = CHAT_DEMO_PEOPLE.find((p) => `chat-thread-${CHAT_DEMO_PEOPLE.indexOf(p) + 1}` === threadId);
  const script = CHAT_THREAD_MESSAGES[threadId] || [];
  return script.map((turn, i) => ({
    _id: `${threadId}-msg-${i + 1}`,
    threadId,
    senderId: turn.fromMe ? me.id : (person?.userId || 'chat-contact-0'),
    senderType: turn.fromMe ? me.role : String(person?.userType || 'student').toLowerCase(),
    senderName: turn.fromMe ? me.name : (person?.name || 'Contact'),
    text: turn.text,
    createdAt: new Date(Date.now() - (script.length - i) * 600000).toISOString(),
    seenBy: [{ userId: me.id, seenAt: new Date().toISOString() }],
  }));
};

// Consumed by TeacherAnalyticsDashboard.jsx's class-trends/term-comparison
// widgets, which expect a flat object (not an array) under `data`.
const teacherAnalyticsTrends = () => ({
  success: true,
  data: {
    classAverage: 82,
    atRiskCount: 6,
    topPerformers: Array.from({ length: 5 }, () => ({ name: name(), score: rand(90, 99) })),
    trend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, average: rand(70, 90) })),
    subjectTrends: SUBJECTS.map((s) => ({
      subject: s,
      trend: Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, average: rand(70, 90) })),
    })),
  },
});

// Consumed by StudentAnalyticsPortal.jsx's Intervention tab (fetchWeakStudents,
// run unconditionally on mount) and TeacherAnalyticsDashboard.jsx's at-risk
// widget — both expect `data` to be an array of student records.
const teacherAnalyticsAtRisk = () => {
  const levels = ['critical', 'high', 'medium'];
  return Array.from({ length: 6 }, (_, i) => {
    const studentName = name();
    return {
      studentId: `stu-risk-${i + 1}`,
      name: studentName,
      studentName,
      roll: i + 1,
      grade: pick(CLASSES),
      section: pick(SECTIONS),
      subject: pick(SUBJECTS),
      level: levels[i % levels.length],
      riskLevel: levels[i % levels.length],
      attPct: rand(55, 85),
      avgScore: rand(35, 58),
      scoreTrend: pick([-8, -5, -2, 0, 3]),
      weakAreas: [pick(['Fractions', 'Grammar', 'Algebra', 'Reading Comprehension']), pick(['Problem Solving', 'Application Skills', 'Core Concepts'])],
      hasAIPath: Math.random() > 0.6,
    };
  });
};

const teacherHoliday = () => ({
  success: true,
  data: Array.from({ length: 6 }, (_, i) => ({
    _id: `hol-${i + 1}`,
    name: pick(['Independence Day', 'Diwali', 'Winter Break', 'Republic Day', 'Summer Vacation', 'Founders Day']),
    date: new Date(Date.now() + (i + 1) * 15 * 86400000).toISOString(),
  })),
});

// --- Fees Collection (admin) fixtures ---------------------------------------

const FEE_ACADEMIC_YEAR = { id: 'year-2025-26', name: '2025-2026', isActive: true };
const feeClasses = CLASSES.map((c, i) => ({ id: `class-${i}`, name: c, academicYearId: FEE_ACADEMIC_YEAR.id }));
const feeSections = feeClasses.flatMap((cls) =>
  SECTIONS.map((s, j) => ({ id: `${cls.id}-sec-${j}`, name: s, classId: cls.id }))
);

const feesAdminFilters = () => ({
  classes: feeClasses,
  sections: feeSections,
  academicYears: [FEE_ACADEMIC_YEAR],
});

const feeStructures = () => feeClasses.map((cls, i) => ({
  id: `fs-${i}`,
  _id: `fs-${i}`,
  name: `${cls.name} Standard Fee`,
  classId: cls.id,
  academicYearId: cls.academicYearId,
  isActive: true,
  totalAmount: pick([15000, 18000, 22000, 25000, 30000]),
}));

const makeFeeInvoices = (count = 24) => Array.from({ length: count }, (_, i) => {
  const cls = pick(feeClasses);
  const total = pick([15000, 18000, 22000, 25000, 30000]);
  const roll = Math.random();
  const paid = roll < 0.3 ? total : roll < 0.75 ? Math.round(total * (0.3 + Math.random() * 0.4)) : 0;
  const balance = total - paid;
  return {
    invoiceId: `inv-${i + 1}`,
    studentId: `stu-${i + 1}`,
    studentName: name(),
    admissionNumber: `ADM-${1000 + i}`,
    className: cls.name,
    classId: cls.id,
    section: pick(SECTIONS),
    totalAmount: total,
    paidAmount: paid,
    balanceAmount: balance,
    status: balance <= 0 ? 'paid' : paid > 0 ? 'partial' : 'due',
    profilePic: '',
  };
});

// ---------------------------------------------------------------------------
// Route table — matched in order, first match wins
// ---------------------------------------------------------------------------

const routes = [
  { test: /\/api\/student\/dashboard/, get: studentDashboard },
  // Raw array, shaped to match what ClassesHub/TeacherDashboard/ClassNotes etc. expect:
  // classId/sectionId/subjectId as populated objects, not plain strings.
  { test: /\/api\/teacher\/dashboard\/routine/, get: () => ({ success: true, ...makeTeacherRoutine() }) },
  { test: /\/api\/teacher\/dashboard\/feedback/, get: () => makeTeacherFeedback() },
  { test: /\/api\/teacher\/dashboard\/complaints/, get: () => makeTeacherComplaints() },
  { test: /\/api\/teacher\/dashboard\/work-attendance/, get: () => makeWorkAttendance() },
  { test: /\/api\/teacher\/dashboard\/leave-requests/, get: () => makeLeaveRequests() },
  { test: /\/api\/teacher\/dashboard\/expenses/, get: () => makeTeacherExpenses() },
  { test: /\/api\/teacher\/auth\/profile/, get: () => makeTeacherProfile() },
  { test: /\/api\/teacher\/dashboard\/allocations/, get: () => [
    { classId: { _id: 'class-0', name: 'Grade 5', academicYearId: 'year-2025-26' }, sectionId: { _id: 'sec-0', name: 'A' }, subjectId: { _id: 'sub-0', name: 'Mathematics' } },
    { classId: { _id: 'class-1', name: 'Grade 6', academicYearId: 'year-2025-26' }, sectionId: { _id: 'sec-1', name: 'B' }, subjectId: { _id: 'sub-1', name: 'Science' } },
    { classId: { _id: 'class-2', name: 'Grade 7', academicYearId: 'year-2025-26' }, sectionId: { _id: 'sec-2', name: 'A' }, subjectId: { _id: 'sub-2', name: 'English' } },
    { classId: { _id: 'class-3', name: 'Grade 8', academicYearId: 'year-2025-26' }, sectionId: { _id: 'sec-0', name: 'C' }, subjectId: { _id: 'sub-4', name: 'Computer Science' } },
  ] },
  { test: /\/api\/teacher\/dashboard/, get: teacherDashboardPayload },
  { test: /\/api\/academic\/hierarchy/, get: academicHierarchy },
  // Raw object — ClassesHub, AssignmentPortal, admin/Analytics.jsx etc. all
  // read `_id`/`name` straight off the body, not under `.data`.
  { test: /\/api\/academic\/active-year/, get: () => ({ _id: 'year-2025-26', name: '2025-2026', isActive: true }) },
  // Raw arrays — most admin screens call `res.json()` and expect the array directly.
  { test: /\/api\/academic\/years/, get: () => [{ _id: 'year-2025-26', name: '2025-2026', isActive: true }] },
  { test: /\/api\/academic\/classes/, get: () => CLASSES.map((c, i) => ({ _id: `class-${i}`, name: c, academicYearId: 'year-2025-26' })) },
  // One row per class x section (with `classId`) — NoticeManagement.jsx,
  // ReportCardManagement.jsx, ExaminationManagement.jsx etc. all cascade
  // their section dropdown by filtering `sec.classId === selectedClassId`;
  // a flat section-name-only list (no classId) never matched anything.
  { test: /\/api\/academic\/sections/, get: () => CLASSES.slice(0, 4).flatMap((_, ci) => SECTIONS.map((s, si) => ({ _id: `sec-${ci}-${si}`, name: s, classId: `class-${ci}` }))) },
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
  { test: /\/api\/admin-analytics\/mastery-matrix/, get: adminAnalyticsMasteryMatrix },
  { test: /\/api\/admin-analytics\/teacher-effectiveness/, get: adminAnalyticsTeacherEffectiveness },
  { test: /\/api\/admin-analytics\/ai-path-effectiveness/, get: adminAnalyticsAiPath },
  { test: /\/api\/admin-analytics\/dropout-risk/, get: adminAnalyticsDropoutRisk },
  { test: /\/api\/admin-analytics\/cohort-trend/, get: adminAnalyticsCohortTrend },
  { test: /\/api\/admin-analytics\/content-usage/, get: adminAnalyticsContentUsage },
  { test: /\/api\/admin-analytics\/system-health/, get: adminAnalyticsSystemHealth },
  { test: /\/api\/admin-analytics\/exam-integrity/, get: adminAnalyticsExamIntegrity },
  { test: /\/api\/admin-analytics\/equity-monitoring/, get: adminAnalyticsEquityMonitoring },
  { test: /\/api\/departments/, get: () => ({ success: true, data: ['Administration', 'Finance', 'Library', 'IT', 'Transport'].map((d, i) => ({ _id: `dept-${i}`, name: d })) }) },
  // Raw array — admin/Analytics.jsx's Recent Activity feed reads `Array.isArray(data)`
  // directly, and each entry's `meta.actorName`/`entity`/`createdAt` (not `user`/`timestamp`).
  { test: /\/api\/audit-logs/, get: () => Array.from({ length: 24 }, (_, i) => {
    const action = pick(['Login', 'Updated record', 'Created student', 'Deleted notice', 'Fee payment recorded', 'Published lesson plan', 'Approved leave request', 'Marked attendance']);
    return {
      _id: `log-${i}`,
      action,
      entity: pick(['Student', 'Teacher', 'Fee Invoice', 'Notice', 'Lesson Plan', 'Attendance']),
      actorType: pick(['Admin', 'Teacher', 'Principal']),
      meta: { actorName: name(), entityName: pick(CLASSES) },
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    };
  }) },
  { test: /\/api\/promotion\/preview|\/api\/promotion\/history/, get: () => ({ success: true, data: makeStudentList(15) }) },
  { test: /\/api\/promotion\/leaving-students/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/teacher-allocations/, get: () => ({ success: true, data: makeTeacherList(10).map((t) => ({ ...t, class: pick(CLASSES), section: pick(SECTIONS), subject: pick(SUBJECTS) })) }) },
  // Raw array — timetableApi.getAll()'s caller does `Array.isArray(r.value)` on
  // the body directly (handleResponse returns `response.json()` as-is).
  { test: /\/api\/timetable\/all/, get: () => makeTimetables() },
  { test: /\/api\/holidays\/admin/, get: teacherHoliday },
  // Raw object — admin/Analytics.jsx reads `reportsSummary.attendance`/`.users` directly.
  { test: /\/api\/reports\/summary/, get: () => ({
    attendance: { present: 1142, absent: 68, totalMarked: 1247 },
    users: { students: 1247, teachers: 98, parents: 1180, staff: 34 },
    totalReports: 24,
    generatedThisMonth: 6,
  }) },
  // Raw object — admin/Analytics.jsx's charts read `subjectPerformance`/
  // `gradeDistribution`/`improvementTrends` straight off the body.
  { test: /\/api\/progress\/analytics/, get: () => {
    const subjectPerformance = {};
    SUBJECTS.forEach((s) => { subjectPerformance[s] = { averageScore: rand(62, 91), studentCount: rand(180, 320) }; });
    const gradeDistribution = { 'A+': rand(80, 160), A: rand(150, 260), 'B+': rand(180, 300), B: rand(150, 260), 'C+': rand(80, 160), C: rand(50, 110), D: rand(15, 45), F: rand(5, 20) };
    const improvementTrends = { improving: rand(380, 520), stable: rand(400, 560), declining: rand(80, 180) };
    return {
      subjectPerformance,
      gradeDistribution,
      improvementTrends,
      totalStudents: 1247,
      attendanceRate: 92,
      averageScore: 78,
    };
  } },
  // Raw arrays — admin/pages/Result.jsx reads each of these directly
  // (`Array.isArray(d)`), scoped to the same Grade 5-A / Mid-Term dataset
  // so the class/section/session/exam filters all actually match something.
  { test: /\/api\/exam\/results\/exam-options/, get: () => EXAM_RESULT_SUBJECT_EXAMS },
  { test: /\/api\/exam\/results\/admin/, get: () => makeExamResults() },
  { test: /\/api\/exam\/groups/, get: () => makeExamResultGroups() },
  { test: /\/api\/exam\/fetch/, get: () => makeExamsList(10) },
  { test: /\/api\/exam\/seating-plans/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/exam\/auto-schedule-settings|\/api\/exam\/creation-drafts/, get: () => ({ success: true, data: {} }) },
  // Raw `{stats, feedback, filters}` — admin/pages/TeacherFeedbackOverview.jsx
  // reads the body directly, not under `.data`.
  { test: /\/api\/admin\/feedback\/teacher-feedback\/settings/, get: () => ({ settings: { enabled: true, startDate: new Date(Date.now() - 5 * 86400000).toISOString(), endDate: new Date(Date.now() + 10 * 86400000).toISOString() } }) },
  { test: /\/api\/admin\/feedback\/teacher-feedback/, get: () => {
    const feedback = Array.from({ length: 36 }, (_, i) => ({
      id: `teacher-fb-${i + 1}`,
      teacherName: name(),
      studentName: Math.random() > 0.3 ? name() : 'Anonymous',
      isAnonymous: Math.random() > 0.3,
      className: pick(CLASSES),
      sectionName: pick(SECTIONS),
      subjectName: pick(SUBJECTS),
      overallRating: rand(2, 5),
      comments: pick(['Explains concepts very clearly.', 'Makes the class engaging and fun.', 'Could give more practice problems.', 'Always available to help after class.', 'Sometimes goes too fast through topics.', 'Great at answering doubts patiently.']),
      createdAt: new Date(Date.now() - i * 43200000).toISOString(),
    }));
    const ratingDistribution = feedback.reduce((acc, f) => { acc[f.overallRating] = (acc[f.overallRating] || 0) + 1; return acc; }, {});
    return {
      stats: {
        averageRating: feedback.reduce((sum, f) => sum + f.overallRating, 0) / feedback.length,
        totalFeedback: feedback.length,
        ratingDistribution,
      },
      feedback,
      filters: { classes: CLASSES, sections: SECTIONS, subjects: SUBJECTS },
    };
  } },
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
  { test: /\/api\/fees\/admin\/filters/, get: feesAdminFilters },
  { test: /\/api\/fees\/admin\/invoices/, get: () => makeFeeInvoices() },
  { test: /\/api\/fees\/admin/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/fees\/structures/, get: feeStructures },
  // admin/Analytics.jsx filters/sums on totalAmount/balanceAmount/academicYearId/
  // className/section directly — the old `amount`/`class`/`status` shape never matched.
  { test: /\/api\/fees\/invoices|\/api\/fees\/invoice/, get: () => makeStudentList(220).map((s, i) => {
    const totalAmount = pick([15000, 18000, 22000, 25000, 30000]);
    const roll = Math.random();
    const balanceAmount = roll < 0.4 ? 0 : roll < 0.8 ? Math.round(totalAmount * (0.2 + Math.random() * 0.5)) : totalAmount;
    return {
      _id: `inv-${i}`,
      studentName: s.name,
      className: s.class,
      section: s.section,
      academicYearId: 'year-2025-26',
      totalAmount,
      balanceAmount,
      dueDate: new Date(Date.now() + (i % 30 - 15) * 86400000).toISOString(),
      createdAt: new Date(Date.now() - (i % 180) * 86400000).toISOString(),
    };
  }) },
  { test: /\/api\/fees\/parent/, get: () => ({ success: true, data: { due: 4500, paid: 45000, invoices: [] } }) },
  { test: /\/api\/fees/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/nif\/students/, get: () => ({ success: true, data: makeStudentList() }) },
  { test: /\/api\/attendance\/teacher/, get: () => ({ success: true, data: makeClassStudentRoster() }) },
  { test: /\/api\/attendance/, get: () => ({ success: true, data: { percentage: rand(85, 98), present: rand(150, 180), absent: rand(2, 15) } }) },
  // Raw arrays/objects — AssignmentPortal.jsx reads `response.data` directly
  // (axios) with no `.data.data` unwrap, so these must not be `{success,data}`-wrapped.
  { test: /\/api\/assignment\/teacher\/submissions/, get: () => makeAssignmentSubmissions() },
  { test: /\/api\/assignment\/teacher\/my-assignments/, get: () => makeAssignments() },
  { test: /\/api\/assignment\/teacher/, get: () => ({ success: true, data: makeAssignments() }) },
  { test: /\/api\/assignment/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/lesson-plans\/teacher\/tryout-submissions/, get: () => makeTryoutSubmissions() },
  { test: /\/api\/lesson-plans\/teacher\/options/, get: () => makeLessonPlanOptions() },
  // `/my` is read by both AssignmentPortal.jsx (a simple list) and
  // AIPoweredTeaching.jsx (full chapter-plan docs it filters by classId/
  // sectionId/subjectId) — union both fixtures into one raw array so each
  // consumer finds what it needs and ignores the extra fields.
  { test: /\/api\/lesson-plans\/teacher\/my/, get: () => [...makeLessonPlanChapters(), ...makeLessonPlans()] },
  { test: /\/api\/lesson-plans\/teacher/, get: () => makeLessonPlans() },
  { test: /\/api\/lesson-plans/, get: () => ({ success: true, data: [] }) },
  // Raw array, optionally filtered by `?examId=` — used by the bulk-entry
  // grid to pre-fill existing marks for that subject exam.
  { test: /\/api\/exam\/results\?/, get: (path) => {
    const examId = decodeURIComponent(path.match(/examId=([^&]+)/)?.[1] || '');
    const all = makeExamResults();
    return examId ? all.filter((r) => String(r.examId?._id) === examId) : all;
  } },
  { test: /\/api\/exam\/results/, get: () => ({ success: true, data: SUBJECTS.map((s) => ({ subject: s, score: rand(60, 98), grade: pick(['A+', 'A', 'B+', 'B']) })) }) },
  { test: /\/api\/exam\/teacher|\/api\/exam\/groups/, get: () => ({ success: true, data: makeExamsList() }) },
  { test: /\/api\/reports\/report-cards/, get: () => ({ success: true, data: SUBJECTS.map((s) => ({ subject: s, score: rand(60, 98), grade: pick(['A+', 'A', 'B+', 'B']) })) }) },
  { test: /\/api\/exam/, get: () => ({ success: true, data: [] }) },
  // Raw array — both the student-submission view and teacher-approval view
  // read the response body directly (`Array.isArray(data)`), no `.data` unwrap.
  { test: /\/api\/excuse-letters/, get: () => makeExcuseLetters() },
  { test: /\/api\/observations/, get: () => ({ success: true, data: makeObservations() }) },
  // Raw array + raw object — StudentAnalyticsPortal.jsx reads these directly
  // (`Array.isArray(data)`, `setAnalytics(analyticsData)`), not via `.data`.
  { test: /\/api\/progress\/students/, get: () => makeProgressStudents() },
  { test: /\/api\/progress\/analytics/, get: () => ({ averageScore: rand(68, 84), attendanceRate: rand(85, 95), testPerformance: rand(65, 88), totalStudents: 22 }) },
  { test: /\/api\/teacher-analytics\/(class-trends|term-comparison)/, get: teacherAnalyticsTrends },
  { test: /\/api\/teacher-analytics\/at-risk/, get: () => ({ success: true, data: teacherAnalyticsAtRisk() }) },
  // Any other /teacher-analytics/<sub-route> (interventions, misconceptions,
  // class-gaps, mastery, cohort, ...): safe array fallback so `payload.data || []`
  // on the consumer side actually gets an empty array, not a truthy object.
  { test: /\/api\/teacher-analytics/, get: () => ({ success: true, data: [] }) },
  { test: /\/api\/holidays/, get: teacherHoliday },
  // Raw array — every consumer (teacher/parent/principal notification bells,
  // MyWorkPortal) does `Array.isArray(data)` directly on the response body.
  { test: /\/api\/notifications\/user|\/api\/notifications\/teacher/, get: () => makeNotifications() },
  // Raw array — NoticeManagement.jsx/NoticeDetail.jsx read `Array.isArray(data)`
  // directly on the bare `/api/notifications` endpoint (admin notice board).
  { test: /\/api\/notifications/, get: () => makeAdminNotices() },
  { test: /\/api\/alcove\/posts|notice/i, get: () => ({ success: true, data: makeNotices() }) },
  // Raw shapes — TeacherChat.jsx/ParentChat.jsx/StudentChat.jsx/PrincipalChatPanel.jsx
  // all call `apiFetch` (unwrapped res.json()) and use the body directly, e.g.
  // `setContacts(data)` with no array check — a `{success,data}` wrapper here
  // crashes the contacts search (`contacts.filter` on a non-array object).
  { test: /\/api\/chat\/me/, get: () => chatMeIdentity() },
  { test: /\/api\/chat\/threads\/[^/]+\/presence/, get: () => ({ presence: { 'chat-contact-1': { online: true, lastSeen: null }, 'chat-contact-2': { online: false, lastSeen: new Date(Date.now() - 3600000).toISOString() }, 'chat-contact-3': { online: true, lastSeen: null } } }) },
  { test: /\/api\/chat\/threads\/[^/]+\/messages/, get: (path) => {
    const threadId = path.match(/\/api\/chat\/threads\/([^/?]+)\/messages/)?.[1] || '';
    return makeChatMessages(threadId);
  } },
  { test: /\/api\/chat\/threads\/[^/]+\/keys/, get: () => ({ keys: {} }) },
  { test: /\/api\/chat\/contacts|\/api\/chat\/students|\/api\/chat\/parents/, get: () => makeChatContacts() },
  { test: /\/api\/chat\/threads/, get: () => makeChatThreads() },
  { test: /\/api\/tenant/, get: () => ({ organization: { name: 'Electronic Educare Demo School', primaryColor: '#2563eb', secondaryColor: '#0f172a' }, isMainDomain: true }) },
  { test: /\/api\/super-admin\/overview/, get: () => ({ success: true, data: { schools: 12, activeUsers: 4300, revenue: 890000 } }) },
  { test: /\/api\/super-admin\/schools/, get: () => ({ success: true, data: Array.from({ length: 8 }, (_, i) => ({ _id: `sch-${i}`, name: `Demo School ${i + 1}`, students: rand(300, 1500) })) }) },
];

const genericFallback = () => ({ success: true, data: [], message: 'Demo mode: no backend connected' });

// ---------------------------------------------------------------------------
// AI teacher-tool fixtures — every "Generate with AI" button in the teacher
// portal POSTs to one of these /api/ai-teacher/* routes. Demo mode has no LLM
// behind it, so each one returns realistic canned content instead of the
// generic "Saved (demo mode)" write ack, which otherwise left these buttons
// looking broken (success with no visible output).
// ---------------------------------------------------------------------------

const AI_OPTION_BANK = {
  Mathematics: ['The sum of the two values', 'The difference of the two values', 'The product of the two values', 'Twice the smaller value'],
  Science: ['Photosynthesis', 'Respiration', 'Condensation', 'Evaporation'],
  English: ['A noun', 'A verb', 'An adjective', 'An adverb'],
  default: ['Option A', 'Option B', 'Option C', 'Option D'],
};

const aiQuizQuestions = ({ subject = 'General', topic = 'the topic', count = 5, questionType = 'mcq', difficulty = 'medium', bloomLevel = '' } = {}) => {
  const bank = AI_OPTION_BANK[subject] || AI_OPTION_BANK.default;
  return Array.from({ length: Math.max(1, Math.min(Number(count) || 5, 10)) }, (_, i) => {
    const correctIndex = rand(0, 3);
    return {
      questionText: `[Demo AI] Question ${i + 1} on "${topic}" (${subject})`,
      question: `[Demo AI] Question ${i + 1} on "${topic}" (${subject})`,
      type: questionType,
      options: bank.map((text, idx) => ({ text, isCorrect: idx === correctIndex })),
      explanation: `Demo explanation: option "${bank[correctIndex]}" is correct for this ${subject} question on ${topic}.`,
      difficulty,
      bloomLevel: bloomLevel || 'understand',
    };
  });
};

const aiIdoWeeDoContent = (subject, topic) => [
  `HOOK: Kick off with a quick real-world question about ${topic} to spark curiosity in ${subject}.`,
  `I DO: Demonstrate one worked example of ${topic}, narrating your thinking step by step.`,
  `WE DO: Work through a second ${topic} problem together, calling on students to supply the next step.`,
  `YOU DO: Students independently solve 2-3 ${topic} problems while you circulate and check understanding.`,
].join('\n');

const aiLessonContent = (subject, topic) => ({
  objectives: [
    `Explain the core concept of ${topic} in ${subject} using their own words.`,
    `Apply ${topic} to solve at least two practice problems independently.`,
    `Identify common mistakes students make when working with ${topic}.`,
  ],
  flow: {
    HOOK: `Open with a short real-world scenario involving ${topic}.`,
    'I DO': `Model one worked example of ${topic} on the board.`,
    'WE DO': `Guide the class through a second ${topic} example together.`,
    'YOU DO': `Students practice ${topic} independently in pairs.`,
  },
  explanation: `${topic} is a foundational idea in ${subject}. Demo AI explanation: start from the definition, walk through a worked example, then connect it to a real-world application so students see why it matters.`,
  recap: `Today we covered ${topic} in ${subject} — the key idea, a worked example, and guided practice. Review the exit-ticket problems before next class.`,
});

const aiClassSummary = (className, section, subject) => {
  const label = [className, section].filter(Boolean).join('-') || 'this class';
  const subj = subject || 'the subject';
  return `**Demo AI summary for ${label} (${subj})**\n\nOverall performance is trending steady, with most students scoring in the 70-85% range. A small group (roughly 15%) is falling behind on recent assessments and would benefit from targeted intervention. Attendance remains strong. Recommended next step: a short focused review session on the lowest-scoring topic before the next assessment.`;
};

const aiMisconceptionReport = (subject) => (
  `**Demo AI misconception report — ${subject || 'this subject'}**\n\n` +
  `1. Several students confuse related terms/steps and apply the wrong procedure first.\n` +
  `2. A recurring pattern of sign/unit errors suggests the underlying concept needs re-teaching, not just more practice.\n` +
  `3. Recommended action: a 10-minute warm-up next class addressing the top misconception directly, followed by a quick formative check.`
);

const parseJsonBody = (init) => {
  try { return JSON.parse(init?.body || '{}'); } catch { return {}; }
};

const isApiUrl = (url) => typeof url === 'string' && url.includes('/api/');

export const installMockApi = () => {
  if (typeof window === 'undefined' || window.__mockApiInstalled) return;
  window.__mockApiInstalled = true;
  axios.defaults.adapter = 'fetch';
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (!isApiUrl(url)) return realFetch(input, init);

    const method = (init?.method || 'GET').toUpperCase();
    const path = url.replace(/^https?:\/\/[^/]+/, '');

    // Non-GET requests: pretend the write succeeded.
    if (method !== 'GET') {
      await new Promise((r) => setTimeout(r, 150));
      if (/\/api\/fees\/admin\/invoices\/bulk/.test(path)) {
        return json({ createdCount: rand(8, 25), skippedCount: rand(0, 4) });
      }
      if (/\/api\/fees\/admin\/razorpay\/order/.test(path)) {
        return json({ keyId: 'rzp_test_demo', order: { id: `order_demo_${Date.now()}`, amount: 10000, currency: 'INR' } });
      }
      if (/\/api\/fees\/admin\/razorpay\/verify/.test(path)) {
        return json({ success: true });
      }
      if (/\/api\/ai-teacher\/quiz-generate/.test(path)) {
        const body = parseJsonBody(init);
        return json({ success: true, data: { groundedInMaterial: true, questions: aiQuizQuestions(body) } });
      }
      if (/\/api\/ai-teacher\/idoweedo/.test(path)) {
        const { subject = 'General', topic = 'this topic' } = parseJsonBody(init);
        return json({ success: true, data: { content: aiIdoWeeDoContent(subject, topic) } });
      }
      if (/\/api\/ai-teacher\/generate-content/.test(path)) {
        const { subject = 'General', topic = 'this topic' } = parseJsonBody(init);
        return json({ success: true, data: aiLessonContent(subject, topic) });
      }
      if (/\/api\/ai-teacher\/class-summary/.test(path)) {
        const { className, section, subject } = parseJsonBody(init);
        return json({ success: true, data: { content: aiClassSummary(className, section, subject) } });
      }
      if (/\/api\/ai-teacher\/misconception-report/.test(path)) {
        const { subject } = parseJsonBody(init);
        return json({ success: true, data: { content: aiMisconceptionReport(subject) } });
      }
      if (/\/api\/ai-teacher\/ingest-file|\/api\/ai-teacher\/assignment-draft/.test(path)) {
        const body = parseJsonBody(init);
        return json({ success: true, data: { groundedInMaterial: true, draft: { title: `[Demo AI] ${body.topic || body.chapterTitle || 'Draft assignment'}`, description: `1. Demo AI question about ${body.topic || 'the topic'}.\n2. Explain your reasoning.` } } });
      }
      if (/\/api\/ai-tutor\/generate|\/api\/ai-tutor\/exam-explanation|\/api\/ai-tutor\/exam-feedback/.test(path)) {
        return json({ success: true, data: { content: 'Demo AI response: here is a step-by-step explanation tailored to this question, generated in demo mode.' } });
      }
      // Echo the sent text back as a well-formed message (not the generic
      // write ack) — the chat UI replaces its optimistic bubble with exactly
      // this response, so an ack with no `text` field would blank the bubble
      // right after sending.
      if (/\/api\/chat\/threads\/[^/]+\/messages/.test(path)) {
        const threadId = path.match(/\/api\/chat\/threads\/([^/?]+)\/messages/)?.[1] || '';
        const me = chatMeIdentity();
        const { text = '' } = parseJsonBody(init);
        return json({
          _id: `${threadId}-msg-${Date.now()}`,
          threadId,
          senderId: me.id,
          senderType: me.role,
          senderName: me.name,
          text,
          createdAt: new Date().toISOString(),
          seenBy: [{ userId: me.id, seenAt: new Date().toISOString() }],
        });
      }
      if (/\/api\/chat\/threads\/direct/.test(path)) {
        const { participantId } = parseJsonBody(init);
        const person = CHAT_DEMO_PEOPLE.find((p) => p.userId === participantId) || CHAT_DEMO_PEOPLE[0];
        const idx = CHAT_DEMO_PEOPLE.indexOf(person);
        return json({ _id: `chat-thread-${idx + 1}`, type: 'direct', otherParticipant: person, unreadCount: 0, lastMessage: '', lastMessageAt: new Date().toISOString() });
      }
      // Echo the saved profile back as `{teacher: {...}}` — MyWorkPortal re-maps
      // its form from this response, so the generic ack (no `teacher` field)
      // would wipe every field the teacher just edited back to blank.
      if (/\/api\/teacher\/auth\/profile/.test(path)) {
        return json({ teacher: { ...makeTeacherProfile().teacher, ...parseJsonBody(init) } });
      }
      // Echo saved settings back under `settings` — the admin feedback-window
      // toggle re-reads this response, so a bare ack would reset it to disabled.
      if (/\/api\/admin\/feedback\/teacher-feedback\/settings/.test(path)) {
        return json({ settings: parseJsonBody(init) });
      }
      // Echo the full updated letter back (not just the ack) — the approve/
      // reject UI replaces the whole row with this response, so a bare ack
      // would blank out the student's name, reason, dates, etc. on update.
      if (/\/api\/excuse-letters\/teacher\/[^/]+/.test(path)) {
        const id = path.match(/\/api\/excuse-letters\/teacher\/([^/?]+)/)?.[1] || '';
        const existing = makeExcuseLetters().find((l) => l._id === id) || makeExcuseLetters()[0];
        return json({ ...existing, _id: id, id, ...parseJsonBody(init) });
      }
      return json({ success: true, message: 'Saved (demo mode)' });
    }

    const route = routes.find((r) => r.test.test(path));
    const payload = route ? route.get(path) : genericFallback();
    await new Promise((r) => setTimeout(r, 150));
    return json(payload);
  };
};
