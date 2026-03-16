import type { ReactNode } from "react";
import { TimerProvider } from "../timer/context/TimerContext";

type AppProvidersProps = {
    children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
    return <TimerProvider>{children}</TimerProvider>;
}