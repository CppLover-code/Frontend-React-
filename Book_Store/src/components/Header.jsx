import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css"
import useAuth from "../hooks/useAuth";

function Header()
{
    const { user, logout } = useAuth();

    return (
        <header className="header">

            <Link to="/" className="logo">📚 Book Store</Link>

            <nav className="navigation">

                <NavLink to="/">Home</NavLink>

                <NavLink to="/books">Books</NavLink>

                <NavLink to="/about">About</NavLink>

                {user ? (
                    <>
                        <span>Hi, {user.username}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <NavLink to="/login">Login</NavLink>
                )}
                
                {!user?.is_staff && <NavLink to="/cart">Cart</NavLink>}

            </nav>

        </header>
    );
}

export default Header;
