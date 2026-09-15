import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { LogIn, Mail, Lock, Swords, ArrowRight } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <MainLayout>
            <Head title="Sign In • Crystal Brawlers" />

            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 mb-3 shadow-lg shadow-cyan-950/60">
                        <div className="w-full h-full bg-[#1b1038] rounded-[14px] flex items-center justify-center">
                            <Swords className="w-7 h-7 text-cyan-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display text-white tracking-wider text-outline-sm">
                        Gladiator Login
                    </h1>
                    <p className="text-xs text-violet-100/60 mt-1">
                        Sign in to access your garage, equipment & arena stats
                    </p>
                </div>

                <div className="toon-card p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-xs font-bold text-violet-100/75 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="player@crystalbrawlers.com"
                                    className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                />
                            </div>
                            {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-violet-100/75 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-violet-200/50 absolute left-3.5 top-3" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#1a1136] border-[3px] border-[#16102b] focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-violet-300/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                                />
                            </div>
                            {errors.password && <p className="text-rose-400 text-[10px] mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-violet-100/60">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-[#16102b] bg-[#1a1136] text-cyan-500 focus:ring-cyan-400"
                                />
                                <span>Remember me</span>
                            </label>

                            <Link href="/faq" className="text-cyan-400 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="toon-btn toon-btn-accent w-full disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {processing ? 'Authenticating...' : 'Sign In To Battle'}
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="text-center pt-2 border-t-[3px] border-[#16102b]">
                            <p className="text-xs text-violet-100/60">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-amber-400 font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
