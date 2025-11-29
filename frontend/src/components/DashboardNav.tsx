import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, LogOut, TrendingUp, Home, User, Info, Settings } from 'lucide-react';

interface DashboardNavProps {
    onNewHabit: () => void;
    onLogout: () => void;
    currentPage?: string;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ onNewHabit, onLogout, currentPage = 'dashboard' }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        { id: 'about', label: 'About', icon: Info, path: '/about' },
    ];

    return (
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
                            onClick={onNewHabit}
                            className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">New Habit</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            className="btn-secondary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardNav;
