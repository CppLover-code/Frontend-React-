import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header()
{
    return (
        <header className={styles.header}>

            <Link to="/" className={styles.logo}>📚 Book Store</Link>

            <nav className={styles.navigation}>

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
