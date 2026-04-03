import Link from 'next/link';
import ImageWithFallback from '../../components/ImageWithFallback';

async function getTechNews() {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey) {
        throw new Error('NEWSDATA_API_KEY is not configured');
    }

    const res = await fetch(
        `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=in,wo&category=technology`,
        { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!res.ok) {
        throw new Error('Failed to fetch news');
    }

    return res.json();
}

export default async function TechNewsPage() {
    let news = [];
    let error = null;

    try {
        const data = await getTechNews();
        news = data.results || [];
    } catch (e) {
        console.error('Error fetching news:', e);
        error = 'Failed to load latest tech news. Please try again later.';
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Latest Tech News
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Stay updated with the most recent breakthroughs and headlines from the world of technology.
                    </p>
                </header>

                {error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
                            <p className="text-red-400 font-medium">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item: any, index: number) => (
                            <article
                                key={item.article_id || index}
                                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full group"
                            >
                                <div className="relative h-48 overflow-hidden bg-slate-700">
                                    {item.image_url ? (
                                        <ImageWithFallback
                                            src={item.image_url}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                            <span className="text-sm">No Image Available</span>
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 p-3">
                                        <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                                            {item.source_id || 'News'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-slate-400 flex items-center">
                                            {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Recent'}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h2>

                                    <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                                        {item.description || "Click 'Read Full Article' to see more details about this news story."}
                                    </p>

                                    <Link
                                        href={`/tech-news/${item.article_id}`}
                                        className="mt-auto inline-flex items-center justify-center w-full px-4 py-2 bg-slate-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 font-medium text-sm group-hover:shadow-lg hover:shadow-blue-500/25"
                                    >
                                        Read Full Article
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!error && news.length === 0 && (
                    <div className="text-center text-slate-400 py-12">
                        No news articles found at the moment.
                    </div>
                )}
            </div>
        </div>
    );
}
