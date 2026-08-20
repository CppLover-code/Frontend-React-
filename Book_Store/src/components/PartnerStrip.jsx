function CapBooksIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="currentColor" aria-hidden="true">
            <path d="M8 22 32 12l24 10-24 10L8 22Z" />
            <path d="M52 24v10c0 4-9 8-20 8s-20-4-20-8V24" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <rect x="14" y="38" width="10" height="14" rx="1" />
            <rect x="27" y="36" width="10" height="16" rx="1" />
            <rect x="40" y="40" width="10" height="12" rx="1" />
        </svg>
    );
}

function StampIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="32" cy="32" r="22" />
            <circle cx="32" cy="32" r="16" strokeDasharray="2 3" />
            <path d="M24 38V26l8 4 8-4v12l-8 4-8-4Z" fill="currentColor" stroke="none" />
        </svg>
    );
}

function BookdoorIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="currentColor" aria-hidden="true">
            <path d="M18 12h12v40H18z" />
            <path d="M34 16c8 0 14 4 14 16s-6 16-14 16V16Z" />
        </svg>
    );
}

function LibraryIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="currentColor" aria-hidden="true">
            <path d="M8 40c8-8 16-8 24 0 8-8 16-8 24 0v4c-8-6-16-6-24 2-8-8-16-8-24-2v-4Z" />
            <path d="M8 28c8-8 16-8 24 0 8-8 16-8 24 0v4c-8-6-16-6-24 2-8-8-16-8-24-2v-4Z" />
        </svg>
    );
}

function FlapriseIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="currentColor" aria-hidden="true">
            <path d="M8 40c10-14 18-20 24-22 6 2 14 8 24 22H8Z" />
            <circle cx="32" cy="22" r="4" />
        </svg>
    );
}

const MARKS = [
    { name: "Bookstore", Icon: CapBooksIcon },
    { name: "Bookstore", Icon: StampIcon },
    { name: "bookdoor", Icon: BookdoorIcon },
    { name: "Library", Icon: LibraryIcon },
    { name: "Flaprise", Icon: FlapriseIcon },
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
