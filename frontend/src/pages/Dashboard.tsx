import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { habitService } from '../services/habitService';
import DashboardNav from '../components/DashboardNav';
import DashboardStats from '../components/DashboardStats';
import HabitsGrid from '../components/HabitsGrid';
import CreateHabitModal from '../components/CreateHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ProgressChart from '../components/ProgressChart';
import AchievementUnlocked from '../components/AchievementUnlocked';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import type { Habit, CreateHabitData, UpdateHabitData, UnlockedAchievement } from '../types';

const Dashboard: React.FC = () => {
    const { user, logout, token, updateUser } = useAuth();
    const navigate = useNavigate();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [processingHabitId, setProcessingHabitId] = useState<string | null>(null);
    const [unlockedAchievement, setUnlockedAchievement] = useState<UnlockedAchievement | null>(null);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        if (!token) return;

        try {
            const response = await habitService.getHabits(token);
            setHabits(response.habits || []);
            // Update user points in auth context if available
            if (response.userPoints !== undefined) {
                updateUser({ points: response.userPoints });
            }
        } catch (error) {
            console.error('Error fetching habits:', error);
            toast.error('Failed to load habits');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateHabit = async (habitData: CreateHabitData) => {
        if (!token) return;

        setIsCreating(true);
        try {
            const response = await habitService.createHabit(token, habitData);
            toast.success('Habit created successfully', {
                style: { background: '#1e293b', color: '#fff' },
            });
            setIsModalOpen(false);
            fetchHabits();

            // Show achievement unlock if any
            if (response.newAchievements && response.newAchievements.length > 0) {
                // Show first achievement (can be enhanced to queue multiple)
                setUnlockedAchievement(response.newAchievements[0]);
                // Update points
                const bonusPoints = response.newAchievements.reduce((sum, a) => sum + a.pointsAwarded, 0);
                updateUser({ points: (user?.points || 0) + bonusPoints });
            }
        } catch (error) {
            console.error('Error creating habit:', error);
            toast.error('Failed to create habit');
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditHabit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsEditModalOpen(true);
    };

    const handleUpdateHabit = async (id: string, habitData: UpdateHabitData) => {
        if (!token) return;

        setIsUpdating(true);
        try {
            await habitService.updateHabit(token, id, habitData);
            toast.success('Habit updated successfully', {
                style: { background: '#1e293b', color: '#fff' },
            });
            setIsEditModalOpen(false);
            setEditingHabit(null);
            fetchHabits();
        } catch (error) {
            console.error('Error updating habit:', error);
            toast.error('Failed to update habit');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCheckIn = async (id: string, note?: string) => {
        if (!token) return;

        setProcessingHabitId(id);
        try {
            const response = await habitService.logHabit(token, id, note);
            // Update user points if available in response
            if (response.userPoints !== undefined) {
                updateUser({ points: response.userPoints });
            }
            toast.success('+10 points earned!', {
                icon: '🎯',
                style: { background: '#1e293b', color: '#fff' },
            });
            fetchHabits();

            // Show achievement unlock if any
            if (response.newAchievements && response.newAchievements.length > 0) {
                // Show first achievement with a small delay to let check-in complete
                setTimeout(() => {
                    setUnlockedAchievement(response.newAchievements![0]);
                }, 500);
            }
        } catch (error) {
            console.error('Error checking in:', error);
            toast.error('Failed to check in');
        } finally {
            setProcessingHabitId(null);
        }
    };

    const handleDelete = (id: string) => {
        setHabitToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!habitToDelete || !token) return;

        setIsDeleting(true);
        try {
            await habitService.deleteHabit(token, habitToDelete);
            toast.success('Habit deleted successfully');
            fetchHabits();
            setIsConfirmDeleteOpen(false);
            setHabitToDelete(null);
        } catch (error) {
            console.error('Error deleting habit:', error);
            toast.error('Failed to delete habit');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const totalCompletions = habits.reduce((sum, habit) => sum + habit.logs.length, 0);
    const todayCompletions = habits.filter(habit =>
        habit.logs.some(log => {
            const logDate = new Date(log.date).toDateString();
            return logDate === new Date().toDateString();
        })
    ).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            <Toaster position="top-right" />

            {/* Top Navigation */}
            <DashboardNav
                onNewHabit={() => setIsModalOpen(true)}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="mb-2 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                        Welcome back, <span className="text-gradient-primary">{user?.name || 'User'}</span>
                    </h2>
                    <p className="text-slate-600">Here's your progress at a glance</p>
                </motion.div>

                {/* Stats Grid */}
                <DashboardStats
                    userPoints={user?.points || 0}
                    habitsCount={habits.length}
                    todayCompletions={todayCompletions}
                    totalCompletions={totalCompletions}
                />

                {/* Progress Chart */}
                {habits.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <ProgressChart habits={habits} />
                    </motion.div>
                )}

                {/* Habits Section */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">Your Habits</h3>
                        <span className="text-sm text-slate-600">{habits.length} total</span>
                    </div>

                    <HabitsGrid
                        habits={habits}
                        isLoading={isLoading}
                        onCheckIn={handleCheckIn}
                        onEdit={handleEditHabit}
                        onDelete={handleDelete}
                        processingHabitId={processingHabitId}
                        onCreateHabit={() => setIsModalOpen(true)}
                    />
                </div>
            </div>

            <CreateHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateHabit}
                isLoading={isCreating}
            />

            <EditHabitModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingHabit(null);
                }}
                onUpdate={handleUpdateHabit}
                habit={editingHabit}
                isLoading={isUpdating}
            />

            <ConfirmDialog
                isOpen={isConfirmDeleteOpen}
                onClose={() => {
                    setIsConfirmDeleteOpen(false);
                    setHabitToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Habit"
                message="Are you sure you want to delete this habit? This action cannot be undone and all progress will be lost."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
                type="danger"
            />

            {/* Achievement Unlock Modal */}
            <AchievementUnlocked
                achievement={unlockedAchievement}
                onClose={() => setUnlockedAchievement(null)}
            />
        </div>
    );
};

export default Dashboard;
