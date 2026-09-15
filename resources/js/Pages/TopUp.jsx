import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Coins, Gem, Sparkles, ShieldCheck, Zap, Check, CreditCard } from 'lucide-react';

const COIN_STYLE = {
    accent: '#ffc531',
    soft: 'rgba(255,197,49,0.18)',
    icon: Coins,
    label: 'Gold Coins',
    blurb: 'Spend on Garage upgrades and most store skins.',
};

const CRYSTAL_STYLE = {
    accent: '#67e8f9',
    soft: 'rgba(103,232,249,0.18)',
    icon: Gem,
    label: 'Crystals',
    blurb: 'Premium currency for epic and legendary cosmetics.',
};

export default function TopUp({ packages = [], auth }) {
    const [pending, setPending] = useState(null);
    const user = auth?.user;

    const buy = (pkg) => {
        setPending(pkg.id);
        router.post('/topup', { package: pkg.id }, {
            preserveScroll: true,
            onFinish: () => setPending(null),
        });
    };

    const coinPacks = packages.filter((p) => p.currency === 'coins');
    const crystalPacks = packages.filter((p) => p.currency === 'crystals');

    return (
        <MainLayout>
            <Head title="Top up • Crystal Brawlers" />

            <section className="relative overflow-hidden bg-arena-sky">
                <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <span className="toon-chip text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                                <Sparkles className="w-3.5 h-3.5" /> Wallet
                            </span>
                            <h1 className="font-display text-4xl sm:text-5xl text-white text-outline mt-4">
                                Top up your <span className="text-gold">war chest.</span>
                            </h1>
                            <p className="mt-3 text-sm sm:text-base text-violet-100/75 font-semibold max-w-xl">
                                Coins buy upgrades and most skins. Crystals unlock the flashy stuff. Both land in your
                                wallet the moment the purchase goes through.
                            </p>
                        </div>

                        <div className="toon-panel p-4 flex items-center gap-4 shrink-0">
                            <Balance icon={Coins} value={user?.coins ?? 0} label="Gold coins" color="#ffc531" />
                            <span className="w-px h-10 bg-violet-400/20" />
                            <Balance icon={Gem} value={user?.crystals ?? 0} label="Crystals" color="#67e8f9" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#150e2c] py-14 border-y-[3px] border-[#16102b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                    <PackRow style={COIN_STYLE} packs={coinPacks} onBuy={buy} pending={pending} />
                    <PackRow style={CRYSTAL_STYLE} packs={crystalPacks} onBuy={buy} pending={pending} />
                </div>
            </section>

            <section className="bg-[#120c24] py-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-5">
                    <Perk icon={Zap} title="Instant delivery" text="Currency is credited to your account the second the purchase completes." />
                    <Perk icon={ShieldCheck} title="Nothing expires" text="Coins and crystals stay in your wallet forever — no seasonal resets." />
                    <Perk icon={CreditCard} title="Demo checkout" text="Payments are not connected to a provider yet, so purchases here are free." />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
                    <Link href="/store" className="toon-btn toon-btn-accent">
                        <Sparkles className="w-4 h-4" /> Spend it in the store
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}

function PackRow({ style, packs, onBuy, pending }) {
    const Icon = style.icon;
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="w-12 h-12 rounded-2xl border-[3px] border-[#16102b] flex items-center justify-center"
                    style={{ background: style.accent }}
                >
                    <Icon className="w-6 h-6 text-[#16102b]" />
                </div>
                <div>
                    <h2 className="font-display text-2xl text-white leading-none">{style.label}</h2>
                    <p className="text-xs font-semibold text-violet-100/60 mt-1">{style.blurb}</p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {packs.map((pkg, i) => {
                    const total = pkg.amount + pkg.bonus;
                    const highlight = pkg.tag === 'Most popular';
                    return (
                        <div
                            key={pkg.id}
                            className={`toon-card p-5 relative flex flex-col ${highlight ? 'ring-4 ring-amber-400/40' : ''}`}
                        >
                            {pkg.tag && (
                                <span
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border-[3px] border-[#16102b] whitespace-nowrap"
                                    style={{ background: style.accent, color: '#16102b' }}
                                >
                                    {pkg.tag}
                                </span>
                            )}

                            <div
                                className="mx-auto mt-2 mb-3 rounded-2xl flex items-center justify-center"
                                style={{
                                    width: 76 + i * 6,
                                    height: 76 + i * 6,
                                    background: style.soft,
                                    border: '3px solid #16102b',
                                }}
                            >
                                <Icon className="w-9 h-9" style={{ color: style.accent }} />
                            </div>

                            <p className="font-display text-2xl text-white text-center leading-none">
                                {total.toLocaleString()}
                            </p>
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-center mt-1" style={{ color: style.accent }}>
                                {pkg.bonus > 0 ? `${pkg.amount.toLocaleString()} + ${pkg.bonus.toLocaleString()} bonus` : style.label}
                            </p>

                            <button
                                onClick={() => onBuy(pkg)}
                                disabled={pending === pkg.id}
                                className="toon-btn toon-btn-primary w-full justify-center mt-4 disabled:opacity-60"
                            >
                                {pending === pkg.id ? 'Processing…' : `€${pkg.price.toFixed(2)}`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Balance({ icon: Icon, value, label, color }) {
    return (
        <div className="flex items-center gap-2.5">
            <Icon className="w-6 h-6" style={{ color }} />
            <div>
                <p className="font-display text-xl text-white leading-none">{Number(value).toLocaleString()}</p>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200/50 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

function Perk({ icon: Icon, title, text }) {
    return (
        <div className="toon-card p-5">
            <div className="w-11 h-11 rounded-2xl bg-[#2a1a52] border-[3px] border-[#16102b] flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="font-display text-lg text-white">{title}</h3>
            <p className="text-xs font-semibold text-violet-100/65 mt-1.5 leading-relaxed">{text}</p>
        </div>
    );
}
