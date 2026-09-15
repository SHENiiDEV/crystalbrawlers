import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { FileText, Receipt, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function Index({ invoices }) {
    return (
        <MainLayout>
            <Head title="Order Receipts & Invoices • Crystal Brawlers" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                            <Receipt className="w-4 h-4" /> Billing & Order Records
                        </div>
                        <h1 className="text-3xl font-black font-heading uppercase text-white tracking-wider mt-1">
                            Order Invoices & Receipts
                        </h1>
                    </div>

                    <Link
                        href="/store"
                        className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold uppercase tracking-wider text-slate-200 transition inline-flex items-center gap-2 self-start"
                    >
                        <ShoppingBag className="w-4 h-4 text-amber-400" /> Back to Store
                    </Link>
                </div>

                {/* Table or Empty State */}
                {invoices.data.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                        <h3 className="text-lg font-bold text-white uppercase font-heading">No Invoices Found</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            When you purchase skins or currency packages in the Store, your official digital receipts will be listed here.
                        </p>
                    </div>
                ) : (
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                                        <th className="py-3 px-4">Invoice #</th>
                                        <th className="py-3 px-4">Item</th>
                                        <th className="py-3 px-4">Payment Method</th>
                                        <th className="py-3 px-4">Price Paid</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4 text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {invoices.data.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                                            <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                                                {inv.invoice_number}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-white">
                                                {inv.item_name}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-300">
                                                {inv.payment_method}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-amber-400">
                                                {inv.price_coins > 0 && `${inv.price_coins.toLocaleString()} 🪙`}
                                                {inv.price_crystals > 0 && `${inv.price_crystals} 💎`}
                                                {inv.amount_usd > 0 && `$${inv.amount_usd} USD`}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-400">
                                                {new Date(inv.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={`/invoices/${inv.id}`}
                                                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold font-heading uppercase text-xs"
                                                >
                                                    View <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}
