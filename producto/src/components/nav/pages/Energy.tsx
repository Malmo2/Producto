import Header from "../../panels/Header";
import DashboardLayout from "../../layout/DashboardLayout";
import EnergyPage from "../../energy/EnergyPage";
import { Box } from "../../ui";

export default function Energy() {
  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Header />
      <DashboardLayout>
        <EnergyPage />
      </DashboardLayout>
    </Box>
  );
}
