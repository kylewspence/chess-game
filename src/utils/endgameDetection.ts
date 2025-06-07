// src/utils/endgameDetection.ts
import { Color, GameStatus, PieceType } from '@/types';
import type { Board } from '@/types';
import { isKingInCheck } from './checkDetection';
import { generatePossibleMoves } from './movement';

/**
 * Determines the current game status (checkmate, stalemate, or active)
 */
export function determineGameStatus(board: Board, currentPlayer: Color): GameStatus {
    const hasLegalMoves = playerHasLegalMoves(board, currentPlayer);
    const inCheck = isKingInCheck(board, currentPlayer);

    if (!hasLegalMoves) {
        if (inCheck) {
            return GameStatus.Checkmate;
        } else {
            return GameStatus.Stalemate;
        }
    }

    if (inCheck) {
        return GameStatus.Check;
    }

    // Check for insufficient material
    if (isInsufficientMaterial(board)) {
        return GameStatus.Draw;
    }

    return GameStatus.Active;
}

/**
 * Checks if a player has any legal moves available
 */
function playerHasLegalMoves(board: Board, color: Color): boolean {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const moves = generatePossibleMoves(board, piece);
                if (moves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Checks for insufficient material to checkmate
 */
function isInsufficientMaterial(board: Board): boolean {
    const pieces: { white: PieceType[], black: PieceType[] } = {
        white: [],
        black: []
    };

    // Collect all pieces on the board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.type !== PieceType.King) {
                pieces[piece.color].push(piece.type);
            }
        }
    }

    // King vs King
    if (pieces.white.length === 0 && pieces.black.length === 0) {
        return true;
    }

    // King + Bishop vs King or King + Knight vs King
    if ((pieces.white.length === 1 && pieces.black.length === 0) ||
        (pieces.white.length === 0 && pieces.black.length === 1)) {
        const singlePiece = pieces.white.length === 1 ? pieces.white[0] : pieces.black[0];
        return singlePiece === PieceType.Bishop || singlePiece === PieceType.Knight;
    }

    // King + Bishop vs King + Bishop (same color squares)
    if (pieces.white.length === 1 && pieces.black.length === 1 &&
        pieces.white[0] === PieceType.Bishop && pieces.black[0] === PieceType.Bishop) {
        // This would require checking if bishops are on same color squares
        // For simplicity, we'll assume they are different colors for now
        return false;
    }

    return false;
}