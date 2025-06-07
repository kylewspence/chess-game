// src/components/Board/Board.tsx
import { useState } from 'react';
import { Square } from '../Square/Square';
import { createInitialBoard } from '@/utils/board';
import type { Board as BoardType, Square as SquareType } from '@/types';

interface BoardProps {
    flipped?: boolean;
}

export const Board = ({ flipped = false }: BoardProps) => {
    const [board] = useState<BoardType>(createInitialBoard());
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);

    const handleSquareClick = (square: SquareType) => {
        setSelectedSquare(square);
    };

    return (
        <div className="relative m-5">
            {/* The actual chess board */}
            <div className="grid grid-cols-8 border-2 border-gray-800 w-[640px] h-[640px]">
                {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;

                    const actualRow = flipped ? 7 - row : row;
                    const actualCol = flipped ? 7 - col : col;

                    const piece = board[actualRow][actualCol];
                    const position = { row: actualRow, col: actualCol };

                    const isSelected = selectedSquare &&
                        selectedSquare.row === actualRow &&
                        selectedSquare.col === actualCol;

                    return (
                        <Square
                            key={`${actualRow}-${actualCol}`}
                            position={position}
                            piece={piece}
                            isSelected={isSelected}
                            onClick={() => handleSquareClick(position)}
                        />
                    );
                })}
            </div>

            {/* Rank labels (1-8) */}
            <div className="absolute top-0 -left-6 h-[640px] flex flex-col justify-around">
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