function PageDecor() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-accent dark:text-paper"
            aria-hidden="true"
        >
            <svg
                className="absolute -top-8 -left-10 h-52 w-52 opacity-[0.22] dark:opacity-[0.1]"
                viewBox="0 0 200 200"
                fill="none"
            >
                <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-6 left-[26%] h-28 w-28 text-gold opacity-[0.22] dark:text-accent dark:opacity-[0.14]"
                viewBox="0 0 120 120"
                fill="none"
            >
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-44 left-[12%] h-36 w-36 opacity-[0.2] dark:opacity-[0.1]"
                viewBox="0 0 160 160"
                fill="none"
            >
                <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-[40%] left-3 h-24 w-24 text-gold opacity-[0.2] dark:text-accent dark:opacity-[0.12]"
                viewBox="0 0 100 100"
                fill="none"
            >
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-56 left-[30%] h-16 w-16 opacity-[0.16] dark:opacity-[0.08]"
                viewBox="0 0 80 80"
                fill="none"
            >
                <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            <svg
                className="absolute top-[12%] -right-10 h-56 w-56 text-gold opacity-[0.22] dark:text-accent dark:opacity-[0.14]"
                viewBox="0 0 200 200"
                fill="none"
            >
                <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-[28%] right-[18%] h-28 w-28 opacity-[0.16] dark:opacity-[0.08]"
                viewBox="0 0 120 120"
                fill="none"
            >
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-[42%] right-6 h-36 w-36 text-gold opacity-[0.2] dark:text-accent dark:opacity-[0.12]"
                viewBox="0 0 160 160"
                fill="none"
            >
                <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <svg
                className="absolute top-[58%] right-[22%] h-16 w-16 opacity-[0.16] dark:opacity-[0.08]"
                viewBox="0 0 80 80"
                fill="none"
            >
                <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            <svg
                className="absolute right-0 bottom-10 h-40 w-[28rem] opacity-[0.18] dark:opacity-[0.08]"
                viewBox="0 0 480 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            >
                <path d="M0 70c40-30 80-30 120 0s80 30 120 0 80-30 120 0 80 30 120 0" />
                <path d="M40 90c40-24 80-24 120 0s80 24 120 0 80-24 120 0" />
            </svg>
        </div>
    );
}

export default PageDecor;
