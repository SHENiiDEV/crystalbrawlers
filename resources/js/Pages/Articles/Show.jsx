import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Calendar, ArrowLeft, Tag, Share2 } from 'lucide-react';

export default function Show({ article, relatedArticles = [] }) {
    return (
        <MainLayout>
            <Head title={`${article.title} • Crystal Brawlers`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
                
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-100/60 hover:text-cyan-400 transition font-display"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to All Articles
                </Link>

                {/* Article Header */}
                <div className="space-y-4 border-b-[3px] border-[#16102b] pb-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-extrabold uppercase tracking-wider">
                            {article.category}
                        </span>
                        {article.version_tag && (
                            <span className="text-xs font-mono font-bold text-amber-400 bg-[#1a1136] px-2.5 py-0.5 rounded border-[3px] border-[#16102b]">
                                {article.version_tag}
                            </span>
                        )}
                        <span className="text-xs text-violet-200/50 flex items-center gap-1 ml-auto">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(article.published_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-display text-white tracking-wider leading-tight text-outline-sm">
                        {article.title}
                    </h1>

                    <p className="text-sm text-cyan-200/90 font-medium leading-relaxed bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl">
                        {article.summary}
                    </p>
                </div>

                {/* Main Content */}
                <div className="prose prose-invert max-w-none text-violet-100/75 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                    {article.content}
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="pt-10 border-t-[3px] border-[#16102b] space-y-4">
                        <h3 className="text-lg font-display text-white tracking-wider">
                            Related Articles
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/articles/${rel.slug}`}
                                    className="p-4 rounded-2xl bg-[#241548]/60 border-[3px] border-[#16102b] hover:border-cyan-500/40 transition block space-y-2"
                                >
                                    <span className="text-[10px] font-bold uppercase text-cyan-400">{rel.category}</span>
                                    <h4 className="text-xs font-bold text-white line-clamp-2">{rel.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}
