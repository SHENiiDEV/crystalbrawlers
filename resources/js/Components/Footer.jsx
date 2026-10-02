import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { company } = usePage().props;
    const companyName = company?.name || 'Crystal Brawlers Interactive Ltd.';
    const companyNumber = company?.number || '2026-EU-984210';
    const companyAddress = company?.address || 'Tower 4, Fintech Square, Level 8, London, UK';
    const companyEmail = company?.email || 'info@crystalbrawlers.com';

    return (
        <footer className="bg-[#05080f] border-t border-slate-900 text-slate-400 text-xs">
            
            <div className="border-b border-slate-900 bg-slate-950/60 py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span>Digital game content · For players aged 18+</span>
                    <Link href="/payment-security" className="text-cyan-300 hover:underline">Payment & delivery information</Link>
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
                        High-octane browser 2D fantasy brawler built for instant competitive action. Real-time multiplayer combat, character upgrades, and in-game cosmetics.
                    </p>

                    <div className="p-3.5 bg-slate-900/70 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                        <div><strong className="text-slate-200">Legal Entity:</strong> {companyName}</div>
                        <div><strong className="text-slate-200">Company No:</strong> {companyNumber}</div>
                        <div><strong className="text-slate-200">Registered Office:</strong> {companyAddress}</div>
                        <div><strong className="text-slate-200">Support Desk:</strong> <a href={`mailto:${companyEmail}`} className="text-cyan-400 hover:underline">{companyEmail}</a></div>
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
                        <li><Link href="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
                        <li><Link href="/refund-policy" className="hover:text-cyan-400 transition">Refund & Cancellation</Link></li>
                        <li><Link href="/aml-policy" className="hover:text-cyan-400 transition">Acceptable Use & Sanctions</Link></li>
                        <li><Link href="/cookie-policy" className="hover:text-cyan-400 transition">Cookie Policy</Link></li>
                        <li><Link href="/payment-security" className="hover:text-cyan-400 transition">Payment & Delivery</Link></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Copyright & Disclaimer */}
            <div className="border-t border-slate-900 bg-[#04060b] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
                    <p className="text-center sm:text-right">
                        Gold Coins and Crystals are for in-game use only. No cash withdrawals.
                    </p>
                </div>
            </div>

        </footer>
    );
}
