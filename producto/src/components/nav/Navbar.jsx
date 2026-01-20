import { NavLink } from "react-router-dom";
import './navbar.css';

function Navbar({ links = [] }) {
    return (
        <nav className="sidebar">
            <div className="logo">
                <span className="logo-icon">stuff</span>
                <span className="logo-text">morestuff</span>
            </div>

            <ul className="navbar">
                {links.map(link => (
                    <li key={link.url}>
                        <NavLink
                            to={link.url}
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;
