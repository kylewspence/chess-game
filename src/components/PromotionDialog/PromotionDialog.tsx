// src/components/PromotionDialog/PromotionDialog.tsx
import { PieceType } from '@/types';
import { getPromotionOptions } from '@/utils/specialMoves';

interface PromotionDialogProps {
    isOpen: boolean;
    playerColor: 'white' | 'black';
    onSelectPiece: (pieceType: PieceType) => void;
    onCancel: () => void;
}

export const PromotionDialog = ({
    isOpen,
    playerColor,
    onSelectPiece,
    onCancel
}: PromotionDialogProps) => {
    if (!isOpen) return null;

    const promotionOptions = getPromotionOptions();

    const pieceSymbols = {
        [PieceType.Queen]: { white: '♕', black: '♛' },
        [PieceType.Rook]: { white: '♖', black: '♜' },
        [PieceType.Bishop]: { white: '♗', black: '♝' },
        [PieceType.Knight]: { white: '♘', black: '♞' },
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-center">
                    Choose promotion piece
                </h3>
                <div className="flex gap-4">
                    {promotionOptions.map((pieceType) => (
                        <button
                            key={pieceType}
                            onClick={() => onSelectPiece(pieceType)}
                            className="w-16 h-16 border-2 border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center text-4xl transition-colors"
                        >
                            {pieceSymbols[pieceType as keyof typeof pieceSymbols][playerColor]}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onCancel}
                    className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};