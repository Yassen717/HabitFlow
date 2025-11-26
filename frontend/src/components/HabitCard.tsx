import React from 'react';
import { Check, Trash2, Calendar, TrendingUp, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Habit } from '../types';

interface HabitCardProps {
    habit: Habit;
    onCheckIn: (id: string) => void;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    isProcessing?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onCheckIn, onEdit, onDelete, isProcessing = false }) => {
    const isCompletedToday = habit.logs.some((log) => {
        const logDate = new Date(log.date).toDateString();
        const today = new Date().toDateString();
        return logDate === today;
    });

    // Use backend-calculated streak
    const streak = habit.streak ?? 0;

    // Calculate proper completion rate based on frequency
    const calculateCompletionRate = (): number => {
        if (!habit.createdAt || habit.logs.length === 0) return 0;

        const created = new Date(habit.createdAt);
        const today = new Date();
        const daysSinceCreation = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (habit.frequency === 'daily') {
            // For daily habits, compare completions to days since creation
            const expectedCompletions = Math.max(1, daysSinceCreation);
            return Math.min(100, Math.round((habit.logs.length / expectedCompletions) * 100));
        } else if (habit.frequency === 'weekly') {
            // For weekly habits, calculate weeks since creation
            const weeksSinceCreation = Math.max(1, Math.ceil(daysSinceCreation / 7));
            return Math.min(100, Math.round((habit.logs.length / weeksSinceCreation) * 100));
        }

        return habit.logs.length > 0 ? 100 : 0;
    };

    const completionRate = calculateCompletionRate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group glass-card card-hover relative overflow-hidden rounded-2xl p-6"
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="mb-1 font-['Space_Grotesk'] text-lg font-bold text-slate-900">{habit.title}</h3>
                    {habit.description && (
                        <p className="text-sm text-slate-600">{habit.description}</p>
                    )}
                </div>

                <div className="flex gap-1">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(habit)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-600"
                        title="Edit habit"
                    >
                        <Pencil size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(habit.id)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete habit"
                    >
                        <Trash2 size={16} />
                    </motion.button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5">
                    <Calendar size={14} className="text-sky-600" />
                    <span className="text-xs font-semibold text-sky-700">{habit.frequency}</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5">
                    <TrendingUp size={14} className="text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-700">{streak} days</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">Completion</span>
                    <span className="font-semibold text-slate-900">{completionRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-600"
                    />
                </div>
            </div>

            {/* Action Button */}
            <motion.button
                whileHover={{ scale: isCompletedToday || isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isCompletedToday || isProcessing ? 1 : 0.98 }}
                onClick={() => !isCompletedToday && !isProcessing && onCheckIn(habit.id)}
                disabled={isCompletedToday || isProcessing}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${isCompletedToday
                    ? 'cursor-not-allowed bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                    : isProcessing
                        ? 'cursor-wait opacity-60 btn-primary'
                        : 'btn-primary'
                    }`}
            >
                <Check size={18} />
                {isCompletedToday ? 'Completed Today' : isProcessing ? 'Processing...' : 'Mark Complete'}
            </motion.button>
        </motion.div>
    );
};

export default HabitCard;
