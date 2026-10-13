import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, BookOpen, Calendar, GraduationCap, Headphones,
  MessagesSquare, ShieldCheck, Users, Wallet, UserCog, Briefcase,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AUTH_NOTICE, consumeAuthNotice, purgeStaleSessionCaches } from '../utils/authSession';
import { useTenant } from '../context/TenantContext';
import { makeDemoToken } from '../utils/demoAuth';

// Floating glass icon badge used around the hero illustration
const FloatingIcon = ({ icon, className, delay = 0 }) => (
  <Motion.div
    className={`absolute flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg text-white ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: [0, -8, 0] }}
    transition={{
      opacity: { duration: 0.6, delay },
      y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay },
    }}
  >
    {icon}
  </Motion.div>
);

const LoginForm = () => {
  const { name: organizationName, logo, colors } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const noticeFromState = location.state?.authNotice;
    const storedNotice = consumeAuthNotice();
    const notice = noticeFromState || storedNotice;
    if (!notice) return;

    if (notice === AUTH_NOTICE.EXPIRED) {
      toast.error('Session time expired. Login again.');
      return;
    }
    if (notice === AUTH_NOTICE.LOGGED_OUT) {
      toast.success('Logged out successfully');
    }
  }, [location.state?.authNotice]);

  const handleRoleSelect = (role) => {
    purgeStaleSessionCaches();
    const token = makeDemoToken(role, `demo-${role.toLowerCase()}`);
    localStorage.setItem('token', token);
    localStorage.setItem('userType', role);

    const redirectByUserType = {
      Student: '/student',
      Teacher: '/teacher/dashboard',
      Parent: '/parent',
      Principal: '/principal',
      Admin: '/admin/dashboard',
      SuperAdmin: '/super-admin/overview',
    };
    toast.success(`Signed in as ${role}`);
    navigate(redirectByUserType[role] || '/student');
  };

  const roleCards = [
    { role: 'Student', icon: <GraduationCap size={28} />, desc: 'Access your classes, homework & results', bg: 'bg-blue-500' },
    { role: 'Teacher', icon: <Briefcase size={28} />, desc: 'Manage classes, assignments & attendance', bg: 'bg-orange-500' },
    { role: 'Parent', icon: <Users size={28} />, desc: "Track your child's progress & communication", bg: 'bg-emerald-500' },
    { role: 'Principal', icon: <ShieldCheck size={28} />, desc: 'Oversee school-wide operations & analytics', bg: 'bg-purple-500' },
    { role: 'Admin', icon: <UserCog size={28} />, desc: 'Manage administration & records', bg: 'bg-rose-500' },
  ];

  const features = [
    { icon: <Users size={18} />, label: 'Smart Attendance', desc: 'Real-time attendance tracking made easy', bg: 'bg-blue-500' },
    { icon: <BookOpen size={18} />, label: 'Homework', desc: 'Create, assign and manage homework', bg: 'bg-orange-500' },
    { icon: <Wallet size={18} />, label: 'Fee Management', desc: 'Secure and hassle-free fee collection', bg: 'bg-emerald-500' },
    { icon: <BarChart3 size={18} />, label: 'Analytics', desc: 'Powerful reports for better decisions', bg: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-svh lg:h-svh flex flex-col lg:flex-row bg-[#fffaf2] overflow-x-hidden lg:overflow-hidden">

      {/* ══════════════════════════ LEFT / HERO PANEL ══════════════════════════ */}
      <div
        className="hidden lg:flex relative w-full lg:w-[55%] flex-col overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:px-10 lg:py-6 xl:px-14 xl:py-8 lg:h-full"
        style={{
          backgroundImage: 'url(/login-blue.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          background: `linear-gradient(160deg, ${colors.secondary || '#1E3A8A'} 0%, ${colors.primary || '#2563EB'} 55%, #3B82F6 100%), url(/login-blue.png)`,
          backgroundBlendMode: 'screen',
        }}
      >
        {/* Fine grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.15]"
          // style={{
          //   backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)',
          //   backgroundSize: '36px 36px',
          // }}
        />
        {/* Soft glowing blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-black/10 pointer-events-none" />
        <div className="absolute top-1/3 right-6 w-28 h-28 rounded-full bg-blue-400/10 border border-blue-300/20 blur-sm pointer-events-none" />

        {/* Logo */}
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden shrink-0">
            <img src={logo || '/logo_new.png'} loading='lazy' alt="" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-lg font-black text-white leading-none">EEC</div>
            <div className="text-xs text-white/60 font-medium leading-none mt-1">{organizationName}</div>
          </div>
        </Motion.div>

        {/* Badge pill */}
        <Motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 mt-6 lg:mt-4 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span className="text-xs font-semibold text-white/85 tracking-wide">School Management ERP Platform</span>
        </Motion.div>

        {/* Heading + description */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 mt-6 lg:mt-4"
        >
          {/* <h1 className="text-4xl sm:text-5xl lg:text-3xl xl:text-4xl 2xl:text-[3.25rem] font-black text-white leading-[1.08] tracking-tight">
            Empowering<br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Education,
            </span><br />
            Every Day
          </h1> */}
          <p className="mt-4 lg:mt-2 text-sm sm:text-base lg:text-sm text-blue-100/70 leading-relaxed max-w-[420px]">
            A unified platform connecting students, teachers, parents and schools for smarter and better education.
          </p>
        </Motion.div>

        {/* Hero illustration + floating icons */}
        <div className="relative z-10 flex-1 flex items-end justify-center min-h-[240px] sm:min-h-[340px] lg:min-h-0 mt-6 lg:mt-2">
          <FloatingIcon
            icon={<GraduationCap size={20} />}
            className="w-11 h-11 sm:w-14 sm:h-14 top-[3%] left-[18%] sm:left-[22%]"
            delay={0.1}
          />
          <FloatingIcon
            icon={<BarChart3 size={20} />}
            className="w-11 h-11 sm:w-14 sm:h-14 -top-[6%] right-[12%] sm:right-[16%] text-amber-200"
            delay={0.4}
          />
          <FloatingIcon
            icon={<Wallet size={18} />}
            className="w-10 h-10 sm:w-12 sm:h-12 top-[32%] left-[4%] sm:left-[8%] text-emerald-200"
            delay={0.7}
          />
          <FloatingIcon
            icon={<MessagesSquare size={18} />}
            className="w-10 h-10 sm:w-12 sm:h-12 top-[28%] right-[2%] sm:right-[6%] text-blue-200"
            delay={1.0}
          />
          <FloatingIcon
            icon={<Calendar size={18} />}
            className="w-10 h-10 sm:w-12 sm:h-12 bottom-[8%] right-[16%] sm:right-[20%] text-purple-200"
            delay={1.3}
          />

          <Motion.img
            src="/login-left-image.png"
            alt="Students, teachers and parents using Electronic Educare"
            className="relative w-[72%] sm:w-[62%] lg:w-auto lg:h-[26vh] lg:max-h-[100vh] xl:h-[100vh] xl:max-h-[50vh] max-w-full object-contain select-none pointer-events-none top-12"
            animate={{ y: [0, -12, 0] }}
            loading='lazy'
            // transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Feature card */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 mt-6 lg:mt-4 rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl px-4 py-5 sm:px-6 sm:py-6 lg:px-5 lg:py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-0 shrink-0 lg:divide-x lg:divide-white/15"
        >
          {features.map(({ icon, label, desc, bg }) => (
            <div key={label} className="flex flex-col items-center gap-2 lg:gap-1.5 lg:px-3">
              <div className={`w-9 h-9 lg:w-8 lg:h-8 rounded-xl ${bg} flex items-center justify-center text-white shadow-md`}>
                {icon}
              </div>
              <div className="text-sm lg:text-xs font-bold text-white leading-tight">{label}</div>
              <div className="text-center text-[11px] lg:text-[10px] text-blue-100/60 leading-snug">{desc}</div>
            </div>
          ))}
        </Motion.div>
      </div>

      {/* ══════════════════════════ RIGHT / FORM PANEL ══════════════════════════ */}
      <div className="relative flex-1 flex flex-col items-center justify-start lg:justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-10 lg:py-6 xl:px-16 bg-gradient-to-b from-[#fffaf3] via-[#fffaf3] to-[#fff3e2] lg:h-full lg:overflow-hidden lg:-ml-8 lg:rounded-tl-[40px] lg:rounded-bl-[40px] lg:z-10">

        {/* Background accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange-50/60 blur-2xl pointer-events-none" />

        {/* Language selector */}
        {/* <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-10 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-3.5 pr-3 py-2 shadow-sm text-xs font-semibold text-gray-600 select-none">
          <Globe size={14} className="text-gray-400" />
          <span>English</span>
          <ChevronDown size={13} className="text-gray-400" />
        </div> */}

        <div className="relative z-10 w-full max-w-[440px] mx-auto">

          {/* Heading */}
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 lg:mb-4 mt-10 sm:mt-0 text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3 lg:mb-2">
              <div className="h-0.5 w-5 bg-amber-400 rounded-full" />
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.14em]">
                Portal Access
              </span>
            </div>
            <h2 className="text-3xl sm:text-[2.25rem] lg:text-3xl font-black text-gray-900 leading-tight">
              Welcome back!
            </h2>
            <p className="mt-2 lg:mt-1 text-sm text-gray-400">
              Choose your portal to continue to {organizationName || 'Electronic Educare'}.
            </p>
          </Motion.div>

          {/* Login card */}
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-10 lg:p-7"
          >
            <div className="space-y-3">
              {roleCards.map(({ role, icon, desc, bg }, i) => (
                <Motion.button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 rounded-3xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:border-amber-300 hover:shadow-lg"
                >
                  <div className={`w-14 h-14 shrink-0 rounded-2xl ${bg} flex items-center justify-center text-white shadow-md`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900">{role}</div>
                    <div className="text-xs text-gray-400 leading-snug">{desc}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 shrink-0" />
                </Motion.button>
              ))}
            </div>
          </Motion.div>

          {/* Trust badges */}
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 lg:mt-3 bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl px-4 py-3.5 lg:py-2.5 flex items-center justify-around gap-2 shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure Login</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200 shrink-0" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Data Protected</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200 shrink-0" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Headphones className="w-3.5 h-3.5 text-blue-500" />
              <span>24/7 Support</span>
            </div>
          </Motion.div>

          {/* Footer */}
          <p className="mt-6 lg:mt-3 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-500">Electronic Educare</span>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
