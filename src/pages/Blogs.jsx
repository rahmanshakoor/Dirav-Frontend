import React from 'react';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

const Blogs = () => {
    const articles = [
        {
            id: 1,
            title: "How to Build a Student Budget That Actually Works",
            excerpt: "Stop wondering where your money went. Follow these 5 simple steps to take control of your student finances without sacrificing fun.",
            category: "Budgeting",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1554224155-984063584d8c?auto=format&fit=crop&q=80&w=1000",
            featured: true
        },
        {
            id: 2,
            title: "Understanding Credit Scores: A Student Guide",
            excerpt: "Your credit score matters more than you think. Learn the basics before you graduate.",
            category: "Credit",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800",
            featured: false
        },
        {
            id: 3,
            title: "Top 10 Money Saving Hacks for Campus Life",
            excerpt: "From textbooks to meal plans, discover the hidden ways to save thousands during your degree.",
            category: "Lifestyle",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
            featured: false
        },
        {
            id: 4,
            title: "Investing 101: Starting Small",
            excerpt: "You don't need to be rich to start investing. local micro-investing apps explained.",
            category: "Investing",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800",
            featured: false
        }
    ];

    return (
        <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Financial Literacy Hub</h2>
                <p className="text-lg text-slate-500">Master your money with our curated guides and articles designed specifically for students.</p>
            </div>

            {/* Featured Article */}
            {articles.filter(a => a.featured).map(article => (
                <div key={article.id} className="card p-0 overflow-hidden group cursor-pointer border-none shadow-lg">
                    <div className="grid md:grid-cols-2">
                        <div className="h-64 md:h-auto overflow-hidden">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-sm text-indigo-600 font-medium mb-4">
                                <span className="bg-indigo-50 px-3 py-1 rounded-full">{article.category}</span>
                                <span className="flex items-center gap-1 text-slate-400"><Clock size={16} /> {article.readTime}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                {article.excerpt}
                            </p>
                            <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                                Read Article <ArrowRight size={20} className="ml-2" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.filter(a => !a.featured).map(article => (
                    <div key={article.id} className="card p-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="h-48 overflow-hidden">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 text-xs text-indigo-600 font-medium mb-3">
                                <span className="bg-indigo-50 px-2 py-1 rounded-md">{article.category}</span>
                                <span className="text-slate-400">{article.readTime}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-3">
                                {article.excerpt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;
