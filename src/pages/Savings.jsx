import React, { useState } from 'react';
import { useFinances } from '../context/FinancesContext';
import { PiggyBank, Target, Plus } from 'lucide-react';

const Savings = () => {
    const { savings } = useFinances();
    const [goals, setGoals] = useState([
        { id: 1, title: 'New Laptop', target: 2000, current: 850, color: 'bg-blue-500' },
        { id: 2, title: 'Summer Trip', target: 1500, current: 350, color: 'bg-pink-500' },
        { id: 3, title: 'Emergency Fund', target: 1000, current: 1000, color: 'bg-emerald-500', completed: true },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalTitle || !newGoalTarget) return;

        setGoals([...goals, {
            id: Date.now(),
            title: newGoalTitle,
            target: Number(newGoalTarget),
            current: 0,
            color: 'bg-indigo-500'
        }]);
        setIsAdding(false);
        setNewGoalTitle('');
        setNewGoalTarget('');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Savings Goals</h2>
                    <p className="text-slate-500 mt-1">Set goals and watch your money grow.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary"
                >
                    <Plus size={18} className="mr-2" /> New Goal
                </button>
            </div>

            <div className="card bg-cyan-900 text-white border-none overflow-hidden relative">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-cyan-200 mb-1">Total Saved</p>
                        <h3 className="text-4xl font-bold">${savings.toFixed(2)}</h3>
                    </div>
                    <PiggyBank size={64} className="text-cyan-400 opacity-50" />
                </div>
            </div>

            {isAdding && (
                <div className="card animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold mb-4">Create New Goal</h3>
                    <form onSubmit={handleAddGoal} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700">Goal Name</label>
                            <input
                                value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg" placeholder="e.g. Car"
                            />
                        </div>
                        <div className="w-32">
                            <label className="text-sm font-medium text-slate-700">Target ($)</label>
                            <input
                                type="number"
                                value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg" placeholder="1000"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary h-[42px]">Create</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <div key={goal.id} className={`card border-l-4 ${goal.completed ? 'border-emerald-500' : 'border-indigo-500'}`}>
                        <div className="flex justify-between mb-4">
                            <div className="font-bold text-lg text-slate-800">{goal.title}</div>
                            {goal.completed && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">Completed</span>}
                        </div>

                        <div className="space-y-1 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">${goal.current} saved</span>
                                <span className="font-medium text-slate-700">Target: ${goal.target}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${goal.color}`}
                                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            Add Money
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Savings;
