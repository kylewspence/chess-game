import { Color, PieceType } from '@/types';
import type { AlgebraicNotation, Board, Square, Piece } from '@/types';

/**
 * Converts algebraic notation (e.g., "e4") to board coordinates (row, col)
 */
export function algebraicToCoordinates(algebraic: AlgebraicNotation): Square {
    const col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(algebraic.charAt(1));

    return { row, col };
}

/**
 * Converts board coordinates (row, col) to algebraic notation (e.g., "e4")
 */
export function coordinatesToAlgebraic(square: Square): AlgebraicNotation {
    const file = String.fromCharCode('a'.charCodeAt(0) + square.col);
    const rank = 8 - square.row;

    return `${file}${rank}`;
}

/**
 * Checks if the given coordinates are valid (within the 8x8 board)
 */
export function isValidPosition(square: Square): boolean {
    return square.row >= 0 && square.row < 8 && square.col >= 0 && square.col < 8;
}

/**
 * Creates a new, empty 8x8 chess board
 */
export function createEmptyBoard(): Board {
    const board: Board = [];

    for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
            board[row][col] = null;
        }
    }

    return board;
}

/**
 * Creates a new chess board with pieces in the starting position
 */
export function createInitialBoard(): Board {
    const board = createEmptyBoard();

    // Set up pawns
    for (let col = 0; col < 8; col++) {
        board[1][col] = {
            type: PieceType.Pawn,
            color: Color.Black,
            position: { row: 1, col },
            hasMoved: false,
            id: `black-pawn-${col}`
        };

        board[6][col] = {
            type: PieceType.Pawn,
            color: Color.White,
            position: { row: 6, col },
            hasMoved: false,
            id: `white-pawn-${col}`
        };
    }

    // Set up other pieces
    const backRankPieces = [
        PieceType.Rook,
        PieceType.Knight,
        PieceType.Bishop,
        PieceType.Queen,
        PieceType.King,
        PieceType.Bishop,
        PieceType.Knight,
        PieceType.Rook
    ];

    for (let col = 0; col < 8; col++) {
        board[0][col] = {
            type: backRankPieces[col],
            color: Color.Black,
            position: { row: 0, col },
            hasMoved: false,
            id: `black-${backRankPieces[col]}-${col}`
        };

        board[7][col] = {
            type: backRankPieces[col],
            color: Color.White,
            position: { row: 7, col },
            hasMoved: false,
            id: `white-${backRankPieces[col]}-${col}`
        };
    }

    return board;
}

/**
 * Gets a piece at the specified position
 */
export function getPieceAt(board: Board, square: Square): Piece | null {
    if (!isValidPosition(square)) {
        return null;
    }

    return board[square.row][square.col];
}

/**
 * Gets a piece at the specified algebraic notation position
 */
export function getPieceAtAlgebraic(board: Board, algebraic: AlgebraicNotation): Piece | null {
    return getPieceAt(board, algebraicToCoordinates(algebraic));
}

/**
 * Determines if a square is empty
 */
export function isSquareEmpty(board: Board, square: Square): boolean {
    return getPieceAt(board, square) === null;
}

/**
 * Determines if a square has an opponent's piece
 */
export function hasOpponentPiece(board: Board, square: Square, playerColor: Color): boolean {
    const piece = getPieceAt(board, square);
    return piece !== null && piece.color !== playerColor;
}

/**
 * Determines if a square has a friendly piece
 */
export function hasFriendlyPiece(board: Board, square: Square, playerColor: Color): boolean {
    const piece = getPieceAt(board, square);
    return piece !== null && piece.color === playerColor;
}

/**
 * Creates a deep copy of the board
 */
export function cloneBoard(board: Board): Board {
    const newBoard: Board = createEmptyBoard();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                newBoard[row][col] = { ...piece };
            }
        }
    }

    return newBoard;
}