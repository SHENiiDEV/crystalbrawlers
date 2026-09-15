import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-[#16102b] bg-[#241548]/80">
                    <h3 className="text-lg font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-violet-100/60 hover:text-white hover:bg-[#2a1a52] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 text-sm text-violet-100/75 space-y-4">
                    {children}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t-[3px] border-[#16102b] bg-[#241548]/60 flex justify-end">
                    <button
                        onClick={onClose}
                        className="toon-btn toon-btn-accent"
                    >
                        I Understand & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
