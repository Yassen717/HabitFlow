import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface Habit {
    id: string;
    title: string;
    logs: any[];
}

interface ProgressChartProps {
    habits: Habit[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ habits }) => {
    const data = habits.map((habit) => ({
        name: habit.title.length > 12 ? habit.title.substring(0, 12) + '...' : habit.title,
        completions: habit.logs.length,
    }));

    const colors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7', '#06b6d4'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload[0]) {
            return (
                <div className="glass-card rounded-lg px-4 py-2 shadow-lg">
                    <p className="text-sm font-semibold text-slate-900">{payload[0].payload.name}</p>
                    <p className="text-xs text-slate-600">
                        {payload[0].value} check-in{payload[0].value !== 1 ? 's' : ''}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card rounded-2xl p-6 shadow-premium">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
                        <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">Progress Overview</h3>
                        <p className="text-sm text-slate-600">Your habit completion statistics</p>
                    </div>
                </div>
            </div>

            {data.length > 0 ? (
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                fontWeight={500}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                fontWeight={500}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                            <Bar dataKey="completions" radius={[8, 8, 0, 0]} maxBarSize={60}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex h-80 items-center justify-center">
                    <p className="text-slate-400">Create habits to visualize your progress</p>
                </div>
            )}
        </div>
    );
};

export default ProgressChart;
