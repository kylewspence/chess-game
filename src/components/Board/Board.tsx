// src/components/Board/Board.tsx
import { Square } from '../Square/Square';
import { useChessGame } from '@/hooks/useChessGame';
import type { Square as SquareType } from '@/types';

interface BoardProps {
    flipped?: boolean;
}

export const Board = ({ flipped = false }: BoardProps) => {
    const { gameState, selectSquare } = useChessGame();

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

    return (
        <div className="relative m-5">
            {/* Turn indicator */}
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold">
                    {gameState.currentTurn === 'white' ? 'White' : 'Black'} to move
                </h2>
            </div>

            {/* The actual chess board */}
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

            {/* Rank labels (1-8) */}
            <div className="absolute top-12 -left-6 h-[640px] flex flex-col justify-around">
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={`rank-${i}`} className="h-10 flex items-center font-bold text-sm">
                        {flipped ? i + 1 : 8 - i}
                    </div>
                ))}
            </div>

            {/* File labels (a-h) */}
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