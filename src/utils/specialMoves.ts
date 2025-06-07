// src/utils/specialMoves.ts
import { Color, PieceType } from '@/types';
import type { Board, Square, Piece, Move } from '@/types';
import { getPieceAt } from './board';
import { isSquareUnderAttack } from './checkDetection';

/**
 * Checks if castling is legal and returns the rook move if so
 */
export function canCastle(board: Board, king: Piece, side: 'kingside' | 'queenside'): { legal: boolean, rookMove?: { from: Square, to: Square } } {
    // King must not have moved
    if (king.hasMoved) {
        return { legal: false };
    }

    // King must not be in check
    if (isSquareUnderAttack(board, king.position, king.color === Color.White ? Color.Black : Color.White)) {
        return { legal: false };
    }

    const row = king.color === Color.White ? 7 : 0;
    const kingCol = 4;
    const rookCol = side === 'kingside' ? 7 : 0;
    const rookTargetCol = side === 'kingside' ? 5 : 3;

    // Check if rook exists and hasn't moved
    const rook = getPieceAt(board, { row, col: rookCol });
    if (!rook || rook.type !== PieceType.Rook || rook.hasMoved) {
        return { legal: false };
    }

    // Check if path is clear
    const start = Math.min(kingCol, rookCol) + 1;
    const end = Math.max(kingCol, rookCol);
    for (let col = start; col < end; col++) {
        if (getPieceAt(board, { row, col })) {
            return { legal: false };
        }
    }

    // Check if king passes through or lands on attacked squares
    const opponentColor = king.color === Color.White ? Color.Black : Color.White;
    const colsToCheck = side === 'kingside' ? [5, 6] : [2, 3];

    for (const col of colsToCheck) {
        if (isSquareUnderAttack(board, { row, col }, opponentColor)) {
            return { legal: false };
        }
    }

    return {
        legal: true,
        rookMove: {
            from: { row, col: rookCol },
            to: { row, col: rookTargetCol }
        }
    };
}

/**
 * Generates castling moves for the king
 */
export function generateCastlingMoves(board: Board, king: Piece): Square[] {
    const moves: Square[] = [];
    const row = king.color === Color.White ? 7 : 0;

    // Check kingside castling
    const kingsideCastle = canCastle(board, king, 'kingside');
    if (kingsideCastle.legal) {
        moves.push({ row, col: 6 });
    }

    // Check queenside castling
    const queensideCastle = canCastle(board, king, 'queenside');
    if (queensideCastle.legal) {
        moves.push({ row, col: 2 });
    }

    return moves;
}

/**
 * Executes a castling move
 */
export function executeCastling(board: Board, kingFrom: Square, kingTo: Square): void {
    const king = getPieceAt(board, kingFrom);
    if (!king) return;

    const side = kingTo.col === 6 ? 'kingside' : 'queenside';
    const castleInfo = canCastle(board, king, side);

    if (!castleInfo.legal || !castleInfo.rookMove) return;

    // Move king
    board[kingTo.row][kingTo.col] = { ...king, position: kingTo, hasMoved: true };
    board[kingFrom.row][kingFrom.col] = null;

    // Move rook
    const rook = getPieceAt(board, castleInfo.rookMove.from);
    if (rook) {
        board[castleInfo.rookMove.to.row][castleInfo.rookMove.to.col] = {
            ...rook,
            position: castleInfo.rookMove.to,
            hasMoved: true
        };
        board[castleInfo.rookMove.from.row][castleInfo.rookMove.from.col] = null;
    }
}

/**
 * Checks if a move is a castling move
 */
export function isCastlingMove(piece: Piece, from: Square, to: Square): boolean {
    return piece.type === PieceType.King && Math.abs(to.col - from.col) === 2;
}

/**
 * Checks if en passant capture is legal
 */
export function canCaptureEnPassant(pawn: Piece, targetSquare: Square, lastMove?: Move): boolean {
    if (pawn.type !== PieceType.Pawn || !lastMove) {
        return false;
    }

    // Last move must have been a two-square pawn move
    if (lastMove.piece.type !== PieceType.Pawn) {
        return false;
    }

    const moveDistance = Math.abs(lastMove.to.row - lastMove.from.row);
    if (moveDistance !== 2) {
        return false;
    }

    // The pawn that moved must be adjacent to our pawn
    if (Math.abs(lastMove.to.col - pawn.position.col) !== 1 || lastMove.to.row !== pawn.position.row) {
        return false;
    }

    // Target square must be behind the opponent's pawn
    const expectedRow = pawn.color === Color.White ? pawn.position.row - 1 : pawn.position.row + 1;
    return targetSquare.row === expectedRow && targetSquare.col === lastMove.to.col;
}

/**
 * Generates en passant moves for a pawn
 */
export function generateEnPassantMoves(pawn: Piece, lastMove?: Move): Square[] {
    if (!lastMove) return [];

    const moves: Square[] = [];
    const direction = pawn.color === Color.White ? -1 : 1;

    // Check left and right for en passant opportunities
    const leftTarget = { row: pawn.position.row + direction, col: pawn.position.col - 1 };
    const rightTarget = { row: pawn.position.row + direction, col: pawn.position.col + 1 };

    if (canCaptureEnPassant(pawn, leftTarget, lastMove)) {
        moves.push(leftTarget);
    }

    if (canCaptureEnPassant(pawn, rightTarget, lastMove)) {
        moves.push(rightTarget);
    }

    return moves;
}

/**
 * Executes an en passant capture
 */
export function executeEnPassant(board: Board, pawn: Piece, targetSquare: Square): Piece | null {
    // Remove the captured pawn
    const capturedPawnRow = pawn.position.row; // Same row as the capturing pawn
    const capturedPawnCol = targetSquare.col;

    const capturedPawn = getPieceAt(board, { row: capturedPawnRow, col: capturedPawnCol });
    board[capturedPawnRow][capturedPawnCol] = null;

    // Move the capturing pawn
    board[targetSquare.row][targetSquare.col] = { ...pawn, position: targetSquare, hasMoved: true };
    board[pawn.position.row][pawn.position.col] = null;

    return capturedPawn;
}

/**
 * Checks if a pawn move results in promotion
 */
export function isPromotionMove(pawn: Piece, targetSquare: Square): boolean {
    if (pawn.type !== PieceType.Pawn) return false;

    const promotionRow = pawn.color === Color.White ? 0 : 7;
    return targetSquare.row === promotionRow;
}

/**
 * Gets available promotion pieces
 */
export function getPromotionOptions(): PieceType[] {
    return [PieceType.Queen, PieceType.Rook, PieceType.Bishop, PieceType.Knight];
}

/**
 * Executes pawn promotion
 */
export function executePromotion(board: Board, pawn: Piece, targetSquare: Square, promoteTo: PieceType): void {
    const promotedPiece: Piece = {
        ...pawn,
        type: promoteTo,
        position: targetSquare,
        hasMoved: true,
        id: `${pawn.color}-${promoteTo}-promoted-${Date.now()}`
    };

    board[targetSquare.row][targetSquare.col] = promotedPiece;
    board[pawn.position.row][pawn.position.col] = null;
}