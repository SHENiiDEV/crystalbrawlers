import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Lock, ShieldCheck, EyeOff } from 'lucide-react';

export default function Privacy() {
    const { company } = usePage().props;
    const companyName = company?.name || 'Crystal Brawlers Interactive Ltd.';
    const companyEmail = company?.email || 'info@crystalbrawlers.com';

    return (
        <MainLayout>
            <Head title="Privacy Policy • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                <div className="space-y-3 border-b-[3px] border-[#16102b] pb-6">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Privacy & Compliance</span>
                    <h1 className="text-3xl sm:text-4xl font-display text-white tracking-wider text-outline-sm">
                        Privacy Policy (GDPR & CCPA Compliant)
                    </h1>
                    <p className="text-xs text-violet-200/50">
                        Effective Date: September 15, 2026 • Your Data Rights & Protection Standards
                    </p>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-violet-100/75 leading-relaxed">
                    
                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">1. Information We Collect</h2>
                        <p>
                            {companyName} ("Crystal Brawlers") collects personal information that you provide when registering: your name, email address, password (hashed using BCRYPT), date of birth (for 18+ verification), phone number, and residence location for billing compliance.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">2. How We Use Your Data</h2>
                        <ul className="list-disc pl-5 space-y-1 text-violet-100/60">
                            <li>To authenticate and maintain your player profile and match history.</li>
                            <li>To verify eligibility under sanctions compliance rules.</li>
                            <li>To process virtual store transactions securely.</li>
                            <li>To detect and prevent fraudulent bot activity and malicious hacks.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">3. Data Security & Storage</h2>
                        <p>
                            We implement stringent technical controls, encrypted database connections, HTTPS transport layers, and HMAC signed WebSocket communication tokens to protect player data from unauthorized access.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-display text-white">4. Your GDPR & CCPA Rights</h2>
                        <p>
                            Under GDPR and California Consumer Privacy Act (CCPA), you have the right to request access, modification, or complete deletion of your personal data at any time by contacting <span className="text-cyan-400 font-bold">{companyEmail}</span>.
                        </p>
                    </section>

                </div>

            </div>
        </MainLayout>
    );
}
