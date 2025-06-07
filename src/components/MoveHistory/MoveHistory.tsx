// src/components/MoveHistory/MoveHistory.tsx
import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import type { Move, Board } from '@/types';
import { moveToAlgebraic, exportToPGN } from '@/utils/algebraicNotation';

interface MoveHistoryProps {
    moves: Move[];
    board: Board;
    onMoveSelect?: (moveIndex: number) => void;
    selectedMoveIndex?: number;
    gameResult?: string;
}

export const MoveHistory = ({
    moves,
    board,
    onMoveSelect,
    selectedMoveIndex,
    gameResult = '*'
}: MoveHistoryProps) => {
    const [showPGN, setShowPGN] = useState(false);

    const handleExportPGN = () => {
        const pgn = exportToPGN(moves, board, gameResult);
        const blob = new Blob([pgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chess-game-${new Date().toISOString().split('T')[0]}.pgn`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyPGN = async () => {
        const pgn = exportToPGN(moves, board, gameResult);
        try {
            await navigator.clipboard.writeText(pgn);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy PGN:', err);
        }
    };

    // Group moves into pairs (White move, Black move)
    const movePairs: (Move | null)[][] = [];
    for (let i = 0; i < moves.length; i += 2) {
        movePairs.push([moves[i], moves[i + 1] || null]);
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-80">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Move History</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowPGN(!showPGN)}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Toggle PGN view"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleExportPGN}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Export PGN"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showPGN ? (
                // PGN Text View
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded p-3 text-sm font-mono max-h-64 overflow-y-auto">
                        {exportToPGN(moves, board, gameResult)}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleCopyPGN}
                            className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Copy PGN
                        </button>
                        <button
                            onClick={handleExportPGN}
                            className="flex-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Download
                        </button>
                    </div>
                </div>
            ) : (
                // Move List View
                <div className="space-y-2">
                    {moves.length === 0 ? (
                        <p className="text-gray-500 text-sm italic text-center py-4">
                            No moves yet
                        </p>
                    ) : (
                        <div className="max-h-64 overflow-y-auto">
                            {movePairs.map((pair, pairIndex) => (
                                <div key={pairIndex} className="flex items-center space-x-2 py-1">
                                    {/* Move number */}
                                    <span className="text-sm font-medium text-gray-600 w-8">
                                        {pairIndex + 1}.
                                    </span>

                                    {/* White move */}
                                    <button
                                        onClick={() => onMoveSelect?.(pairIndex * 2)}
                                        className={`flex-1 text-left px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors ${selectedMoveIndex === pairIndex * 2 ? 'bg-blue-100 text-blue-800' : ''
                                            }`}
                                    >
                                        {pair[0] && moveToAlgebraic(pair[0], board, pair[0].isCheck, pair[0].isCheckmate)}
                                    </button>

                                    {/* Black move */}
                                    {pair[1] && (
                                        <button
                                            onClick={() => onMoveSelect?.(pairIndex * 2 + 1)}
                                            className={`flex-1 text-left px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors ${selectedMoveIndex === pairIndex * 2 + 1 ? 'bg-blue-100 text-blue-800' : ''
                                                }`}
                                        >
                                            {moveToAlgebraic(pair[1], board, pair[1].isCheck, pair[1].isCheckmate)}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};