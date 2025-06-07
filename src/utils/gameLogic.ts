// src/utils/gameLogic.ts
import { Color, GameStatus } from '@/types';
import type { Board, Square, Piece, Move, GameState } from '@/types';
import { getPieceAt, cloneBoard } from './board';
import { generatePossibleMoves } from './movement';

/**
 * Executes a move on the board
 */
export function executeMove(gameState: GameState, from: Square, to: Square): GameState | null {
    const piece = getPieceAt(gameState.board, from);

    if (!piece) {
        return null; // No piece at source square
    }

    if (piece.color !== gameState.currentTurn) {
        return null; // Not the player's turn
    }

    // Check if the move is valid
    const possibleMoves = generatePossibleMoves(gameState.board, piece);
    const isValidMove = possibleMoves.some(move => move.row === to.row && move.col === to.col);

    if (!isValidMove) {
        return null; // Invalid move
    }

    // Create new board state
    const newBoard = cloneBoard(gameState.board);
    const capturedPiece = getPieceAt(newBoard, to);

    // Update piece position
    const updatedPiece: Piece = {
        ...piece,
        position: to,
        hasMoved: true
    };

    // Execute the move
    newBoard[from.row][from.col] = null;
    newBoard[to.row][to.col] = updatedPiece;

    // Create move record
    const move: Move = {
        from,
        to,
        piece: updatedPiece,
        capturedPiece: capturedPiece || undefined
    };

    // Update captured pieces
    const newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece) {
        if (capturedPiece.color === Color.White) {
            newCapturedPieces[Color.White] = [...newCapturedPieces[Color.White], capturedPiece];
        } else {
            newCapturedPieces[Color.Black] = [...newCapturedPieces[Color.Black], capturedPiece];
        }
    }

    // Switch turns
    const nextTurn = gameState.currentTurn === Color.White ? Color.Black : Color.White;

    // Create new game state
    const newGameState: GameState = {
        board: newBoard,
        currentTurn: nextTurn,
        moveHistory: [...gameState.moveHistory, move],
        capturedPieces: newCapturedPieces,
        status: GameStatus.Active, // We'll add check detection later
        check: { inCheck: false }, // We'll implement this in Phase 5
        selectedPiece: null,
        validMoves: []
    };

    return newGameState;
}

/**
 * Gets the opposite color
 */
export function getOppositeColor(color: Color): Color {
    return color === Color.White ? Color.Black : Color.White;
}