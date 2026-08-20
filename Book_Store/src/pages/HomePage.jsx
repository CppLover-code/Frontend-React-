import LatestArticles from "../components/LatestArticles";
import NewArrivals from "../components/NewArrivals";
import NewsletterBanner from "../components/NewsletterBanner";
import PartnerStrip from "../components/PartnerStrip";

function HomePage() {
    return (
        <div className="space-y-20">
            <section className="flex flex-col items-center pt-2 pb-6 text-center">
                <p className="section-kicker mb-4">
                    Some quality items for your mind and soul
                </p>
                <h1 className="font-heading text-5xl leading-tight text-ink md:text-7xl dark:text-paper">
                    Book Store
                </h1>
                <span className="title-underline" />
                <p className="mt-8 max-w-xl text-muted dark:text-faint">
                    A quiet place where you can browse, choose, and buy your favorite books.
                </p>
            </section>

            <PartnerStrip />
            <NewArrivals />
            <NewsletterBanner />
            <LatestArticles />
        </div>
    );
}

export default HomePage;
