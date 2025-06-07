/**
 * Represents the types of chess pieces
 */
export enum PieceType {
    King = 'king',
    Queen = 'queen',
    Rook = 'rook',
    Bishop = 'bishop',
    Knight = 'knight',
    Pawn = 'pawn'
}

/**
 * Represents the color of a chess piece
 */
export enum Color {
    White = 'white',
    Black = 'black'
}

/**
 * Represents a position on the chess board
 */
export interface Square {
    row: number; // 0-7 (8th rank to 1st rank)
    col: number; // 0-7 (a-file to h-file)
}

/**
 * Represents a chess piece with its properties
 */
export interface Piece {
    type: PieceType;
    color: Color;
    position: Square;
    hasMoved: boolean;
    id: string; // Unique identifier
}

/**
 * Represents a chess move
 */
export interface Move {
    from: Square;
    to: Square;
    piece: Piece;
    capturedPiece?: Piece;
    isCheck?: boolean;
    isCheckmate?: boolean;
    isPromotion?: boolean;
    promotionPiece?: PieceType;
    isCastle?: boolean;
    isEnPassant?: boolean;
}

/**
 * Represents a complete state of the chess game
 */
export interface GameState {
    board: (Piece | null)[][];
    currentTurn: Color;
    moveHistory: Move[];
    capturedPieces: {
        [Color.White]: Piece[];
        [Color.Black]: Piece[];
    };
    status: GameStatus;
    check: {
        inCheck: boolean;
        kingPosition?: Square;
    };
    selectedPiece: Piece | null;
    validMoves: Square[];
}

/**
 * Represents the current status of the game
 */
export enum GameStatus {
    Active = 'active',
    Check = 'check',
    Checkmate = 'checkmate',
    Stalemate = 'stalemate',
    Draw = 'draw'
}

/**
 * Represents chess notation 
 */
export type AlgebraicNotation = string; // e.g., "a1", "e4", etc.

/**
 * Type for representing a full chess board
 */
export type Board = (Piece | null)[][];