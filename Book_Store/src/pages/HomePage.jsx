function HomePage()
{
        return(
            <section className="flex flex-col items-center py-16 text-center">
                <p className="section-kicker mb-4">Some quality items</p>
                <h1 className="font-heading text-5xl leading-tight text-ink md:text-7xl dark:text-paper">
                    Book Store
                </h1>
                <span className="title-underline" />
                <p className="mt-8 max-w-xl text-muted dark:text-faint">
                    A quiet place to browse, collect, and keep the books you love.
                </p>
            </section>
        );
}
export default HomePage;
