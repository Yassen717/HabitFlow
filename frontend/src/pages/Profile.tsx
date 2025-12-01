import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Award, Calendar, Edit2, Save, X, ArrowLeft, Trophy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { userService } from '../services/userService';
import { achievementService } from '../services/achievementService';
import AchievementBadge from '../components/AchievementBadge';
import type { UpdateProfileData, Achievement, UserAchievement } from '../types';

const Profile: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [achievementsLoading, setAchievementsLoading] = useState(true);

    const handleSave = async () => {
        if (!token) return;

        // Validation
        if (!name.trim() && !email.trim()) {
            toast.error('Please fill in at least one field');
            return;
        }

        if (name === user?.name && email === user?.email) {
            toast.error('No changes to save');
            return;
        }

        setIsLoading(true);

        try {
            const updateData: UpdateProfileData = {};
            if (name !== user?.name) updateData.name = name;
            if (email !== user?.email) updateData.email = email;

            const response = await userService.updateProfile(token, updateData);

            // Update the user in AuthContext
            updateUser(response.user);

            toast.success('Profile updated successfully!', {
                style: { background: '#1e293b', color: '#fff' },
            });
            setIsEditing(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage, {
                style: { background: '#dc2626', color: '#fff' },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setIsEditing(false);
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
        : new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

    // Fetch achievements on mount
    useEffect(() => {
        const fetchAchievements = async () => {
            if (!token) return;
            try {
                const [allAchievements, userAchs] = await Promise.all([
                    achievementService.getAchievements(),
                    achievementService.getUserAchievements(token),
                ]);
                setAchievements(allAchievements);
                setUserAchievements(userAchs);
            } catch (error) {
                console.error('Error fetching achievements:', error);
            } finally {
                setAchievementsLoading(false);
            }
        };
        fetchAchievements();
    }, [token]);

    const unlockedKeys = new Set(userAchievements.map(ua => ua.achievementKey));
    const unlockedCount = userAchievements.length;

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
                        Profile Settings
                    </h1>
                    <p className="text-slate-600">Manage your account information and preferences</p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-card rounded-2xl p-8 shadow-premium">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                                    Personal Information
                                </h2>
                                {!isEditing ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        className="btn-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
                                    >
                                        <Edit2 size={16} />
                                        Edit Profile
                                    </motion.button>
                                ) : (
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: isLoading ? 1 : 1.05 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.95 }}
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-wait"
                                        >
                                            <Save size={16} />
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </motion.button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-3xl font-bold text-white">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-['Space_Grotesk'] text-2xl font-bold text-slate-900">
                                            {user?.name || 'User'}
                                        </h3>
                                        <p className="text-sm text-slate-600">Member since {memberSince}</p>
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full rounded-xl border-2 bg-white py-3 pl-12 pr-4 text-slate-900 transition-all ${isEditing
                                                ? 'border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10'
                                                : 'border-slate-100 bg-slate-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full rounded-xl border-2 bg-white py-3 pl-12 pr-4 text-slate-900 transition-all ${isEditing
                                                ? 'border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10'
                                                : 'border-slate-100 bg-slate-50 cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Points Card */}
                        <div className="glass-card rounded-2xl p-6 shadow-premium">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <div className="mb-1 text-sm font-semibold text-slate-600">Total Points</div>
                            <div className="font-['Space_Grotesk'] text-4xl font-bold text-slate-900">
                                {user?.points || 0}
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Keep building those habits! 🎯</p>
                        </div>

                        {/* Membership Card */}
                        <div className="glass-card rounded-2xl p-6 shadow-premium">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="mb-1 text-sm font-semibold text-slate-600">Member Since</div>
                            <div className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                                {memberSince}
                            </div>
                        </div>

                        {/* Achievements Card */}
                        <div className="glass-card rounded-2xl p-6 shadow-premium">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                                        Achievements
                                    </h3>
                                </div>
                                <span className="text-sm font-semibold text-sky-600">
                                    {unlockedCount}/{achievements.length}
                                </span>
                            </div>

                            {achievementsLoading ? (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    Loading achievements...
                                </div>
                            ) : achievements.length > 0 ? (
                                <div className="grid grid-cols-4 gap-3">
                                    {achievements.slice(0, 8).map((achievement) => {
                                        const userAch = userAchievements.find(
                                            (ua) => ua.achievementKey === achievement.key
                                        );
                                        return (
                                            <AchievementBadge
                                                key={achievement.id}
                                                achievement={achievement}
                                                isUnlocked={unlockedKeys.has(achievement.key)}
                                                size="md"
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    No achievements yet. Start completing habits!
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
