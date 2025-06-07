// src/components/GameInfo/GameInfo.tsx
import { GameStatus, Color } from '@/types';
import type { GameState } from '@/types';

interface GameInfoProps {
    gameState: GameState;
    onNewGame?: () => void;
}

export const GameInfo = ({ gameState, onNewGame }: GameInfoProps) => {
    const getCurrentPlayerMessage = () => {
        switch (gameState.status) {
            case GameStatus.Check:
                return `${gameState.currentTurn === Color.White ? 'White' : 'Black'} is in CHECK!`;
            case GameStatus.Checkmate:
                return `CHECKMATE! ${gameState.currentTurn === Color.White ? 'Black' : 'White'} wins!`;
            case GameStatus.Stalemate:
                return 'STALEMATE! Game is a draw.';
            case GameStatus.Draw:
                return 'DRAW! Game ended in a draw.';
            default:
                return `${gameState.currentTurn === Color.White ? 'White' : 'Black'} to move`;
        }
    };

    const getStatusColor = () => {
        switch (gameState.status) {
            case GameStatus.Check:
                return 'text-orange-600';
            case GameStatus.Checkmate:
                return 'text-red-600';
            case GameStatus.Stalemate:
            case GameStatus.Draw:
                return 'text-blue-600';
            default:
                return 'text-gray-800';
        }
    };

    const isGameOver = [GameStatus.Checkmate, GameStatus.Stalemate, GameStatus.Draw].includes(gameState.status);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-64">
            <h3 className="text-lg font-bold mb-3 text-center">Game Status</h3>

            {/* Current Turn / Game Status */}
            <div className="text-center mb-4">
                <div className={`text-xl font-semibold ${getStatusColor()}`}>
                    {getCurrentPlayerMessage()}
                </div>
            </div>

            {/* Current Turn Indicator (visual) */}
            {!isGameOver && (
                <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${gameState.currentTurn === Color.White ? 'bg-white border-2 border-gray-800' : 'bg-gray-800'
                            }`}></div>
                        <span className="text-sm font-medium">
                            {gameState.currentTurn === Color.White ? 'White' : 'Black'}
                        </span>
                    </div>
                </div>
            )}

            {/* Move Counter */}
            <div className="text-center mb-4">
                <div className="text-sm text-gray-600">
                    Move: {Math.floor(gameState.moveHistory.length / 2) + 1}
                    {gameState.moveHistory.length % 2 === 1 && '.5'}
                </div>
            </div>

            {/* New Game Button */}
            {onNewGame && (
                <button
                    onClick={onNewGame}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                             transition-colors"
                >
                    New Game
                </button>
            )}
        </div>
    );
};