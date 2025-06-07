// src/App.tsx - Fix board label overlap
import { useState } from 'react';
import { Board } from '@/components/Board/Board';
import { GameInfo } from '@/components/GameInfo/GameInfo';
import { CapturedPieces } from '@/components/CapturedPieces/CapturedPieces';
import { GameTimer } from '@/components/GameTimer/GameTimer';
import { MoveHistory } from '@/components/MoveHistory/MoveHistory';
import { useChessGame } from '@/hooks/useChessGame';
import { GameStatus } from '@/types';

function App() {
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);

  // Single useChessGame hook - this is the source of truth
  const { gameState, selectSquare, handlePromotion, cancelPromotion, resetGame } = useChessGame();

  const isGameActive = gameState.status === GameStatus.Active || gameState.status === GameStatus.Check;

  const handleTimeExpired = (color: string) => {
    console.log(`${color} ran out of time!`);
  };

  // Determine game result for PGN export
  const getGameResult = () => {
    switch (gameState.status) {
      case GameStatus.Checkmate:
        return gameState.currentTurn === 'white' ? '0-1' : '1-0';
      case GameStatus.Stalemate:
      case GameStatus.Draw:
        return '1/2-1/2';
      default:
        return '*';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-none mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Chess Game</h1>

        <div className="flex justify-center items-start gap-8 overflow-x-auto">
          {/* Left Panel - All info components */}
          <div className="flex flex-col space-y-3 w-60 flex-shrink-0">
            <GameInfo gameState={gameState} onNewGame={resetGame} />
            <GameTimer
              currentTurn={gameState.currentTurn}
              isGameActive={isGameActive}
              onTimeExpired={handleTimeExpired}
            />
            <CapturedPieces capturedPieces={gameState.capturedPieces} />
            <MoveHistory
              moves={gameState.moveHistory}
              board={gameState.board}
              gameResult={getGameResult()}
            />
          </div>

          {/* Center - Chess Board with extra left margin */}
          <div className="flex flex-col items-center flex-shrink-0 ml-6">
            <Board
              flipped={isBoardFlipped}
              gameState={gameState}
              onSquareClick={selectSquare}
              onPromotion={handlePromotion}
              onCancelPromotion={cancelPromotion}
            />
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setIsBoardFlipped(!isBoardFlipped)}
            >
              Flip Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;