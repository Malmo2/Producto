import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import Button from "../button/button";

function Navbar({ links = [], isLoggedIn = false, onLogout, userEmail = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleLinks = isLoggedIn
    ? links.filter((link) => link.url !== "/login")
    : [{ url: "/login", label: "Login" }];

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className={styles.hamburger}
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
      </button>

      {isOpen && <div className={styles.overlay} onClick={closeMenu} />}

      <div className={`${styles.navbarContainer} ${isOpen ? styles.open : ""}`}>
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
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
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
              <Button type="button" variant="logoutButton" onClick={() => { closeMenu(); onLogout?.(); }}>
                Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

export default Navbar;
