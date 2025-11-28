import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import HabitCard from './HabitCard';
import LoadingSpinner from './LoadingSpinner';
import type { Habit } from '../types';

interface HabitsGridProps {
    habits: Habit[];
    isLoading: boolean;
    onCheckIn: (id: string) => void;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    processingHabitId: string | null;
    onCreateHabit: () => void;
}

const HabitsGrid: React.FC<HabitsGridProps> = ({
    habits,
    isLoading,
    onCheckIn,
    onEdit,
    onDelete,
    processingHabitId,
    onCreateHabit,
}) => {
    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (habits.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-12 text-center shadow-premium"
            >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600">
                    <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-3 font-['Space_Grotesk'] text-2xl font-bold text-slate-900">No habits yet</h3>
                <p className="mb-6 text-slate-600">Start building better habits today</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCreateHabit}
                    className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3"
                >
                    <Plus size={20} />
                    Create Your First Habit
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.05,
                    },
                },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
            {habits.map((habit) => (
                <HabitCard
                    key={habit.id}
                    habit={habit}
                    onCheckIn={onCheckIn}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isProcessing={processingHabitId === habit.id}
                />
            ))}
        </motion.div>
    );
};

export default HabitsGrid;
