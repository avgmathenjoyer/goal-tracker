"use client";

import { Goal } from "@prisma/client";
import GoalContainer from "./goals";
import MetricContainer from "./metrics";
import { useEffect, useState } from "react";
import { produce } from "immer";
import { useSession } from "next-auth/react";
import { EMPTY_GOAL } from "../../app/lib/dummy";

import { createContext } from "react";
import Link from "next/link";
import {
    createGoal,
    deleteGoal,
    fetchGoalsByOwnerId,
    updateSteps,
} from "@/app/lib/data";
import { Skeleton } from "../ui/skeleton";
export const GoalContext = createContext<Goal[]>([]);

function Loading() {
    return (
        <div className="w-full h-full flex flex-col p-8">
            <Skeleton className="w-[300px] h-[60px] rounded-xl m-4"/>
            <Skeleton className="w-[500px] h-[300px] lg:w-[900px] rounded-xl m-4"/>
            <Skeleton className="w-[300px] h-[60px] rounded-xl m-4"/>
            <Skeleton className="w-[500px] h-[300px] lg-w-[900px] rounded-xl m-4"/>
        </div>
    )
}


export default function View() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") {
            setLoading(true);
            return;
        }
        if (session === undefined || session === null) {
            return;
        }
        const fetchData = async () => {
            if (session.user?.id === undefined || session.user.id === null) {
                throw Error("user not authenticated!");
            } else {
                const dataGoals = await fetchGoalsByOwnerId();
                if (dataGoals.status === 200) {
                    setGoals(dataGoals.goals!);
                }
                setLoading(false);
            }
        };
        fetchData();
    }, [session, status]);

    const onClickDeleteGoal = async (goalId: number) => {
        setGoals(
            produce((draft) => {
                const index = draft.findIndex((goal) => goal.id === goalId);
                if (index !== -1) {
                    draft.splice(index, 1);
                }
            })
        );
        const response = await deleteGoal(goalId);
        if (response.status !== 200) {
            console.error("Can't remove goal!");
        }
    };

    const onClickCreateGoal = async (goalName: string, goalSteps: number) => {
        if (session?.user?.id === undefined) {
            throw Error("not authenticated!");
        }

        const createdGoal: Goal = { ...EMPTY_GOAL };
        createdGoal.name = goalName;
        createdGoal.steps = goalSteps;
        createdGoal.ownerId = session.user.id;
        const response = await createGoal(createdGoal);
        if (response.status === 200) {
            createdGoal.id = response.createdGoalId!;
            setGoals(
                produce((draft) => {
                    draft.push(createdGoal);
                })
            );
        } else {
            console.error("Can't create goal", response.status);
        }
    };

    const onClickUpdateGoal = async (goalId: number, how_much: number) => {
        setGoals(
            produce((draft) => {
                const index = draft.findIndex((goal) => goal.id === goalId);
                draft[index].completed += how_much;
            })
        );
        const response = await updateSteps(goalId, how_much);
        if (response.status !== 200) {
            console.error(":(");
        }
    };

    return (
        <main className="w-full h-full">
            {loading ? (
                <Loading />
            ) : (
                <GoalContext.Provider value={goals}>
                    {status === "authenticated" ? (
                        <div className="p-2">
                            <GoalContainer
                                onClickCreateGoal={onClickCreateGoal}
                                onClickDeleteGoal={onClickDeleteGoal}
                                onClickUpdateGoal={onClickUpdateGoal}
                            />
                            <MetricContainer userId={session.user.id} />
                        </div>
                    ) : (
                        <div>
                            <h1>You are not authenticated</h1>
                            <Link href="/api/auth/signin" replace>
                                Click here to sign in
                            </Link>
                        </div>
                    )}
                </GoalContext.Provider>
            )}
        </main>
    );
}
