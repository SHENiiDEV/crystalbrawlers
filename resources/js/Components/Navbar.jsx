import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Sparkles, Coins, Gem, Menu, X, Swords, LogOut, Plus } from 'lucide-react';

const LINKS = [
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/heroes', label: 'Heroes' },
    { href: '/leaderboard', label: 'Ranks' },
    { href: '/faq', label: 'FAQ' },
    { href: '/articles', label: 'Patch notes' },
];

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-40 bg-[#1b1038]/95 backdrop-blur-md border-b-[3px] border-[#16102b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">

                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-amber-400 border-[3px] border-[#16102b] flex items-center justify-center shadow-[0_5px_0_#16102b] group-hover:-translate-y-0.5 transition-transform">
                        <Swords className="w-5 h-5 text-[#16102b]" />
                    </div>
                    <div className="leading-none">
                        <span className="block font-display text-xl text-white">Crystal <span className="text-gold">Brawlers</span></span>
                        <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-violet-300/60 mt-0.5">
                            2D Arena Brawler
                        </span>
                    </div>
                </Link>

                <nav className="hidden xl:flex items-center gap-1">
                    {LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide text-violet-100/70 hover:text-white hover:bg-[#2a1a52] transition"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                    {user ? (
                        <>
                            <Link
                                href="/topup"
                                title="Top up coins & crystals"
                                className="flex items-center gap-2.5 rounded-full bg-[#241548] border-[3px] border-[#16102b] px-3 py-1.5 text-xs font-extrabold hover:brightness-125 transition"
                            >
                                <span className="flex items-center gap-1 text-cyan-300">
                                    <Gem className="w-4 h-4" />{user.crystals.toLocaleString()}
                                </span>
                                <span className="w-px h-3.5 bg-violet-400/30" />
                                <span className="flex items-center gap-1 text-amber-300">
                                    <Coins className="w-4 h-4" />{user.coins.toLocaleString()}
                                </span>
                                <span className="w-5 h-5 rounded-full bg-amber-400 text-[#16102b] flex items-center justify-center">
                                    <Plus className="w-3.5 h-3.5" />
                                </span>
                            </Link>
                            <Link href="/garage" className="toon-btn toon-btn-ghost text-[11px] px-3.5 py-2">Garage</Link>
                            <Link href="/arena" className="toon-btn toon-btn-primary text-[11px] px-4 py-2">Enter arena</Link>
                            <button onClick={handleLogout} title="Sign out" className="p-2 rounded-xl text-violet-300/60 hover:text-rose-300 hover:bg-[#2a1a52] transition">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="px-3 py-2 rounded-xl text-xs font-extrabold uppercase text-violet-100/70 hover:text-white transition">
                                Sign in
                            </Link>
                            <Link href="/register" className="toon-btn toon-btn-primary text-[11px] px-4 py-2.5">
                                <Sparkles className="w-4 h-4" /> Play free
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="xl:hidden p-2 rounded-xl text-violet-100 hover:bg-[#2a1a52] transition"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="xl:hidden bg-[#1b1038] border-t-[3px] border-[#16102b] px-4 py-5 space-y-2">
                    {LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="block px-3 py-2 rounded-xl text-sm font-extrabold text-violet-100/80 hover:bg-[#2a1a52] hover:text-white"
                        >
                            {l.label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t-[3px] border-[#16102b] flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link href="/garage" className="toon-btn toon-btn-ghost justify-center">Garage</Link>
                                <Link href="/store" className="toon-btn toon-btn-ghost justify-center">Store</Link>
                                <Link href="/topup" className="toon-btn toon-btn-ghost justify-center">Top up</Link>
                                <Link href="/arena" className="toon-btn toon-btn-primary justify-center">Enter arena</Link>
                                <button onClick={handleLogout} className="py-2 text-sm font-extrabold text-rose-300">Sign out</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="toon-btn toon-btn-ghost justify-center">Sign in</Link>
                                <Link href="/register" className="toon-btn toon-btn-primary justify-center">Play free</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
