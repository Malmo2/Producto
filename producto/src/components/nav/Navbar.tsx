import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/producto-logo.svg";
import logoDark from "../../assets/producto-logo-dark.svg";
import styles from "./navbar.module.css"
import Button from "../button/button";
import { useAuthActions, useAuthState } from "../../contexts/AuthContext";

type NavItem = {
  url: string;
  label: string;
};

type NavbarProps = {
  links?: NavItem[];
};

function Navbar({ links = [] }: NavbarProps) {
  const { status, user } = useAuthState();
  const { logout } = useAuthActions();

  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = status === "authenticated";

  const visibleLinks = useMemo<NavItem[]>(() => {
    return isLoggedIn
      ? links.filter((link) => link.url !== "/login")
      : [{ url: "/login", label: "Login" }];
  }, [isLoggedIn, links]);

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
            <img src={logo} alt="Producto logo" className={styles.logoImage} />
            <img src={logoDark} alt="Producto logo dark" className={`${styles.logoImage} ${styles.logoDark}`} />
          </div>

          <ul className={styles.navbar}>
            {visibleLinks.map((link) => (
              <li key={link.url}>
                <NavLink
                  to={link.url}
                  onClick={closeMenu}
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
              {user?.email && <p className={styles.userEmail}>{user.email}</p>}
              <Button
                type="button"
                variant="logoutButton"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
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
