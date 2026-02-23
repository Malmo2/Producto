import React, { createContext, useContext, useMemo, useState } from 'react';

export type TimerMode = "work" | "break";

export type RecommendationPlan = {
    timerMode: TimerMode;
    minutes: number;
    label?: string;
};

type RecommendationPlanContextValue = {
    plan: RecommendationPlan | null;
    setPlan: React.Dispatch<React.SetStateAction<RecommendationPlan | null>>;
    clearPlan: () => void;
};

const RecommendationPlanContext = createContext<RecommendationPlanContextValue | null>(null);

export function RecommendationPlanProvider({ children }: { children: React.ReactNode }) {
    const [plan, setPlan] = useState<RecommendationPlan | null>(null);

    const clearPlan = () => setPlan(null);

    const value = useMemo(() => {
        return { plan, setPlan, clearPlan };
    }, [plan]);


    return (
        <RecommendationPlanContext.Provider value={value}>
            {children}
        </RecommendationPlanContext.Provider>
    );
};

export function useRecommendationPlan() {
    const ctx = useContext(RecommendationPlanContext);
    if (!ctx) throw new Error("useRecommendationPlan must be used inside RecommendationPlanProvider");
    return ctx
};

