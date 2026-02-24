import { Button, Typography } from "../ui";
import styles from "./Header.module.css";
import Greeting from "../../utils/Greeting";

function Header() {
  const today = new Date();
  const weekDay = today.toLocaleDateString("en-US", { weekday: "long" });
  const month = today.toLocaleDateString("en-US", { month: "long" });
  const day = today.getDate();

  const name = "John Doe";

  return (
    <div className={styles.headerContainer}>
      <Greeting>, {name} </Greeting>
      <Typography variant="body1">
        Today is {weekDay}, {month} {day}
      </Typography>
      <Button type="button" variant="primary">
        New task
      </Button>
    </div>
  );
}

export default Header;
