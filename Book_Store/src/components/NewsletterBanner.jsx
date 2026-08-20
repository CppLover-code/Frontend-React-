function NewsletterBanner() {
    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-paper-muted py-16 dark:bg-night-card">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16">
                <div>
                    <h2 className="font-heading text-4xl leading-tight text-ink md:text-5xl dark:text-paper">
                        Subscribe To
                        <br />
                        Our Newsletter
                    </h2>
                    <span className="title-underline" />
                </div>

                <div>
                    <p className="mb-6 max-w-md text-sm leading-relaxed text-muted dark:text-faint">
                        Be the first to hear about new titles, quiet recommendations,
                        and seasonal reads from our shelf.
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="flex max-w-md items-end gap-3 border-b border-line pb-2 dark:border-night-border"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address here"
                            className="min-w-0 flex-1 bg-transparent pb-1 text-sm text-ink outline-none placeholder:text-faint dark:text-paper"
                        />
                        <button
                            type="submit"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-2 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:text-accent dark:text-paper dark:hover:text-accent"
                        >
                            Send
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 6h16v12H4z" />
                                <path d="M4 7l8 6 8-6" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default NewsletterBanner;
