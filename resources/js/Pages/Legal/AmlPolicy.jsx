import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AmlPolicy() {
    return (
        <MainLayout>
            <Head title="Anti-Money Laundering & Sanctions Policy • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                <div className="space-y-3 border-b border-slate-800 pb-6">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Regulatory Framework</span>
                    <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wider">
                        Anti-Money Laundering (AML) & Sanctions Policy
                    </h1>
                    <p className="text-xs text-slate-500">
                        In accordance with FATF Guidelines, OFAC Directives, and EU Anti-Money Laundering Directives
                    </p>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">1. Policy Statement</h2>
                        <p>
                            Crystal Brawlers Interactive Ltd. is committed to maintaining high standards of compliance with all applicable anti-money laundering, counter-terrorist financing (CTF), and international trade sanctions regulations.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">2. Prohibited Jurisdictions & Sanctions Enforcement</h2>
                        <p>
                            We maintain strict technological and database-level blocks prohibiting user registration, gameplay access, and payment processing from comprehensively sanctioned jurisdictions, including:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-bold text-slate-300">
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Russian Federation</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Republic of Belarus</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">DPRK (North Korea)</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Islamic Republic of Iran</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Syrian Arab Republic</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Republic of Cuba</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Republic of the Sudan</span>
                            <span className="bg-slate-900 p-2 rounded border border-slate-800">Bolivarian Republic of Venezuela</span>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">3. Customer Due Diligence (CDD)</h2>
                        <p>
                            Our registration protocol mandates verification of age (18+ verification), residential address, contact number, and country of origin prior to granting account activation and transaction privileges.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">4. Suspicious Activity Monitoring</h2>
                        <p>
                            Our automated fraud detection systems continuously evaluate transaction frequency, velocity, and geographic IP consistency. Any detected attempts to bypass sanctions via VPN or spoofed credentials trigger immediate account suspension and regulatory reporting.
                        </p>
                    </section>

                </div>

            </div>
        </MainLayout>
    );
}
