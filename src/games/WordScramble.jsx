import React, { useState } from 'react';

const WORDS = [
  { word: 'PYTHON', hint: 'A popular programming language' },
  { word: 'GALAXY', hint: 'Millions of stars grouped together' },
  { word: 'VOLCANO', hint: 'A mountain that can erupt' },
  { word: 'LIBRARY', hint: 'A place full of books' },
  { word: 'PLANET', hint: 'Earth is one' },
  { word: 'OXYGEN', hint: 'A gas we need to breathe' },
  { word: 'TRIANGLE', hint: 'A shape with three sides' },
  { word: 'KEYBOARD', hint: 'Used to type on a computer' },
];

const scramble = (word) => {
  let letters = word.split('');
  do {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
  } while (letters.join('') === word && word.length > 1);
  return letters.join('');
};

const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const WordScramble = () => {
  const [current, setCurrent] = useState(pickWord);
  const [scrambled, setScrambled] = useState(() => scramble(current.word));
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const nextWord = () => {
    const w = pickWord();
    setCurrent(w);
    setScrambled(scramble(w.word));
    setGuess('');
    setFeedback(null);
    setShowHint(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (guess.trim().toUpperCase() === current.word) {
      setScore((s) => s + (showHint ? 5 : 10));
      setFeedback('correct');
      setTimeout(nextWord, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 700);
    }
  };

  return (
    <div className="p-6 text-center">
      <div className="text-2xl">🔤</div>
      <h2 className="text-lg font-semibold mt-2">Word Scramble</h2>
      <p className="text-sm text-gray-500 mb-4">Unscramble the letters to find the hidden word.</p>

      <div className="text-sm text-gray-600 mb-3">Score: <strong>{score}</strong></div>

      <div className="text-3xl font-bold tracking-[0.3em] text-indigo-700 mb-4">{scrambled}</div>

      {showHint && (
        <div className="text-sm text-gray-500 italic mb-3">Hint: {current.hint}</div>
      )}

      <form onSubmit={submit} className="flex flex-col items-center gap-3">
        <input
          autoFocus
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className={`w-56 text-center border rounded-lg px-3 py-2 text-lg uppercase ${
            feedback === 'wrong' ? 'border-red-400' : feedback === 'correct' ? 'border-green-400' : 'border-gray-300'
          }`}
          placeholder="Your guess"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="px-4 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-sm font-medium hover:bg-amber-200"
          >
            Hint
          </button>
          <button
            type="button"
            onClick={nextWord}
            className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
          >
            Skip
          </button>
        </div>
      </form>

      {feedback === 'correct' && (
        <div className="mt-3 text-sm text-green-600 font-medium">Correct! Next word coming up…</div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-3 text-sm text-red-600 font-medium">Not quite, try again.</div>
      )}
    </div>
  );
};

export default WordScramble;
