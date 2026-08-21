function HeartIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="currentColor" aria-hidden="true">
            <path d="M32 52S10 38 10 24a12 12 0 0 1 22-6 12 12 0 0 1 22 6c0 14-22 28-22 28Z" />
        </svg>
    );
}

function BulbIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M32 8a16 16 0 0 1 8 30v6H24v-6A16 16 0 0 1 32 8Z" />
            <path d="M26 48h12M28 54h8" />
            <path d="M32 20v8M24 26l4 3M40 26l-4 3" strokeWidth="1.8" />
        </svg>
    );
}

function CompassIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="32" cy="32" r="22" />
            <path d="m32 16 6 16-6 16-6-16 6-16Z" fill="currentColor" stroke="none" />
            <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="currentColor" aria-hidden="true">
            <path d="M32 6 36 24 54 28 36 32 32 50 28 32 10 28 28 24Z" />
            <path d="M48 40 50 48 58 50 50 52 48 60 46 52 38 50 46 48Z" />
            <path d="M14 42 16 48 22 50 16 52 14 58 12 52 6 50 12 48Z" />
        </svg>
    );
}

function MugIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M16 22h26v22a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10V22Z" />
            <path d="M42 28h6a8 8 0 0 1 0 16h-6" />
            <path d="M22 12c0 4 4 4 4 8M30 12c0 4 4 4 4 8" />
        </svg>
    );
}

const MARKS = [
    { name: "Love", Icon: HeartIcon },
    { name: "Inspiration", Icon: BulbIcon },
    { name: "Journey", Icon: CompassIcon },
    { name: "Magic", Icon: SparklesIcon },
    { name: "Cosiness", Icon: MugIcon },
];

function PartnerStrip() {
    return (
        <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-paper-muted py-12 dark:bg-night-card">
            <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-8 px-4 text-faint md:justify-between md:gap-x-6">
                {MARKS.map((mark, index) => (
                    <li
                        key={`${mark.name}-${index}`}
                        className="flex min-w-24 flex-col items-center gap-2"
                    >
                        <mark.Icon />
                        <span className="text-[11px] uppercase tracking-[0.18em]">
                            {mark.name}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default PartnerStrip;
