import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Shield, Sparkles, Cpu, Globe, Users, Trophy } from 'lucide-react';

export default function About() {
    return (
        <MainLayout>
            <Head title="About Us • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">About The Project</span>
                    <h1 className="text-4xl sm:text-5xl font-display text-white tracking-wider text-outline-sm">
                        Reinventing Fast-Paced Browser Gaming
                    </h1>
                    <p className="text-sm text-violet-100/60 max-w-2xl mx-auto leading-relaxed">
                        Crystal Brawlers was born out of a desire to create a zero-install, instant-action 2D fantasy combat experience with competitive netcode and deep RPG progression.
                    </p>
                </div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="toon-card p-6 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-display text-white">Sub-50ms Netcode</h3>
                        <p className="text-xs text-violet-100/60 leading-relaxed">
                            Built with custom 30 TPS Node.js WebSocket server architecture, providing crisp authoritative hitboxes, instant attack feedback, and smooth position synchronization.
                        </p>
                    </div>

                    <div className="toon-card p-6 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-display text-white">Fair & Rewarding</h3>
                        <p className="text-xs text-violet-100/60 leading-relaxed">
                            Every coin earned in battle can be reinvested into permanent attribute upgrades or exclusive cosmetic skins. Pure skill and strategy dictate arena dominance.
                        </p>
                    </div>

                    <div className="toon-card p-6 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-display text-white">Secure Financial Core</h3>
                        <p className="text-xs text-violet-100/60 leading-relaxed">
                            Our Laravel backend strictly segregates financial ledgers and account authentication from live game physics, preventing client-side spoofing and tampering.
                        </p>
                    </div>
                </div>

                {/* Mission Narrative */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-[3px] border-[#16102b] rounded-[1.5rem] p-8 space-y-4">
                    <h2 className="text-2xl font-display text-white">Our Mission</h2>
                    <p className="text-xs sm:text-sm text-violet-100/75 leading-relaxed">
                        We believe modern web technologies like HTML5 Canvas, WebGL, and WebSockets enable console-grade arcade brawlers right inside any standard browser window. Whether you have 5 minutes between tasks or an evening to climb the seasonal Leaderboard, Crystal Brawlers delivers instant excitement.
                    </p>
                    <div className="pt-4 flex gap-4">
                        <Link
                            href="/register"
                            className="toon-btn toon-btn-primary"
                        >
                            Join The Arena
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="toon-btn toon-btn-ghost"
                        >
                            View Game Guide
                        </Link>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
