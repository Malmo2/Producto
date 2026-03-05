import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export type TimerMode = "work" | "meeting" | "break";

export type RecommendationPlan = {
    timerMode: TimerMode;
    minutes: number;
    label?: string;
};

type RecommendationPlanContextValue = {
    plan: RecommendationPlan | null;
    setPlan: React.Dispatch<React.SetStateAction<RecommendationPlan | null>>;
    clearPlan: () => void;
    consumePlan: () => RecommendationPlan | null;
};

const RecommendationPlanContext =
    createContext<RecommendationPlanContextValue | null>(null);

export function RecommendationPlanProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [plan, setPlanState] = useState<RecommendationPlan | null>(null);

    const planRef = useRef(plan);
    useEffect(() => {
        planRef.current = plan;
    }, [plan]);

    const setPlan: RecommendationPlanContextValue["setPlan"] = useCallback(
        (next) => {
            setPlanState((prev) => (typeof next === "function" ? next(prev) : next));
        },
        [],
    );

    const clearPlan = useCallback(() => setPlan(null), [setPlan]);

    const consumePlan = useCallback(() => {
        const current = planRef.current;
        clearPlan();
        return current;
    }, [clearPlan]);

    const value = useMemo(() => {
        return { plan, setPlan, clearPlan, consumePlan };
    }, [plan, setPlan, clearPlan, consumePlan]);

    return (
        <RecommendationPlanContext.Provider value={value}>
            {children}
        </RecommendationPlanContext.Provider>
    );
}

export function useRecommendationPlan() {
    const ctx = useContext(RecommendationPlanContext);
    if (!ctx)
        throw new Error(
            "useRecommendationPlan must be used inside RecommendationPlanProvider",
        );
    return ctx;
}