import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <MainLayout>
            <Head title="Contact & Support Desk • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Customer Support & Inquiries</span>
                    <h1 className="text-4xl sm:text-5xl font-black font-heading uppercase text-white tracking-wider">
                        Get In Touch
                    </h1>
                    <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Have questions regarding tournament matchmaking, account security, billing invoices, or game partnerships? Our team is here to assist.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Details */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">Official Support Email</span>
                                    <p className="text-sm font-bold text-white">
                                        <a href="mailto:info@crystalbrawlers.com" className="text-cyan-400 hover:underline">
                                            info@crystalbrawlers.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">Corporate Headquarters</span>
                                    <p className="text-xs font-bold text-slate-300">
                                        Crystal Brawlers Interactive Ltd.<br />
                                        Tower 4, Fintech Square, Level 8
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">Community Hub</span>
                                    <p className="text-xs font-bold text-purple-300">
                                        Discord 24/7 Community Gladiator Guild
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        {submitted ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black font-heading uppercase text-white">Message Dispatched!</h3>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    Thank you for reaching out. A confirmation has been sent from <span className="text-cyan-400">info@crystalbrawlers.com</span>. Our support specialists will respond within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-lg font-black font-heading uppercase text-white">Send Us A Message</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="Arthur Pendelton"
                                            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1">Your Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="player@crystalbrawlers.com"
                                            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        placeholder="Order Inquiry / Account Question"
                                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Describe your inquiry..."
                                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-extrabold text-xs uppercase tracking-wider glow-cyan transition font-heading flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Send Inquiry
                                </button>
                            </form>
                        )}
                    </div>

                </div>

            </div>
        </MainLayout>
    );
}
