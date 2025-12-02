import React, { useState } from 'react';
import { Check, Trash2, Calendar, TrendingUp, Pencil, StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit } from '../types';

interface HabitCardProps {
    habit: Habit;
    onCheckIn: (id: string, note?: string) => void;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    isProcessing?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onCheckIn, onEdit, onDelete, isProcessing = false }) => {
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [note, setNote] = useState('');
    const [showNotesHistory, setShowNotesHistory] = useState(false);

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

    // Get notes with content (most recent first)
    const notesWithContent = habit.logs
        .filter(log => log.note && log.note.trim())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const handleSubmitCheckIn = () => {
        onCheckIn(habit.id, note.trim() || undefined);
        setNote('');
        setShowNoteInput(false);
    };

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

                {notesWithContent.length > 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5">
                        <StickyNote size={14} className="text-purple-600" />
                        <span className="text-xs font-semibold text-purple-700">{notesWithContent.length} notes</span>
                    </div>
                )}
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

            {/* Check-in Section */}
            {!isCompletedToday && !isProcessing && (
                <AnimatePresence>
                    {showNoteInput ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 overflow-hidden"
                        >
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note about today's completion... (optional)"
                                maxLength={500}
                                rows={3}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                <span>{note.length}/500 characters</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowNoteInput(false);
                                            setNote('');
                                        }}
                                        className="px-3 py-1 text-slate-600 hover:text-slate-900"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            )}

            {/* Action Button */}
            <motion.button
                whileHover={{ scale: isCompletedToday || isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isCompletedToday || isProcessing ? 1 : 0.98 }}
                onClick={() => {
                    if (isCompletedToday || isProcessing) return;
                    if (showNoteInput) {
                        handleSubmitCheckIn();
                    } else {
                        setShowNoteInput(true);
                    }
                }}
                disabled={isCompletedToday || isProcessing}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${isCompletedToday
                    ? 'cursor-not-allowed bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                    : isProcessing
                        ? 'cursor-wait opacity-60 btn-primary'
                        : 'btn-primary'
                    }`}
            >
                <Check size={18} />
                {isCompletedToday ? 'Completed Today' : isProcessing ? 'Processing...' : showNoteInput ? 'Submit' : 'Mark Complete'}
            </motion.button>

            {/* Notes History */}
            {notesWithContent.length > 0 && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                    <button
                        onClick={() => setShowNotesHistory(!showNotesHistory)}
                        className="mb-2 flex w-full items-center justify-between text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                        <span>Recent Notes ({notesWithContent.length})</span>
                        {showNotesHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <AnimatePresence>
                        {showNotesHistory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {notesWithContent.map((log, index) => (
                                    <div key={log.id || index} className="rounded-lg bg-slate-50 p-3">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">
                                                {new Date(log.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700">{log.note}</p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default HabitCard;
