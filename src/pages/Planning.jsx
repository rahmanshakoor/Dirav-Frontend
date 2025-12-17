import React, { useState } from 'react';
import { useFinances } from '../context/FinancesContext';
import { PlusCircle, MinusCircle, Check } from 'lucide-react';

const Planning = () => {
    const { monthlyAllowance, addTransaction, transactions } = useFinances();
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('expense'); // 'income' or 'expense'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !title) return;

        addTransaction({
            title,
            amount: parseFloat(amount),
            type,
            date: new Date().toISOString().split('T')[0]
        });

        setAmount('');
        setTitle('');
    };

    const totalSpent = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(new Date().toISOString().slice(0, 7))) // rough current month filter
        .reduce((acc, curr) => acc + curr.amount, 0);

    const progress = Math.min((totalSpent / monthlyAllowance) * 100, 100);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Budget Planning</h2>
                <p className="text-slate-500 mt-1">Manage your allowance and track your spending manually.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Monthly Budget Tracker */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Allowance</h3>

                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-indigo-600">${monthlyAllowance.toFixed(2)}</span>
                        <span className="text-slate-400 mb-1">/ month</span>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Spent (${totalSpent.toFixed(2)})</span>
                            <span>Remaining (${(monthlyAllowance - totalSpent).toFixed(2)})</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${progress > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        {progress > 90 && (
                            <p className="text-xs text-rose-500 font-medium mt-1">Warning: You are approaching your budget limit!</p>
                        )}
                    </div>
                </div>

                {/* Add Transaction Form */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Add Transaction</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Grocery, Freelance"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                type="button"
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg border ${type === 'expense' ? 'bg-rose-50 border-rose-200 text-rose-600 font-medium shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                onClick={() => setType('expense')}
                            >
                                <MinusCircle size={18} /> Expense
                            </button>
                            <button
                                type="button"
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg border ${type === 'income' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 font-medium shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                onClick={() => setType('income')}
                            >
                                <PlusCircle size={18} /> Income
                            </button>
                        </div>

                        <button type="submit" className="w-full btn btn-primary mt-4 py-3">
                            Add Transaction
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Planning;
