import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Show({ invoice }) {
    const { company } = usePage().props;
    const companyName = company?.name || 'Crystal Brawlers Interactive Ltd.';
    const companyNumber = company?.number || '2026-EU-984210';
    const companyAddress = company?.address || 'Tower 4, Fintech Square, Level 8, London, UK';
    const companyEmail = company?.email || 'info@crystalbrawlers.com';

    const handlePrint = () => {
        window.print();
    };

    return (
        <MainLayout>
            <Head title={`Invoice #${invoice.invoice_number} • Crystal Brawlers`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
                
                {/* Navigation and Print Header */}
                <div className="flex items-center justify-between no-print">
                    <Link
                        href="/invoices"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition font-heading"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Invoices
                    </Link>

                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider transition font-heading flex items-center gap-1.5"
                    >
                        <Printer className="w-4 h-4" /> Print / Save PDF
                    </button>
                </div>

                {/* Printable Invoice Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
                    
                    {/* Invoice Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-800 pb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-cyan-500 text-black font-black flex items-center justify-center font-heading text-xs">
                                    CB
                                </div>
                                <span className="text-xl font-black font-heading uppercase text-white print:text-black">
                                    Crystal Brawlers
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 print:text-slate-600 leading-relaxed">
                                {companyName}<br />
                                Registration No: {companyNumber}<br />
                                Address: {companyAddress}<br />
                                Support: {companyEmail}
                            </p>
                        </div>

                        <div className="text-left sm:text-right space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Official Receipt</span>
                            <h2 className="text-xl font-mono font-black text-cyan-400 print:text-blue-600">
                                {invoice.invoice_number}
                            </h2>
                            <p className="text-xs text-slate-400 print:text-slate-600">
                                Date: {new Date(invoice.created_at).toLocaleDateString()}
                            </p>
                            <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase print:bg-green-100 print:text-green-800">
                                Status: {invoice.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Bill To & Payment Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500">Billed To:</span>
                            <p className="font-bold text-white print:text-black text-sm">{invoice.billing_name}</p>
                            <p className="text-slate-400 print:text-slate-600">{invoice.billing_email}</p>
                            <p className="text-slate-400 print:text-slate-600">
                                {invoice.billing_address || 'Digital Goods Delivery'}, {invoice.billing_city} {invoice.billing_post_code}<br />
                                {invoice.billing_country}
                            </p>
                        </div>

                        <div className="space-y-1 sm:text-right">
                            <span className="text-[10px] font-bold uppercase text-slate-500">Payment Information:</span>
                            <p className="font-bold text-amber-400 print:text-amber-800">{invoice.payment_method}</p>
                            <p className="text-slate-400 print:text-slate-600">Currency: {invoice.currency}</p>
                            <p className="text-slate-400 print:text-slate-600">Fulfillment: Instant In-Game Delivery</p>
                        </div>
                    </div>

                    {/* Item Table */}
                    <div className="border border-slate-800 rounded-2xl overflow-hidden print:border-slate-300">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                                <tr>
                                    <td className="py-4 px-4 font-bold text-white print:text-black">
                                        {invoice.item_name}
                                    </td>
                                    <td className="py-4 px-4 uppercase text-cyan-400 print:text-blue-600">
                                        {invoice.item_type}
                                    </td>
                                    <td className="py-4 px-4 text-right font-black font-heading text-sm text-amber-400 print:text-black">
                                        {invoice.price_coins > 0 && `${invoice.price_coins.toLocaleString()} 🪙`}
                                        {invoice.price_crystals > 0 && `${invoice.price_crystals} 💎`}
                                        {invoice.amount_usd > 0 && `$${invoice.amount_usd} USD`}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Note */}
                    <div className="border-t border-slate-800 pt-6 text-[11px] text-slate-500 print:text-slate-600 text-center space-y-1">
                        <p>This document serves as proof of digital purchase in the Crystal Brawlers online platform.</p>
                        <p>Questions or inquiries? Contact support at <strong className="text-slate-300 print:text-black">{companyEmail}</strong>.</p>
                    </div>

                </div>

            </div>
        </MainLayout>
    );
}
