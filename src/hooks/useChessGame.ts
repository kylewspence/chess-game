// src/hooks/useChessGame.ts
import { useState } from 'react';
import { Color, GameStatus } from '@/types';
import type { GameState, Square } from '@/types';
import { createInitialBoard } from '@/utils/board';
import { executeMove } from '@/utils/gameLogic';
import { generatePossibleMoves } from '@/utils/movement';
import { INITIAL_GAME_STATE } from '@/constants';

export function useChessGame() {
    const [gameState, setGameState] = useState<GameState>({
        board: createInitialBoard(),
        ...INITIAL_GAME_STATE
    });

    const selectSquare = (square: Square) => {
        const piece = gameState.board[square.row][square.col];

        // If clicking on a piece of the current player's color
        if (piece && piece.color === gameState.currentTurn) {
            const validMoves = generatePossibleMoves(gameState.board, piece);
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

    const resetGame = () => {
        setGameState({
            board: createInitialBoard(),
            ...INITIAL_GAME_STATE
        });
    };

    return {
        gameState,
        selectSquare,
        resetGame
    };
}