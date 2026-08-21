function CoverFallback({ className = "h-16 w-16" }) {
    return (
        <img
            src="/no-cover.png"
            alt=""
            className={`object-contain opacity-50 dark:invert ${className}`}
        />
    );
}

export default CoverFallback;
