// src/utils/algebraicNotation.ts
import { PieceType, Color } from '@/types';
import type { Move, Square, Board } from '@/types';

/**
 * Converts a square position to algebraic notation (e.g., {row: 0, col: 0} -> "a8")
 */
export function squareToAlgebraic(square: Square): string {
    const file = String.fromCharCode(97 + square.col); // a-h
    const rank = (8 - square.row).toString(); // 8-1
    return file + rank;
}

/**
 * Converts algebraic notation to square position (e.g., "a8" -> {row: 0, col: 0})
 */
export function algebraicToSquare(algebraic: string): Square {
    const file = algebraic.charCodeAt(0) - 97; // a=0, b=1, etc.
    const rank = parseInt(algebraic[1]);
    return {
        row: 8 - rank,
        col: file
    };
}

/**
 * Gets the piece symbol for algebraic notation
 */
function getPieceSymbol(pieceType: PieceType): string {
    switch (pieceType) {
        case PieceType.King: return 'K';
        case PieceType.Queen: return 'Q';
        case PieceType.Rook: return 'R';
        case PieceType.Bishop: return 'B';
        case PieceType.Knight: return 'N';
        case PieceType.Pawn: return '';
        default: return '';
    }
}

/**
 * Checks if two pieces of the same type can move to the same square (for disambiguation)
 */
function needsDisambiguation(board: Board, move: Move): { file: boolean; rank: boolean } {
    const { piece, to } = move;
    let needsFileDisambiguation = false;
    let needsRankDisambiguation = false;

    // Check all squares for pieces of the same type and color
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const otherPiece = board[row][col];
            if (!otherPiece ||
                otherPiece === piece ||
                otherPiece.type !== piece.type ||
                otherPiece.color !== piece.color) {
                continue;
            }

            // This is a simplified check - in a real implementation,
            // you'd need to check if the other piece can actually move to the target square
            if (otherPiece.position.col === piece.position.col) {
                needsRankDisambiguation = true;
            }
            if (otherPiece.position.row === piece.position.row) {
                needsFileDisambiguation = true;
            }
        }
    }

    return { file: needsFileDisambiguation, rank: needsRankDisambiguation };
}

/**
 * Converts a move to algebraic notation
 */
export function moveToAlgebraic(move: Move, board: Board, isCheck = false, isCheckmate = false): string {
    const { piece, from, to, capturedPiece, isCastle, isPromotion, promotionPiece } = move;

    // Special case: Castling
    if (isCastle) {
        // Determine if it's kingside or queenside castling
        return to.col > from.col ? 'O-O' : 'O-O-O';
    }

    let notation = '';

    // Piece symbol (empty for pawns)
    const pieceSymbol = getPieceSymbol(piece.type);
    notation += pieceSymbol;

    // Disambiguation for non-pawn pieces
    if (piece.type !== PieceType.Pawn) {
        const disambiguation = needsDisambiguation(board, move);
        if (disambiguation.file) {
            notation += squareToAlgebraic(from)[0]; // Add file
        } else if (disambiguation.rank) {
            notation += squareToAlgebraic(from)[1]; // Add rank
        }
    } else if (capturedPiece) {
        // Pawn captures include the file they came from
        notation += squareToAlgebraic(from)[0];
    }

    // Capture indicator
    if (capturedPiece) {
        notation += 'x';
    }

    // Destination square
    notation += squareToAlgebraic(to);

    // Pawn promotion
    if (isPromotion && promotionPiece) {
        notation += '=' + getPieceSymbol(promotionPiece);
    }

    // Check/Checkmate indicators
    if (isCheckmate) {
        notation += '#';
    } else if (isCheck) {
        notation += '+';
    }

    return notation;
}

/**
 * Formats a move number for display
 */
export function formatMoveNumber(moveIndex: number, color: Color): string {
    const moveNumber = Math.floor(moveIndex / 2) + 1;
    if (color === Color.White) {
        return `${moveNumber}.`;
    } else {
        return moveIndex === 1 ? `${moveNumber}...` : '';
    }
}

/**
 * Converts game moves to PGN format
 */
export function movesToPGN(moves: Move[], board: Board): string {
    let pgn = '';

    moves.forEach((move, index) => {
        const color = index % 2 === 0 ? Color.White : Color.Black;
        const moveNumber = formatMoveNumber(index, color);

        if (moveNumber) {
            pgn += moveNumber + ' ';
        }

        const algebraic = moveToAlgebraic(move, board, move.isCheck, move.isCheckmate);
        pgn += algebraic + ' ';
    });

    return pgn.trim();
}

/**
 * Creates a downloadable PGN file
 */
export function exportToPGN(moves: Move[], board: Board, gameResult = '*'): string {
    const headers = [
        '[Event "Casual Game"]',
        '[Site "Chess App"]',
        `[Date "${new Date().toISOString().split('T')[0]}"]`,
        '[Round "1"]',
        '[White "Player 1"]',
        '[Black "Player 2"]',
        `[Result "${gameResult}"]`,
        ''
    ].join('\n');

    const moveText = movesToPGN(moves, board);

    return headers + moveText + ' ' + gameResult;
}