// src/utils/gameLogic.ts - Complete update

import { Color, GameStatus, PieceType } from '@/types';
import type { Square, Piece, Move, GameState } from '@/types';
import { getPieceAt, cloneBoard } from './board';
import { generatePossibleMoves } from './movement';
import { findKing } from './checkDetection';
import {
    isCastlingMove,
    executeCastling,
    isPromotionMove,
    executePromotion,
    canCaptureEnPassant,
    executeEnPassant
} from './specialMoves';
import { determineGameStatus } from './endgameDetection';

export function executeMove(gameState: GameState, from: Square, to: Square, promotionPiece?: PieceType): GameState | null {
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

    // Handle promotion requirement
    if (isPromotionMove(piece, to) && !promotionPiece) {
        return {
            ...gameState,
            pendingPromotion: { from, to, pawn: piece }
        };
    }

    // Create new board state
    const newBoard = cloneBoard(gameState.board);
    let capturedPiece = getPieceAt(newBoard, to);
    let isEnPassant = false;
    let isPawnDoubleMove = false;

    // Handle different move types
    if (isCastlingMove(piece, from, to)) {
        // Castling
        executeCastling(newBoard, from, to);
        capturedPiece = null;
    } else if (isPromotionMove(piece, to) && promotionPiece) {
        // Pawn promotion
        executePromotion(newBoard, piece, to, promotionPiece);
    } else if (piece.type === PieceType.Pawn && canCaptureEnPassant(piece, to, lastMove)) {
        // En passant capture
        capturedPiece = executeEnPassant(newBoard, piece, to);
        isEnPassant = true;
    } else {
        // Regular move
        const updatedPiece: Piece = {
            ...piece,
            position: to,
            hasMoved: true
        };

        // Check if this is a pawn double move (for en passant tracking)
        if (piece.type === PieceType.Pawn && Math.abs(to.row - from.row) === 2) {
            isPawnDoubleMove = true;
        }

        newBoard[from.row][from.col] = null;
        newBoard[to.row][to.col] = updatedPiece;
    }

    // Create move record
    const move: Move = {
        from,
        to,
        piece: { ...piece, position: to, hasMoved: true },
        capturedPiece: capturedPiece || undefined,
        isCastle: isCastlingMove(piece, from, to),
        isEnPassant,
        isPawnDoubleMove,
        isPromotion: isPromotionMove(piece, to),
        promotionPiece
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

    // Determine game status (includes checkmate/stalemate)
    const newStatus = determineGameStatus(newBoard, nextTurn);
    const opponentInCheck = newStatus === GameStatus.Check || newStatus === GameStatus.Checkmate;

    // Create new game state
    const newGameState: GameState = {
        board: newBoard,
        currentTurn: nextTurn,
        moveHistory: [...gameState.moveHistory, move],
        capturedPieces: newCapturedPieces,
        status: newStatus,
        check: {
            inCheck: opponentInCheck,
            kingPosition: opponentInCheck ? (findKing(newBoard, nextTurn) || undefined) : undefined
        },
        selectedPiece: null,
        validMoves: [],
        // Clear pending promotion
        pendingPromotion: undefined
    };

    return newGameState;
}

/**
 * Gets the opposite color
 */
export function getOppositeColor(color: Color): Color {
    return color === Color.White ? Color.Black : Color.White;
}