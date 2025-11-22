import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                name,
                email,
                password,
            });
            login(response.data.token, response.data.user);
            toast.success('Account created successfully!', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                },
            });
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed', {
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
                            Start Your Journey to Excellence
                        </h1>
                        <p className="text-lg leading-relaxed text-slate-300">
                            Join thousands of users who have transformed their lives through consistent habit tracking and goal achievement.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20">
                            <div className="h-2 w-2 rounded-full bg-sky-400"></div>
                        </div>
                        <p className="text-slate-300">Track unlimited habits</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                            <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                        </div>
                        <p className="text-slate-300">Visualize your progress</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                        </div>
                        <p className="text-slate-300">Earn rewards and badges</p>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Register Form */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                            Create Account
                        </h2>
                        <p className="text-slate-600">Get started with HabitFlow today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-sky-600 transition-colors hover:text-sky-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
