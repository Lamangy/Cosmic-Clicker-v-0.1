import React from 'react';
import { Achievement, GameState } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementsPanelProps {
    unlockedAchievements: Record<string, number>;
    gameState: GameState;
    formatNumber: (n: number) => string;
}

const AchievementItem: React.FC<{
    achievement: Achievement,
    isUnlocked: boolean,
}> = ({ achievement, isUnlocked }) => {
    const opacityClass = isUnlocked ? 'opacity-100' : 'opacity-50';

    return (
        <div className={`flex items-center p-3 border border-gray-700 rounded-lg bg-gray-800/50 ${opacityClass} transition-opacity`}>
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 mr-4">
                {isUnlocked ? (
                    <svg className="w-8 h-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>
            <div>
                <h3 className={`font-bold ${isUnlocked ? 'text-cyan-200' : 'text-gray-400'}`}>{achievement.name}</h3>
                <p className="text-xs text-gray-400">{achievement.description}</p>
            </div>
        </div>
    );
};


const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ unlockedAchievements, gameState, formatNumber }) => {
    const allAchievements = Object.values(ACHIEVEMENTS).filter(ach => !ach.isSecret || unlockedAchievements[ach.id]);

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-center mb-4 text-cyan-300 drop-shadow-lg">Achievements</h2>
            <div className="space-y-3 flex-grow overflow-y-auto">
                {allAchievements.map(ach => (
                    <AchievementItem 
                        key={ach.id}
                        achievement={ach}
                        isUnlocked={!!unlockedAchievements[ach.id]}
                    />
                ))}
            </div>
        </div>
    );
};

export default AchievementsPanel;