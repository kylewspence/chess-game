// src/utils/gameLogic.ts - Update the executeMove function

import { Color, GameStatus } from '@/types';
import type { Square, Piece, Move, GameState } from '@/types';
import { getPieceAt, cloneBoard } from './board';
import { generatePossibleMoves } from './movement';
import { isKingInCheck, findKing } from './checkDetection';
import { isCastlingMove, executeCastling } from './specialMoves'; // Add these imports

export function executeMove(gameState: GameState, from: Square, to: Square): GameState | null {
    const piece = getPieceAt(gameState.board, from);

    if (!piece) {
        return null; // No piece at source square
    }

    if (piece.color !== gameState.currentTurn) {
        return null; // Not the player's turn
    }

    // Check if the move is valid
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const possibleMoves = generatePossibleMoves(gameState.board, piece, lastMove);
    const isValidMove = possibleMoves.some(move => move.row === to.row && move.col === to.col);

    if (!isValidMove) {
        return null; // Invalid move
    }

    // Create new board state
    const newBoard = cloneBoard(gameState.board);
    let capturedPiece = getPieceAt(newBoard, to);

    // Check if this is a castling move
    if (isCastlingMove(piece, from, to)) {
        // Execute castling (moves both king and rook)
        executeCastling(newBoard, from, to);
        capturedPiece = null; // No capture in castling
    } else {
        // Regular move execution
        const updatedPiece: Piece = {
            ...piece,
            position: to,
            hasMoved: true
        };

        newBoard[from.row][from.col] = null;
        newBoard[to.row][to.col] = updatedPiece;
    }

    // Create move record
    const move: Move = {
        from,
        to,
        piece: { ...piece, position: to, hasMoved: true },
        capturedPiece: capturedPiece || undefined,
        isCastle: isCastlingMove(piece, from, to)
    };

    // Update captured pieces (only if there was a capture)
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

    // Check if the opponent is now in check
    const opponentInCheck = isKingInCheck(newBoard, nextTurn);

    // Create new game state
    const newGameState: GameState = {
        board: newBoard,
        currentTurn: nextTurn,
        moveHistory: [...gameState.moveHistory, move],
        capturedPieces: newCapturedPieces,
        status: opponentInCheck ? GameStatus.Check : GameStatus.Active,
        check: {
            inCheck: opponentInCheck,
            kingPosition: opponentInCheck ? (findKing(newBoard, nextTurn) || undefined) : undefined
        },
        selectedPiece: null,
        validMoves: []
    };

    return newGameState;
}

// ... rest of the file stays the same