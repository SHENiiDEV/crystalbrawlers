import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { ShieldCheck, Lock, CheckCircle2, CreditCard, Cpu } from 'lucide-react';

export default function PaymentSecurity() {
    return (
        <MainLayout>
            <Head title="Payment Security & PCI DSS Standards • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
                
                <div className="space-y-3 border-b border-slate-800 pb-6">
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Trust & Security</span>
                    <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white tracking-wider">
                        Payment Security & PCI DSS Compliance
                    </h1>
                    <p className="text-xs text-slate-500">
                        Information regarding data encryption, payment gateway underwriting, and transaction tokenization
                    </p>
                </div>

                {/* Logos Highlight Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div>
                        <h3 className="text-lg font-black font-heading uppercase text-white">
                            Certified Payment Processing
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-md">
                            All card transactions are processed via Tier-1 PCI DSS Level 1 certified gateways ensuring your sensitive credit card data never touches our application servers.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="h-9 w-20 flex items-center justify-center bg-white rounded-lg p-1.5 shadow">
                            <img src="/images/payments/visa.png" alt="Visa" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="h-9 w-16 flex items-center justify-center bg-white rounded-lg p-1 shadow">
                            <img src="/images/payments/mastercard.png" alt="Mastercard" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="h-9 w-20 flex items-center justify-center bg-white rounded-lg p-1.5 shadow">
                            <img src="/images/payments/pci-dss.png" alt="PCI DSS" className="max-h-full max-w-full object-contain" />
                        </div>
                    </div>
                </div>

                <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">1. End-to-End Encryption (TLS 1.3)</h2>
                        <p>
                            All communication between your browser, our web portal, and our banking partners is protected by high-grade 256-bit TLS encryption with Perfect Forward Secrecy (PFS).
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">2. Tokenization Architecture</h2>
                        <p>
                            We employ direct tokenization. When you submit payment information for virtual coins or packages, your card details are transmitted directly to the secure PCI-compliant processor vault. Crystal Brawlers only receives a cryptographically signed token representing the successful charge.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-black font-heading uppercase text-white">3. Automated Invoicing & Purchase Receipts</h2>
                        <p>
                            Every completed transaction generates an immutable order invoice and receipt sent directly to your registered email address from <span className="text-cyan-400 font-bold">info@crystalbrawlers.com</span>. You can also view and print your complete order history under the <Link href="/invoices" className="text-cyan-400 hover:underline">Order Receipts</Link> portal.
                        </p>
                    </section>

                </div>

            </div>
        </MainLayout>
    );
}
