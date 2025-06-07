// src/utils/checkDetection.ts
import { Color, PieceType } from '@/types';
import type { Board, Square, Piece } from '@/types';
import { isValidPosition, getPieceAt, cloneBoard } from './board';

/**
 * Finds the king of a given color on the board
 */
export function findKing(board: Board, color: Color): Square | null {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.type === PieceType.King && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
}

/**
 * Checks if a square is under attack by the opponent
 */
export function isSquareUnderAttack(board: Board, square: Square, byColor: Color): boolean {
    // Check for pawn attacks
    if (isAttackedByPawn(board, square, byColor)) return true;

    // Check for knight attacks
    if (isAttackedByKnight(board, square, byColor)) return true;

    // Check for sliding piece attacks (rook, bishop, queen)
    if (isAttackedBySlidingPiece(board, square, byColor)) return true;

    // Check for king attacks
    if (isAttackedByKing(board, square, byColor)) return true;

    return false;
}

/**
 * Checks if a king is currently in check
 */
export function isKingInCheck(board: Board, kingColor: Color): boolean {
    const kingPosition = findKing(board, kingColor);
    if (!kingPosition) return false;

    const opponentColor = kingColor === Color.White ? Color.Black : Color.White;
    return isSquareUnderAttack(board, kingPosition, opponentColor);
}

/**
 * Simulates a move and checks if it leaves the king in check
 */
export function wouldMoveResultInCheck(board: Board, from: Square, to: Square, playerColor: Color): boolean {
    // Create a copy of the board and simulate the move
    const testBoard = cloneBoard(board);
    const piece = testBoard[from.row][from.col];

    if (!piece) return false;

    // Execute the move on the test board
    testBoard[to.row][to.col] = { ...piece, position: to };
    testBoard[from.row][from.col] = null;

    // Check if this move leaves the king in check
    return isKingInCheck(testBoard, playerColor);
}

/**
 * Filters moves to remove those that would result in check
 */
export function filterLegalMoves(board: Board, piece: Piece, possibleMoves: Square[]): Square[] {
    return possibleMoves.filter(move =>
        !wouldMoveResultInCheck(board, piece.position, move, piece.color)
    );
}

// Helper functions for attack detection

function isAttackedByPawn(board: Board, square: Square, byColor: Color): boolean {
    const { row, col } = square;
    const pawnDirection = byColor === Color.White ? 1 : -1; // Opposite of movement direction

    const leftAttack = { row: row + pawnDirection, col: col - 1 };
    const rightAttack = { row: row + pawnDirection, col: col + 1 };

    const leftPiece = isValidPosition(leftAttack) ? getPieceAt(board, leftAttack) : null;
    const rightPiece = isValidPosition(rightAttack) ? getPieceAt(board, rightAttack) : null;

    return (leftPiece?.type === PieceType.Pawn && leftPiece.color === byColor) ||
        (rightPiece?.type === PieceType.Pawn && rightPiece.color === byColor);
}

function isAttackedByKnight(board: Board, square: Square, byColor: Color): boolean {
    const { row, col } = square;
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
        if (isValidPosition(move)) {
            const piece = getPieceAt(board, move);
            if (piece?.type === PieceType.Knight && piece.color === byColor) {
                return true;
            }
        }
    }

    return false;
}

function isAttackedBySlidingPiece(board: Board, square: Square, byColor: Color): boolean {
    const { row, col } = square;

    // Check all 8 directions
    const directions = [
        { row: -1, col: 0 },  // North
        { row: -1, col: 1 },  // Northeast
        { row: 0, col: 1 },   // East
        { row: 1, col: 1 },   // Southeast
        { row: 1, col: 0 },   // South
        { row: 1, col: -1 },  // Southwest
        { row: 0, col: -1 },  // West
        { row: -1, col: -1 }  // Northwest
    ];

    for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        const isDiagonal = direction.row !== 0 && direction.col !== 0;

        let currentRow = row + direction.row;
        let currentCol = col + direction.col;

        while (isValidPosition({ row: currentRow, col: currentCol })) {
            const piece = getPieceAt(board, { row: currentRow, col: currentCol });

            if (piece) {
                if (piece.color === byColor) {
                    // Check if this piece can attack in this direction
                    if (piece.type === PieceType.Queen) {
                        return true;
                    } else if (piece.type === PieceType.Rook && !isDiagonal) {
                        return true;
                    } else if (piece.type === PieceType.Bishop && isDiagonal) {
                        return true;
                    }
                }
                break; // Stop looking in this direction after hitting any piece
            }

            currentRow += direction.row;
            currentCol += direction.col;
        }
    }

    return false;
}

function isAttackedByKing(board: Board, square: Square, byColor: Color): boolean {
    const { row, col } = square;
    const kingMoves = [
        { row: row - 1, col: col - 1 },
        { row: row - 1, col: col },
        { row: row - 1, col: col + 1 },
        { row: row, col: col - 1 },
        { row: row, col: col + 1 },
        { row: row + 1, col: col - 1 },
        { row: row + 1, col: col },
        { row: row + 1, col: col + 1 }
    ];

    for (const move of kingMoves) {
        if (isValidPosition(move)) {
            const piece = getPieceAt(board, move);
            if (piece?.type === PieceType.King && piece.color === byColor) {
                return true;
            }
        }
    }

    return false;
}