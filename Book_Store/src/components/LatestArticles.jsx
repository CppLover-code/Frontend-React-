const ARTICLES = [
    {
        id: 1,
        date: "2 Aug, 2026",
        title: "Reading Books Always Makes The Moments Happy",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 2,
        date: "2 Aug, 2026",
        title: "A Quiet Afternoon With A Good Story Nearby",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 3,
        date: "2 Aug, 2026",
        title: "Why We Keep Returning To Favorite Pages",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    },
];

function LatestArticles() {
    return (
        <section>
            <div className="mb-12 text-center">
                <p className="section-kicker">Read our articles</p>
                <h2 className="page-title mt-1">Latest Articles</h2>
                <span className="title-underline mx-auto" />
            </div>

            <div className="grid gap-10 md:grid-cols-3">
                {ARTICLES.map((article) => (
                    <article key={article.id}>
                        <div className="mb-6 overflow-hidden">
                            <img
                                src={article.image}
                                alt=""
                                className="h-56 w-full object-cover"
                            />
                        </div>
                        <p className="text-sm text-faint">{article.date}</p>
                        <h3 className="mt-3 font-heading text-2xl leading-snug text-ink dark:text-paper">
                            {article.title}
                        </h3>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default LatestArticles;
