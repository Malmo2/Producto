import Header from "../../panels/Header";
import DashboardLayout from "../../layout/DashboardLayout";
import EnergyPage from "../../energy/EnergyPage";
import { Box } from "../../ui";

export default function Energy() {
  return (
    <Box className="page-shell">
      <Header />
      <Box className="page-content">
        <DashboardLayout>
          <EnergyPage />
        </DashboardLayout>
      </Box>
    </Box>
  );
}
