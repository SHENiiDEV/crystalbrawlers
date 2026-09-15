import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Newspaper, Tag, Calendar, ArrowRight } from 'lucide-react';

export default function Index({ articles, categories = [], selectedCategory = 'All' }) {
    const handleCategoryChange = (cat) => {
        router.get('/articles', cat === 'All' ? {} : { category: cat }, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Patch Notes & Articles • Crystal Brawlers" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 mb-2 shadow-lg shadow-cyan-950/60">
                        <Newspaper className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-display text-white tracking-wider text-outline-sm">
                        Patch Notes & Articles
                    </h1>
                    <p className="text-xs sm:text-sm text-violet-100/60 max-w-xl mx-auto">
                        Stay informed on upcoming balance patches, hero releases, tournament announcements, and engineering updates.
                    </p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`toon-btn toon-btn-accent`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.data.map((art) => (
                        <Link
                            key={art.id}
                            href={`/articles/${art.slug}`}
                            className="group toon-card hover:border-cyan-500/50 rounded-[1.5rem] p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-extrabold uppercase">
                                        {art.category}
                                    </span>
                                    {art.version_tag && (
                                        <span className="text-[10px] font-mono font-bold text-amber-400">
                                            {art.version_tag}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-display text-white group-hover:text-cyan-400 transition leading-snug">
                                    {art.title}
                                </h3>

                                <p className="text-xs text-violet-100/60 leading-relaxed line-clamp-3">
                                    {art.summary}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t-[3px] border-[#16102b]/80 flex items-center justify-between text-xs text-violet-200/50">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(art.published_at).toLocaleDateString()}
                                </span>
                                <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 font-display">
                                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </MainLayout>
    );
}
