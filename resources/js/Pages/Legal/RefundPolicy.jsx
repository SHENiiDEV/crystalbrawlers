import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RefundPolicy() {
    return (
        <MainLayout>
            <Head title="Refund & Cancellation Policy • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                <div className="space-y-3 border-b border-slate-800 pb-6">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Compliance Document</span>
                    <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wider">
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-xs text-slate-500">
                        Effective Date: September 15, 2026 • Stripe & Payment Processing Consumer Protection Directives
                    </p>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">1. Digital Goods & Virtual Content</h2>
                        <p>
                            All purchases made within Crystal Brawlers (including Gold Coins, Crystals, Character Skins, and Stat Upgrades) constitute non-tangible digital items that are delivered immediately upon successful transaction completion.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">2. Right of Withdrawal & Exceptions</h2>
                        <p>
                            Under European Union Consumer Rights Directives (2011/83/EU) and global merchant guidelines, by initiating and confirming the purchase of digital content, you explicitly request immediate performance of the contract and acknowledge that you lose your statutory 14-day right of withdrawal once the digital content is made available in your account.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">3. Eligible Refund Scenarios</h2>
                        <p>Refunds may be evaluated and granted on a case-by-case basis under the following verified conditions:</p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li><strong>Duplicate Charges:</strong> Technical glitches resulting in multiple billings for a single order.</li>
                            <li><strong>Non-Delivery of Content:</strong> Purchased items fail to credit to the player account due to backend synchronization faults.</li>
                            <li><strong>Fraudulent / Unauthorized Transactions:</strong> Confirmed unauthorized card usage reported within 48 hours.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">4. Refund Request Process</h2>
                        <p>
                            To submit a refund inquiry, email our billing department at <span className="text-cyan-400 font-bold">info@crystalbrawlers.com</span> with your Order Invoice Number (e.g., <code>INV-2026-XXXXX</code>), registered account email, and explanation of the issue. Requests are reviewed within 2-3 business days.
                        </p>
                    </section>

                </div>

            </div>
        </MainLayout>
    );
}
