import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Award, Users, Shield, Smartphone, ArrowLeft } from 'lucide-react';

const About: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Target,
            title: 'Smart Habit Tracking',
            description: 'Create and track daily or weekly habits with an intuitive interface.',
            color: 'from-sky-400 to-blue-500'
        },
        {
            icon: Award,
            title: 'Gamification System',
            description: 'Earn points for completing habits and unlock achievements.',
            color: 'from-amber-400 to-orange-500'
        },
        {
            icon: TrendingUp,
            title: 'Progress Visualization',
            description: 'Beautiful charts and stats to monitor your improvement over time.',
            color: 'from-emerald-400 to-green-500'
        },
        {
            icon: Zap,
            title: 'Real-time Updates',
            description: 'Instant feedback and notifications keep you motivated.',
            color: 'from-violet-400 to-purple-500'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is encrypted and protected with industry-standard security.',
            color: 'from-rose-400 to-pink-500'
        },
        {
            icon: Smartphone,
            title: 'Responsive Design',
            description: 'Access your habits on any device with our mobile-friendly interface.',
            color: 'from-cyan-400 to-teal-500'
        }
    ];

    const stats = [
        { label: 'Active Users', value: '10K+' },
        { label: 'Habits Tracked', value: '50K+' },
        { label: 'Success Rate', value: '95%' },
        { label: 'Daily Active', value: '5K+' }
    ];

    const techStack = [
        { category: 'Frontend', items: ['React 19', 'TypeScript', 'TailwindCSS', 'Framer Motion'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'Prisma', 'SQLite'] },
        { category: 'Tools', items: ['Git', 'Vite', 'JWT Auth', 'Recharts'] }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white/50 hover:text-slate-900"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                    >
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg">
                                <TrendingUp className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="mb-4 font-['Space_Grotesk'] text-5xl font-bold text-slate-900">
                            Welcome to <span className="text-gradient-primary">HabitFlow</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl text-slate-600">
                            Your intelligent companion for building better habits and achieving your goals through
                            gamification and data-driven insights.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card rounded-2xl p-6 text-center shadow-premium">
                                <div className="mb-2 font-['Space_Grotesk'] text-4xl font-bold text-gradient-primary">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-semibold text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                            Powerful Features
                        </h2>
                        <p className="text-slate-600">Everything you need to build and maintain healthy habits</p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -4 }}
                                className="glass-card card-hover rounded-2xl p-6"
                            >
                                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-2 font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                            Built With Modern Technologies
                        </h2>
                        <p className="text-slate-600">Leveraging the latest and greatest in web development</p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {techStack.map((stack, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                className="glass-card rounded-2xl p-6 shadow-premium"
                            >
                                <h3 className="mb-4 font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                                    {stack.category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {stack.items.map((item, i) => (
                                        <span
                                            key={i}
                                            className="rounded-lg bg-gradient-to-r from-sky-50 to-indigo-50 px-3 py-1.5 text-sm font-semibold text-sky-700"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card rounded-2xl p-12 text-center shadow-premium-lg"
                    >
                        <div className="mb-6 flex justify-center">
                            <Users className="h-12 w-12 text-sky-600" />
                        </div>
                        <h2 className="mb-4 font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
                            Our Mission
                        </h2>
                        <p className="mb-6 text-lg leading-relaxed text-slate-600">
                            We believe that small, consistent actions lead to extraordinary results. HabitFlow was created
                            to make habit tracking enjoyable, insightful, and effective. Our goal is to help you build
                            the life you want, one habit at a time.
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="text-center">
                                <div className="mb-1 text-2xl">🚀</div>
                                <div className="text-xs font-semibold text-slate-600">Continuous Growth</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-2xl">💡</div>
                                <div className="text-xs font-semibold text-slate-600">Data-Driven Insights</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-2xl">🎯</div>
                                <div className="text-xs font-semibold text-slate-600">Goal Achievement</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 px-6 py-8">
                <div className="mx-auto max-w-6xl text-center">
                    <p className="text-sm text-slate-600">
                        Built with ❤️ as a portfolio project showcasing modern full-stack development
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        © 2025 HabitFlow. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default About;
