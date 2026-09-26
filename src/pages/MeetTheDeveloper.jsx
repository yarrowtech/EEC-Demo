import React from "react";

const MeetTheDeveloper = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50 p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-amber-700 mb-6">Meet the Developers</h1>
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-gray-800">Koushik Bala</span>
            <span className="text-sm text-gray-600 mb-2">Frontend Developer</span>
            <a
              href="https://www.linkedin.com/in/koushikbalasxc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              LinkedIn Profile
            </a>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-gray-800">Atanu Ghosh</span>
            <span className="text-sm text-gray-600 mb-2">Backend Developer</span>
            {/* Add LinkedIn or other profile if available */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetTheDeveloper;