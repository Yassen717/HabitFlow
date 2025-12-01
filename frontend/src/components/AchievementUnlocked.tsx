import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import type { UnlockedAchievement } from '../types';

interface AchievementUnlockedProps {
    achievement: UnlockedAchievement | null;
    onClose: () => void;
}

const getTierColor = (tier: string): string => {
    const colors = {
        bronze: 'from-amber-600 to-amber-800',
        silver: 'from-gray-400 to-gray-600',
        gold: 'from-yellow-400 to-yellow-600',
        platinum: 'from-purple-500 to-indigo-600',
    };
    return colors[tier as keyof typeof colors] || 'from-sky-500 to-indigo-600';
};

const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
    achievement,
    onClose,
}) => {
    // Auto-dismiss after 5 seconds
    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    return (
        <AnimatePresence>
            {achievement && (
                <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Achievement Modal */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="pointer-events-auto relative z-10 max-w-md"
                    >
                        {/* Sparkles Animation */}
                        <div className="absolute -inset-4">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [1, 1, 0],
                                        x: [0, Math.cos(i * 45 * (Math.PI / 180)) * 100],
                                        y: [0, Math.sin(i * 45 * (Math.PI / 180)) * 100],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: 0.2,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                    className="absolute left-1/2 top-1/2"
                                >
                                    <Sparkles className="h-6 w-6 text-yellow-400" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Card */}
                        <div className="glass-card relative overflow-hidden rounded-3xl p-8 shadow-premium-lg">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/50 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>

                            {/* Content */}
                            <div className="text-center">
                                {/* Trophy Icon */}
                                <motion.div
                                    initial={{ rotate: -20, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        delay: 0.2,
                                        duration: 0.6,
                                    }}
                                    className="mb-6 flex justify-center"
                                >
                                    <div
                                        className={`
                                            flex h-24 w-24 items-center justify-center rounded-3xl
                                            bg-gradient-to-br ${getTierColor(achievement.achievement.tier)}
                                            shadow-2xl
                                        `}
                                    >
                                        <span className="text-5xl drop-shadow-lg">
                                            {achievement.achievement.icon}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Text */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-sky-600">
                                        Achievement Unlocked!
                                    </div>
                                    <h3 className="mb-3 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                                        {achievement.achievement.name}
                                    </h3>
                                    <p className="mb-6 text-slate-600">
                                        {achievement.achievement.description}
                                    </p>

                                    {/* Points */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.6, type: 'spring' }}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-white shadow-lg"
                                    >
                                        <Trophy size={20} />
                                        <span className="font-['Space_Grotesk'] text-xl font-bold">
                                            +{achievement.pointsAwarded} Points
                                        </span>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AchievementUnlocked;
