import React, { useState, useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
    achievement: Achievement | null;
    onDismiss: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Allow time for fade-out animation before dismissing
                setTimeout(onDismiss, 500);
            }, 4500);

            return () => clearTimeout(timer);
        }
    }, [achievement, onDismiss]);

    if (!achievement) {
        return null;
    }

    return (
        <div 
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all duration-500 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="relative bg-gray-800/80 backdrop-blur-md border border-yellow-400/50 rounded-xl shadow-2xl shadow-yellow-500/20 p-4 flex items-center">
                <div className="flex-shrink-0 mr-4">
                    <svg className="w-10 h-10 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-yellow-300">Achievement Unlocked!</h3>
                    <p className="text-sm text-gray-200">{achievement.name}</p>
                </div>
            </div>
        </div>
    );
};

export default AchievementToast;
