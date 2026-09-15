import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ShieldCheck, Scale, AlertCircle } from 'lucide-react';

export default function Terms() {
    return (
        <MainLayout>
            <Head title="Terms and Conditions • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                <div className="space-y-3 border-b-[3px] border-[#16102b] pb-6">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Legal Document</span>
                    <h1 className="text-3xl sm:text-4xl font-display text-white tracking-wider text-outline-sm">
                        Terms and Conditions of Service
                    </h1>
                    <p className="text-xs text-violet-200/50">
                        Last Updated: September 15, 2026 • Compliant with EU / US Consumer Directives & Stripe Underwriting Standards
                    </p>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-violet-100/75 leading-relaxed">
                    
                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">1. Agreement to Terms</h2>
                        <p>
                            By creating an account, accessing, or using the Crystal Brawlers web portal and real-time game servers, you agree to be bound by these Terms and Conditions. If you do not agree, you must immediately cease use of our services.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">2. Eligibility & Age Restriction (18+)</h2>
                        <p>
                            You must be at least 18 years old to register an account and participate in virtual economy activities. By registering, you warrant that you are legally competent and meet all jurisdiction-specific age criteria.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">3. Sanctioned Jurisdictions & AML Policy</h2>
                        <p>
                            In strict accordance with international trade sanctions and Anti-Money Laundering (AML) regulations, access and account registration are strictly prohibited from certain jurisdictions, including but not limited to the Russian Federation, Belarus, North Korea, Iran, Syria, Cuba, and other restricted territories. Any attempt to circumvent these geo-restrictions via VPN or API spoofing will result in immediate and permanent account termination.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">4. Virtual Currency & Purchases</h2>
                        <p>
                            Gold Coins and Crystals are virtual license units granted for entertainment purposes within the Crystal Brawlers ecosystem. They have no monetary cash value, are non-transferable, and non-refundable once redeemed for in-game upgrades or cosmetics.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">5. Fair Play & Anti-Cheat Policies</h2>
                        <p>
                            Use of automated scripts, bot nets, packet manipulation, or unauthorized client modifications is strictly prohibited. All arena physics calculations are authoritative on the Node.js server engine.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">6. Limitation of Liability & Contact</h2>
                        <p>
                            Crystal Brawlers is provided "as-is". For legal inquiries or support questions, contact <span className="text-cyan-400 font-bold">legal@crystalbrawlers.com</span>.
                        </p>
                    </section>

                </div>

            </div>
        </MainLayout>
    );
}
