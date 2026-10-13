import React, { useState } from 'react';
import { Video, Upload, Loader2, FileText, Tag, ListChecks } from 'lucide-react';

// Teacher tool: upload a lecture video, get back a transcript, an AI summary,
// and a quiz. This is a frontend-only demo with no AI backend — the "upload"
// progress and the "analysis" below are both simulated locally, and the
// summary/quiz/transcript are generated from the video's file name so the
// output still feels tied to what was picked.
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const titleFromFileName = (name) => {
  const base = name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Lecture Recording';
};

const KEYWORD_POOL = [
  'key concept', 'worked example', 'definitions', 'class discussion', 'recap',
  'homework', 'assessment prep', 'common mistakes', 'real-world application',
];

const generateMockVideoAnalysis = (fileName) => {
  const topic = titleFromFileName(fileName);
  const durationSeconds = 300 + Math.floor(Math.random() * 1500);
  const keywords = [...KEYWORD_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
  const summary = `This lecture on "${topic}" opens with a quick recap of prior material before introducing the main concept through a worked example. The teacher walks through the reasoning step by step, pausing to address a common misconception (${pick(['mixing up the order of operations', 'over-generalising from a single case', 'confusing correlation with causation', 'skipping a required step'])}), then opens the floor for student questions. The session closes with a short recap and a preview of the next topic.`;
  const quiz = `1. What is the main topic covered in this lecture?
   A) ${topic}
   B) An unrelated review session
   C) A guest lecture on a different subject
   D) A test-taking strategies session
   Answer: A

2. Which teaching technique did the instructor use to introduce the topic?
   A) A worked example walked through step by step
   B) A silent reading assignment
   C) A pop quiz with no explanation
   D) A video with no narration
   Answer: A

3. What common mistake did the teacher warn students about?
   A) ${pick(['Mixing up the order of operations', 'Over-generalising from a single example', 'Confusing correlation with causation', 'Skipping a required step'])}
   B) Using a calculator
   C) Writing too much detail
   D) Reading too quickly
   Answer: A

4. How did the lecture conclude?
   A) With a recap and a preview of the next topic
   B) Abruptly with no summary
   C) With an unrelated announcement
   D) With a pop quiz
   Answer: A`;
  const transcript = `[00:00] Good morning everyone, today we're covering ${topic}. Let's start with a quick recap of what we covered last time.
[02:15] Now, the key idea here is to walk through this step by step — watch closely as I work through this example.
[07:40] A lot of students get tripped up here by ${pick(['mixing up the order of operations', 'over-generalising from a single example', 'confusing correlation with causation'])}, so let's slow down on this part.
[15:20] Great questions from the back row — let's open this up for discussion for a couple of minutes.
[${Math.floor(durationSeconds / 60) - 2}:00] To wrap up, remember the main takeaway from today: ${topic} builds directly on what we'll need for the next unit. See you next class.`;
  return { summary, quiz, transcript, keywords, duration_seconds: durationSeconds };
};

const VideoUnderstandingTool = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState('');

  // Simulated upload progress — no real network call, since this demo has
  // no backend to receive the file.
  const simulateUpload = () => new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(99, progress + 8 + Math.random() * 12);
      setUploadProgress(Math.round(progress));
      if (progress >= 99) {
        clearInterval(interval);
        setUploadProgress(100);
        resolve();
      }
    }, 120);
  });

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setResult(null);
    setFileName(file.name);
    setUploading(true);
    setUploadProgress(0);
    try {
      await simulateUpload();
      setUploading(false);
      setAnalyzing(true);
      const data = await new Promise((resolve) => {
        setTimeout(() => resolve(generateMockVideoAnalysis(file.name)), 1200 + Math.random() * 600);
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Video className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Video Lecture Understanding</h1>
          <p className="text-sm text-slate-500">Upload a lecture recording to get a transcript, summary, and quiz — generated from the audio track.</p>
        </div>
      </header>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-8 text-center transition-colors hover:bg-indigo-50">
        <Upload className="size-8 text-indigo-400" />
        <span className="text-sm font-semibold text-indigo-700">
          {fileName || 'Click to choose a video file (mp4, webm)'}
        </span>
        <span className="text-xs text-indigo-400">Best for narrated lectures — visual-only slides without speech won&apos;t be captured.</span>
        <input
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={uploading || analyzing}
        />
      </label>

      {uploading && (
        <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
            <span>Uploading…</span><span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {analyzing && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          <Loader2 className="size-4 animate-spin text-indigo-500" />
          Transcribing and analyzing the lecture — this can take a few minutes for longer videos…
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileText className="size-4 text-indigo-500" /> Summary
            </h2>
            <p className="text-sm text-slate-600">{result.summary}</p>
            {result.keywords?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.keywords.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                    <Tag className="size-3" /> {k}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
              <ListChecks className="size-4 text-indigo-500" /> Quiz
            </h2>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">{result.quiz}</pre>
          </div>

          <details className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-bold text-slate-800">Full transcript ({Math.round((result.duration_seconds || 0) / 60)} min)</summary>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{result.transcript}</p>
          </details>
        </div>
      )}
    </div>
  );
};

export default VideoUnderstandingTool;
