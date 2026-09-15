import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroPortrait from '../Components/HeroPortrait';
import { styleFor, CLASS_STYLE } from '../game/toon';
import {
    Heart, Swords, Gauge, Plus, Play, Coins, Gem, Trophy, Target,
    Sparkles, Wrench, Crown, Flame,
} from 'lucide-react';

const STAT_META = {
    hp: { label: 'Max health', icon: Heart, color: '#fb7185', blurb: '+20 HP per level' },
    damage: { label: 'Attack damage', icon: Swords, color: '#fbbf24', blurb: '+8% damage per level' },
    speed: { label: 'Move speed', icon: Gauge, color: '#67e8f9', blurb: '+4% speed per level' },
};

export default function Garage({ activeHeroMeta, userSkins = [], matchHistories = [], upgradeCosts = {} }) {
    const { auth, skinPalettes = {} } = usePage().props;
    const user = auth?.user;
    const heroClass = user?.selected_hero_class || 'knight';
    const st = styleFor(heroClass);
    const palette = skinPalettes?.[user?.equipped_skin] || null;
    const equipped = userSkins.find((s) => s.slug === user?.equipped_skin);

    const upgrade = (stat) => router.post('/garage/upgrade', { stat }, { preserveScroll: true });

    const levels = {
        hp: user?.stat_hp_level ?? 1,
        damage: user?.stat_damage_level ?? 1,
        speed: user?.stat_speed_level ?? 1,
    };

    return (
        <MainLayout>
            <Head title="Garage • Crystal Brawlers" />

            {/* ----------------------------- header ----------------------------- */}
            <section className="relative overflow-hidden bg-arena-sky">
                <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                    <div>
                        <span className="toon-chip text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                            <Wrench className="w-3.5 h-3.5" /> Personal workshop
                        </span>
                        <h1 className="font-display text-4xl sm:text-5xl text-white text-outline mt-4">
                            The <span className="text-gold">garage.</span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="toon-chip text-xs font-extrabold text-amber-300">
                            <Coins className="w-4 h-4" /> {Number(user?.coins ?? 0).toLocaleString()}
                        </div>
                        <div className="toon-chip text-xs font-extrabold text-cyan-300">
                            <Gem className="w-4 h-4" /> {Number(user?.crystals ?? 0).toLocaleString()}
                        </div>
                        <Link href="/topup" className="toon-btn toon-btn-ghost text-[11px] px-3.5 py-2">
                            <Plus className="w-4 h-4" /> Top up
                        </Link>
                        <Link href="/arena" className="toon-btn toon-btn-primary text-[11px] px-4 py-2.5">
                            <Play className="w-4 h-4 fill-current" /> Enter arena
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#150e2c] border-y-[3px] border-[#16102b] py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6">

                    {/* ------------------------- loadout ------------------------- */}
                    <div className="lg:col-span-4">
                        <div className="toon-panel p-6 text-center relative overflow-hidden">
                            <div
                                className="absolute -top-24 inset-x-0 h-56 blur-3xl opacity-50 pointer-events-none"
                                style={{ background: st.glow }}
                            />
                            <div className="relative flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
                                <span style={{ color: st.glow }}>{activeHeroMeta?.badge || CLASS_STYLE[heroClass].label}</span>
                                <span className="text-violet-200/50">{CLASS_STYLE[heroClass].label}</span>
                            </div>

                            <div className="relative flex justify-center my-3 animate-float">
                                <HeroPortrait heroClass={heroClass} palette={palette} size={200} scale={1.8} />
                            </div>

                            <h2 className="relative font-display text-2xl text-white leading-none">
                                {user?.name} {user?.surname}
                            </h2>
                            <p className="relative text-xs font-semibold text-violet-100/60 mt-2">
                                Wearing <strong className="text-white">{equipped?.name || user?.equipped_skin || 'Default'}</strong>
                            </p>

                            <div className="relative grid grid-cols-3 gap-2 mt-5">
                                <Fact icon={Trophy} label="Best score" value={Number(user?.high_score ?? 0).toLocaleString()} />
                                <Fact icon={Target} label="Kills" value={user?.total_kills ?? 0} />
                                <Fact icon={Flame} label="Matches" value={user?.matches_played ?? 0} />
                            </div>

                            <div className="relative mt-5 flex gap-3">
                                <Link href="/heroes" className="toon-btn toon-btn-ghost flex-1 justify-center text-[11px]">
                                    Change class
                                </Link>
                                <Link href="/store" className="toon-btn toon-btn-accent flex-1 justify-center text-[11px]">
                                    <Sparkles className="w-4 h-4" /> Skins
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ------------------------- upgrades ------------------------- */}
                    <div className="lg:col-span-8 space-y-6">
                        <div>
                            <h3 className="font-display text-2xl text-white mb-4">Attribute upgrades</h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {Object.entries(STAT_META).map(([key, meta]) => {
                                    const level = levels[key];
                                    const cost = upgradeCosts[key] ?? 0;
                                    const maxed = level >= 10;
                                    const affordable = (user?.coins ?? 0) >= cost;
                                    const Icon = meta.icon;
                                    return (
                                        <div key={key} className="toon-card p-5 flex flex-col">
                                            <div
                                                className="w-12 h-12 rounded-2xl border-[3px] border-[#16102b] flex items-center justify-center mb-3"
                                                style={{ background: meta.color }}
                                            >
                                                <Icon className="w-6 h-6 text-[#16102b]" />
                                            </div>
                                            <p className="font-display text-lg text-white leading-tight">{meta.label}</p>
                                            <p className="text-[11px] font-semibold text-violet-100/55 mt-1">{meta.blurb}</p>

                                            <div className="flex items-center gap-1 mt-3">
                                                {Array.from({ length: 10 }).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className="flex-1 h-2.5 rounded-full border-2 border-[#16102b]"
                                                        style={{ background: i < level ? meta.color : '#1a1136' }}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200/50 mt-2">
                                                Level {level} / 10
                                            </p>

                                            <button
                                                onClick={() => upgrade(key)}
                                                disabled={maxed || !affordable}
                                                className={`toon-btn w-full justify-center mt-4 text-[11px] ${maxed ? 'toon-btn-ghost' : 'toon-btn-primary'} disabled:opacity-50`}
                                            >
                                                {maxed ? 'Max level' : (
                                                    <>
                                                        <Coins className="w-4 h-4" /> {cost.toLocaleString()}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ------------------------- wardrobe ------------------------- */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-display text-2xl text-white">Your wardrobe</h3>
                                <Link href="/store" className="text-[11px] font-extrabold uppercase text-cyan-300 hover:text-cyan-200">
                                    Get more skins
                                </Link>
                            </div>

                            {userSkins.length === 0 ? (
                                <div className="toon-card p-6 text-sm font-semibold text-violet-100/60">
                                    No skins yet — the store has free ones for every class.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {userSkins.map((skin) => (
                                        <div
                                            key={skin.id}
                                            className={`toon-card p-3 text-center ${skin.slug === user?.equipped_skin ? 'ring-4 ring-lime-400/40' : ''}`}
                                        >
                                            <HeroPortrait heroClass={skin.hero_class} palette={skin.palette} size={96} scale={0.95} />
                                            <p className="font-display text-sm text-white leading-tight mt-1">{skin.name}</p>
                                            {skin.slug === user?.equipped_skin ? (
                                                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-lime-400 text-lime-950 border-2 border-[#16102b]">
                                                    Equipped
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => router.post(`/store/equip/${skin.id}`, {}, { preserveScroll: true })}
                                                    className="mt-1.5 text-[10px] font-extrabold uppercase text-cyan-300 hover:text-cyan-200"
                                                >
                                                    Equip
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ------------------------- history ------------------------- */}
                        <div>
                            <h3 className="font-display text-2xl text-white mb-4">Recent matches</h3>
                            {matchHistories.length === 0 ? (
                                <div className="toon-card p-6 text-sm font-semibold text-violet-100/60">
                                    No matches on record yet. The arena is right there.
                                </div>
                            ) : (
                                <div className="toon-panel overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="text-[10px] uppercase font-extrabold tracking-wider text-violet-200/50 border-b-[3px] border-[#16102b]">
                                                    <th className="px-4 py-3">Hero</th>
                                                    <th className="px-4 py-3">Result</th>
                                                    <th className="px-4 py-3">Score</th>
                                                    <th className="px-4 py-3">Kills</th>
                                                    <th className="px-4 py-3">Coins</th>
                                                    <th className="px-4 py-3">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {matchHistories.map((match) => (
                                                    <tr key={match.id} className="border-b border-[#2a1a52] last:border-0 font-bold text-violet-100/80">
                                                        <td className="px-4 py-3 text-white">{CLASS_STYLE[match.hero_class]?.label || match.hero_class}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border-2 border-[#16102b] ${
                                                                match.result === 'victory' ? 'bg-lime-400 text-lime-950' : 'bg-[#2a1a52] text-violet-100/70'
                                                            }`}>
                                                                {match.result}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-white">{match.score}</td>
                                                        <td className="px-4 py-3 text-rose-300">{match.kills}</td>
                                                        <td className="px-4 py-3 text-amber-300">+{match.coins_earned}</td>
                                                        <td className="px-4 py-3">{Math.floor(match.duration_seconds / 60)}m {match.duration_seconds % 60}s</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

function Fact({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl bg-[#1a1136] border-[3px] border-[#16102b] py-2 text-center">
            <Icon className="w-3.5 h-3.5 mx-auto text-amber-300" />
            <p className="text-[9px] uppercase font-extrabold tracking-wider text-violet-200/50 mt-1">{label}</p>
            <p className="font-display text-sm text-white leading-none mt-0.5">{value}</p>
        </div>
    );
}
