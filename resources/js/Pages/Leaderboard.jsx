import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroPortrait from '../Components/HeroPortrait';
import { CLASS_STYLE, styleFor } from '../game/toon';
import { Crown, Trophy, Target, Swords, Play, Globe } from 'lucide-react';

const MEDALS = ['#ffc531', '#d7dfe8', '#e08c4a'];

export default function Leaderboard({ leaderboard = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [classFilter, setClassFilter] = useState('all');

    const filtered = classFilter === 'all'
        ? leaderboard
        : leaderboard.filter((g) => g.selected_hero_class === classFilter);

    const podium = filtered.slice(0, 3);
    const rest = filtered.slice(3);

    return (
        <MainLayout>
            <Head title="Leaderboard • Crystal Brawlers" />

            <section className="relative overflow-hidden bg-arena-sky">
                <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <span className="toon-chip text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                        <Trophy className="w-3.5 h-3.5" /> Season 1
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl text-white text-outline mt-4">
                        Global <span className="text-gold">leaderboard.</span>
                    </h1>
                    <p className="mt-3 text-sm text-violet-100/75 font-semibold max-w-xl mx-auto">
                        Ranked by best single-match score. Every arena run counts — including the ones that end badly.
                    </p>
                </div>

                {/* ------------------------- podium ------------------------- */}
                {podium.length > 0 && (
                    <div className="relative max-w-4xl mx-auto px-4 pb-14">
                        <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end">
                            {[podium[1], podium[0], podium[2]].map((g, i) => {
                                if (!g) return <div key={`empty-${i}`} />;
                                const rank = g === podium[0] ? 0 : g === podium[1] ? 1 : 2;
                                const st = styleFor(g.selected_hero_class);
                                const heights = ['h-24', 'h-32', 'h-20'];
                                return (
                                    <div key={g.id} className="flex flex-col items-center">
                                        <div className="relative">
                                            {rank === 0 && <Crown className="w-7 h-7 text-amber-300 absolute -top-5 left-1/2 -translate-x-1/2" />}
                                            <HeroPortrait
                                                heroClass={g.selected_hero_class}
                                                size={rank === 0 ? 130 : 105}
                                                scale={rank === 0 ? 1.25 : 1}
                                            />
                                        </div>
                                        <div
                                            className={`w-full ${heights[i]} rounded-t-2xl border-[3px] border-b-0 border-[#16102b] flex flex-col items-center justify-center px-2 shadow-[inset_0_-10px_0_rgba(0,0,0,0.18)]`}
                                            style={{ background: MEDALS[rank] }}
                                        >
                                            <span className="font-display text-2xl text-[#16102b]">#{rank + 1}</span>
                                            <span className="text-[11px] font-extrabold text-[#16102b] truncate max-w-full">{g.name}</span>
                                            <span className="text-[10px] font-extrabold uppercase text-[#16102b]/80">
                                                {Number(g.high_score).toLocaleString()} pts
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>

            {/* ------------------------- filters + table ------------------------- */}
            <section className="bg-[#150e2c] border-y-[3px] border-[#16102b] py-5">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2">
                    {['all', ...Object.keys(CLASS_STYLE)].map((c) => (
                        <button
                            key={c}
                            onClick={() => setClassFilter(c)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border-[3px] border-[#16102b] transition ${
                                classFilter === c ? 'bg-amber-400 text-[#16102b]' : 'bg-[#241548] text-violet-100/70 hover:text-white'
                            }`}
                        >
                            {c === 'all' ? 'All classes' : CLASS_STYLE[c].label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-[#120c24] py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {rest.length === 0 && podium.length === 0 ? (
                        <div className="toon-card p-10 text-center">
                            <p className="font-display text-xl text-white">No ranked gladiators yet</p>
                            <p className="text-sm text-violet-100/60 font-semibold mt-2">Win a match and claim the top spot.</p>
                        </div>
                    ) : (
                        <div className="toon-panel overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] uppercase font-extrabold tracking-wider text-violet-200/50 border-b-[3px] border-[#16102b]">
                                            <th className="px-4 py-3.5">#</th>
                                            <th className="px-4 py-3.5">Gladiator</th>
                                            <th className="px-4 py-3.5">Class</th>
                                            <th className="px-4 py-3.5 text-right">Kills</th>
                                            <th className="px-4 py-3.5 text-right">Matches</th>
                                            <th className="px-4 py-3.5 text-right">Best score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((g, i) => {
                                            const st = styleFor(g.selected_hero_class);
                                            const me = user?.id === g.id;
                                            return (
                                                <tr
                                                    key={g.id}
                                                    className={`border-b border-[#2a1a52] last:border-0 text-sm font-bold ${me ? 'bg-amber-400/10' : ''}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className="inline-flex w-7 h-7 rounded-lg border-2 border-[#16102b] items-center justify-center font-display text-xs"
                                                            style={{
                                                                background: MEDALS[i] || '#2a1a52',
                                                                color: MEDALS[i] ? '#16102b' : '#cbd5e1',
                                                            }}
                                                        >
                                                            {i + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-white">
                                                        {g.name}
                                                        {me && <span className="ml-2 text-[10px] uppercase text-amber-300">you</span>}
                                                        {g.country && (
                                                            <span className="ml-2 text-[10px] font-extrabold uppercase text-violet-200/40 inline-flex items-center gap-1">
                                                                <Globe className="w-3 h-3" />{g.country}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-[11px] font-extrabold uppercase" style={{ color: st.glow }}>
                                                            {CLASS_STYLE[g.selected_hero_class]?.label || g.selected_hero_class}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-rose-300">{g.total_kills}</td>
                                                    <td className="px-4 py-3 text-right text-violet-100/70">{g.matches_played}</td>
                                                    <td className="px-4 py-3 text-right font-display text-base text-amber-300">
                                                        {Number(g.high_score).toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/arena" className="toon-btn toon-btn-primary">
                            <Play className="w-4 h-4 fill-current" /> Climb the ranks
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
