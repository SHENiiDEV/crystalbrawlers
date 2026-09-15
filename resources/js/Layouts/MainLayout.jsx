import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function MainLayout({ children, title }) {
    const { flash } = usePage().props;
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setAlertMessage(flash.success);
            setAlertType('success');
        } else if (flash?.error) {
            setAlertMessage(flash.error);
            setAlertType('error');
        } else if (flash?.message) {
            setAlertMessage(flash.message);
            setAlertType('info');
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-[#120c24] flex flex-col selection:bg-amber-300 selection:text-[#16102b]">
            <Navbar />

            {/* Flash Banner notification */}
            {alertMessage && (
                <div className="fixed top-24 right-4 z-50 max-w-md">
                    <div className={`toon-panel flex items-center gap-3 p-4 animate-pop ${
                        alertType === 'success'
                            ? 'text-lime-200'
                            : alertType === 'error'
                            ? 'text-rose-200'
                            : 'text-cyan-200'
                    }`}>
                        {alertType === 'success' && <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />}
                        {alertType === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                        {alertType === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
                        
                        <p className="text-xs font-semibold flex-1">{alertMessage}</p>
                        
                        <button 
                            onClick={() => setAlertMessage(null)}
                            className="p-1 text-slate-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <main className="flex-1 bg-arena-sky">
                {children}
            </main>

            <Footer />
        </div>
    );
}
