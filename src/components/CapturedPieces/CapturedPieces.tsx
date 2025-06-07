// src/components/CapturedPieces/CapturedPieces.tsx
import { Piece } from '../Piece/Piece';
import { Color } from '@/types';
import type { Piece as PieceType } from '@/types';

interface CapturedPiecesProps {
    capturedPieces: {
        [Color.White]: PieceType[];
        [Color.Black]: PieceType[];
    };
}

export const CapturedPieces = ({ capturedPieces }: CapturedPiecesProps) => {
    const whiteCaptured = capturedPieces[Color.White] || [];
    const blackCaptured = capturedPieces[Color.Black] || [];

    const getMaterialValue = (pieces: PieceType[]) => {
        const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
        return pieces.reduce((total, piece) => total + values[piece.type], 0);
    };

    const whiteValue = getMaterialValue(whiteCaptured);
    const blackValue = getMaterialValue(blackCaptured);
    const materialDifference = blackValue - whiteValue; // Positive means White is ahead

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-64">
            <h3 className="text-lg font-bold mb-3 text-center">Captured Pieces</h3>

            {/* Material Balance */}
            <div className="text-center mb-4">
                <div className="text-sm text-gray-600">
                    Material Balance:
                    <span className={`ml-1 font-semibold ${materialDifference > 0 ? 'text-gray-800' :
                            materialDifference < 0 ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                        {materialDifference > 0 && '+'}
                        {materialDifference}
                        {materialDifference !== 0 && (
                            <span className="text-xs ml-1">
                                ({materialDifference > 0 ? 'White' : 'Black'} ahead)
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* White Captured Pieces */}
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-white border border-gray-800 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">White pieces captured ({whiteCaptured.length})</span>
                </div>
                <div className="min-h-[40px] bg-gray-50 rounded p-2 flex flex-wrap gap-1">
                    {whiteCaptured.length > 0 ? (
                        whiteCaptured.map((piece, index) => (
                            <div key={`white-captured-${index}`} className="w-8 h-8">
                                <Piece piece={piece} />
                            </div>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                    )}
                </div>
            </div>

            {/* Black Captured Pieces */}
            <div>
                <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Black pieces captured ({blackCaptured.length})</span>
                </div>
                <div className="min-h-[40px] bg-gray-50 rounded p-2 flex flex-wrap gap-1">
                    {blackCaptured.length > 0 ? (
                        blackCaptured.map((piece, index) => (
                            <div key={`black-captured-${index}`} className="w-8 h-8">
                                <Piece piece={piece} />
                            </div>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                    )}
                </div>
            </div>
        </div>
    );
};