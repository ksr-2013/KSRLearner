import Link from 'next/link';
import ImageWithFallback from '../../../components/ImageWithFallback';
import { notFound } from 'next/navigation';

async function getArticle(id: string) {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey) {
        throw new Error('NEWSDATA_API_KEY is not configured');
    }

    try {
        const res = await fetch(
            `https://newsdata.io/api/1/latest?apikey=${apiKey}&id=${id}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) {
            // If 404 or other error, return null to handle gracefully
            return null;
        }

        const data = await res.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return null;
    }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
    const article = await getArticle(params.id);

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                    <p className="mb-6 text-slate-400">The article you are looking for could not be found or has been removed.</p>
                    <Link href="/tech-news" className="text-blue-400 hover:text-blue-300">
                        &larr; Back to Tech News
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/tech-news"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to News
                </Link>

                <article>
                    <header className="mb-8">
                        <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
                            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                                {article.source_id || 'Tech News'}
                            </span>
                            <span>{article.pubDate ? new Date(article.pubDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'Recent'}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {article.title}
                        </h1>
                    </header>

                    {article.image_url && (
                        <div className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                            <ImageWithFallback
                                src={article.image_url}
                                alt={article.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* NewsData.io primarily returns description/content snippets. 
                    We display what we have. */}
                        <p className="lead text-xl text-slate-300 mb-6">
                            {article.description}
                        </p>

                        {article.content && (
                            <div className="text-slate-300 space-y-4 whitespace-pre-wrap">
                                {article.content}
                            </div>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <p className="text-slate-400 mb-4 italic">
                            Read the full story at the original source:
                        </p>
                        <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all font-medium shadow-lg shadow-blue-600/20"
                        >
                            Visit {article.source_id || 'Source'} Website
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </article>
            </div>
        </div>
    );
}
