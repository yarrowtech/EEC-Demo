import React, { useCallback, useEffect, useState } from 'react';

const OPS = ['+', '-', '×'];

const randomProblem = () => {
  const op = OPS[Math.floor(Math.random() * OPS.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  if (op === '-' && b > a) [a, b] = [b, a];
  const answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
  return { a, b, op, answer };
};

const ROUND_SECONDS = 30;

const QuickMath = () => {
  const [problem, setProblem] = useState(randomProblem);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft]);

  const start = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(ROUND_SECONDS);
    setProblem(randomProblem());
    setInput('');
    setFeedback(null);
    setRunning(true);
  };

  const submit = useCallback(
    (e) => {
      e.preventDefault();
      if (!running) return;
      const val = Number(input);
      if (val === problem.answer) {
        setScore((s) => s + 10 + streak);
        setStreak((s) => s + 1);
        setFeedback('correct');
      } else {
        setStreak(0);
        setFeedback('wrong');
      }
      setProblem(randomProblem());
      setInput('');
      setTimeout(() => setFeedback(null), 500);
    },
    [input, problem, running, streak]
  );

  return (
    <div className="p-6 text-center">
      <div className="text-2xl">➗</div>
      <h2 className="text-lg font-semibold mt-2">Quick Math</h2>
      <p className="text-sm text-gray-500 mb-4">Solve as many problems as you can before time runs out.</p>

      <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
        <span>Score: <strong>{score}</strong></span>
        <span>Streak: <strong>{streak}</strong></span>
        <span>Time: <strong>{timeLeft}s</strong></span>
      </div>

      {!running ? (
        <div>
          {timeLeft === 0 && (
            <div className="mb-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
              Time&apos;s up! Final score: {score}
            </div>
          )}
          <button
            onClick={start}
            className="px-5 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600"
          >
            {timeLeft === 0 ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col items-center gap-3">
          <div
            className={`text-3xl font-bold ${
              feedback === 'correct' ? 'text-green-600' : feedback === 'wrong' ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {problem.a} {problem.op} {problem.b} = ?
          </div>
          <input
            autoFocus
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-32 text-center border border-gray-300 rounded-lg px-3 py-2 text-lg"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default QuickMath;
