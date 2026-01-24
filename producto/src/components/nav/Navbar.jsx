import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import Button from "../button/button";

function Navbar({ links = [], isLoggedIn = false, onLogout, userEmail = "" }) {
  const visibleLinks = isLoggedIn
    ? links.filter((link) => link.url !== '/login')
    : [{ url: '/login', label: "Login" }];
  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>stuff</span>
          <span className={styles.logoText}>morestuff</span>
        </div>

        <ul className={styles.navbar}>
          {visibleLinks.map((link) => (
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

        {isLoggedIn && (
          <div className={styles.authSection}>
            {userEmail && <p className={styles.userEmail}>{userEmail}</p>}
            <Button
              type="button"
              variant="logoutButton"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
