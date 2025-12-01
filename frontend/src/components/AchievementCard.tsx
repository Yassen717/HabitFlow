import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Achievement, AchievementTier } from '../types';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    unlockedAt?: string;
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

const getTierBgColor = (tier: AchievementTier): string => {
    const colors = {
        bronze: 'bg-amber-50',
        silver: 'bg-gray-50',
        gold: 'bg-yellow-50',
        platinum: 'bg-purple-50',
    };
    return colors[tier];
};

const getTierTextColor = (tier: AchievementTier): string => {
    const colors = {
        bronze: 'text-amber-700',
        silver: 'text-gray-700',
        gold: 'text-yellow-700',
        platinum: 'text-purple-700',
    };
    return colors[tier];
};

const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    isUnlocked,
    unlockedAt,
}) => {
    const formattedDate = unlockedAt
        ? new Date(unlockedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: isUnlocked ? 1.03 : 1 }}
            className={`
                glass-card rounded-2xl p-6 transition-all duration-300
                ${isUnlocked ? 'shadow-premium' : 'opacity-60'}
            `}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                    className={`
                        flex h-16 w-16 items-center justify-center rounded-xl text-3xl
                        bg-gradient-to-br ${getTierColor(achievement.tier)} 
                        ${isUnlocked ? 'shadow-lg' : 'grayscale opacity-40'}
                    `}
                >
                    {isUnlocked ? (
                        <span className="drop-shadow-md">{achievement.icon}</span>
                    ) : (
                        <Lock className="h-6 w-6 text-white" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                            {achievement.name}
                        </h3>
                        {/* Tier Badge */}
                        <span
                            className={`
                                rounded-full px-3 py-1 text-xs font-semibold uppercase
                                ${getTierBgColor(achievement.tier)}
                                ${getTierTextColor(achievement.tier)}
                            `}
                        >
                            {achievement.tier}
                        </span>
                    </div>

                    <p className="mb-3 text-sm text-slate-600">
                        {achievement.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs">
                        {isUnlocked ? (
                            <span className="font-semibold text-green-600">
                                ✓ Unlocked {formattedDate}
                            </span>
                        ) : (
                            <span className="font-semibold text-slate-400">
                                🔒 Locked
                            </span>
                        )}
                        <span className="font-semibold text-sky-600">
                            +{achievement.pointsReward} pts
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementCard;
