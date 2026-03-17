import { Box } from "../../ui";
import Timer from "../../timer/timer";
import Header from "../../panels/Header";

export default function TimerPage() {
  return (
    <Box className="page-shell">
      <Header />
      <Box className="page-content">
        <Timer />
      </Box>
    </Box>
  );
}
