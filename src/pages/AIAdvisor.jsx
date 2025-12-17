import React, { useState } from 'react';
import { Bot, User, Send, Sparkles } from 'lucide-react';

const AIAdvisor = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I am your personal financial advisor. I notice you spent 15% more on food this week. Would you like some tips on budgeting for meals?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages([...messages, { id: Date.now(), sender: 'user', text: input }]);
        setInput('');

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: "That's a great goal. Based on your current allowance, I suggest setting aside $50/week. I can help you set up an auto-save rule if you'd like!"
            }]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    AI Advisor <Sparkles className="text-indigo-500" />
                </h2>
                <p className="text-slate-500 mt-1">Get personalized financial advice powered by AI.</p>
            </div>

            <div className="flex-1 card flex flex-col p-0 overflow-hidden bg-white border border-slate-200">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'bot'
                                    ? 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                                    : 'bg-indigo-600 text-white rounded-tr-none'
                                }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            placeholder="Ask me anything about money..."
                            className="w-full pl-6 pr-14 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisor;
