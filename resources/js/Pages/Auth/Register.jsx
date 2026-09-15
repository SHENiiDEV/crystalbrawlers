import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import Modal from '../../Components/Modal';
import { ShieldCheck, User, Mail, Lock, Calendar, Phone, MapPin, Globe, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register({ allowedCountries = [] }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [modalState, setModalState] = useState({ open: false, type: '' });

    const { data, setData, post, processing, errors, reset } = useForm({
        // Step 1: Account & Personal
        name: '',
        surname: '',
        email: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        phone: '',

        // Step 2: Address (Sanctions Filtered)
        street_address: '',
        city: '',
        country: allowedCountries[0]?.code || 'US',
        post_code: '',

        // Step 3: Agreements
        terms_accepted: false,
    });

    // Password strength evaluator
    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
        let score = 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
        if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
        if (score === 3) return { score: 75, label: 'Strong', color: 'bg-cyan-500' };
        return { score: 100, label: 'Very Strong', color: 'bg-emerald-500' };
    };

    // 18+ Date of birth helper
    const calculateAge = (dobString) => {
        if (!dobString) return null;
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(data.date_of_birth);
    const passwordStrength = getPasswordStrength(data.password);

    const validateStep1 = () => {
        if (!data.name || !data.surname || !data.email || !data.password || !data.password_confirmation || !data.date_of_birth || !data.phone) {
            alert('Please fill in all personal information fields.');
            return false;
        }
        if (data.password !== data.password_confirmation) {
            alert('Passwords do not match.');
            return false;
        }
        if (data.password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return false;
        }
        if (age !== null && age < 18) {
            alert('You must be at least 18 years old to register.');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!data.street_address || !data.city || !data.country || !data.post_code) {
            alert('Please fill in all address and location fields.');
            return false;
        }
        return true;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <MainLayout>
            <Head title="Create Gladiator Account • 3-Step Registration" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
                
                {/* Form Card Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-3 shadow-lg shadow-cyan-950/60">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-display text-white tracking-wider text-outline-sm">
                        Create Account
                    </h1>
                    <p className="text-xs text-violet-100/60 mt-1">
                        Step {currentStep} of 3 • Secure Gladiator Enrollment
                    </p>
                </div>

                {/* Step Progress Bar matching reference */}
                <div className="mb-8">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-violet-100/60 mb-2">
                        <span className={currentStep >= 1 ? 'text-cyan-400 font-extrabold' : ''}>1. Personal Info</span>
                        <span className={currentStep >= 2 ? 'text-cyan-400 font-extrabold' : ''}>2. Residence & Billing</span>
                        <span className={currentStep >= 3 ? 'text-cyan-400 font-extrabold' : ''}>3. Agreements</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#241548] border-[3px] border-[#16102b] overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300"
                            style={{ width: `${(currentStep / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="toon-card p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <form onSubmit={currentStep === 3 ? handleSubmit : handleNext} className="space-y-6">

                        {/* STEP 1: Account & Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h3 className="text-sm font-display text-cyan-400 border-b-[3px] border-[#16102b] pb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Personal & Account Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Arthur"
                                            className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                        />
                                        {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">Last Name (Surname)</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.surname}
                                            onChange={(e) => setData('surname', e.target.value)}
                                            placeholder="e.g. Pendelton"
                                            className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                        />
                                        {errors.surname && <p className="text-rose-400 text-[10px] mt-1">{errors.surname}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-violet-100/75 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="gladiator@crystalbrawlers.com"
                                            className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                        />
                                    </div>
                                    {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">Password</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                            <input
                                                type="password"
                                                required
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Min 8 chars, symbols & digits"
                                                className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                            />
                                        </div>
                                        {/* Password Strength Indicator */}
                                        {data.password && (
                                            <div className="mt-1.5 space-y-1">
                                                <div className="h-1.5 w-full bg-[#2a1a52] rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                                                        style={{ width: `${passwordStrength.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] text-violet-100/60">Strength: <strong className="text-violet-50">{passwordStrength.label}</strong></span>
                                            </div>
                                        )}
                                        {errors.password && <p className="text-rose-400 text-[10px] mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                            <input
                                                type="password"
                                                required
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Repeat password"
                                                className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">Date of Birth (18+)</label>
                                        <div className="relative">
                                            <Calendar className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                            <input
                                                type="date"
                                                required
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                            />
                                        </div>
                                        {age !== null && (
                                            <p className={`text-[10px] mt-1 font-semibold ${age >= 18 ? 'text-lime-400' : 'text-rose-400'}`}>
                                                {age >= 18 ? `✓ Verified Age: ${age} years old` : `✕ Age ${age} is under required 18+ limit`}
                                            </p>
                                        )}
                                        {errors.date_of_birth && <p className="text-rose-400 text-[10px] mt-1">{errors.date_of_birth}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                            <input
                                                type="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Address & Sanctions Filter */}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h3 className="text-sm font-display text-cyan-400 border-b-[3px] border-[#16102b] pb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Residence & Billing Location
                                </h3>

                                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                                    <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                    <span>
                                        In compliance with international financial regulations and AML policies, registrations from sanctioned jurisdictions are strictly restricted.
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-violet-100/75 mb-1">Country of Residence</label>
                                    <select
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                    >
                                        {allowedCountries.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.flag} {c.name} ({c.dial_code})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && <p className="text-rose-400 text-[10px] mt-1">{errors.country}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-violet-100/75 mb-1">Street Address, House & Apt</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.street_address}
                                        onChange={(e) => setData('street_address', e.target.value)}
                                        placeholder="e.g. 104 Main Boulevard, Apt 4B"
                                        className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                    />
                                    {errors.street_address && <p className="text-rose-400 text-[10px] mt-1">{errors.street_address}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="e.g. Austin"
                                            className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                        />
                                        {errors.city && <p className="text-rose-400 text-[10px] mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-violet-100/75 mb-1">Postal / Zip Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.post_code}
                                            onChange={(e) => setData('post_code', e.target.value)}
                                            placeholder="e.g. 78701"
                                            className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                        />
                                        {errors.post_code && <p className="text-rose-400 text-[10px] mt-1">{errors.post_code}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Agreements & Consent */}
                        {currentStep === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h3 className="text-sm font-display text-cyan-400 border-b-[3px] border-[#16102b] pb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Review & Legal Agreements
                                </h3>

                                {/* Summary Recap */}
                                <div className="bg-[#1a1136] p-4 rounded-xl border-[3px] border-[#16102b] space-y-2 text-xs">
                                    <div className="flex justify-between text-violet-100/60">
                                        <span>Gladiator Name:</span>
                                        <strong className="text-violet-50">{data.name} {data.surname}</strong>
                                    </div>
                                    <div className="flex justify-between text-violet-100/60">
                                        <span>Email Address:</span>
                                        <strong className="text-violet-50">{data.email}</strong>
                                    </div>
                                    <div className="flex justify-between text-violet-100/60">
                                        <span>Country & City:</span>
                                        <strong className="text-violet-50">{data.city}, {data.country}</strong>
                                    </div>
                                    <div className="flex justify-between text-violet-100/60">
                                        <span>Starter Bonus:</span>
                                        <strong className="text-amber-400 font-bold">25,000 Coins + 1,500 Crystals</strong>
                                    </div>
                                </div>

                                {/* Terms Checkbox with modal openers */}
                                <div className="pt-2">
                                    <label className="flex items-start gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={data.terms_accepted}
                                            onChange={(e) => setData('terms_accepted', e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-[#16102b] bg-[#1a1136] text-cyan-500 focus:ring-cyan-400"
                                        />
                                        <span className="text-xs text-violet-100/75 leading-relaxed">
                                            I confirm that I am at least 18 years old and agree to the{' '}
                                            <button
                                                type="button"
                                                onClick={() => setModalState({ open: true, type: 'terms' })}
                                                className="text-cyan-400 hover:underline font-bold"
                                            >
                                                Terms & Conditions
                                            </button>
                                            {' '}and{' '}
                                            <button
                                                type="button"
                                                onClick={() => setModalState({ open: true, type: 'privacy' })}
                                                className="text-cyan-400 hover:underline font-bold"
                                            >
                                                Privacy Policy (GDPR)
                                            </button>.
                                        </span>
                                    </label>
                                    {errors.terms_accepted && <p className="text-rose-400 text-[10px] mt-1.5">{errors.terms_accepted}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step Navigation Controls */}
                        <div className="pt-4 border-t-[3px] border-[#16102b] flex items-center justify-between gap-4">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="toon-btn toon-btn-ghost flex items-center gap-1.5"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-xs text-violet-100/60 hover:text-cyan-400 font-semibold"
                                >
                                    Already have an account? Sign In
                                </Link>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="submit"
                                    className="toon-btn toon-btn-accent flex items-center gap-1.5"
                                >
                                    Next Step <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing || !data.terms_accepted}
                                    className="toon-btn toon-btn-primary disabled:opacity-50"
                                >
                                    {processing ? 'Creating Account...' : 'Complete Registration & Enter'}
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>

            {/* Legal Modals for Inline Inspection without losing form state */}
            <Modal
                isOpen={modalState.open && modalState.type === 'terms'}
                onClose={() => setModalState({ open: false, type: '' })}
                title="Crystal Brawlers • Terms & Conditions"
            >
                <div className="space-y-3 text-xs leading-relaxed text-violet-100/75">
                    <p><strong>1. Acceptance of Terms:</strong> By creating an account or accessing Crystal Brawlers, you agree to comply with all rules and anti-cheat policies.</p>
                    <p><strong>2. Age Requirement (18+):</strong> Users must be at least 18 years of age to register and participate in virtual currency transactions.</p>
                    <p><strong>3. Virtual Currencies & Purchases:</strong> Gold Coins and Crystals are virtual game items with no real monetary conversion value.</p>
                    <p><strong>4. Fair Play & Prohibited Behaviors:</strong> Automation, botting client hacks, or memory manipulation results in immediate permanent ban.</p>
                </div>
            </Modal>

            <Modal
                isOpen={modalState.open && modalState.type === 'privacy'}
                onClose={() => setModalState({ open: false, type: '' })}
                title="Crystal Brawlers • Privacy Policy (GDPR)"
            >
                <div className="space-y-3 text-xs leading-relaxed text-violet-100/75">
                    <p><strong>1. Data Collection:</strong> We collect email, name, date of birth, and billing country solely for account security and compliance.</p>
                    <p><strong>2. GDPR & Data Rights:</strong> You may request full export or deletion of your game records at any time through our support portal.</p>
                    <p><strong>3. Security:</strong> All passwords and sensitive sessions are encrypted using industry-standard BCRYPT algorithms and HTTPS protocols.</p>
                </div>
            </Modal>

        </MainLayout>
    );
}
