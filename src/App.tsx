// src/App.tsx - Add a test class
import { useState } from 'react';
import { Board } from '@/components/Board/Board';

function App() {
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);

  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center p-4">
      {/* ↑ Changed to bg-red-500 to test if Tailwind is working */}
      <h1 className="text-3xl font-bold mb-6 text-white">Chess Game</h1>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <Board flipped={isBoardFlipped} />
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => setIsBoardFlipped(!isBoardFlipped)}
        >
          Flip Board
        </button>
      </div>
    </div>
  );
}

export default App;