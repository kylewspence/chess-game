// src/components/GameTimer/GameTimer.tsx
import { useState, useEffect } from 'react';
import { Color } from '@/types';
import { Clock } from 'lucide-react';

interface GameTimerProps {
    currentTurn: Color;
    isGameActive: boolean;
    initialTimeMs?: number; // Initial time in milliseconds
    onTimeExpired?: (color: Color) => void;
}

export const GameTimer = ({
    currentTurn,
    isGameActive,
    initialTimeMs = 10 * 60 * 1000, // 10 minutes default
    onTimeExpired
}: GameTimerProps) => {
    const [whiteTime, setWhiteTime] = useState(initialTimeMs);
    const [blackTime, setBlackTime] = useState(initialTimeMs);

    useEffect(() => {
        if (!isGameActive) return;

        const interval = setInterval(() => {
            if (currentTurn === Color.White) {
                setWhiteTime(prev => {
                    if (prev <= 1000) {
                        onTimeExpired?.(Color.White);
                        return 0;
                    }
                    return prev - 1000;
                });
            } else {
                setBlackTime(prev => {
                    if (prev <= 1000) {
                        onTimeExpired?.(Color.Black);
                        return 0;
                    }
                    return prev - 1000;
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentTurn, isGameActive, onTimeExpired]);

    const formatTime = (timeMs: number) => {
        const minutes = Math.floor(timeMs / 60000);
        const seconds = Math.floor((timeMs % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isTimeRunningOut = (timeMs: number) => timeMs < 30000; // Less than 30 seconds
    const isTimeCritical = (timeMs: number) => timeMs < 10000; // Less than 10 seconds

    const getTimeColor = (timeMs: number, isActive: boolean) => {
        if (isTimeCritical(timeMs)) return 'text-red-600';
        if (isTimeRunningOut(timeMs)) return 'text-orange-600';
        if (isActive) return 'text-blue-600';
        return 'text-gray-600';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-64">
            <div className="flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-bold">Game Timer</h3>
            </div>

            {/* White Timer */}
            <div className={`mb-3 p-3 rounded-lg ${currentTurn === Color.White && isGameActive ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-white border border-gray-800 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">White</span>
                    </div>
                    <div className={`text-lg font-mono font-bold ${getTimeColor(whiteTime, currentTurn === Color.White && isGameActive)
                        }`}>
                        {formatTime(whiteTime)}
                    </div>
                </div>
            </div>

            {/* Black Timer */}
            <div className={`p-3 rounded-lg ${currentTurn === Color.Black && isGameActive ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-800 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Black</span>
                    </div>
                    <div className={`text-lg font-mono font-bold ${getTimeColor(blackTime, currentTurn === Color.Black && isGameActive)
                        }`}>
                        {formatTime(blackTime)}
                    </div>
                </div>
            </div>
        </div>
    );
};