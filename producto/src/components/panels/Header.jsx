import Button from "../button/button";
import styles from "./Header.module.css";

function Header() {
  const today = new Date();
  const weekDay = today.toLocaleDateString("en-US", { weekDay: "long" });
  const month = today.toLocaleDateString("en-US", { month: "long" });
  const day = today.getDate();

  const name = "John Doe";

  return (
    <>
      <div className={styles.headerContainer}>
        <h2>Hello, {name}</h2>
        <p>
          Today is {weekDay}, {month} {day}
        </p>
        <Button type="button" variant="primary" />
      </div>
    </>
  );
}

export default Header;
