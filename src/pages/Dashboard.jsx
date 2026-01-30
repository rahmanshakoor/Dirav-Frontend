import React, { useState } from 'react';
import { useFinances } from '../context/FinancesContext';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, Tag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { balance, savings, monthlyAllowance, transactions } = useFinances();
    const [activePromo, setActivePromo] = useState(0);

    const featuredPromos = [
        { id: 1, title: 'Back to School Tech', discount: '40% OFF', provider: 'ElectroWorld', color: 'from-blue-600 to-blue-700', icon: Tag },
        { id: 2, title: 'Summer Travel Pass', discount: '$200 Grant', provider: 'GlobalRail', color: 'from-pink-500 to-rose-500', icon: Sparkles },
        { id: 3, title: 'Campus Meal Plan', discount: 'Buy 1 Get 1', provider: 'UniFoods', color: 'from-cyan-500 to-teal-500', icon: Tag },
    ];

    return (
        <div className="space-y-8 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        Welcome back, Student
                    </h2>
                    <p className="text-slate-500 mt-1">Here's your financial pulse.</p>
                </div>
                <Link to="/opportunities" className="hidden md:flex text-blue-600 font-medium hover:underline">
                    View all opportunities &rarr;
                </Link>
            </div>

            {/* Featured Opportunities - Biggest Ratio */}
            <div className="relative overflow-hidden rounded-3xl shadow-lg h-64 md:h-80">
                {featuredPromos.map((promo, index) => (
                    <div
                        key={promo.id}
                        className={`absolute inset-0 bg-gradient-to-br ${promo.color} p-6 md:p-10 text-white flex flex-col justify-center transition-opacity duration-500 ${index === activePromo ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12">
                            <promo.icon size={180} />
                        </div>

                        <div className="relative z-10 max-w-lg">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4">
                                Featured Opportunity
                            </span>
                            <h3 className="text-4xl md:text-5xl font-black mb-2 leading-tight">
                                {promo.discount}
                            </h3>
                            <p className="text-xl md:text-2xl font-light opacity-90 mb-8">
                                at {promo.provider} - {promo.title}
                            </p>
                            <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
                                Claim Now
                            </button>
                        </div>
                    </div>
                ))}

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-6 md:left-10 z-20 flex gap-2">
                    {featuredPromos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActivePromo(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === activePromo ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="md:hidden text-center">
                <Link to="/opportunities" className="text-blue-600 font-medium hover:underline">
                    See all 15+ student discounts &rarr;
                </Link>
            </div>

            {/* Summary Cards */}
            <h3 className="text-xl font-bold text-slate-800">Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="card text-slate-800 bg-white border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Total Balance</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900">${balance.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                        <TrendingUp size={16} />
                        <span>+12% vs last month</span>
                    </div>
                </div>

                {/* Savings Card */}
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Total Savings</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900">${savings.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                            <ArrowUpRight size={24} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Goal Progress</span>
                            <span>65%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Monthly Budget Card */}
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Monthly Allowance</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900">${monthlyAllowance.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <ArrowDownLeft size={24} />
                        </div>
                    </div>
                    <div className="flex gap-4 border-t border-slate-50 pt-3 mt-1">
                        <div className="flex-1">
                            <p className="text-xs text-slate-400">Spent</p>
                            <p className="font-semibold text-slate-700">$1,340</p>
                        </div>
                        <div className="flex-1 border-l border-slate-100 pl-4">
                            <p className="text-xs text-slate-400">Remaining</p>
                            <p className="font-semibold text-emerald-600">$1,660</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions & AI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                    </div>

                    <div className="card p-0 overflow-hidden">
                        {transactions.slice(0, 5).map((t, i) => (
                            <div key={t.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${i !== transactions.slice(0, 5).length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {t.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 truncate">{t.title}</p>
                                        <p className="text-sm text-slate-500">{t.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold whitespace-nowrap ml-2 ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Tips / Widget */}
                <div className="space-y-6">
                    <div className="card bg-slate-900 text-white border-none relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <Sparkles className="text-yellow-400" size={18} /> Daily Insight
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                "Spending on coffee has increased by 15%. Consider the Campus Cafe discount (Buy 1 Get 1)!"
                            </p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors flex-1">
                                    View Tip
                                </button>
                                <button className="px-4 py-2 bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
