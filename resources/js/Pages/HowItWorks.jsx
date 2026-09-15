import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Keyboard, MousePointer, Coins, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
    return (
        <MainLayout>
            <Head title="How It Works • Game Guide & Controls" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Beginner's Guide</span>
                    <h1 className="text-4xl sm:text-5xl font-display text-white tracking-wider text-outline-sm">
                        Master The Arena In 4 Steps
                    </h1>
                    <p className="text-sm text-violet-100/60 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about combat controls, scoring, character upgrades, and unlocking rare cosmetics.
                    </p>
                </div>

                {/* Step-by-Step Interactive Guide */}
                <div className="space-y-6">
                    
                    {/* Step 1: Controls */}
                    <div className="toon-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-950">
                            <Keyboard className="w-7 h-7" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-extrabold uppercase">
                                    Step 1
                                </span>
                                <h3 className="text-xl font-display text-white">
                                    Movement & Combat Controls
                                </h3>
                            </div>
                            <p className="text-xs text-violet-100/60 leading-relaxed">
                                Use <strong className="text-cyan-400 font-mono">W, A, S, D</strong> or <strong className="text-cyan-400 font-mono">Arrow Keys</strong> to run across the map. Your character automatically aims towards your mouse cursor. Click the <strong className="text-amber-400">Left Mouse Button</strong> or press <strong className="text-amber-400 font-mono">Spacebar</strong> to trigger your class attack.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
                                <span className="px-3 py-1 bg-[#1a1136] rounded-lg border-[3px] border-[#16102b] text-violet-100/75">W / ↑ : Move Up</span>
                                <span className="px-3 py-1 bg-[#1a1136] rounded-lg border-[3px] border-[#16102b] text-violet-100/75">A / ← : Move Left</span>
                                <span className="px-3 py-1 bg-[#1a1136] rounded-lg border-[3px] border-[#16102b] text-violet-100/75">S / ↓ : Move Down</span>
                                <span className="px-3 py-1 bg-[#1a1136] rounded-lg border-[3px] border-[#16102b] text-violet-100/75">D / → : Move Right</span>
                                <span className="px-3 py-1 bg-[#1a1136] rounded-lg border-[3px] border-[#16102b] text-cyan-300">Left Click: Strike</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Eliminating Bots & Earning Coins */}
                    <div className="toon-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-950">
                            <Coins className="w-7 h-7" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-extrabold uppercase">
                                    Step 2
                                </span>
                                <h3 className="text-xl font-display text-white">
                                    Defeat Foes & Farm Gold Coins
                                </h3>
                            </div>
                            <p className="text-xs text-violet-100/60 leading-relaxed">
                                The arena is populated by live gladiators and automated training bots (Goblins, Skeletons, Orcs). Slaying a bot rewards you with <strong className="text-amber-400">10-25 Gold Coins</strong> and score points. Eliminating another human player grants <strong className="text-amber-400">100+ bonus score</strong>!
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Upgrading Stats in the Garage */}
                    <div className="toon-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-950">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-extrabold uppercase">
                                    Step 3
                                </span>
                                <h3 className="text-xl font-display text-white">
                                    Level Up Base Attributes
                                </h3>
                            </div>
                            <p className="text-xs text-violet-100/60 leading-relaxed">
                                Return to your Garage hub to permanently level up your <strong className="text-cyan-400">Max Health</strong>, <strong className="text-rose-400">Attack Damage</strong>, and <strong className="text-lime-400">Movement Speed</strong>. These stats persist across every match you play!
                            </p>
                        </div>
                    </div>

                    {/* Step 4: Hall of Heroes & Custom Skins */}
                    <div className="toon-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-lime-400/40 flex items-center justify-center text-lime-400 shrink-0 shadow-lg shadow-emerald-950">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-lime-300 border border-emerald-800 text-[10px] font-extrabold uppercase">
                                    Step 4
                                </span>
                                <h3 className="text-xl font-display text-white">
                                    Switch Classes & Collect Arsenal
                                </h3>
                            </div>
                            <p className="text-xs text-violet-100/60 leading-relaxed">
                                Visit the <strong className="text-cyan-400">Hall of Heroes</strong> at any time to freely swap between the Knight, Rogue, Mage, Hunter, Berserker, and Cleric classes. Unlock epic skins in the Store to show off your style on the battlefield.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Action */}
                <div className="text-center pt-4">
                    <Link
                        href="/heroes"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider inline-flex items-center gap-2 font-display transition transform hover:scale-105"
                    >
                        Go To Hall of Heroes <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

            </div>
        </MainLayout>
    );
}
