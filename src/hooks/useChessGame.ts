// src/hooks/useChessGame.ts - Update to handle promotion and draw conditions

import { useState } from 'react';
import { GameStatus, PieceType } from '@/types';
import type { GameState, Square } from '@/types';
import { createInitialBoard } from '@/utils/board';
import { executeMove } from '@/utils/gameLogic';
import { generatePossibleMoves } from '@/utils/movement';
import { isFiftyMoveRule, isThreefoldRepetition } from '@/utils/drawConditions';
import { INITIAL_GAME_STATE } from '@/constants';

export function useChessGame() {
    const [gameState, setGameState] = useState<GameState>({
        board: createInitialBoard(),
        ...INITIAL_GAME_STATE
    });

    const selectSquare = (square: Square) => {
        // If there's a pending promotion, ignore square selection
        if (gameState.pendingPromotion) {
            return;
        }

        const piece = gameState.board[square.row][square.col];

        // If clicking on a piece of the current player's color
        if (piece && piece.color === gameState.currentTurn) {
            const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
            const validMoves = generatePossibleMoves(gameState.board, piece, lastMove);
            setGameState(prev => ({
                ...prev,
                selectedPiece: piece,
                validMoves
            }));
            return;
        }

        // If we have a selected piece and are clicking a valid move target
        if (gameState.selectedPiece) {
            const newGameState = executeMove(gameState, gameState.selectedPiece.position, square);

            if (newGameState) {
                // Check for draw conditions
                if (newGameState.status === GameStatus.Active) {
                    if (isFiftyMoveRule(newGameState) || isThreefoldRepetition(newGameState)) {
                        newGameState.status = GameStatus.Draw;
                    }
                }

                setGameState(newGameState);
            } else {
                // Invalid move, clear selection
                setGameState(prev => ({
                    ...prev,
                    selectedPiece: null,
                    validMoves: []
                }));
            }
        }
    };

    const handlePromotion = (pieceType: PieceType) => {
        if (!gameState.pendingPromotion) return;

        const { from, to } = gameState.pendingPromotion;
        const newGameState = executeMove(gameState, from, to, pieceType);

        if (newGameState) {
            // Check for draw conditions
            if (newGameState.status === GameStatus.Active) {
                if (isFiftyMoveRule(newGameState) || isThreefoldRepetition(newGameState)) {
                    newGameState.status = GameStatus.Draw;
                }
            }

            setGameState(newGameState);
        }
    };

    const cancelPromotion = () => {
        setGameState(prev => ({
            ...prev,
            pendingPromotion: undefined,
            selectedPiece: null,
            validMoves: []
        }));
    };

    const resetGame = () => {
        setGameState({
            board: createInitialBoard(),
            ...INITIAL_GAME_STATE
        });
    };

    return {
        gameState,
        selectSquare,
        handlePromotion,
        cancelPromotion,
        resetGame
    };
}