import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement, AchievementTier } from '../types';

interface AchievementBadgeProps {
    achievement: Achievement;
    isUnlocked: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const getTierColor = (tier: AchievementTier): string => {
    const colors = {
        bronze: 'from-amber-600 to-amber-800',
        silver: 'from-gray-400 to-gray-600',
        gold: 'from-yellow-400 to-yellow-600',
        platinum: 'from-purple-500 to-indigo-600',
    };
    return colors[tier];
};

const getTierRingColor = (tier: AchievementTier): string => {
    const colors = {
        bronze: 'ring-amber-500/30',
        silver: 'ring-gray-400/30',
        gold: 'ring-yellow-400/30',
        platinum: 'ring-purple-500/30',
    };
    return colors[tier];
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
    achievement,
    isUnlocked,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'w-12 h-12 text-xl',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-20 h-20 text-3xl',
    };

    return (
        <motion.div
            whileHover={{ scale: isUnlocked ? 1.1 : 1 }}
            className="group relative"
        >
            <div
                className={`
                    ${sizeClasses[size]}
                    flex items-center justify-center rounded-2xl
                    bg-gradient-to-br ${getTierColor(achievement.tier)}
                    ${isUnlocked ? 'opacity-100 shadow-lg' : 'opacity-30 grayscale'}
                    ${isUnlocked ? `ring-4 ${getTierRingColor(achievement.tier)}` : ''}
                    transition-all duration-300
                `}
            >
                <span className="drop-shadow-md">
                    {achievement.icon}
                </span>
            </div>

            {/* Tooltip on hover */}
            <div
                className="
                    pointer-events-none absolute -top-16 left-1/2 z-10 -translate-x-1/2
                    rounded-xl bg-slate-900 px-3 py-2 text-xs text-white opacity-0
                    shadow-xl transition-opacity duration-200 group-hover:opacity-100
                "
            >
                <div className="font-semibold">{achievement.name}</div>
                <div className="text-slate-300">{achievement.description}</div>
                <div className="absolute left-1/2 top-full -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-slate-900"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementBadge;
