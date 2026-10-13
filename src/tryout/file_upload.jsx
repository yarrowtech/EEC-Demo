import React, { useState } from "react";

// Mock "AI" review phrases for uploaded submissions — picked at random so
// repeated uploads don't all read identically. No backend involved.
const AI_STRENGTHS = [
  "clear structure and logical flow",
  "good use of relevant examples",
  "neat presentation and legible handwriting/formatting",
  "accurate use of key terminology",
  "a well-organized introduction and conclusion",
];
const AI_IMPROVEMENTS = [
  "adding a bit more detail to support your main points",
  "double-checking spelling and grammar before submitting",
  "including a short summary at the end",
  "citing where your information came from",
  "making sure every section directly answers the prompt",
];
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickTwoRandom = (arr) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

function FileUpload({ isTeacherMode = false }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rubric, setRubric] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected && selected.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
    setAiFeedback(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setAiFeedback(null);
      alert("Please select a file first!");
      return;
    }
    setAnalyzing(true);
    setAiFeedback(null);
    setTimeout(() => {
      const strengths = pickTwoRandom(AI_STRENGTHS);
      const improvement = pickRandom(AI_IMPROVEMENTS);
      const score = 72 + Math.floor(Math.random() * 24); // 72-95
      setAiFeedback({
        fileName: file.name,
        score,
        summary: `Your submission "${file.name}" has been reviewed. Overall this looks like solid work.`,
        strengths,
        improvement,
      });
      setAnalyzing(false);
    }, 1000 + Math.random() * 400);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-xl shadow-md border border-purple-300">
      <h2 className="text-2xl font-bold text-center text-black mb-6">
        Upload a File
      </h2>

      {isTeacherMode && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
          <label className="block text-amber-800 text-sm font-medium mb-1">
            👩‍🏫 Teacher Mode — Grading Notes / Rubric (not shown to students)
          </label>
          <textarea
            value={rubric}
            onChange={(e) => setRubric(e.target.value)}
            rows={3}
            className="w-full border border-amber-300 rounded p-2 text-sm text-black"
            placeholder="e.g., Accept only PDF. Check for 3 sections..."
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center hover:bg-purple-50 transition cursor-pointer">
          <label htmlFor="fileInput" className="block cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-purple-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12m-5 4h.01M12 20v-4"
              />
            </svg>
            <span className="text-sm text-black">
              Click to browse or drag & drop a file
            </span>
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {file && (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md text-sm text-black">
            <span className="font-medium">{file.name}</span>
            <span className="text-black text-xs">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>
        )}

        {preview && (
          <div className="mt-4">
            <p className="text-sm text-black mb-1">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border"
            />
          </div>
        )}

        <div>
          <h3 className="text-sm text-black text-center mt-2">
            JPG, GIF, PNG, and PDF files are supported.
          </h3>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={analyzing}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-60"
          >
            {analyzing ? "Analyzing..." : "Upload File"}
          </button>
        </div>

        {analyzing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-700">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
            AI is reviewing your submission...
          </div>
        )}

        {aiFeedback && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-black space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">AI Review</span>
              <span className="font-bold text-purple-700">{aiFeedback.score}/100</span>
            </div>
            <p>{aiFeedback.summary}</p>
            <div>
              <p className="font-medium">Strengths:</p>
              <ul className="list-disc list-inside">
                {aiFeedback.strengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <p><span className="font-medium">Suggestion:</span> Try {aiFeedback.improvement}.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default FileUpload;
