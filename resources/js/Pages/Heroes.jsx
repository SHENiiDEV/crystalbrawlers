import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroPortrait from '../Components/HeroPortrait';
import { CLASS_STYLE, styleFor } from '../game/toon';
import { Check, Play, Heart, Swords, Gauge, Crosshair, Timer, Sparkles } from 'lucide-react';

export default function Heroes({ heroClasses = [], selectedClass = 'knight' }) {
    const { auth, skinPalettes = {} } = usePage().props;
    const user = auth?.user;
    const [preview, setPreview] = useState(selectedClass);
    const [busy, setBusy] = useState(false);

    const active = heroClasses.find((h) => h.id === preview) || heroClasses[0];
    const st = styleFor(preview);
    const palette = preview === user?.selected_hero_class ? skinPalettes?.[user?.equipped_skin] : null;

    const choose = (id) => {
        setBusy(true);
        router.post('/heroes/select', { hero_class: id }, { preserveScroll: true, onFinish: () => setBusy(false) });
    };

    return (
        <MainLayout>
            <Head title="Hall of heroes • Crystal Brawlers" />

            <section className="relative overflow-hidden bg-arena-sky">
                <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <span className="toon-chip text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                        <Sparkles className="w-3.5 h-3.5" /> Hall of heroes
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl text-white text-outline mt-4">
                        Choose your <span className="text-gold">champion.</span>
                    </h1>
                    <p className="mt-3 text-sm text-violet-100/75 font-semibold max-w-2xl">
                        All six classes are free. Swap whenever you like — your upgrades and skins follow you.
                    </p>
                </div>
            </section>

            <section className="bg-[#150e2c] border-y-[3px] border-[#16102b] py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6">

                    {/* ------- spotlight ------- */}
                    {active && (
                        <div className="lg:col-span-5">
                            <div className="toon-panel p-6 text-center relative overflow-hidden">
                                <div
                                    className="absolute -top-24 inset-x-0 h-56 blur-3xl opacity-50 pointer-events-none"
                                    style={{ background: st.glow }}
                                />
                                <span
                                    className="relative inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border-2 border-[#16102b]"
                                    style={{ background: st.body, color: '#16102b' }}
                                >
                                    {active.badge}
                                </span>

                                <div className="relative flex justify-center my-3 animate-float">
                                    <HeroPortrait heroClass={active.id} palette={palette} size={210} scale={1.9} />
                                </div>

                                <h2 className="relative font-display text-3xl text-white leading-none">{active.name}</h2>
                                <p className="relative text-xs font-extrabold uppercase tracking-wider mt-1.5" style={{ color: st.glow }}>
                                    {active.title}
                                </p>
                                <p className="relative text-sm text-violet-100/70 font-semibold mt-3">{active.description}</p>

                                <div className="relative mt-5 space-y-2 text-left">
                                    <Bar icon={Heart} label="HP" value={active.stats.hp} max={active.max_stats.hp} color="#fb7185" />
                                    <Bar icon={Swords} label="DMG" value={active.stats.damage} max={active.max_stats.damage} color="#fbbf24" />
                                    <Bar icon={Gauge} label="SPD" value={active.stats.speed} max={active.max_stats.speed} color="#67e8f9" />
                                </div>

                                <div className="relative grid grid-cols-3 gap-2 mt-5">
                                    <Fact icon={Crosshair} label="Range" value={`${active.attack_range}px`} />
                                    <Fact icon={Timer} label="Cooldown" value={`${active.attack_cooldown}ms`} />
                                    <Fact icon={Swords} label="Attack" value={active.attack_type.split(' ')[0]} />
                                </div>

                                <div className="relative mt-6 flex flex-col sm:flex-row gap-3">
                                    {selectedClass === active.id ? (
                                        <Link href="/arena" className="toon-btn toon-btn-primary flex-1 justify-center">
                                            <Play className="w-4 h-4 fill-current" /> Enter arena
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => choose(active.id)}
                                            disabled={busy}
                                            className="toon-btn toon-btn-primary flex-1 justify-center disabled:opacity-60"
                                        >
                                            <Check className="w-4 h-4" /> Play as {active.name}
                                        </button>
                                    )}
                                    <Link href="/store" className="toon-btn toon-btn-ghost justify-center">
                                        Skins
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ------- roster ------- */}
                    <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 content-start">
                        {heroClasses.map((hero) => {
                            const hs = styleFor(hero.id);
                            const isActive = hero.id === preview;
                            const isSelected = hero.id === selectedClass;
                            return (
                                <button
                                    key={hero.id}
                                    onClick={() => setPreview(hero.id)}
                                    className={`toon-card p-4 text-left relative overflow-hidden ${isActive ? 'ring-4' : ''}`}
                                    style={isActive ? { '--tw-ring-color': `${hs.glow}66` } : undefined}
                                >
                                    {isSelected && (
                                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-lime-400 text-lime-950 border-2 border-[#16102b]">
                                            Active
                                        </span>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <HeroPortrait heroClass={hero.id} size={92} scale={0.95} />
                                        <div className="min-w-0">
                                            <p className="font-display text-xl text-white leading-none">{hero.name}</p>
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider mt-1" style={{ color: hs.glow }}>
                                                {CLASS_STYLE[hero.id].weapon}
                                            </p>
                                            <p className="text-[11px] text-violet-100/60 font-semibold mt-1.5 line-clamp-2">
                                                {hero.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

function Bar({ icon: Icon, label, value, max, color }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
            <span className="text-[10px] font-extrabold uppercase text-violet-200/60 w-8">{label}</span>
            <div className="flex-1 h-3 rounded-full bg-[#1a1136] border-2 border-[#16102b] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-[10px] font-extrabold text-white w-8 text-right">{value}</span>
        </div>
    );
}

function Fact({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl bg-[#1a1136] border-[3px] border-[#16102b] py-2 text-center">
            <Icon className="w-3.5 h-3.5 mx-auto text-cyan-300" />
            <p className="text-[9px] uppercase font-extrabold tracking-wider text-violet-200/50 mt-1">{label}</p>
            <p className="font-display text-sm text-white leading-none mt-0.5">{value}</p>
        </div>
    );
}
