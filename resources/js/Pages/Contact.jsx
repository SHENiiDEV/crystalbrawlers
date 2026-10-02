import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function Contact() {
    const { company = {} } = usePage().props;
    const email = company.email || 'info@crystalbrawlers.com';
    const [form, setForm] = useState({ name: '', email: '', subject: 'General support', message: '' });
    const mailto = `mailto:${email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nAccount email: ${form.email}\n\n${form.message}`)}`;

    return <MainLayout>
        <Head title="Contact & Support • Crystal Brawlers" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Crystal Brawlers / Support</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white">Contact & support</h1>
            <p className="mt-4 text-lg text-violet-100/70 max-w-2xl">Help with your account, digital content, refunds and privacy. Email us with the details below so we can find your request.</p>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
                <div className="space-y-6">
                    <section className="rounded-xl border border-violet-300/20 bg-[#1b1233] p-6 space-y-4">
                        <h2 className="text-xl text-white font-bold flex items-center gap-2"><Mail size={20} className="text-cyan-300" /> Customer support</h2>
                        <a href={`mailto:${email}`} className="text-cyan-300 hover:underline break-all text-base">{email}</a>
                        <p className="text-sm leading-6 text-violet-100/75">We aim to acknowledge support and billing enquiries within three business days, Monday to Friday, excluding UK public holidays. Complex enquiries may take longer; we will keep you informed. Statutory deadlines take priority.</p>
                        <p className="text-sm leading-6 text-violet-100/75">Include your account email, order reference if available, item, date and the resolution you would like. Never send a password, full card number or CVV.</p>
                    </section>
                    <section className="rounded-xl border border-violet-300/20 p-6 space-y-3">
                        <h2 className="text-xl text-white font-bold flex items-center gap-2"><MapPin size={20} className="text-cyan-300" /> Operator</h2>
                        <p className="text-base text-violet-100/80">{company.name}</p>
                        <p className="text-sm text-violet-100/70">Registration number: {company.number}</p>
                        <p className="text-sm leading-6 text-violet-100/70">{company.address}</p>
                        <p className="text-sm text-violet-100/60">Support is available by email. Telephone support is not currently offered.</p>
                    </section>
                    <nav aria-label="Support policies" className="flex flex-col gap-3 text-sm text-cyan-300">
                        <Link href="/refund-policy" className="hover:underline">Refunds & cancellation <ArrowUpRight className="inline" size={14} /></Link>
                        <Link href="/privacy" className="hover:underline">Privacy requests <ArrowUpRight className="inline" size={14} /></Link>
                        <Link href="/payment-security" className="hover:underline">Payments & digital delivery <ArrowUpRight className="inline" size={14} /></Link>
                    </nav>
                </div>
                <section className="rounded-xl border border-violet-300/20 bg-[#1b1233] p-6 sm:p-8">
                    <h2 className="text-xl text-white font-bold">Prepare an email</h2>
                    <p className="text-sm text-violet-100/70 leading-6 mt-3">This form opens a draft in your email app. Review it and send it there. If your device has no email app configured, write directly to the support address.</p>
                    <form onSubmit={(event) => { event.preventDefault(); window.location.href = mailto; }} className="mt-6 space-y-4">
                        {[['name', 'Your name', 'text'], ['email', 'Account email', 'email']].map(([key, label, type]) => <div key={key}>
                            <label htmlFor={`support-${key}`} className="block text-sm text-violet-100 mb-2">{label}</label>
                            <input id={`support-${key}`} type={type} required maxLength={255} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full bg-[#120c24] border border-violet-300/30 rounded-lg px-4 py-3 text-white focus:outline-2 focus:outline-cyan-300" />
                        </div>)}
                        <div>
                            <label htmlFor="support-subject" className="block text-sm text-violet-100 mb-2">Topic</label>
                            <select id="support-subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="w-full bg-[#120c24] border border-violet-300/30 rounded-lg px-4 py-3 text-white">
                                {['General support', 'Missing or incorrect content', 'Refund / cancellation', 'Unauthorised payment', 'Account closure', 'Privacy request', 'Complaint / decision review'].map((topic) => <option key={topic}>{topic}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="support-message" className="block text-sm text-violet-100 mb-2">Message</label>
                            <textarea id="support-message" required rows={6} maxLength={3000} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="w-full bg-[#120c24] border border-violet-300/30 rounded-lg px-4 py-3 text-white focus:outline-2 focus:outline-cyan-300" />
                        </div>
                        <p className="text-xs leading-5 text-violet-100/60">Your email will include the information entered here. See our <Link href="/privacy" className="text-cyan-300 underline">Privacy Policy</Link> for how support information is used.</p>
                        <button type="submit" className="toon-btn toon-btn-accent w-full justify-center"><Mail size={16} /> Open email draft</button>
                    </form>
                </section>
            </div>
        </div>
    </MainLayout>;
}
