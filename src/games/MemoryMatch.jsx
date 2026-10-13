import React, { useEffect, useMemo, useState } from 'react';

const EMOJIS = ['🍎', '🚀', '🎈', '🐳', '🎸', '🌟', '🍩', '🦊'];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = () =>
  shuffle([...EMOJIS, ...EMOJIS]).map((emoji, idx) => ({
    id: idx,
    emoji,
    flipped: false,
    matched: false,
  }));

const MemoryMatch = () => {
  const [deck, setDeck] = useState(buildDeck);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const matchedCount = useMemo(() => deck.filter((c) => c.matched).length, [deck]);
  const won = matchedCount === deck.length;

  useEffect(() => {
    if (selected.length !== 2) return;
    setLocked(true);
    const [a, b] = selected;
    const timer = setTimeout(() => {
      setDeck((prev) =>
        prev.map((card) => {
          if (card.id !== a && card.id !== b) return card;
          if (prev[a].emoji === prev[b].emoji) return { ...card, matched: true, flipped: true };
          return { ...card, flipped: false };
        })
      );
      setSelected([]);
      setLocked(false);
      setMoves((m) => m + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [selected]);

  const flip = (id) => {
    if (locked) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || selected.length === 2) return;
    setDeck((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setSelected((prev) => [...prev, id]);
  };

  const reset = () => {
    setDeck(buildDeck());
    setSelected([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="p-6 text-center">
      <div className="text-2xl">🧠</div>
      <h2 className="text-lg font-semibold mt-2">Memory Match</h2>
      <p className="text-sm text-gray-500 mb-4">Flip two cards and find every matching pair.</p>

      <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
        <span>Moves: <strong>{moves}</strong></span>
        <span>Pairs found: <strong>{matchedCount / 2}/{EMOJIS.length}</strong></span>
        <button
          onClick={reset}
          className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600"
        >
          Restart
        </button>
      </div>

      {won ? (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
          🎉 Solved in {moves} moves! Great memory.
        </div>
      ) : null}

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {deck.map((card) => (
          <button
            key={card.id}
            onClick={() => flip(card.id)}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-200 border ${
              card.flipped || card.matched
                ? 'bg-white border-indigo-300 shadow-sm'
                : 'bg-indigo-500 border-indigo-600 hover:bg-indigo-400'
            } ${card.matched ? 'opacity-60' : ''}`}
          >
            {(card.flipped || card.matched) ? card.emoji : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryMatch;
