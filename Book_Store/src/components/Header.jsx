import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

function navLinkClass({ isActive }) {
    return [
        "px-3 py-2 text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-300",
        isActive
            ? "text-accent"
            : "text-ink hover:text-accent dark:text-paper dark:hover:text-accent",
    ].join(" ");
}

function SunIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M6.2 6.2l1.8 1.8M16 16l1.8 1.8M6.2 17.8l1.8-1.8M16 8l1.8-1.8" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function Header() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const headerRef = useRef(null);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        function setHeaderHeight() {
            document.documentElement.style.setProperty(
                "--header-height",
                `${header.offsetHeight}px`
            );
        }

        setHeaderHeight();
        const observer = new ResizeObserver(setHeaderHeight);
        observer.observe(header);

        return () => {
            observer.disconnect();
            document.documentElement.style.removeProperty("--header-height");
        };
    }, []);

    const themeButton = (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 inline-flex cursor-pointer items-center justify-center px-3 py-2 text-ink transition-colors duration-300 hover:text-accent dark:text-paper dark:hover:text-accent"
        >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
    );

    return (
        <header ref={headerRef} className="border-b border-line bg-paper dark:border-night-border dark:bg-night">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5">
                <Link to="/" className="font-heading text-2xl text-ink dark:text-paper">
                    Book Store
                </Link>
                <nav className="flex flex-wrap items-center gap-1">
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/books" className={navLinkClass}>Books</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                    {user && <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>}
                    {!user?.is_staff && <NavLink to="/cart" className={navLinkClass}>Cart</NavLink>}
                    {user ? (
                        <>
                            {user.is_staff ? (
                                <span className="ml-2 px-3 py-2 text-sm uppercase tracking-[0.12em] text-muted dark:text-faint">
                                    Hi, {user.username}
                                </span>
                            ) : (
                                <NavLink to="/profile" className={navLinkClass}>
                                    Hi, {user.username}
                                </NavLink>
                            )}
                            {themeButton}
                            <button
                                onClick={logout}
                                className="btn-primary btn-sm ml-1"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                            {themeButton}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
