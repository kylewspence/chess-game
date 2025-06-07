// src/components/Square/Square.tsx
import { Piece } from '../Piece/Piece';
import type { Piece as PieceType, Square as SquareType } from '@/types';

interface SquareProps {
    position: SquareType;
    piece: PieceType | null;
    isSelected?: boolean;
    isValidMove?: boolean;
    onClick: () => void;
}

export const Square = ({
    position,
    piece,
    isSelected = false,
    isValidMove = false,
    onClick
}: SquareProps) => {
    const isLightSquare = (position.row + position.col) % 2 === 0;

    return (
        <div
            className={`
                w-full h-full flex justify-center items-center relative cursor-pointer
                ${isLightSquare ? 'bg-amber-100' : 'bg-amber-800'}
                ${isSelected ? 'ring-4 ring-blue-400 ring-inset' : ''}
                hover:opacity-90
            `}
            onClick={onClick}
        >
            {piece && <Piece piece={piece} />}
            {isValidMove && !piece && (
                <div className="absolute w-6 h-6 rounded-full bg-black bg-opacity-20"></div>
            )}
            {isValidMove && piece && (
                <div className="absolute inset-0 ring-4 ring-red-500 ring-inset"></div>
            )}
        </div>
    );
};