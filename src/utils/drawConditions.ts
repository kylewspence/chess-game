// src/utils/drawConditions.ts
import type { GameState, Piece } from '@/types';
import { PieceType } from '@/types';

/**
 * Checks for 50-move rule (50 moves without pawn move or capture)
 */
export function isFiftyMoveRule(gameState: GameState): boolean {
    if (gameState.moveHistory.length < 100) { // 50 moves per side = 100 total
        return false;
    }

    const last100Moves = gameState.moveHistory.slice(-100);

    for (const move of last100Moves) {
        // If there was a pawn move or capture, reset the count
        if (move.piece.type === PieceType.Pawn || move.capturedPiece) {
            return false;
        }
    }

    return true;
}

/**
 * Checks for threefold repetition
 */
export function isThreefoldRepetition(gameState: GameState): boolean {
    const currentBoardState = boardToString(gameState.board);
    const positionCounts = new Map<string, number>();

    // Count occurrences of each position
    let tempBoard = createInitialBoard();
    positionCounts.set(boardToString(tempBoard), 1);

    for (const move of gameState.moveHistory) {
        // Apply move to temp board (simplified)
        tempBoard[move.from.row][move.from.col] = null;
        tempBoard[move.to.row][move.to.col] = move.piece;

        const boardString = boardToString(tempBoard);
        const count = positionCounts.get(boardString) || 0;
        positionCounts.set(boardString, count + 1);

        if (count + 1 >= 3) {
            return true;
        }
    }

    return false;
}

/**
 * Converts board state to string for comparison
 */
function boardToString(board: (Piece | null)[][]): string {
    return board.map(row =>
        row.map(piece =>
            piece ? `${piece.color}${piece.type}` : '.'
        ).join('')
    ).join('');
}

/**
 * Creates initial board for threefold repetition tracking
 */
function createInitialBoard() {
    // Import and use the actual createInitialBoard function
    const { createInitialBoard } = require('./board');
    return createInitialBoard();
}