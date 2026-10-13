import React, { useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, HelpCircle, BarChart2, Users, FileText,
  Layers, CheckSquare, ChevronDown, ChevronUp, Loader2, Copy,
  RefreshCcw, AlertCircle, Brain, Target, ClipboardList, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Mock AI generation helpers ─────────────────────────────────────────────
// This is a frontend-only demo — there is no AI backend. Every "AI" action
// below produces realistic, varied content locally (randomized selection +
// template strings) after a short simulated "thinking" delay, instead of
// calling a real API.
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const mockThink = (build, ms) => new Promise((resolve) => {
  setTimeout(() => resolve(build()), ms || 800 + Math.random() * 700);
});

const HOOKS = [
  'a real-world scenario students will instantly recognise',
  'a short thought-provoking question',
  'a quick before/after comparison',
  'a surprising fact or statistic',
  'a 60-second demonstration',
];
const MISCONCEPTIONS = [
  'confusing correlation with causation',
  'assuming the rule always applies without checking conditions',
  'mixing up the order of operations',
  'overgeneralising from a single example',
  'forgetting to account for units/scale',
];
const ENGAGEMENT_TIPS = [
  'pair-share for 90 seconds before taking answers',
  'use mini-whiteboards for a quick show-of-hands check',
  'cold-call two students then ask for a volunteer to explain',
  'run a 3-question exit poll before moving on',
];

// ─── Markdown-lite renderer ──────────────────────────────────────────────────
const MarkdownContent = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm text-slate-700 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-slate-800 text-base mt-3">{line.slice(3)}</h3>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-slate-800">{line.slice(2, -2)}</p>;
        if (line.startsWith('- ') || line.startsWith('• ')) return (
          <div key={i} className="flex gap-2"><span className="text-purple-400 mt-0.5">•</span><span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</span></div>
        );
        return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
      })}
    </div>
  );
};

// ─── Shared AI result card ───────────────────────────────────────────────────
const AIResult = ({ content, onCopy }) => (
  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex justify-end mb-2">
      <button onClick={onCopy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
        <Copy className="w-3.5 h-3.5" /> Copy
      </button>
    </div>
    <MarkdownContent text={content} />
  </div>
);

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => toast.success('Copied!'));
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: Lesson Content Generator
// ════════════════════════════════════════════════════════════════════════════
const LessonContentTab = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!subject || !topic) { toast.error('Subject and topic are required'); return; }
    setLoading(true);
    setResult('');
    try {
      const grade = gradeLevel ? `Grade ${gradeLevel}` : 'the class';
      const content = await mockThink(() => `## Lesson: ${topic} (${subject})
**Grade level:** ${grade}

## Hook (5 min)
Open with ${pick(HOOKS)} connected to "${topic}". Ask students what they already know and note responses on the board.

## Key Concepts
- ${topic} builds on prior knowledge of core ${subject} fundamentals.
- Identify 2-3 essential vocabulary terms and define them in student-friendly language.
- Link ${topic} to at least one real-world application relevant to ${grade}.

## Step-by-Step Explanation
1. Introduce the core idea behind ${topic} using a worked example.
2. Model the process explicitly, thinking aloud as you go.
3. Guide students through a second example, inviting them to predict the next step.
4. Have students attempt a similar problem independently.

## Common Misconception to Watch For
Students often struggle with ${pick(MISCONCEPTIONS)} — address this directly with a contrasting example.

## Recap (5 min)
- Summarise the main takeaway from ${topic} in one sentence.
- Ask 2 quick check-for-understanding questions.
- Preview how ${topic} connects to the next lesson.

**Engagement tip:** ${pick(ENGAGEMENT_TIPS)}.`);
      setResult(content);
      toast.success('Lesson content generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Generate a full lesson plan with hook, key concepts, step-by-step explanation and recap.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <input className="input-field" placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="input-field" placeholder="Topic / Chapter *" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <input className="input-field" placeholder="Grade (optional)" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Generating…' : 'Generate Lesson Content'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: Hinge Question Generator
// ════════════════════════════════════════════════════════════════════════════
const HingeQuestionTab = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!subject || !topic) { toast.error('Subject and topic are required'); return; }
    setLoading(true);
    setResult('');
    try {
      const grade = gradeLevel ? `Grade ${gradeLevel}` : 'the class';
      const stems = [
        `Which of the following best explains why ${topic} works the way it does?`,
        `A student claims that ${topic} always applies — is this true? Why or why not?`,
        `What would happen to the outcome if one key condition of ${topic} changed?`,
        `Which example below is NOT a correct application of ${topic}?`,
      ];
      const questions = pickN(stems, 3);
      const content = await mockThink(() => `## Hinge Questions: ${topic} (${subject})
**Grade level:** ${grade}
Each question below is designed to be answered in under 2 minutes and reveals whether students are ready to move on.

${questions.map((q, i) => `**Q${i + 1}.** ${q}
- A) A common but incorrect answer reflecting ${pick(MISCONCEPTIONS)}
- B) The correct answer, clearly justified
- C) A partially correct answer missing a key detail
- D) An answer based on a surface-level pattern rather than the underlying concept

