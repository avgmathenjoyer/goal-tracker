import type { Goal } from "@prisma/client";

export function findGoalByID(goals: Goal[], id: number) {
    return goals.find((goal) => goal.id === id);
}