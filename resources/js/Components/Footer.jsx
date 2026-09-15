import React from 'react';
import { Link } from '@inertiajs/react';
import { ShieldCheck, Cpu, Flame, Lock, Globe, Mail, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#05080f] border-t border-slate-900 text-slate-400 text-xs">
            
            {/* Top Payment Security & Compliance Banner featuring Official Logos */}
            <div className="border-b border-slate-900/90 bg-slate-950/60 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Left: Security and compliance badges */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>30 TPS Live Physics Netcode</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300 font-semibold">
                            <Lock className="w-4 h-4 text-cyan-400" />
                            <span>256-Bit SSL Encrypted Checkout</span>
                        </div>
                    </div>

                    {/* Right: Payment Provider Official Logos matching uploaded assets */}
                    <div className="flex items-center gap-4 bg-slate-900/90 px-5 py-2 rounded-2xl border border-slate-800/90 shadow-xl">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
                            Accepted Methods:
                        </span>
                        {/* Visa Logo */}
                        <div className="h-6 w-14 flex items-center justify-center bg-white rounded px-1.5 py-0.5 shadow-sm">
                            <img src="/images/payments/visa.png" alt="Visa" className="max-h-full max-w-full object-contain" />
                        </div>
                        {/* Mastercard Logo */}
                        <div className="h-6 w-12 flex items-center justify-center bg-white rounded px-1 py-0.5 shadow-sm">
                            <img src="/images/payments/mastercard.png" alt="Mastercard" className="max-h-full max-w-full object-contain" />
                        </div>
                        {/* PCI DSS Compliant Logo */}
                        <div className="h-6 w-14 flex items-center justify-center bg-white rounded px-1.5 py-0.5 shadow-sm">
                            <img src="/images/payments/pci-dss.png" alt="PCI DSS Compliant" className="max-h-full max-w-full object-contain" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Multi-Column Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
                
                {/* Col 1: Brand & Company Overview */}
                <div className="col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-amber-500 p-0.5">
                            <div className="w-full h-full bg-[#0b0f19] rounded-[6px] flex items-center justify-center font-black text-cyan-300 text-sm font-heading">
                                CB
                            </div>
                        </div>
                        <span className="text-lg font-black font-heading tracking-wider uppercase text-white">
                            Crystal Brawlers
                        </span>
                    </div>

                    <p className="text-slate-400 leading-relaxed max-w-sm">
                        High-octane browser 2D fantasy brawler built for instant competitive action. Real-time multiplayer combat, deep RPG upgrades, and secure global payment infrastructure.
                    </p>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <div><strong>Corporate Entity:</strong> Crystal Brawlers Interactive Ltd.</div>
                        <div><strong>Registration No:</strong> 2026-EU-984210</div>
                        <div><strong>Support Desk:</strong> <a href="mailto:info@crystalbrawlers.com" className="text-cyan-400 hover:underline">info@crystalbrawlers.com</a></div>
                    </div>
                </div>

                {/* Col 2: Game & Hub Navigation */}
                <div className="space-y-3">
                    <h4 className="text-white font-extrabold uppercase tracking-wider font-heading text-xs">
                        Gladiator Hub
                    </h4>
                    <ul className="space-y-2">
                        <li><Link href="/" className="hover:text-cyan-400 transition">Main Arena</Link></li>
                        <li><Link href="/heroes" className="hover:text-cyan-400 transition">Hall of Heroes</Link></li>
                        <li><Link href="/garage" className="hover:text-cyan-400 transition">Workshop & Upgrades</Link></li>
                        <li><Link href="/store" className="hover:text-cyan-400 transition">Arsenal Store</Link></li>
                        <li><Link href="/leaderboard" className="hover:text-cyan-400 transition">Global Leaderboard</Link></li>
                        <li><Link href="/invoices" className="hover:text-cyan-400 transition">Order Receipts</Link></li>
                    </ul>
                </div>

                {/* Col 3: Information & Guides */}
                <div className="space-y-3">
                    <h4 className="text-white font-extrabold uppercase tracking-wider font-heading text-xs">
                        Information
                    </h4>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="hover:text-cyan-400 transition">About Studio</Link></li>
                        <li><Link href="/how-it-works" className="hover:text-cyan-400 transition">Combat Controls</Link></li>
                        <li><Link href="/articles" className="hover:text-cyan-400 transition">Patch Notes</Link></li>
                        <li><Link href="/faq" className="hover:text-cyan-400 transition">Help & FAQ</Link></li>
                        <li><Link href="/contact" className="hover:text-cyan-400 transition">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Col 4: Legal & Regulatory Policies */}
                <div className="space-y-3">
                    <h4 className="text-white font-extrabold uppercase tracking-wider font-heading text-xs">
                        Legal & Compliance
                    </h4>
                    <ul className="space-y-2">
                        <li><Link href="/terms" className="hover:text-cyan-400 transition">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-cyan-400 transition">Privacy Policy (GDPR)</Link></li>
                        <li><Link href="/refund-policy" className="hover:text-cyan-400 transition">Refund & Cancellation</Link></li>
                        <li><Link href="/aml-policy" className="hover:text-cyan-400 transition">AML & Sanctions</Link></li>
                        <li><Link href="/cookie-policy" className="hover:text-cyan-400 transition">Cookie Preferences</Link></li>
                        <li><Link href="/payment-security" className="hover:text-cyan-400 transition">PCI DSS Security</Link></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Copyright & Disclaimer */}
            <div className="border-t border-slate-900 bg-[#04060b] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <p>© {new Date().getFullYear()} Crystal Brawlers Interactive Ltd. All rights reserved.</p>
                    <p className="text-center sm:text-right">
                        All trademarks, service marks, and trade names of Visa, Mastercard, and PCI-DSS are used under respective authorization guidelines.
                    </p>
                </div>
            </div>

        </footer>
    );
}
