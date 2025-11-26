import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ProgressChart from '../components/ProgressChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, LogOut, TrendingUp, Target, Zap, Award, LayoutGrid, User, Info, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import type { Habit, CreateHabitData, UpdateHabitData } from '../types';

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
    const [currentPage, setCurrentPage] = useState('dashboard');

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/habits', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHabits(response.data.habits || response.data);
            // Update user points in auth context if available
            if (response.data.userPoints !== undefined) {
                updateUser({ points: response.data.userPoints });
            }
        } catch (error) {
            console.error('Error fetching habits:', error);
            toast.error('Failed to load habits');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateHabit = async (habitData: CreateHabitData) => {
        setIsCreating(true);
        try {
            await axios.post('http://localhost:3000/api/habits', habitData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Habit created successfully', {
                style: { background: '#1e293b', color: '#fff' },
            });
            setIsModalOpen(false);
            fetchHabits();
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
        setIsUpdating(true);
        try {
            await axios.put(`http://localhost:3000/api/habits/${id}`, habitData, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    const handleCheckIn = async (id: string) => {
        setProcessingHabitId(id);
        try {
            const response = await axios.post(`http://localhost:3000/api/habits/${id}/log`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Update user points if available in response
            if (response.data.userPoints !== undefined) {
                updateUser({ points: response.data.userPoints });
            }
            toast.success('+10 points earned!', {
                icon: '🎯',
                style: { background: '#1e293b', color: '#fff' },
            });
            fetchHabits();
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
        if (!habitToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:3000/api/habits/${habitToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
        { id: 'about', label: 'About', icon: Info, path: '/about' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            <Toaster position="top-right" />

            {/* Top Navigation */}
            <div className="glass-panel sticky top-0 z-40 border-b border-slate-200/50">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">HabitFlow</h1>
                                    <p className="text-xs text-slate-600">Dashboard</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="hidden items-center gap-2 md:flex">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${currentPage === item.id
                                            ? 'bg-sky-50 text-sky-700'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">New Habit</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="btn-secondary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

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
                        <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{user?.points || 0}</div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <div className="mb-1 text-sm font-semibold text-slate-600">Active Habits</div>
                        <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{habits.length}</div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div className="mb-1 text-sm font-semibold text-slate-600">Today's Progress</div>
                        <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{todayCompletions}/{habits.length}</div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500">
                            <LayoutGrid className="h-6 w-6 text-white" />
                        </div>
                        <div className="mb-1 text-sm font-semibold text-slate-600">Total Check-ins</div>
                        <div className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">{totalCompletions}</div>
                    </div>
                </motion.div>

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

                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : habits.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onCheckIn={handleCheckIn}
                                    onEdit={handleEditHabit}
                                    onDelete={handleDelete}
                                    isProcessing={processingHabitId === habit.id}
                                />
                            ))}
                        </motion.div>
                    ) : (
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
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3"
                            >
                                <Plus size={20} />
                                Create Your First Habit
                            </motion.button>
                        </motion.div>
                    )}
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
        </div>
    );
};

export default Dashboard;
