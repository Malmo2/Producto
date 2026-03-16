import { Stack } from "expo-router";
import { AppProviders } from "../features/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack />
    </AppProviders>
  );
}