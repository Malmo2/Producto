export type WorkModeId = "recover" | "micro" | "light" | "sprint" | "deep";

export type WorkMode = {
    id: WorkModeId;
    title: string;
    description: string;
    minEnergy: number;
    maxEnergy: number;
    minMinutes: number;
    maxMinutes: number;
    timerMode: "work" | "break";
    minutes: number;
};

export const WORK_MODES: WorkMode[] = [
    {
        id: "recover",
        title: "Recovery",
        description: "Reset: water, stretch, short walk.",
        minEnergy: 1,
        maxEnergy: 2,
        minMinutes: 5,
        maxMinutes: 15,
        timerMode: "break",
        minutes: 10,
    },
    {
        id: "micro",
        title: "Micro Wins",
        description: "Quick tasks: reply, tidy notes, small fixes.",
        minEnergy: 1,
        maxEnergy: 3,
        minMinutes: 10,
        maxMinutes: 25,
        timerMode: "work",
        minutes: 15,
    },
    {
        id: "light",
        title: "Light Work",
        description: "Admin, planning, easy work, low pressure.",
        minEnergy: 2,
        maxEnergy: 4,
        minMinutes: 20,
        maxMinutes: 40,
        timerMode: "work",
        minutes: 25,
    },
    {
        id: "sprint",
        title: "Focused Sprint",
        description: "One clear objective. Remove distractions.",
        minEnergy: 3,
        maxEnergy: 5,
        minMinutes: 25,
        maxMinutes: 50,
        timerMode: "work",
        minutes: 25,
    },
    {
        id: "deep",
        title: "Deep Work",
        description: "Hard problems, serious focus, creative output.",
        minEnergy: 4,
        maxEnergy: 5,
        minMinutes: 45,
        maxMinutes: 120,
        timerMode: "work",
        minutes: 50,
    },
];