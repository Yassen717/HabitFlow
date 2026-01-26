import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Bell, Save, Shield, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { userService } from '../services/userService';

const Settings: React.FC = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Preferences state
    const [defaultFrequency, setDefaultFrequency] = useState<'daily' | 'weekly'>('daily');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);

    useEffect(() => {
        const loadPreferences = async () => {
            if (!token) return;
            try {
                const prefs = await userService.getPreferences(token);
                setDefaultFrequency(prefs.defaultFrequency);
                setNotificationsEnabled(prefs.notificationsEnabled);
            } catch (error) {
                console.error('Error loading preferences:', error);
            } finally {
                setIsLoadingPreferences(false);
            }
        };
        loadPreferences();
    }, [token]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) return;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        setIsChangingPassword(true);

        try {
            await userService.changePassword(token, { currentPassword, newPassword });

            toast.success('Password changed successfully!', {
                style: { background: '#1e293b', color: '#fff' },
            });

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            toast.error(errorMessage, {
                style: { background: '#dc2626', color: '#fff' },
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSavePreferences = async () => {
        if (!token) return;

        setIsSavingPreferences(true);
        try {
            await userService.updatePreferences(token, {
                defaultFrequency,
                notificationsEnabled,
            });
            toast.success('Preferences saved!', {
                style: { background: '#1e293b', color: '#fff' },
            });
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error('Failed to save preferences');
        } finally {
            setIsSavingPreferences(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6">
            <Toaster position="top-right" />

            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="mb-4">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white/50 hover:text-slate-900"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </motion.button>
                    </div>
                    <h1 className="mb-2 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                        Settings
                    </h1>
                    <p className="text-slate-600">Manage your account security and preferences</p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Account Security */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-2xl p-8 shadow-premium"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                                        Account Security
                                    </h2>
                                    <p className="text-sm text-slate-600">Change your password</p>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: isChangingPassword ? 1 : 1.02 }}
                                    whileTap={{ scale: isChangingPassword ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold disabled:cursor-wait disabled:opacity-60"
                                >
                                    <Save size={18} />
                                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* App Preferences */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-2xl p-8 shadow-premium"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                                    <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                                        App Preferences
                                    </h2>
                                    <p className="text-sm text-slate-600">Customize your experience</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Default Frequency */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Default Habit Frequency
                                    </label>
                                    <select
                                        value={defaultFrequency}
                                        onChange={(e) => setDefaultFrequency(e.target.value as 'daily' | 'weekly')}
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Default frequency for new habits
                                    </p>
                                </div>

                                {/* Notifications Toggle */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Notifications
                                        </label>
                                        <p className="text-xs text-slate-500">
                                            Receive reminders for your habits
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                        className={`relative h-8 w-14 rounded-full transition-colors ${notificationsEnabled
                                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600'
                                                : 'bg-slate-300'
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: notificationsEnabled ? 24 : 2 }}
                                            className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                                        />
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: isSavingPreferences ? 1 : 1.02 }}
                                    whileTap={{ scale: isSavingPreferences ? 1 : 0.98 }}
                                    onClick={handleSavePreferences}
                                    disabled={isSavingPreferences || isLoadingPreferences}
                                    className="btn-secondary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold disabled:cursor-wait disabled:opacity-60"
                                >
                                    <Save size={18} />
                                    {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {/* Account Actions */}
                        <div className="glass-card rounded-2xl p-6 shadow-premium">
                            <h3 className="mb-4 font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                                Account Actions
                            </h3>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100"
                            >
                                <LogOut size={18} />
                                Logout
                            </motion.button>
                        </div>

                        {/* Security Tips */}
                        <div className="glass-card rounded-2xl p-6 shadow-premium">
                            <h3 className="mb-4 font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                                Security Tips
                            </h3>
                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex gap-2">
                                    <span>🔒</span>
                                    <p>Use a strong, unique password</p>
                                </div>
                                <div className="flex gap-2">
                                    <span>🔄</span>
                                    <p>Update your password regularly</p>
                                </div>
                                <div className="flex gap-2">
                                    <span>🚫</span>
                                    <p>Never share your credentials</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
