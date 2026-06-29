import { NavLink } from "react-router-dom";

function Header()
{
    return (
        <header>

            <h1>📚 Book Store</h1>

            <NavLink to="/">Home</NavLink>

            <NavLink to="/books">Books</NavLink>

            <NavLink to="/about">About</NavLink>

            <NavLink to="/login">Login</NavLink>
            
            <NavLink to="/cart">Cart</NavLink>

        </header>
    );
}

export default Header;
