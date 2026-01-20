import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";

function Navbar({ links = [] }) {
  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>stuff</span>
          <span className={styles.logoText}>morestuff</span>
        </div>

        <ul className={styles.navbar}>
          {links.map((link) => (
            <li key={link.url}>
              <NavLink
                to={link.url}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
