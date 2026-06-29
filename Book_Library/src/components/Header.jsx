import { Link, NavLink } from "react-router-dom";

function Header()
{
    return (
        <header>

            <Link to="/">📚 Book Store</Link>

            <nav>

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
