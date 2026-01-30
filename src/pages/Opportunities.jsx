import React, { useState } from 'react';
import { Tag, GraduationCap, MapPin, ExternalLink, Search } from 'lucide-react';

const Opportunities = () => {
    const [filter, setFilter] = useState('all');

    const opportunities = [
        { id: 1, title: '50% Off Textbooks', provider: 'BookWorld', category: 'education', type: 'discount', location: 'Online' },
        { id: 2, title: 'STEM Future Scholarship', provider: 'TechFoundation', category: 'education', type: 'scholarship', amount: '$5,000', location: 'Global' },
        { id: 3, title: 'Free Coffee Mondays', provider: 'Campus Cafe', category: 'food', type: 'privilege', location: 'Campus Center' },
        { id: 4, title: 'Student Tech Bundle', provider: 'ElectroStore', category: 'tech', type: 'discount', location: 'In-store' },
        { id: 5, title: 'Summer Exchange Program', provider: 'Global Edu', category: 'travel', type: 'scholarship', amount: 'Funded', location: 'Europe' },
        { id: 6, title: 'Cinema Student Night', provider: 'City Movies', category: 'entertainment', type: 'discount', location: 'City Center' },
    ];

    const filtered = filter === 'all' ? opportunities : opportunities.filter(o => o.category === filter);

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'education', label: 'Education' },
        { id: 'food', label: 'Food' },
        { id: 'tech', label: 'Tech' },
        { id: 'travel', label: 'Travel' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Opportunities</h2>
                <p className="text-slate-500 mt-1">Exclusive discounts, scholarships, and privileges for you.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for discounts..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(opp => (
                    <div key={opp.id} className="card group hover:border-blue-200">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${opp.type === 'scholarship' ? 'bg-purple-100 text-purple-700' :
                                    opp.type === 'discount' ? 'bg-rose-100 text-rose-700' : 'bg-cyan-100 text-cyan-700'
                                }`}>
                                {opp.type}
                            </span>
                            <button className="text-slate-400 hover:text-blue-600">
                                <ExternalLink size={18} />
                            </button>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                            {opp.title}
                        </h3>
                        <p className="text-slate-500 text-sm mb-4">{opp.provider}</p>

                        <div className="pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-500">
                            {opp.amount && (
                                <span className="font-semibold text-emerald-600">{opp.amount}</span>
                            )}
                            <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{opp.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Opportunities;
