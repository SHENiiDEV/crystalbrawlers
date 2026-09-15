import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import BattlePreview from '../Components/BattlePreview';
import HeroPortrait from '../Components/HeroPortrait';
import { CLASS_STYLE, styleFor } from '../game/toon';
import {
    Play, Sparkles, Swords, Zap, Trophy, Coins, Shield, Heart, Gauge,
    ArrowRight, ChevronDown, Crown, Gamepad2, Wand2, Users, Timer,
} from 'lucide-react';

const CLASSES = [
    { id: 'knight', tagline: 'Tanky frontliner with a shield wall.', hp: 220, dmg: 25, spd: 4.2, range: 'Melee' },
    { id: 'berserker', tagline: 'Glass-cannon axe with brutal swings.', hp: 190, dmg: 40, spd: 4.0, range: 'Melee' },
    { id: 'rogue', tagline: 'Fastest blades in the arena.', hp: 130, dmg: 20, spd: 5.4, range: 'Melee' },
    { id: 'mage', tagline: 'Long-range arcane burst damage.', hp: 100, dmg: 35, spd: 4.4, range: 'Ranged' },
    { id: 'hunter', tagline: 'Precision arrows from a safe distance.', hp: 130, dmg: 28, spd: 4.8, range: 'Ranged' },
    { id: 'cleric', tagline: 'Sturdy support with holy bolts.', hp: 170, dmg: 22, spd: 4.5, range: 'Ranged' },
];

