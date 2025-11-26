import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit, UpdateHabitData } from '../types';

interface EditHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, habit: UpdateHabitData) => void;
    habit: Habit | null;
    isLoading?: boolean;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ isOpen, onClose, onUpdate, habit, isLoading = false }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('daily');

    useEffect(() => {
        if (habit) {
            setTitle(habit.title);
            setDescription(habit.description || '');
            setFrequency(habit.frequency);
        }
    }, [habit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !habit) return;
        onUpdate(habit.id, { title, description, frequency });
    };

    return (
        <AnimatePresence>
            {isOpen && habit && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="glass-card w-full max-w-lg rounded-2xl p-6 shadow-premium-lg"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">Edit Habit</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="edit-title">
                                        Habit Name
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                        type="text"
                                        id="edit-title"
                                        placeholder="e.g., Morning meditation"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="edit-description">
                                        Description <span className="font-normal text-slate-400">(Optional)</span>
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                        id="edit-description"
                                        rows={3}
                                        placeholder="Why is this habit important to you?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="edit-frequency">
                                        Frequency
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                        id="edit-frequency"
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="button"
                                        onClick={onClose}
                                        className="btn-secondary flex-1 rounded-xl px-6 py-3"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: isLoading ? 1 : 1.01 }}
                                        whileTap={{ scale: isLoading ? 1 : 0.99 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-primary flex-1 rounded-xl px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isLoading ? 'Updating...' : 'Update Habit'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditHabitModal;
