import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroPortrait from '../Components/HeroPortrait';
import { CLASS_STYLE } from '../game/toon';
import { Coins, Gem, Check, Lock, Sparkles, Plus, Swords, Heart, Gauge } from 'lucide-react';

export const RARITY = {
    common: { label: 'Common', color: '#94a3b8', glow: 'rgba(148,163,184,0.30)' },
    rare: { label: 'Rare', color: '#38bdf8', glow: 'rgba(56,189,248,0.35)' },
    epic: { label: 'Epic', color: '#c084fc', glow: 'rgba(192,132,252,0.38)' },
    legendary: { label: 'Legendary', color: '#fbbf24', glow: 'rgba(251,191,36,0.42)' },
};

const CLASS_FILTERS = ['all', ...Object.keys(CLASS_STYLE)];
const RARITY_FILTERS = ['all', 'common', 'rare', 'epic', 'legendary'];

export default function Store({ skins = [], equippedSkin = 'default-knight' }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [heroFilter, setHeroFilter] = useState('all');
    const [rarityFilter, setRarityFilter] = useState('all');
    const [ownedOnly, setOwnedOnly] = useState(false);
    const [busy, setBusy] = useState(null);

    const visible = useMemo(() => skins.filter((s) => (
        (heroFilter === 'all' || s.hero_class === heroFilter)
        && (rarityFilter === 'all' || s.rarity === rarityFilter)
        && (!ownedOnly || s.is_owned)
    )), [skins, heroFilter, rarityFilter, ownedOnly]);

    const ownedCount = skins.filter((s) => s.is_owned).length;

    const buy = (skin) => {
        setBusy(skin.id);
        router.post(`/store/buy/${skin.id}`, {}, { preserveScroll: true, onFinish: () => setBusy(null) });
    };

    const equip = (skin) => {
        setBusy(skin.id);
        router.post(`/store/equip/${skin.id}`, {}, { preserveScroll: true, onFinish: () => setBusy(null) });
    };

    return (
        <MainLayout>
            <Head title="Skin store • Crystal Brawlers" />

            {/* -------------------------- header -------------------------- */}
            <section className="relative overflow-hidden bg-arena-sky">
                <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <span className="toon-chip text-[11px] font-extrabold uppercase tracking-wider text-fuchsia-300">
                                <Sparkles className="w-3.5 h-3.5" /> Cosmetics
                            </span>
                            <h1 className="font-display text-4xl sm:text-5xl text-white text-outline mt-4">
                                The <span className="text-gold">skin store.</span>
                            </h1>
                            <p className="mt-3 text-sm text-violet-100/75 font-semibold">
                                {skins.length} skins across six classes — you own {ownedCount}. Every skin repaints your
                                gladiator in the arena, not just in the menu.
                            </p>
                        </div>

                        <div className="toon-panel p-4 flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-2 text-amber-300">
                                <Coins className="w-5 h-5" />
                                <span className="font-display text-xl text-white">{Number(user?.coins ?? 0).toLocaleString()}</span>
                            </div>
                            <span className="w-px h-8 bg-violet-400/20" />
                            <div className="flex items-center gap-2 text-cyan-300">
                                <Gem className="w-5 h-5" />
                                <span className="font-display text-xl text-white">{Number(user?.crystals ?? 0).toLocaleString()}</span>
                            </div>
                            <Link href="/topup" className="toon-btn toon-btn-primary text-[11px] px-3.5 py-2">
                                <Plus className="w-4 h-4" /> Top up
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------- filters -------------------------- */}
            <section className="bg-[#150e2c] border-y-[3px] border-[#16102b] py-5 sticky top-[72px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2">
                    {CLASS_FILTERS.map((c) => (
                        <Chip key={c} active={heroFilter === c} onClick={() => setHeroFilter(c)}>
                            {c === 'all' ? 'All classes' : CLASS_STYLE[c].label}
                        </Chip>
                    ))}
                    <span className="w-px h-6 bg-violet-400/20 mx-1 hidden sm:block" />
                    {RARITY_FILTERS.map((r) => (
                        <Chip
                            key={r}
                            active={rarityFilter === r}
                            onClick={() => setRarityFilter(r)}
                            color={r !== 'all' ? RARITY[r].color : undefined}
                        >
                            {r === 'all' ? 'All rarities' : RARITY[r].label}
                        </Chip>
                    ))}
                    <span className="w-px h-6 bg-violet-400/20 mx-1 hidden sm:block" />
                    <Chip active={ownedOnly} onClick={() => setOwnedOnly(!ownedOnly)}>Owned only</Chip>
                </div>
            </section>

            {/* -------------------------- grid -------------------------- */}
            <section className="bg-[#120c24] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {visible.length === 0 ? (
                        <div className="toon-card p-10 text-center">
                            <p className="font-display text-xl text-white">Nothing matches those filters</p>
                            <p className="text-sm text-violet-100/60 font-semibold mt-2">Try another class or rarity.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {visible.map((skin) => (
                                <SkinCard
                                    key={skin.id}
                                    skin={skin}
                                    equipped={equippedSkin === skin.slug}
                                    busy={busy === skin.id}
                                    canAfford={
                                        (user?.coins ?? 0) >= skin.price_coins
                                        && (user?.crystals ?? 0) >= skin.price_crystals
                                    }
                                    onBuy={() => buy(skin)}
                                    onEquip={() => equip(skin)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

function SkinCard({ skin, equipped, busy, canAfford, onBuy, onEquip }) {
    const rar = RARITY[skin.rarity] || RARITY.common;
    const cls = CLASS_STYLE[skin.hero_class] || CLASS_STYLE.knight;
    const free = skin.price_coins === 0 && skin.price_crystals === 0;

    return (
        <div
            className="toon-card p-5 relative overflow-hidden flex flex-col"
            style={{ borderColor: equipped ? rar.color : undefined }}
        >
            <div className="absolute inset-x-0 -top-24 h-48 blur-2xl opacity-60 pointer-events-none" style={{ background: rar.glow }} />

            <div className="relative flex items-center justify-between">
                <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border-2 border-[#16102b]"
                    style={{ background: rar.color, color: '#16102b' }}
                >
                    {rar.label}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200/60">
                    {cls.label}
                </span>
            </div>

            <div className="relative flex justify-center my-1">
                <HeroPortrait heroClass={skin.hero_class} palette={skin.palette} size={140} scale={1.25} aim={-0.1} />
            </div>

            <h3 className="relative font-display text-lg text-white text-center leading-tight">{skin.name}</h3>
            <p className="relative text-[11px] text-violet-100/60 font-semibold text-center mt-1 line-clamp-2 min-h-[2.2rem]">
                {skin.description}
            </p>

            <div className="relative mt-3 flex flex-wrap justify-center gap-1.5">
                <span className="toon-chip py-1 px-2 text-[10px] font-extrabold text-cyan-200">{skin.weapon_type}</span>
                {skin.bonus_stats?.hp ? <Bonus icon={Heart} value={`+${skin.bonus_stats.hp} HP`} color="#fb7185" /> : null}
                {skin.bonus_stats?.damage ? <Bonus icon={Swords} value={`+${skin.bonus_stats.damage} DMG`} color="#fbbf24" /> : null}
                {skin.bonus_stats?.speed ? <Bonus icon={Gauge} value={`+${skin.bonus_stats.speed} SPD`} color="#67e8f9" /> : null}
            </div>

            <div className="relative mt-4 pt-3 border-t-[3px] border-[#16102b] flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 text-[11px] font-extrabold">
                    {free ? (
                        <span className="text-lime-300 uppercase">Free</span>
                    ) : (
                        <>
                            {skin.price_coins > 0 && (
                                <span className="flex items-center gap-1 text-amber-300">
                                    <Coins className="w-3.5 h-3.5" />{Number(skin.price_coins).toLocaleString()}
                                </span>
                            )}
                            {skin.price_crystals > 0 && (
                                <span className="flex items-center gap-1 text-cyan-300">
                                    <Gem className="w-3.5 h-3.5" />{Number(skin.price_crystals).toLocaleString()}
                                </span>
                            )}
                        </>
                    )}
                </div>

                {equipped ? (
                    <span className="toon-btn toon-btn-accent text-[11px] px-3 py-2 cursor-default">
                        <Check className="w-4 h-4" /> Equipped
                    </span>
                ) : skin.is_owned ? (
                    <button onClick={onEquip} disabled={busy} className="toon-btn toon-btn-ghost text-[11px] px-3 py-2 disabled:opacity-60">
                        Equip
                    </button>
                ) : (
                    <button
                        onClick={onBuy}
                        disabled={busy || !canAfford}
                        className="toon-btn toon-btn-primary text-[11px] px-3 py-2 disabled:opacity-50"
                        title={canAfford ? 'Unlock this skin' : 'Not enough currency'}
                    >
                        {canAfford ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        {busy ? '…' : canAfford ? 'Unlock' : 'Locked'}
                    </button>
                )}
            </div>
        </div>
    );
}

function Bonus({ icon: Icon, value, color }) {
    return (
        <span className="toon-chip py-1 px-2 text-[10px] font-extrabold" style={{ color }}>
            <Icon className="w-3 h-3" /> {value}
        </span>
    );
}

function Chip({ children, active, onClick, color }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border-[3px] border-[#16102b] transition ${
                active ? 'text-[#16102b]' : 'bg-[#241548] text-violet-100/70 hover:text-white'
            }`}
            style={active ? { background: color || '#ffc531' } : undefined}
        >
            {children}
        </button>
    );
}
