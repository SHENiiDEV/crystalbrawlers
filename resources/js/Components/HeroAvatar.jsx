import React from 'react';

export default function HeroAvatar({ heroClass = 'knight', size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-24 h-24',
        lg: 'w-40 h-40',
        xl: 'w-52 h-52',
    }[size] || 'w-24 h-24';

    // SVG character designs styled in 2D pixel-fantasy aesthetic
    const renderCharacterSvg = () => {
        switch (heroClass.toLowerCase()) {
            case 'knight':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                        {/* Shadow */}
                        <ellipse cx="50" cy="88" rx="28" ry="8" fill="rgba(0,0,0,0.5)" />
                        {/* Body / Armor */}
                        <rect x="36" y="44" width="28" height="34" rx="6" fill="#334155" stroke="#06b6d4" strokeWidth="2.5" />
                        <rect x="42" y="48" width="16" height="20" rx="3" fill="#64748b" />
                        {/* Legs */}
                        <rect x="38" y="76" width="9" height="12" rx="2" fill="#1e293b" />
                        <rect x="53" y="76" width="9" height="12" rx="2" fill="#1e293b" />
                        {/* Head / Helmet */}
                        <circle cx="50" cy="30" r="16" fill="#475569" stroke="#06b6d4" strokeWidth="2.5" />
                        <rect x="42" y="27" width="16" height="6" rx="2" fill="#06b6d4" />
                        {/* Helmet Crest (Red plume) */}
                        <path d="M45 14 Q50 6 58 12 Q52 18 50 20 Z" fill="#ef4444" />
                        {/* Left Hand: Kite Shield */}
                        <path d="M22 45 L32 45 L34 64 L27 72 L20 64 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="27" cy="56" r="3" fill="#38bdf8" />
                        {/* Right Hand: Glowing Broadsword */}
                        <line x1="72" y1="36" x2="86" y2="18" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                        <polygon points="86,18 90,14 86,10 82,14" fill="#67e8f9" />
                        <line x1="68" y1="40" x2="76" y2="32" stroke="#f59e0b" strokeWidth="3" />
                    </svg>
                );

            case 'rogue':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]">
                        {/* Shadow */}
                        <ellipse cx="50" cy="88" rx="24" ry="7" fill="rgba(0,0,0,0.5)" />
                        {/* Body / Leather Cloak */}
                        <path d="M34 45 Q50 40 66 45 L70 78 Q50 82 30 78 Z" fill="#2e1065" stroke="#d946ef" strokeWidth="2.5" />
                        {/* Head / Hood */}
                        <path d="M32 30 Q50 10 68 30 Q68 46 50 48 Q32 46 32 30 Z" fill="#3b0764" stroke="#d946ef" strokeWidth="2.5" />
                        {/* Glowing Purple Eyes */}
                        <ellipse cx="44" cy="30" rx="3" ry="1.5" fill="#f0abfc" />
                        <ellipse cx="56" cy="30" rx="3" ry="1.5" fill="#f0abfc" />
                        {/* Dual Daggers */}
                        <path d="M22 55 L10 40 L16 38 L26 50 Z" fill="#e879f9" stroke="#a855f7" strokeWidth="1.5" />
                        <path d="M78 55 L90 40 L84 38 L74 50 Z" fill="#e879f9" stroke="#a855f7" strokeWidth="1.5" />
                    </svg>
                );

            case 'mage':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                        {/* Shadow */}
                        <ellipse cx="50" cy="88" rx="26" ry="8" fill="rgba(0,0,0,0.5)" />
                        {/* Robe */}
                        <path d="M32 44 L68 44 L76 82 L24 82 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
                        {/* Hood */}
                        <path d="M34 32 Q50 8 66 32 Q66 48 50 48 Q34 48 34 32 Z" fill="#047857" stroke="#10b981" strokeWidth="2.5" />
                        {/* Dark Face & Glowing Eyes */}
                        <ellipse cx="50" cy="32" rx="10" ry="7" fill="#022c22" />
                        <circle cx="45" cy="32" r="2.5" fill="#6ee7b7" />
                        <circle cx="55" cy="32" r="2.5" fill="#6ee7b7" />
                        {/* Mystic Staff */}
                        <line x1="22" y1="20" x2="22" y2="84" stroke="#78350f" strokeWidth="3.5" />
                        <circle cx="22" cy="18" r="7" fill="#10b981" />
                        <circle cx="22" cy="18" r="4" fill="#a7f3d0" className="animate-ping opacity-75" />
                        {/* Floating Runes */}
                        <text x="76" y="32" fill="#34d399" fontSize="12" fontWeight="bold">Ω</text>
                        <text x="80" y="55" fill="#34d399" fontSize="10" fontWeight="bold">✦</text>
                    </svg>
                );

            case 'hunter':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                        {/* Shadow */}
                        <ellipse cx="50" cy="88" rx="24" ry="7" fill="rgba(0,0,0,0.5)" />
                        {/* Body / Leather Tunics */}
                        <rect x="36" y="44" width="28" height="34" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                        {/* Head & Elf Ears */}
                        <circle cx="50" cy="30" r="14" fill="#d97706" />
                        <polygon points="32,26 38,24 36,32" fill="#d97706" />
                        <polygon points="68,26 62,24 64,32" fill="#d97706" />
                        {/* Eyes & Brow */}
                        <ellipse cx="45" cy="28" rx="2" ry="1.5" fill="#fef08a" />
                        <ellipse cx="55" cy="28" rx="2" ry="1.5" fill="#fef08a" />
                        {/* Composite Bow & Arrow */}
                        <path d="M72 15 Q90 50 72 85" fill="none" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="72" y1="15" x2="72" y2="85" stroke="#fef08a" strokeWidth="1.5" />
                        <line x1="45" y1="50" x2="88" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                        <polygon points="88,50 82,46 82,54" fill="#fef08a" />
                    </svg>
                );

            case 'berserker':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">
                        {/* Shadow */}
                        <ellipse cx="50" cy="88" rx="28" ry="8" fill="rgba(0,0,0,0.5)" />
                        {/* Muscular Torso */}
                        <path d="M30 42 L70 42 L64 78 L36 78 Z" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2.5" />
                        <rect x="38" y="74" width="24" height="6" fill="#b91c1c" />
                        {/* Head, Beard & Warpaint */}
                        <circle cx="50" cy="28" r="15" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" />
                        {/* Beard */}
                        <path d="M40 32 Q50 46 60 32 Z" fill="#1c1917" />
                        <circle cx="45" cy="26" r="2" fill="#fca5a5" />
                        <circle cx="55" cy="26" r="2" fill="#fca5a5" />
                        {/* Massive Two-Handed Molten Axe */}
                        <line x1="16" y1="16" x2="78" y2="78" stroke="#292524" strokeWidth="4.5" />
                        <path d="M12 10 Q28 6 36 24 Q24 34 16 28 Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
                        <path d="M26 4 Q4 16 10 38 Q22 28 20 18 Z" fill="#f97316" />
                    </svg>
                );

            case 'cleric':
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
                        {/* Shadow */}
                        <ellipse cx="50" cy="88" rx="26" ry="8" fill="rgba(0,0,0,0.5)" />
                        {/* White/Blue Robe */}
                        <path d="M34 42 L66 42 L74 82 L26 82 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2.5" />
                        {/* Golden Holy Cross */}
                        <path d="M48 50 H52 V66 H48 Z M44 54 H56 V58 H44 Z" fill="#f59e0b" />
                        {/* Head & Halo */}
                        <circle cx="50" cy="18" r="14" fill="none" stroke="#fde047" strokeWidth="2.5" className="animate-pulse" />
                        <circle cx="50" cy="30" r="13" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="1.5" />
                        <circle cx="46" cy="28" r="2" fill="#0284c7" />
                        <circle cx="54" cy="28" r="2" fill="#0284c7" />
                        {/* Holy Scepter */}
                        <line x1="76" y1="20" x2="76" y2="84" stroke="#d97706" strokeWidth="3" />
                        <circle cx="76" cy="20" r="6" fill="#38bdf8" />
                        <circle cx="76" cy="20" r="3" fill="#ffffff" />
                    </svg>
                );

            default:
                return (
                    <div className="w-full h-full rounded-full bg-cyan-900 border-2 border-cyan-400 flex items-center justify-center font-bold text-cyan-300">
                        {heroClass.toUpperCase().slice(0, 2)}
                    </div>
                );
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
            {renderCharacterSvg()}
        </div>
    );
}
