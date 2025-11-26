import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    type = 'danger'
}) => {
    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const iconColors = {
        danger: 'bg-red-100 text-red-600',
        warning: 'bg-amber-100 text-amber-600',
        info: 'bg-blue-100 text-blue-600'
    };

    const buttonColors = {
        danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/40',
        warning: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-amber-500/40',
        info: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-blue-500/40'
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                            className="glass-card w-full max-w-md rounded-2xl p-6 shadow-premium-lg"
                        >
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColors[type]}`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                                            {title}
                                        </h2>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {message}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="btn-secondary flex-1 rounded-xl px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {cancelText}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60 ${buttonColors[type]}`}
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
