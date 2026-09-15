import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Cookie, ShieldCheck } from 'lucide-react';

export default function CookiePolicy() {
    const { company } = usePage().props;
    const companyName = company?.name || 'Crystal Brawlers Interactive Ltd.';
    const companyEmail = company?.email || 'info@crystalbrawlers.com';

    return (
        <MainLayout>
            <Head title="Cookie Policy • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                <div className="space-y-3 border-b border-slate-800 pb-6">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Privacy & Tracking</span>
                    <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wider">
                        Cookie Policy
                    </h1>
                    <p className="text-xs text-slate-500">
                        EU ePrivacy Directive & GDPR Compliant Cookie Disclosure
                    </p>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files stored on your browser or device when visiting {companyName} web platforms. They enable our servers to recognize your session, maintain secure authentication, and remember your character preferences.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">2. Categories of Cookies We Use</h2>
                        <div className="space-y-3 pt-2">
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <strong className="text-cyan-400 block mb-1">Strictly Necessary Cookies (Essential)</strong>
                                <span className="text-slate-400">Required for user login, CSRF security tokens, session management, and shopping cart operations. Cannot be disabled.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <strong className="text-amber-400 block mb-1">Functional & Preference Cookies</strong>
                                <span className="text-slate-400">Stores in-game audio volume preferences, selected hero class preview states, and UI language selections.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <strong className="text-emerald-400 block mb-1">Security & Anti-Cheat Cookies</strong>
                                <span className="text-slate-400">Maintains WebSocket handshake authorization tokens to prevent session hijacking and unauthorized arena injections.</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">3. Managing Your Cookie Preferences</h2>
                        <p>
                            You may configure your browser settings at any time to block or notify you about cookies. For assistance regarding cookie management, email <span className="text-cyan-400 font-bold">{companyEmail}</span>. Note that disabling strictly necessary session cookies will prevent login and gameplay functionality.
                        </p>
                    </section>

                </div>

            </div>
        </MainLayout>
    );
}