const RARITY = {
    common: { label: 'Common', color: '#94a3b8', glow: 'rgba(148,163,184,0.35)' },
    rare: { label: 'Rare', color: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
    epic: { label: 'Epic', color: '#c084fc', glow: 'rgba(192,132,252,0.4)' },
    legendary: { label: 'Legendary', color: '#fbbf24', glow: 'rgba(251,191,36,0.45)' },
};

const FAQ = [
    { q: 'Do I need to download anything?', a: 'No. The arena runs straight in your browser on an HTML5 canvas — open the page, pick a hero and you are fighting within seconds.' },
    { q: 'Is it really free?', a: 'Yes. Every hero class and every stat upgrade is earned with gold coins you win in matches. Crystals only speed up cosmetics.' },
    { q: 'What happens when I lose a fight?', a: 'Nothing is lost. Your coins, score and kills are banked instantly, and you can respawn straight back into the same arena.' },
    { q: 'Are there real players in the arena?', a: 'Every match mixes live gladiators with smart bots, so the battlefield is never empty — even at 4 a.m.' },
];

export default function Welcome({ featuredSkins = [], latestArticles = [], topGladiators = [] }) {
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <MainLayout>
            <Head title="Crystal Brawlers • Free-to-play 2D arena brawler" />

            {/* ============================ HERO ============================ */}
            <section className="relative overflow-hidden bg-arena-sky">
                <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-cyan-400/20 blur-[120px] pointer-events-none" />
                <div className="absolute top-10 -right-24 w-[420px] h-[420px] rounded-full bg-fuchsia-500/20 blur-[120px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6 text-center lg:text-left">
                            <div className="toon-chip text-[11px] font-extrabold uppercase tracking-wider text-lime-300">
                                <span className="relative flex w-2.5 h-2.5">
                                    <span className="absolute inset-0 rounded-full bg-lime-400 animate-ring" />
                                    <span className="relative w-2.5 h-2.5 rounded-full bg-lime-400" />
                                </span>
                                Season 1 is live • 30 ticks per second
                            </div>

                            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-white text-outline">
                                Smash into<br />
                                <span className="text-gold">the arena.</span>
                            </h1>

                            <p className="mt-5 text-base sm:text-lg text-violet-100/80 font-semibold max-w-lg mx-auto lg:mx-0">
                                A fast, chunky 2D brawler you play in the browser. Pick a champion, out-swing real
                                gladiators and goblin hordes, bank gold and unlock ridiculous skins.
                            </p>

                            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                <Link href="/register" className="toon-btn toon-btn-primary text-base w-full sm:w-auto justify-center">
                                    <Play className="w-5 h-5 fill-current" /> Play free now
                                </Link>
                                <Link href="/how-it-works" className="toon-btn toon-btn-ghost w-full sm:w-auto justify-center">
                                    <Gamepad2 className="w-4 h-4" /> How it works
                                </Link>
                            </div>

                            <div className="mt-7 grid grid-cols-3 gap-2.5 max-w-md mx-auto lg:mx-0">
                                <MiniStat icon={Users} value="6" label="Hero classes" />
                                <MiniStat icon={Timer} value="0s" label="Queue time" />
                                <MiniStat icon={Coins} value="Free" label="To play" />
                            </div>
                        </div>

                        {/* Live battle frame */}
                        <div className="lg:col-span-6">
                            <div className="relative">
                                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-400/30 via-fuchsia-500/20 to-amber-400/30 blur-2xl" />
                                <div className="relative toon-panel p-3 overflow-hidden">
                                    <div className="flex items-center justify-between px-1.5 pb-2.5">
                                        <span className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-lime-300">
                                            <span className="w-2 h-2 rounded-full bg-lime-400" /> Live match #104
                                        </span>
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                                            8 gladiators in the pit
                                        </span>
                                    </div>

                                    <div className="rounded-2xl overflow-hidden border-[3px] border-[#16102b]">
                                        <BattlePreview />
                                    </div>

                                    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-violet-100/80">
                                        <span className="toon-chip py-1 px-2.5">WASD to move</span>
                                        <span className="toon-chip py-1 px-2.5">Mouse to aim</span>
                                        <span className="toon-chip py-1 px-2.5">Click to strike</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* marquee strip */}
                <div className="relative border-y-[3px] border-[#16102b] bg-[#1b1038] bg-stripe">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-violet-200/70">
                        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-300" /> Instant matchmaking</span>
                        <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-cyan-300" /> No downloads</span>
                        <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-fuchsia-300" /> 40+ cosmetics</span>
                        <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-lime-300" /> Global leaderboard</span>
                    </div>
                </div>
            </section>

            {/* ============================ CLASSES ============================ */}
            <section className="py-16 lg:py-20 bg-[#150e2c]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHead
                        kicker="Pick your fighter"
                        title="Six champions, six play styles"
                        sub="Every class is unlocked from day one. Upgrade the one that fits how you brawl."
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {CLASSES.map((c) => {
                            const st = styleFor(c.id);
                            return (
                                <div key={c.id} className="toon-card p-5 group relative overflow-hidden">
                                    <div
                                        className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-2xl opacity-40"
                                        style={{ background: st.glow }}
                                    />
                                    <div className="relative flex items-start gap-3">
                                        <div className="shrink-0 -mt-3 -ml-1 group-hover:scale-105 transition-transform">
                                            <HeroPortrait heroClass={c.id} size={120} scale={1.15} />
                                        </div>
                                        <div className="min-w-0 pt-2">
                                            <p className="font-display text-xl text-white leading-none">{CLASS_STYLE[c.id].label}</p>
                                            <span
                                                className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border-2 border-[#16102b]"
                                                style={{ background: st.body, color: '#16102b' }}
                                            >
                                                {c.range}
                                            </span>
                                            <p className="mt-2 text-xs text-violet-100/70 font-semibold leading-relaxed">{c.tagline}</p>
                                        </div>
                                    </div>

                                    <div className="relative mt-4 space-y-2">
                                        <Bar icon={Heart} label="HP" value={c.hp} max={240} color="#fb7185" />
                                        <Bar icon={Swords} label="DMG" value={c.dmg} max={45} color="#fbbf24" />
                                        <Bar icon={Gauge} label="SPD" value={c.spd} max={6} color="#67e8f9" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============================ HOW TO PLAY ============================ */}
            <section className="py-16 lg:py-20 bg-[#120c24] border-y-[3px] border-[#16102b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHead
                        kicker="Three steps"
                        title="From zero to gladiator in a minute"
                        sub="No tutorial gauntlet, no install, no launcher."
                    />

                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { n: '01', icon: Wand2, title: 'Create your brawler', text: 'Sign up, verify you are 18+, and choose a starting champion from the Hall of Heroes.', color: '#67e8f9' },
                            { n: '02', icon: Swords, title: 'Fight in the arena', text: 'Real-time 30 TPS combat against live players and goblin packs. Every kill pays out gold.', color: '#fbbf24' },
                            { n: '03', icon: Trophy, title: 'Upgrade and climb', text: 'Spend coins in the Garage on HP, damage and speed, then flex new skins on the leaderboard.', color: '#a3e635' },
                        ].map((s) => (
                            <div key={s.n} className="toon-card p-6 relative">
                                <span
                                    className="absolute top-4 right-5 font-display text-5xl opacity-20"
                                    style={{ color: s.color }}
                                >{s.n}</span>
                                <div
                                    className="w-14 h-14 rounded-2xl border-[3px] border-[#16102b] flex items-center justify-center mb-4"
                                    style={{ background: s.color }}
                                >
                                    <s.icon className="w-7 h-7 text-[#16102b]" />
                                </div>
                                <h3 className="font-display text-xl text-white">{s.title}</h3>
                                <p className="mt-2 text-sm text-violet-100/70 font-semibold leading-relaxed">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================ SKINS ============================ */}
            {featuredSkins.length > 0 && (
                <section className="py-16 lg:py-20 bg-[#150e2c]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-extrabold uppercase tracking-widest text-fuchsia-300">Arsenal</span>
                                <h2 className="font-display text-3xl sm:text-4xl text-white mt-1">Skins worth grinding for</h2>
                            </div>
                            <Link href="/store" className="toon-btn toon-btn-ghost text-xs self-start md:self-auto">
                                Full store <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredSkins.slice(0, 8).map((skin) => {
                                const rar = RARITY[skin.rarity] || RARITY.common;
                                return (
                                    <div key={skin.id} className="toon-card p-5 text-center relative overflow-hidden">
                                        <div
                                            className="absolute inset-x-0 -top-20 h-40 blur-2xl opacity-50"
                                            style={{ background: rar.glow }}
                                        />
                                        <span
                                            className="relative inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border-2 border-[#16102b]"
                                            style={{ background: rar.color, color: '#16102b' }}
                                        >
                                            {rar.label}
                                        </span>
                                        <div className="relative flex justify-center my-2 animate-float">
                                            <HeroPortrait heroClass={skin.hero_class} palette={skin.palette} size={130} scale={1.2} aim={-0.15} />
                                        </div>
                                        <h3 className="relative font-display text-lg text-white leading-tight">{skin.name}</h3>
                                        <p className="relative text-[11px] text-violet-100/60 font-semibold mt-1 line-clamp-2">{skin.description}</p>
                                        <div className="relative mt-3 flex items-center justify-center gap-2 text-[11px] font-extrabold">
                                            <span className="toon-chip py-1 px-2.5 text-amber-300">
                                                <Coins className="w-3.5 h-3.5" /> {Number(skin.price_coins).toLocaleString()}
                                            </span>
                                            <span className="toon-chip py-1 px-2.5 text-cyan-200">{skin.weapon_type}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================ LEADERBOARD + PATCH NOTES ============================ */}
            <section className="py-16 lg:py-20 bg-[#120c24] border-y-[3px] border-[#16102b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 toon-panel p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-xl text-white flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-300" /> Top gladiators
                            </h3>
                            <Link href="/leaderboard" className="text-[11px] font-extrabold uppercase text-cyan-300 hover:text-cyan-200">
                                All ranks
                            </Link>
                        </div>

                        {topGladiators.length === 0 ? (
                            <p className="text-sm text-violet-100/60 font-semibold">
                                The throne is empty. Win a match and your name goes here first.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {topGladiators.map((g, i) => {
                                    const st = styleFor(g.selected_hero_class);
                                    const medal = ['#fbbf24', '#cbd5e1', '#f0a06a'][i];
                                    return (
                                        <li key={g.id} className="flex items-center gap-3 rounded-xl bg-[#1a1136] border-[3px] border-[#16102b] px-3 py-2">
                                            <span
                                                className="w-7 h-7 shrink-0 rounded-lg border-2 border-[#16102b] flex items-center justify-center font-display text-sm"
                                                style={{ background: medal || '#3a2570', color: medal ? '#16102b' : '#cbd5e1' }}
                                            >
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-extrabold text-white truncate">{g.name}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: st.glow }}>
                                                    {styleFor(g.selected_hero_class).label} • {g.total_kills} kills
                                                </p>
                                            </div>
                                            <span className="font-display text-base text-amber-300">{Number(g.high_score).toLocaleString()}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-xl text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-fuchsia-300" /> Latest from the forge
                            </h3>
                            <Link href="/articles" className="text-[11px] font-extrabold uppercase text-cyan-300 hover:text-cyan-200">
                                All patch notes
                            </Link>
                        </div>

                        {latestArticles.length === 0 ? (
                            <div className="toon-card p-6 text-sm text-violet-100/60 font-semibold">
                                No patch notes published yet — the first update drops soon.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {latestArticles.map((a) => (
                                    <Link
                                        key={a.id}
                                        href={`/articles/${a.slug}`}
                                        className="toon-card p-5 flex items-start gap-4 hover:no-underline"
                                    >
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-600 border-[3px] border-[#16102b] flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2a1a52] border-2 border-[#16102b] text-cyan-200">
                                                    {a.category}
                                                </span>
                                                {a.version_tag && (
                                                    <span className="text-[10px] font-extrabold uppercase text-amber-300">{a.version_tag}</span>
                                                )}
                                            </div>
                                            <p className="font-display text-lg text-white mt-1.5 leading-tight">{a.title}</p>
                                            <p className="text-xs text-violet-100/65 font-semibold mt-1 line-clamp-2">{a.summary}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================ FAQ ============================ */}
            <section className="py-16 lg:py-20 bg-[#150e2c]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHead kicker="Questions" title="Before you jump in" sub="" />
                    <div className="space-y-3">
                        {FAQ.map((item, i) => (
                            <div key={item.q} className="toon-card overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className="font-display text-base sm:text-lg text-white">{item.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 shrink-0 text-cyan-300 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <p className="px-5 pb-5 -mt-1 text-sm text-violet-100/70 font-semibold leading-relaxed">
                                        {item.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================ FINAL CTA ============================ */}
            <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#2a1a52] via-[#1b1038] to-[#2a1a52]">
                <div className="absolute inset-0 bg-stripe opacity-70 pointer-events-none" />
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] rounded-full bg-amber-400/20 blur-[120px] pointer-events-none" />

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <div className="flex justify-center gap-1 sm:gap-4 mb-2">
                        {['knight', 'mage', 'berserker'].map((c, i) => (
                            <div key={c} className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                                <HeroPortrait heroClass={c} size={120} scale={1.2} aim={i === 1 ? 0.2 : -0.2} />
                            </div>
                        ))}
                    </div>

                    <h2 className="font-display text-4xl sm:text-5xl text-white text-outline">
                        The pit is <span className="text-gold">waiting.</span>
                    </h2>
                    <p className="mt-4 text-base text-violet-100/80 font-semibold max-w-xl mx-auto">
                        Free account, instant match, zero installs. Grab a weapon and start climbing the ranks tonight.
                    </p>
                    <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/register" className="toon-btn toon-btn-primary text-base justify-center w-full sm:w-auto">
                            <Play className="w-5 h-5 fill-current" /> Create free account
                        </Link>
                        <Link href="/heroes" className="toon-btn toon-btn-accent justify-center w-full sm:w-auto">
                            <Sparkles className="w-4 h-4" /> Meet the heroes
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

/* ---------------------------- small pieces ---------------------------- */

function SectionHead({ kicker, title, sub }) {
    return (
        <div className="text-center max-w-2xl mx-auto mb-10">
            {kicker && (
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">{kicker}</span>
            )}
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-1.5">{title}</h2>
            {sub && <p className="mt-3 text-sm sm:text-base text-violet-100/70 font-semibold">{sub}</p>}
        </div>
    );
}

function MiniStat({ icon: Icon, value, label }) {
    return (
        <div className="rounded-2xl bg-[#1d1240]/80 border-[3px] border-[#16102b] px-3 py-2.5 text-center">
            <Icon className="w-4 h-4 mx-auto text-cyan-300" />
            <p className="font-display text-lg text-white leading-none mt-1">{value}</p>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200/50 mt-0.5">{label}</p>
        </div>
    );
}

function Bar({ icon: Icon, label, value, max, color }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
            <span className="text-[10px] font-extrabold uppercase text-violet-200/60 w-8">{label}</span>
            <div className="flex-1 h-2.5 rounded-full bg-[#1a1136] border-2 border-[#16102b] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-[10px] font-extrabold text-white w-7 text-right">{value}</span>
        </div>
    );
}