*Misconception targeted:* ${pick(MISCONCEPTIONS)}
`).join('\n')}
## How to Use
- ${pick(ENGAGEMENT_TIPS)}.
- If fewer than 70% answer correctly, re-teach ${topic} with a fresh example before proceeding.`);
      setResult(content);
      toast.success('Hinge questions generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Generate diagnostic hinge questions to check for understanding before moving on. Each question targets a specific misconception.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <input className="input-field" placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="input-field" placeholder="Topic *" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <input className="input-field" placeholder="Grade (optional)" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
        {loading ? 'Generating…' : 'Generate Hinge Questions'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: Differentiated Content
// ════════════════════════════════════════════════════════════════════════════
const DifferentiatedTab = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!subject || !topic) { toast.error('Subject and topic are required'); return; }
    setLoading(true);
    setResult('');
    try {
      const grade = gradeLevel ? `Grade ${gradeLevel}` : 'the class';
      const content = await mockThink(() => `## Differentiated Content: ${topic} (${subject})
**Grade level:** ${grade}

## Foundation
- Simplified explanation of ${topic} using concrete, familiar examples.
- Provide a worked example with every step labelled.
- Practice: 3 straightforward questions with guided prompts and a word/formula bank.
- Support: sentence starters and a visual reference sheet.

## Standard
- Full explanation of ${topic} at grade-level depth, including the "why" behind the rule.
- Practice: 5 mixed questions moving from guided to independent.
- Include one question that connects ${topic} to a previous unit.

## Extension
- Explore an edge case or exception within ${topic} that challenges surface-level understanding.
- Practice: 2-3 open-ended or multi-step problems requiring justification of reasoning.
- Challenge task: have students create their own example of ${topic} and explain why it fits, or find a real-world case where ${topic} does not apply.

**Note:** All three tiers share the same learning objective for ${topic}; only scaffolding and complexity change.`);
      setResult(content);
      toast.success('Differentiated content generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Generate Foundation, Standard, and Extension versions of content and practice for the same topic.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <input className="input-field" placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="input-field" placeholder="Topic *" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <input className="input-field" placeholder="Grade (optional)" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
        {loading ? 'Generating…' : 'Generate Foundation / Standard / Extension'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: Class Performance Summary
// ════════════════════════════════════════════════════════════════════════════
const ClassSummaryTab = () => {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [stats, setStats] = useState(null);

  const generate = async () => {
    setLoading(true);
    setResult('');
    try {
      const label = `Class ${className || '—'}${section ? `-${section}` : ''}${subject ? ` (${subject})` : ''}`;
      const totalStudents = 28 + Math.floor(Math.random() * 15);
      const avgAtt = 82 + Math.floor(Math.random() * 14);
      const below75 = Math.floor(Math.random() * 6);
      const avgScore = 62 + Math.floor(Math.random() * 25);
      const trend = pick(['improving steadily', 'holding steady', 'showing early signs of decline', 'improving quickly after last term\'s intervention']);
      const strongTopic = pick(['fractions and ratios', 'reading comprehension', 'grammar and sentence structure', 'basic algebra', 'scientific method', 'map and data skills']);
      const weakTopic = pick(['word problems', 'essay structuring', 'long division', 'graph interpretation', 'vocabulary in context', 'multi-step reasoning']);
      const content = await mockThink(() => `## Class Performance Summary — ${label}

Overall, this class is ${trend}. Average attendance sits at ${avgAtt}%, with ${below75} student${below75 === 1 ? '' : 's'} below the 75% attendance threshold that typically predicts at-risk outcomes.

## Strengths
- Strong performance on ${strongTopic}, with most students demonstrating solid mastery.
- Class participation and homework completion rates remain healthy.

## Areas Needing Attention
- ${weakTopic.charAt(0).toUpperCase() + weakTopic.slice(1)} continues to be a stumbling block for a meaningful subset of students.
- ${below75} student${below75 === 1 ? '' : 's'} with low attendance may need a check-in to identify barriers.

## Recommendations
- Reteach ${weakTopic} using a scaffolded approach before the next assessment.
- Schedule brief 1:1 check-ins with students below the attendance threshold.
- Continue reinforcing ${strongTopic} through spaced retrieval practice so mastery is retained.
- Consider a low-stakes formative quiz next week to confirm retention before moving to the next unit.`);
      setResult(content);
      setStats({ totalStudents, avgAtt, below75, avgScore });
      toast.success('Class summary generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Generate an AI-written summary of your class's performance, with data-driven recommendations.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <input className="input-field" placeholder="Class (e.g. 7)" value={className} onChange={(e) => setClassName(e.target.value)} />
        <input className="input-field" placeholder="Section (e.g. A)" value={section} onChange={(e) => setSection(e.target.value)} />
        <input className="input-field" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
        {loading ? 'Analysing…' : 'Generate Class Summary'}
      </button>
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.totalStudents}</p>
            <p className="text-xs text-blue-600">Total Students</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{stats.avgAtt}%</p>
            <p className="text-xs text-emerald-600">Avg Attendance</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3 text-center">
            <p className="text-2xl font-bold text-rose-700">{stats.below75}</p>
            <p className="text-xs text-rose-600">Below 75% Att</p>
          </div>
        </div>
      )}
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: Parent Report Writer
// ════════════════════════════════════════════════════════════════════════════
const ParentReportTab = () => {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!studentId && !studentName) { toast.error('Enter student ID or name'); return; }
    setLoading(true);
    setResult('');
    try {
      const name = studentName || `Student ${studentId}`;
      const gradeLabel = grade ? `Grade ${grade}${section ? `-${section}` : ''}` : 'their class';
      const strength = pick(['a genuine curiosity for asking follow-up questions', 'consistent, high-quality homework completion', 'strong collaboration during group work', 'clear and confident verbal explanations', 'steady improvement in test scores this term']);
      const growthArea = pick(['organising longer written responses', 'double-checking work before submitting', 'staying focused during independent tasks', 'building confidence to ask for help sooner', 'managing time during timed assessments']);
      const attendanceNote = pick(['Attendance has been excellent this term.', 'Attendance has been mostly consistent, with a couple of missed days.', 'A few absences this term may be affecting continuity — worth a quick check-in.']);
      const content = await mockThink(() => `## Progress Report — ${name}
**${gradeLabel}**

Dear Parent/Guardian,

It has been a pleasure having ${name} in class this term. ${name} has shown ${strength}, which has had a positive impact on both their own learning and the classroom community.

## Academic Progress
${name} is meeting expectations across most subject areas, with particularly strong engagement recently. ${attendanceNote}

## Area for Growth
One focus for the coming weeks will be ${growthArea}. We will be providing targeted support in class, and any reinforcement at home — even 10-15 minutes a few times a week — would help build this skill further.

## Next Steps
- Continue encouraging daily reading/practice at home.
- Celebrate effort and small wins, not just final grades.
- Feel free to reach out any time with questions — we're glad to partner with you on ${name}'s learning journey.

Warm regards,
Class Teacher`);
      setResult(content);
      toast.success('Parent report generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Auto-generate a warm, professional parent-facing progress report based on the student's academic data.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input-field" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <input className="input-field" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        <input className="input-field" placeholder="Grade (optional)" value={grade} onChange={(e) => setGrade(e.target.value)} />
        <input className="input-field" placeholder="Section (optional)" value={section} onChange={(e) => setSection(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        {loading ? 'Writing…' : 'Generate Parent Report'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: Exit Ticket Grader
// ════════════════════════════════════════════════════════════════════════════
const ExitTicketTab = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const grade = async () => {
    if (!question || !response) { toast.error('Question and student response are required'); return; }
    setLoading(true);
    setResult('');
    try {
      const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
      const depth = wordCount > 40 ? 'detailed' : wordCount > 15 ? 'moderate' : 'brief';
      const understanding = pick(['Secure', 'Developing', 'Partial', 'Emerging']);
      const score = { Secure: 90, Developing: 75, Partial: 60, Emerging: 45 }[understanding] + Math.floor(Math.random() * 8);
      const topicLabel = topic || subject || 'this topic';
      const content = await mockThink(() => `## Exit Ticket Grade

**Understanding level:** ${understanding} (${score}/100)
**Response depth:** ${depth} (${wordCount} words)

## Assessment
The response demonstrates ${understanding.toLowerCase()} understanding of ${topicLabel}. ${
  understanding === 'Secure'
    ? `The student correctly addresses the core idea and supports it with relevant reasoning.`
    : understanding === 'Developing'
    ? `The student shows the right general direction but the explanation could be more precise or complete.`
    : `The response touches on the topic but misses a key element of the expected answer.`
}

## What's Working
- The answer directly engages with the question asked.
- ${pick(['Correct terminology is used.', 'The reasoning is logically ordered.', 'A relevant example is included.'])}

## Next Steps
- ${understanding === 'Secure'
    ? `Extend with a slightly harder follow-up question to confirm mastery.`
    : `Revisit ${topicLabel} with a worked example, focusing on ${pick(MISCONCEPTIONS)}.`}
- ${pick(['Pair with a peer who scored "Secure" for a quick explain-back.', 'Provide a sentence frame for the next attempt.', 'Recommend 2 targeted practice questions before the next class.'])}`);
      setResult(content);
      toast.success('Exit ticket graded!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Paste an exit ticket question and a student's response — AI grades understanding and recommends next steps.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input-field" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="input-field" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>
      <textarea
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
        rows={2} placeholder="Exit ticket question *"
        value={question} onChange={(e) => setQuestion(e.target.value)}
      />
      <textarea
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
        rows={3} placeholder="Student's response *"
        value={response} onChange={(e) => setResponse(e.target.value)}
      />
      <button onClick={grade} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
        {loading ? 'Grading…' : 'Grade Exit Ticket'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TAB: I Do / We Do / You Do
// ════════════════════════════════════════════════════════════════════════════
const IdoWeedoTab = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [totalMinutes, setTotalMinutes] = useState('60');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if (!subject || !topic) { toast.error('Subject and topic are required'); return; }
    setLoading(true);
    setResult('');
    try {
      const mins = Number(totalMinutes) || 60;
      const hook = Math.round(mins * 0.1);
      const iDo = Math.round(mins * 0.25);
      const weDo = Math.round(mins * 0.3);
      const youDo = mins - hook - iDo - weDo;
      const grade = gradeLevel ? `Grade ${gradeLevel}` : 'the class';
      const content = await mockThink(() => `## Gradual Release Lesson: ${topic} (${subject})
**Grade level:** ${grade} · **Total time:** ${mins} min

## HOOK (${hook} min)
Open with ${pick(HOOKS)} to activate prior knowledge about ${topic}.
- Teacher: poses an engaging question, gathers initial ideas.
- Student: shares predictions, activates background knowledge.

## I Do (${iDo} min)
Teacher models ${topic} explicitly, thinking aloud step by step.
- Teacher action: demonstrates one full worked example, narrating the reasoning behind each step.
- Student action: watches, takes notes, asks clarifying questions.
- Activity: annotate a shared example as a class.

## We Do (${weDo} min)
Guided practice — teacher and students work through examples together.
- Teacher action: poses a similar problem, prompts students for the next step, corrects misconceptions in real time (watch for ${pick(MISCONCEPTIONS)}).
- Student action: contributes steps, works in pairs on a scaffolded example.
- Activity: think-pair-share on a near-identical problem.

## You Do (${youDo} min)
Independent practice to check for mastery.
- Teacher action: circulates, provides targeted support, collects a quick formative check.
- Student action: completes 2-3 independent practice problems on ${topic}.
- Activity: exit ticket with one application question.

**Engagement tip:** ${pick(ENGAGEMENT_TIPS)}.`);
      setResult(content);
      toast.success('I Do / We Do / You Do lesson generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Generate a Gradual Release lesson plan with HOOK → I Do → We Do → You Do phases, each with teacher actions, student actions, and activities.</p>
      <div className="grid sm:grid-cols-4 gap-3">
        <input className="input-field" placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="input-field" placeholder="Topic *" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <input className="input-field" placeholder="Grade (optional)" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
        <input className="input-field" type="number" placeholder="Minutes (60)" value={totalMinutes} onChange={(e) => setTotalMinutes(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
        {loading ? 'Generating…' : 'Generate I Do / We Do / You Do'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ─── Curriculum Alignment Checker ───────────────────────────────────────────
const CurriculumAlignmentTab = () => {
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [curriculumStandard, setCurriculumStandard] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!curriculumStandard.trim() || !lessonContent.trim()) {
      toast.error('Both curriculum standard and lesson content are required');
      return;
    }
    setLoading(true);
    setResult('');
    try {
      const contentWords = lessonContent.trim().split(/\s+/).filter(Boolean).length;
      const alignmentScore = 55 + Math.floor(Math.random() * 40);
      const verdict = alignmentScore >= 85 ? 'Strongly Aligned' : alignmentScore >= 70 ? 'Mostly Aligned' : alignmentScore >= 55 ? 'Partially Aligned' : 'Needs Revision';
      const subjLabel = subject || 'the subject';
      const gradeLabel = gradeLevel ? `Grade ${gradeLevel}` : 'the target grade level';
      const content = await mockThink(() => `## Curriculum Alignment Check

**Standard:** "${curriculumStandard.slice(0, 140)}${curriculumStandard.length > 140 ? '…' : ''}"
**Alignment score:** ${alignmentScore}/100 — ${verdict}
**Lesson content reviewed:** ${contentWords} words

## Coverage
The lesson content ${alignmentScore >= 70 ? 'addresses the core learning objective directly' : 'only partially addresses the stated objective'} for ${subjLabel} at ${gradeLabel}.
- ${pick(['Key vocabulary from the standard appears in the lesson.', 'The lesson includes an assessable outcome matching the standard.', 'Real-world application connects to the standard\'s intent.'])}

## Gaps Identified
- ${alignmentScore >= 85 ? 'No significant gaps — minor wording alignment only.' : `The lesson does not explicitly ${pick(['assess mastery of the full standard', 'require students to apply the concept independently', 'address the higher-order thinking implied by the standard', 'connect to real-world examples referenced in the standard'])}.`}
- ${pick(['Consider adding a formative check tied directly to the standard\'s success criteria.', 'Consider explicitly naming the standard/objective for students at the start of the lesson.', 'Consider strengthening the independent practice section to match the standard\'s rigor.'])}

## Suggested Improvements
1. ${pick(['Add a closing task where students self-assess against the standard.', 'Rephrase the lesson objective to mirror the standard\'s exact language.', 'Include one higher-order question requiring justification.'])}
2. ${pick(['Add a worked example demonstrating the exact skill named in the standard.', 'Build in a checkpoint roughly halfway through the lesson.', 'Add a rubric line item mapping directly to the standard.'])}`);
      setResult(content);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Paste your lesson plan and the curriculum standard/objective. AI will score alignment,
        identify gaps, and suggest improvements.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input-field" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="input-field" placeholder="Grade level (optional)" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Curriculum Standard / Learning Objective *</label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder="e.g. 'Students will be able to identify and explain Newton's three laws of motion with real-world examples.'"
          value={curriculumStandard}
          onChange={(e) => setCurriculumStandard(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">Lesson Content to Check *</label>
        <textarea
          className="input-field min-h-[140px] resize-y"
          placeholder="Paste your lesson plan, teaching notes, or content outline here..."
          value={lessonContent}
          onChange={(e) => setLessonContent(e.target.value)}
        />
      </div>
      <button onClick={check} disabled={loading} className="ai-btn">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        {loading ? 'Checking alignment…' : 'Check Curriculum Alignment'}
      </button>
      {result && <AIResult content={result} onCopy={() => copyText(result)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'lesson',     label: 'Lesson Content',        icon: BookOpen,      component: LessonContentTab   },
  { key: 'hinge',      label: 'Hinge Questions',        icon: HelpCircle,    component: HingeQuestionTab   },
  { key: 'idoweedo',   label: 'I Do / We Do / You Do',  icon: Target,        component: IdoWeedoTab        },
  { key: 'diff',       label: 'Differentiated Content', icon: Layers,        component: DifferentiatedTab  },
  { key: 'summary',    label: 'Class Summary',          icon: BarChart2,     component: ClassSummaryTab    },
  { key: 'parent',     label: 'Parent Report',          icon: FileText,      component: ParentReportTab    },
  { key: 'exit',       label: 'Exit Ticket Grader',     icon: CheckSquare,   component: ExitTicketTab      },
  { key: 'curriculum', label: 'Curriculum Alignment',   icon: ShieldCheck,   component: CurriculumAlignmentTab },
];

const TeacherAIToolsPanel = () => {
  const [activeTab, setActiveTab] = useState('lesson');
  const ActiveComponent = TABS.find((t) => t.key === activeTab)?.component || LessonContentTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Teaching Tools</h1>
            <p className="text-xs text-slate-500">LLM-powered tools for lesson design, assessment and reporting</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? 'bg-white shadow-md text-purple-700 border border-purple-200'
                  : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-800 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <AnimatePresence mode="wait">
        <Motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <ActiveComponent />
        </Motion.div>
      </AnimatePresence>

      {/* Global styles injected via className helpers */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          color: #0f172a;
          outline: none;
        }
        .input-field:focus { border-color: #a78bfa; box-shadow: 0 0 0 2px rgba(167,139,250,0.2); }
        .ai-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: opacity 0.15s;
          border: none;
        }
        .ai-btn:hover { opacity: 0.9; }
        .ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default TeacherAIToolsPanel;
