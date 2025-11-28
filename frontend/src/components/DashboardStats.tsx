import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, LayoutGrid } from 'lucide-react';

interface DashboardStatsProps {
    userPoints: number;
    habitsCount: number;
    todayCompletions: number;
    totalCompletions: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
    userPoints,
    habitsCount,
    todayCompletions,
    totalCompletions,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
            <div className="glass-card rounded-2xl p-6 shadow-premium">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                    <Award className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-sm font-semibold text-slate-600">Total Points</div>
                <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{userPoints}</div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-premium">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500">
                    <Target className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-sm font-semibold text-slate-600">Active Habits</div>
                <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{habitsCount}</div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-premium">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500">
                    <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-sm font-semibold text-slate-600">Today's Progress</div>
                <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{todayCompletions}/{habitsCount}</div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-premium">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500">
                    <LayoutGrid className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-sm font-semibold text-slate-600">Total Check-ins</div>
                <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{totalCompletions}</div>
            </div>
        </motion.div>
    );
};

export default DashboardStats;
