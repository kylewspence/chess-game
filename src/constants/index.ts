// Chess game constants will be added here
// This will include initial board setup, piece values, and game configuration
import { Color, GameStatus } from '@/types';

/**
 * Initial game state constants
 */
export const INITIAL_GAME_STATE = {
    currentTurn: Color.White,
    status: GameStatus.Active,
    moveHistory: [],
    capturedPieces: {
        [Color.White]: [],
        [Color.Black]: []
    },
    check: {
        inCheck: false
    },
    selectedPiece: null,
    validMoves: []
};

/**
 * Time values for game clock (in milliseconds)
 */
export const TIME_CONTROLS = {
    bullet: 1 * 60 * 1000, // 1 minute
    blitz: 3 * 60 * 1000,  // 3 minutes
    rapid: 10 * 60 * 1000, // 10 minutes
    classical: 30 * 60 * 1000, // 30 minutes
};

/**
 * Point values for pieces (used for material advantage calculation)
 */
export const PIECE_VALUES = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0 // The king's value is infinite in practice
};

/**
 * Direction vectors for piece movement
 */
export const DIRECTION_VECTORS = {
    north: { row: -1, col: 0 },
    northeast: { row: -1, col: 1 },
    east: { row: 0, col: 1 },
    southeast: { row: 1, col: 1 },
    south: { row: 1, col: 0 },
    southwest: { row: 1, col: -1 },
    west: { row: 0, col: -1 },
    northwest: { row: -1, col: -1 },
    knight: [
        { row: -2, col: -1 }, { row: -2, col: 1 },
        { row: -1, col: -2 }, { row: -1, col: 2 },
        { row: 1, col: -2 }, { row: 1, col: 2 },
        { row: 2, col: -1 }, { row: 2, col: 1 }
    ]
};