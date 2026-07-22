import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css"

function Header()
{
    return (
        <header className="header">

            <Link to="/" className="logo">📚 Book Store</Link>

            <nav className="navigation">

                <NavLink to="/">Home</NavLink>

                <NavLink to="/books">Books</NavLink>

                <NavLink to="/about">About</NavLink>

                <NavLink to="/login">Login</NavLink>
                
                <NavLink to="/cart">Cart</NavLink>

            </nav>

        </header>
    );
}

export default Header;
