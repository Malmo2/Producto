import type { ReactNode } from "react";
import InfoCards from "./InfoCards";
import logo from "../../assets/producto-logo.svg";
import styles from "./AuthLayout.module.css";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  welcomeText: ReactNode;
};

function formatDate() {
  const d = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return `Today is ${d.toLocaleDateString("en-US", options)}`;
}

export function AuthLayout({ children, title, subtitle, welcomeText }: AuthLayoutProps) {
  return (
    <div className={styles.authPage}>
      <div className={styles.leftPanel}>
        <div className={styles.formArea}>
          <img src={logo} alt="Producto" className={styles.logo} />
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
        </div>
      </div>
      <div className={styles.rightPanel}>
        <p className={styles.welcome}>{welcomeText}</p>
        <p className={styles.date}>{formatDate()}</p>
        <InfoCards />
      </div>
    </div>
  );
}
