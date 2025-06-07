// src/components/Piece/Piece.tsx
import type { Piece as PieceType } from '@/types';

interface PieceProps {
    piece: PieceType;
}

export const Piece = ({ piece }: PieceProps) => {
    // Map of piece types to Unicode chess symbols
    const pieceSymbols = {
        king: { white: '♔', black: '♚' },
        queen: { white: '♕', black: '♛' },
        rook: { white: '♖', black: '♜' },
        bishop: { white: '♗', black: '♝' },
        knight: { white: '♘', black: '♞' },
        pawn: { white: '♙', black: '♟' }
    };

    const symbol = pieceSymbols[piece.type][piece.color];

    return (
        <div className="text-5xl flex justify-center items-center h-full w-full cursor-pointer select-none hover:scale-110 transition-transform">
            {symbol}
        </div>
    );
};