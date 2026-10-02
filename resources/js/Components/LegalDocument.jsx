import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, FileText, Mail } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';
import { policies, POLICY_DATE, POLICY_VERSION } from '../Pages/Legal/policies';

export function PolicyBody({ policyKey }) {
    const policy = policies[policyKey];
    return <div className="space-y-9">
        {policy.sections.map(([title, paragraphs], index) => (
            <section key={title} id={`section-${index + 1}`} className="scroll-mt-28 space-y-3">
                <h2 className="text-xl font-bold text-white leading-snug">{index + 1}. {title}</h2>
                {paragraphs.map((paragraph) => <p key={paragraph} className="text-base text-violet-100/80 leading-7 break-words">{paragraph.split(/(https:\/\/policies\.google\.com\/privacy|ico\.org\.uk)/).map((part, partIndex) => part === 'https://policies.google.com/privacy' || part === 'ico.org.uk' ? <a key={partIndex} href={part.startsWith('https://') ? part : `https://${part}`} className="text-cyan-300 underline">{part === 'ico.org.uk' ? 'ICO' : 'Google Privacy Policy'}</a> : part)}</p>)}
            </section>
        ))}
    </div>;
}

export default function LegalDocument({ policyKey }) {
    const { company = {}, legal = {} } = usePage().props;
    const policy = policies[policyKey];

    return <MainLayout>
        <Head title={`${policy.title} • Crystal Brawlers`} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <nav aria-label="Legal policies" className="flex flex-wrap gap-2 mb-10">
                {Object.entries(policies).map(([key, item]) => <Link key={key} href={item.href} aria-current={key === policyKey ? 'page' : undefined}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${key === policyKey ? 'bg-cyan-300 text-[#16102b] border-cyan-300' : 'border-violet-300/20 text-violet-100/75 hover:bg-violet-300/10'}`}>
                    {item.title}
                </Link>)}
            </nav>
            <header className="border-b border-violet-300/20 pb-8 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-3">Crystal Brawlers / {policy.category}</p>
                <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">{policy.title}</h1>
                <p className="mt-4 text-lg text-violet-100/70 max-w-2xl">{policy.description}</p>
                <p className="mt-5 text-sm text-violet-200/60">Last updated {POLICY_DATE} <span aria-hidden="true">·</span> Version {POLICY_VERSION}</p>
            </header>
            <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
                <aside className="lg:sticky lg:top-28 space-y-6">
                    <nav aria-label="Contents" className="rounded-xl border border-violet-300/20 bg-[#1b1233] p-5">
                        <p className="text-sm font-bold text-white flex items-center gap-2 mb-4"><FileText size={16} className="text-cyan-300" /> In this document</p>
                        <ol className="space-y-3 text-sm text-violet-100/70">
                            {policy.sections.map(([title], index) => <li key={title}><a href={`#section-${index + 1}`} className="hover:text-cyan-300 focus-visible:outline focus-visible:outline-cyan-300">{index + 1}. {title}</a></li>)}
                        </ol>
                    </nav>
                    <Link href="/contact" className="flex items-center justify-between text-sm font-bold text-cyan-300 hover:underline">Contact support <ArrowUpRight size={16} /></Link>
                </aside>
                <article className="min-w-0">
                    <div className="border-l-4 border-cyan-300 bg-[#21163c] px-5 py-4 rounded-r-lg mb-8">
                        <p className="text-xs uppercase tracking-wider font-bold text-cyan-300 mb-2">At a glance</p>
                        <p className="text-base leading-7 text-violet-50">{policy.summary}</p>
                    </div>
                    <PolicyBody policyKey={policyKey} />
                    {policyKey === 'cookies' && <div className="mt-8 border border-violet-300/20 rounded-xl p-5 text-sm text-violet-100/80 space-y-2">
                        <h2 className="text-lg text-white font-bold">Current session settings</h2>
                        <p>Session cookie: <code className="break-all">{legal.session_cookie || 'Application session cookie'}</code></p>
                        <p>Session and XSRF-TOKEN lifetime: {legal.session_lifetime ?? 120} minutes{legal.session_expire_on_close ? ', or until the browser closes' : ' of inactivity'}.</p>
                    </div>}
                    <section className="mt-10 border-t border-violet-300/20 pt-7 space-y-3" aria-label="Merchant information">
                        <h2 className="text-xl text-white font-bold">Operator & contact</h2>
                        <dl className="grid sm:grid-cols-[150px_1fr] gap-x-5 gap-y-2 text-sm text-violet-100/75">
                            <dt>Operator</dt><dd>{company.name || 'Not yet confirmed'}</dd>
                            <dt>Registration number</dt><dd>{company.number || 'Not yet confirmed'}</dd>
                            <dt>Registered address</dt><dd>{company.address || 'Not yet confirmed'}</dd>
                            <dt>Email</dt><dd><a href={`mailto:${company.email || 'info@crystalbrawlers.com'}`} className="text-cyan-300 hover:underline break-all inline-flex items-center gap-2"><Mail size={14} />{company.email || 'info@crystalbrawlers.com'}</a></dd>
                        </dl>
                    </section>
                </article>
            </div>
        </div>
    </MainLayout>;
}
