// src/components/Board/Board.tsx - Add promotion dialog

import { Square } from '../Square/Square';
import { PromotionDialog } from '../PromotionDialog';
import { useChessGame } from '@/hooks/useChessGame';
import { GameStatus } from '@/types';
import type { Square as SquareType } from '@/types';

interface BoardProps {
    flipped?: boolean;
}

export const Board = ({ flipped = false }: BoardProps) => {
    const { gameState, selectSquare, handlePromotion, cancelPromotion } = useChessGame();

    const handleSquareClick = (square: SquareType) => {
        selectSquare(square);
    };

    const isValidMoveSquare = (square: SquareType): boolean => {
        return gameState.validMoves.some(
            move => move.row === square.row && move.col === square.col
        );
    };

    const isSelectedSquare = (square: SquareType): boolean => {
        return gameState.selectedPiece !== null &&
            gameState.selectedPiece.position.row === square.row &&
            gameState.selectedPiece.position.col === square.col;
    };

    const getGameStatusMessage = () => {
        switch (gameState.status) {
            case GameStatus.Check:
                return `${gameState.currentTurn === 'white' ? 'White' : 'Black'} is in CHECK!`;
            case GameStatus.Checkmate:
                return `CHECKMATE! ${gameState.currentTurn === 'white' ? 'Black' : 'White'} wins!`;
            case GameStatus.Stalemate:
                return 'STALEMATE! Game is a draw.';
            case GameStatus.Draw:
                return 'DRAW! Game ended in a draw.';
            default:
                return `${gameState.currentTurn === 'white' ? 'White' : 'Black'} to move`;
        }
    };

    return (
        <div className="relative m-5">
            {/* Game status */}
            <div className="mb-4 text-center">
                <h2 className={`text-xl font-bold ${gameState.status === GameStatus.Check ? 'text-red-600' :
                    gameState.status === GameStatus.Checkmate ? 'text-red-800' :
                        gameState.status === GameStatus.Draw || gameState.status === GameStatus.Stalemate ? 'text-blue-600' :
                            'text-gray-800'
                    }`}>
                    {getGameStatusMessage()}
                </h2>
            </div>

            {/* Chess board */}
            <div className="grid grid-cols-8 border-2 border-gray-800 w-[640px] h-[640px]">
                {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;

                    const actualRow = flipped ? 7 - row : row;
                    const actualCol = flipped ? 7 - col : col;

                    const piece = gameState.board[actualRow][actualCol];
                    const position = { row: actualRow, col: actualCol };

                    return (
                        <Square
                            key={`${actualRow}-${actualCol}`}
                            position={position}
                            piece={piece}
                            isSelected={isSelectedSquare(position)}
                            isValidMove={isValidMoveSquare(position)}
                            onClick={() => handleSquareClick(position)}
                        />
                    );
                })}
            </div>

            {/* Promotion Dialog */}
            <PromotionDialog
                isOpen={!!gameState.pendingPromotion}
                playerColor={gameState.currentTurn}
                onSelectPiece={handlePromotion}
                onCancel={cancelPromotion}
            />

            {/* Labels stay the same */}
            <div className="absolute top-12 -left-6 h-[640px] flex flex-col justify-around">
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={`rank-${i}`} className="h-10 flex items-center font-bold text-sm">
                        {flipped ? i + 1 : 8 - i}
                    </div>
                ))}
            </div>

            <div className="absolute -bottom-6 left-0 w-[640px] flex justify-around">
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={`file-${i}`} className="w-10 flex justify-center font-bold text-sm">
                        {String.fromCharCode(flipped ? 104 - i : 97 + i)}
                    </div>
                ))}
            </div>
        </div>
    );
};