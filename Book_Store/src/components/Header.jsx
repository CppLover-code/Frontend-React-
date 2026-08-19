import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function navLinkClass({ isActive }) {
    return [
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
            ? "bg-teal-800 text-white"
            : "text-teal-100 hover:bg-teal-600 hover:text-white",
    ].join(" ");
}

function Header() {
    const { user, logout } = useAuth();
    return (
        <header className="bg-teal-700 shadow-md">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
                <Link to="/" className="text-lg font-bold text-white">
                    📚 Book Store
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
                                <span className="ml-2 px-3 py-2 text-sm text-teal-100">
                                    Hi, {user.username}
                                </span>
                            ) : (
                                <NavLink to="/profile" className={navLinkClass}>
                                    Hi, {user.username}
                                </NavLink>
                            )}
                            <button
                                onClick={logout}
                                className="ml-1 cursor-pointer rounded-md bg-teal-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-950"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
