// src/utils/movement.ts
import { Color, PieceType } from '@/types';
import type { Board, Square, Piece } from '@/types';
import { isValidPosition, getPieceAt, hasOpponentPiece, hasFriendlyPiece } from './board';

/**
 * Generates all possible moves for a piece at a given position
 */
export function generatePossibleMoves(board: Board, piece: Piece): Square[] {
    switch (piece.type) {
        case PieceType.Pawn:
            return generatePawnMoves(board, piece);
        case PieceType.Rook:
            return generateRookMoves(board, piece);
        case PieceType.Bishop:
            return generateBishopMoves(board, piece);
        case PieceType.Queen:
            return generateQueenMoves(board, piece);
        case PieceType.Knight:
            return generateKnightMoves(board, piece);
        case PieceType.King:
            return generateKingMoves(board, piece);
        default:
            return [];
    }
}

/**
 * Generates moves for a pawn
 */
function generatePawnMoves(board: Board, piece: Piece): Square[] {
    const moves: Square[] = [];
    const { row, col } = piece.position;
    const direction = piece.color === Color.White ? -1 : 1; // White moves up (negative), Black moves down (positive)

    // Forward movement
    const oneSquareForward = { row: row + direction, col };
    if (isValidPosition(oneSquareForward) && !getPieceAt(board, oneSquareForward)) {
        moves.push(oneSquareForward);

        // Two squares forward from starting position
        const startingRow = piece.color === Color.White ? 6 : 1;
        if (row === startingRow) {
            const twoSquaresForward = { row: row + (direction * 2), col };
            if (isValidPosition(twoSquaresForward) && !getPieceAt(board, twoSquaresForward)) {
                moves.push(twoSquaresForward);
            }
        }
    }

    // Diagonal captures
    const captureLeft = { row: row + direction, col: col - 1 };
    const captureRight = { row: row + direction, col: col + 1 };

    if (isValidPosition(captureLeft) && hasOpponentPiece(board, captureLeft, piece.color)) {
        moves.push(captureLeft);
    }

    if (isValidPosition(captureRight) && hasOpponentPiece(board, captureRight, piece.color)) {
        moves.push(captureRight);
    }

    return moves;
}

/**
 * Generates moves for a rook (horizontal and vertical lines)
 */
function generateRookMoves(board: Board, piece: Piece): Square[] {
    const directions = [
        { row: -1, col: 0 }, // North
        { row: 1, col: 0 },  // South
        { row: 0, col: -1 }, // West
        { row: 0, col: 1 }   // East
    ];

    return generateSlidingMoves(board, piece, directions);
}

/**
 * Generates moves for a bishop (diagonal lines)
 */
function generateBishopMoves(board: Board, piece: Piece): Square[] {
    const directions = [
        { row: -1, col: -1 }, // Northwest
        { row: -1, col: 1 },  // Northeast
        { row: 1, col: -1 },  // Southwest
        { row: 1, col: 1 }    // Southeast
    ];

    return generateSlidingMoves(board, piece, directions);
}

/**
 * Generates moves for a queen (combination of rook and bishop)
 */
function generateQueenMoves(board: Board, piece: Piece): Square[] {
    const rookMoves = generateRookMoves(board, piece);
    const bishopMoves = generateBishopMoves(board, piece);
    return [...rookMoves, ...bishopMoves];
}

/**
 * Generates moves for a knight (L-shaped moves)
 */
function generateKnightMoves(board: Board, piece: Piece): Square[] {
    const moves: Square[] = [];
    const { row, col } = piece.position;

    const knightMoves = [
        { row: row - 2, col: col - 1 },
        { row: row - 2, col: col + 1 },
        { row: row - 1, col: col - 2 },
        { row: row - 1, col: col + 2 },
        { row: row + 1, col: col - 2 },
        { row: row + 1, col: col + 2 },
        { row: row + 2, col: col - 1 },
        { row: row + 2, col: col + 1 }
    ];

    for (const move of knightMoves) {
        if (isValidPosition(move) && !hasFriendlyPiece(board, move, piece.color)) {
            moves.push(move);
        }
    }

    return moves;
}

/**
 * Generates moves for a king (one square in any direction)
 */
function generateKingMoves(board: Board, piece: Piece): Square[] {
    const moves: Square[] = [];
    const { row, col } = piece.position;

    const kingMoves = [
        { row: row - 1, col: col - 1 }, // Northwest
        { row: row - 1, col: col },     // North
        { row: row - 1, col: col + 1 }, // Northeast
        { row: row, col: col - 1 },     // West
        { row: row, col: col + 1 },     // East
        { row: row + 1, col: col - 1 }, // Southwest
        { row: row + 1, col: col },     // South
        { row: row + 1, col: col + 1 }  // Southeast
    ];

    for (const move of kingMoves) {
        if (isValidPosition(move) && !hasFriendlyPiece(board, move, piece.color)) {
            moves.push(move);
        }
    }

    return moves;
}

/**
 * Helper function for sliding pieces (rook, bishop, queen)
 */
function generateSlidingMoves(board: Board, piece: Piece, directions: Square[]): Square[] {
    const moves: Square[] = [];
    const { row, col } = piece.position;

    for (const direction of directions) {
        let currentRow = row + direction.row;
        let currentCol = col + direction.col;

        while (isValidPosition({ row: currentRow, col: currentCol })) {
            const currentSquare = { row: currentRow, col: currentCol };

            if (hasFriendlyPiece(board, currentSquare, piece.color)) {
                break; // Can't move past our own pieces
            }

            moves.push(currentSquare);

            if (hasOpponentPiece(board, currentSquare, piece.color)) {
                break; // Can capture opponent piece but can't move past it
            }

            currentRow += direction.row;
            currentCol += direction.col;
        }
    }

    return moves;
}

/**
 * Checks if a move is valid for a given piece
 */
export function isValidMove(board: Board, piece: Piece, targetSquare: Square): boolean {
    const possibleMoves = generatePossibleMoves(board, piece);
    return possibleMoves.some(move => move.row === targetSquare.row && move.col === targetSquare.col);
}