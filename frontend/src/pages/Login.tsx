import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.login(email, password);
            login(response.token, response.refreshToken, response.user);
            toast.success('Welcome back!', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                },
            });
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed', {
                style: {
                    background: '#ef4444',
                    color: '#fff',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-right" />

            {/* Left side - Branding */}
            <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 lg:flex lg:flex-col lg:justify-between">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-['Space_Grotesk'] text-2xl font-bold text-white">HabitFlow</span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="mb-6 font-['Space_Grotesk'] text-5xl font-bold leading-tight text-white">
                            Build Better Habits, One Day at a Time
                        </h1>
                        <p className="text-lg leading-relaxed text-slate-300">
                            Track your progress, earn rewards, and transform your life with our intelligent habit tracking system.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                            Welcome Back
                        </h2>
                        <p className="text-slate-600">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                    type="email"
                                    id="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-sky-600 transition-colors hover:text-sky-700">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
