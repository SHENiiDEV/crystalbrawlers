import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Zap, Coins, Server } from 'lucide-react';

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            category: 'Account & Security',
            q: 'How does the 18+ age verification work?',
            a: 'Crystal Brawlers strictly requires players to be at least 18 years old upon registration. This ensures full compliance with international consumer protection laws and digital gaming regulations.',
        },
        {
            category: 'Account & Security',
            q: 'Why is my country not available in the registration dropdown?',
            a: 'In adherence to global sanctions, international regulatory frameworks, and AML compliance directives, registrations from restricted jurisdictions (including Russia, Belarus, DPRK, Iran, Syria, etc.) are strictly prohibited across our platform and backend APIs.',
        },
        {
            category: 'Gameplay & Netcode',
            q: 'How does real-time multiplayer work in the browser?',
            a: 'We operate custom Node.js game servers running at 30 ticks per second (30 TPS). The server computes authoritative physics, hitbox checks, and bot pathfinding, transmitting synchronized states over low-latency WebSockets.',
        },
        {
            category: 'Gameplay & Netcode',
            q: 'Are bots always present on the arena map?',
            a: 'Yes! To eliminate wait times and ensure constant combat action, the server maintains a healthy population of AI training bots that drop gold coins and combat score upon defeat.',
        },
        {
            category: 'Purchases & Virtual Currency',
            q: 'How do I earn Gold Coins and Crystals?',
            a: 'Gold Coins are earned by defeating bots and players in arena battles. You start with 25,000 Coins and 1,500 Crystals upon registration, which you can spend on attribute upgrades in the Garage and cosmetic skins in the Store.',
        },
        {
            category: 'Purchases & Virtual Currency',
            q: 'Can I get a refund for skins or virtual upgrades?',
            a: 'Virtual items (such as skins and stat upgrades) are consumed upon redemption and cannot be returned for real-world currency. All in-game purchases using earned coins are final.',
        },
    ];

    return (
        <MainLayout>
            <Head title="FAQ • Frequently Asked Questions" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 mb-2 shadow-lg shadow-cyan-950/60">
                        <HelpCircle className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-display text-white tracking-wider text-outline-sm">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xs sm:text-sm text-violet-100/60 max-w-xl mx-auto">
                        Find answers to common questions regarding account compliance, netcode mechanics, and store items.
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${ isOpen ? 'bg-[#241548]/90 border-cyan-500/40 shadow-lg shadow-cyan-950/30' : 'bg-[#241548]/50 border-[#16102b] hover:border-[#16102b]' }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-display font-extrabold text-sm sm:text-base text-white tracking-wide uppercase transition"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1a1136] text-cyan-400 border-[3px] border-[#16102b] font-sans font-bold">
                                            {faq.category}
                                        </span>
                                        {faq.q}
                                    </span>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-violet-200/50 shrink-0" />
                                    )}
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-5 text-xs sm:text-sm text-violet-100/75 leading-relaxed border-t-[3px] border-[#16102b]/60 pt-3 animate-in fade-in duration-200">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Still Have Questions Box */}
                <div className="bg-[#1a1136]/80 border-[3px] border-[#16102b] rounded-[1.5rem] p-6 sm:p-8 text-center space-y-3">
                    <h3 className="text-lg font-display text-white">Still Have Questions?</h3>
                    <p className="text-xs text-violet-100/60 max-w-md mx-auto">
                        Our support team and gladiator community are active 24/7 on Discord to help you troubleshoot or discuss game balance.
                    </p>
                    <div className="pt-2">
                        <a
                            href="https://discord.com"
                            target="_blank"
                            rel="noreferrer"
                            className="toon-btn toon-btn-accent"
                        >
                            Open Support Ticket on Discord
                        </a>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
