import React from 'react';
import HeroAvatar from './HeroAvatar';
import { Check } from 'lucide-react';

export default function HeroPedestal({ hero, isSelected, onSelect }) {
    const colorClasses = {
        knight: {
            glow: 'shadow-[0_0_30px_rgba(6,182,212,0.45)]',
            ring: 'border-cyan-400 bg-cyan-500/20',
            text: 'text-cyan-400',
            borderActive: 'border-cyan-400 ring-2 ring-cyan-400/50',
            badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
        },
        rogue: {
            glow: 'shadow-[0_0_30px_rgba(217,70,239,0.45)]',
            ring: 'border-fuchsia-400 bg-fuchsia-500/20',
            text: 'text-fuchsia-400',
            borderActive: 'border-fuchsia-400 ring-2 ring-fuchsia-400/50',
            badge: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800',
        },
        mage: {
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.45)]',
            ring: 'border-emerald-400 bg-emerald-500/20',
            text: 'text-emerald-400',
            borderActive: 'border-emerald-400 ring-2 ring-emerald-400/50',
            badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
        },
        hunter: {
            glow: 'shadow-[0_0_30px_rgba(245,158,11,0.45)]',
            ring: 'border-amber-400 bg-amber-500/20',
            text: 'text-amber-400',
            borderActive: 'border-amber-400 ring-2 ring-amber-400/50',
            badge: 'bg-amber-950/80 text-amber-300 border-amber-800',
        },
        berserker: {
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.45)]',
            ring: 'border-rose-500 bg-rose-500/20',
            text: 'text-rose-400',
            borderActive: 'border-rose-500 ring-2 ring-rose-500/50',
            badge: 'bg-rose-950/80 text-rose-300 border-rose-800',
        },
        cleric: {
            glow: 'shadow-[0_0_30px_rgba(56,189,248,0.45)]',
            ring: 'border-sky-400 bg-sky-500/20',
            text: 'text-sky-400',
            borderActive: 'border-sky-400 ring-2 ring-sky-400/50',
            badge: 'bg-sky-950/80 text-sky-300 border-sky-800',
        },
    }[hero.id] || {
        glow: 'shadow-cyan-500/30',
        ring: 'border-cyan-400 bg-cyan-500/20',
        text: 'text-cyan-400',
        borderActive: 'border-cyan-400',
        badge: 'bg-slate-900 text-cyan-300 border-slate-700',
    };

    return (
        <div
            onClick={() => onSelect(hero)}
            className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 bg-slate-900/40 hover:bg-slate-900/80 border ${
                isSelected 
                    ? `${colorClasses.borderActive} bg-slate-900/90 ${colorClasses.glow} scale-[1.02]` 
                    : 'border-slate-800/80 hover:border-slate-700 hover:scale-[1.01]'
            }`}
        >
            {/* Active Selected Checkmark */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md shadow-cyan-400/50">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
            )}

            {/* Holographic light beam from top */}
            <div className="relative w-full flex flex-col items-center pt-2 pb-1">
                <div className="w-28 h-28 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <HeroAvatar heroClass={hero.id} size="lg" />
                </div>

                {/* Pedestal Elliptical Glowing Ring matching the reference */}
                <div className="w-32 h-8 relative -mt-4 flex items-center justify-center">
                    <div className={`w-28 h-6 rounded-full border-2 ${colorClasses.ring} ${isSelected ? 'animate-pulse' : ''} shadow-inner`}></div>
                    <div className={`absolute inset-x-4 top-1.5 h-3 bg-gradient-to-b from-transparent to-white/10 rounded-full blur-[2px]`}></div>
                </div>
            </div>

            {/* Class Name & Description */}
            <div className="text-center mt-2 w-full">
                <h3 className={`text-base font-display tracking-wider ${colorClasses.text}`}>
                    {hero.name}
                </h3>
                <p className="text-[11px] text-violet-100/60 leading-tight mt-1 line-clamp-2 px-1">
                    {hero.description}
                </p>
            </div>
        </div>
    );
}
