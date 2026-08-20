import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../api/books";

function ArrowIcon({ direction }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            {direction === "left" ? (
                <path d="M15 5l-7 7 7 7" />
            ) : (
                <path d="M9 5l7 7-7 7" />
            )}
        </svg>
    );
}

function NewArrivals() {
    const [books, setBooks] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const data = await getBooks({ ordering: "-id", page_size: 3 });
                if (!ignore) setBooks(data.results ?? []);
            } catch {
                if (!ignore) setBooks([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return <p className="status-message">Loading...</p>;
    }

    if (books.length === 0) {
        return null;
    }

    const book = books[index];
    const authorNames = book.authors.map((author) => author.name).join(", ");

    function showPrev() {
        setIndex((current) => (current === 0 ? books.length - 1 : current - 1));
    }

    function showNext() {
        setIndex((current) => (current === books.length - 1 ? 0 : current + 1));
    }

    return (
        <section>
            <div className="mb-10 text-center">
                <p className="section-kicker">Just arrived</p>
                <h2 className="page-title mt-1">New arrivals</h2>
                <span className="title-underline mx-auto" />
            </div>

            <div>
                <div className="flex items-center gap-4 md:gap-6">
                    {books.length > 1 && (
                        <button
                            type="button"
                            onClick={showPrev}
                            aria-label="Previous book"
                            className="hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-300 hover:border-accent hover:text-accent md:flex dark:border-night-border dark:bg-night dark:text-paper"
                        >
                            <ArrowIcon direction="left" />
                        </button>
                    )}

                    <div className="grid min-w-0 flex-1 items-center gap-10 md:grid-cols-2 md:gap-12">
                        <div className="text-left">
                            <h3 className="font-heading text-4xl leading-tight text-ink md:text-5xl dark:text-paper">
                                {book.title}
                            </h3>
                            <p className="mt-3 text-sm uppercase tracking-[0.12em] text-faint">
                                {authorNames}
                            </p>
                            {book.description && (
                                <p className="mt-6 line-clamp-4 text-muted dark:text-faint">
                                    {book.description}
                                </p>
                            )}
                            <Link
                                to={`/books/${book.id}`}
                                className="btn-outline btn-sm mt-8"
                            >
                                Read more →
                            </Link>
                        </div>

                        <div className="flex justify-center md:justify-end">
                            <div className="flex h-[420px] w-[280px] items-center justify-center border border-cover-border bg-shelf p-8 shadow-[0_20px_50px_rgba(47,47,47,0.08)] dark:border-night-border dark:bg-night-shelf">
                                {book.cover ? (
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="font-heading text-6xl text-faint">B</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {books.length > 1 && (
                        <button
                            type="button"
                            onClick={showNext}
                            aria-label="Next book"
                            className="hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-300 hover:border-accent hover:text-accent md:flex dark:border-night-border dark:bg-night dark:text-paper"
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    )}
                </div>

                {books.length > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {books.map((item, itemIndex) => (
                            <button
                                key={item.id}
                                type="button"
                                aria-label={`Show ${item.title}`}
                                onClick={() => setIndex(itemIndex)}
                                className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-300 ${
                                    itemIndex === index
                                        ? "bg-gold"
                                        : "bg-line hover:bg-faint dark:bg-night-border"
                                }`}
                            />
                        ))}
                    </div>
                )}

                {books.length > 1 && (
                    <div className="mt-6 flex justify-center gap-3 md:hidden">
                        <button
                            type="button"
                            onClick={showPrev}
                            aria-label="Previous book"
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink dark:border-night-border dark:text-paper"
                        >
                            <ArrowIcon direction="left" />
                        </button>
                        <button
                            type="button"
                            onClick={showNext}
                            aria-label="Next book"
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink dark:border-night-border dark:text-paper"
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default NewArrivals;
