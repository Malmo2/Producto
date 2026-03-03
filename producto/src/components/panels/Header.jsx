import { Button, Typography } from "../ui";
import styles from "./Header.module.css";
import Greeting from "../../utils/Greeting";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "../../contexts/AuthContext";

function Header() {
  const today = new Date();
  const weekDay = today.toLocaleDateString("en-US", { weekday: "long" });
  const month = today.toLocaleDateString("en-US", { month: "long" });
  const day = today.getDate();
  const navigate = useNavigate();
  const { user } = useAuthState();

  const name = user?.name?.trim() || "User";

  return (
    <div className={styles.headerContainer}>
      <Greeting>, {name}</Greeting>
      <Typography variant="body1">
        Today is {weekDay}, {month} {day}
      </Typography>
      <Button
        onClick={() => navigate('/timer')}
        type="button" variant="primary">
        New session
      </Button>
    </div>
  );
}

export default Header;
