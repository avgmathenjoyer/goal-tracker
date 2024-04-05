"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";

import { Goal } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useContext, useState } from "react";
import { GoalContext } from "./viewComponent";
import { useToast } from "@/components/ui/use-toast";

function GoalComponent({
    goal,
    onClickDeleteGoal,
    onClickUpdateGoal,
}: {
    goal: Goal;
    onClickDeleteGoal: (goalId: number) => void;
    onClickUpdateGoal: (goalId: number, how_much: number) => void;
}) {
    const [completedSteps, setCompletedSteps] = useState(goal.completed);
    const changeSteps = (how_much: number) => {
        if (
            completedSteps + how_much >= 0 &&
            completedSteps + how_much <= goal.steps
        ) {
            onClickUpdateGoal(goal.id, how_much);
            setCompletedSteps(completedSteps + how_much);
        }
    };
    return (
        <Card className="h-96 w-72 bg-slate-100 m-1">
            <CardHeader>
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription>
                    You have already completed {completedSteps} out of{" "}
                    {goal.steps} steps for this goal.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-col">
                <h1>Progress:</h1>
                <Progress value={(completedSteps / goal.steps) * 100} />
                <Button
                    className="w-full my-1 bg-green-600 hover:bg-green-800"
                    onClick={() => changeSteps(1)}
                >
                    Add step
                </Button>
                <Button
                    className="w-full my-1 bg-red-600 hover:bg-red-800"
                    onClick={() => changeSteps(-1)}
                >
                    Decrease step
                </Button>
                <Button
                    className="w-full my-1"
                    onClick={() => onClickDeleteGoal(goal.id)}
                >
                    Delete Goal
                </Button>
            </CardContent>
        </Card>
    );
}

function CreateGoalDrawer({
    onClickCreateGoal,
}: {
    onClickCreateGoal: (name: string, stepNumber: number) => void;
}) {
    const [name, setName] = useState("");
    const [stepNumber, setStepNumber] = useState(0);
    const { toast } = useToast();

    const handleSubmit = (nameInput: string, steps: number) => {
        if (nameInput === "") {
            toast({
                title: "Error with input",
                description: "Goal name can't be empty",
                variant: "destructive",
            });
            return;
        }
        if (steps <= 0 || Math.floor(steps) !== steps) {
            toast({
                title: "Error with input",
                description:
                    "You must select a step amount bigger than 0 and an integer",
                variant: "destructive",
            });
            return;
        }
        onClickCreateGoal(name, steps);
        setName("");
    };

    return (
        <Drawer>
            <DrawerTrigger className="bg-slate-900 text-white w-36 h-10 rounded-lg">
                Create Goal
            </DrawerTrigger>
            <DrawerContent className="p-2">
                <DrawerHeader>
                    <DrawerTitle className="text-5xl">Add a goal</DrawerTitle>
                </DrawerHeader>
                <Input
                    className="max-w-96 my-2"
                    type="text"
                    placeholder="Goal name"
                    onChange={(evt) => setName(evt.target.value)}
                />
                <Input
                    className="max-w-96 my-2"
                    type="number"
                    placeholder="Steps number"
                    id="stepNumberInput"
                    min="1"
                    onChange={(evt) =>
                        setStepNumber(parseInt(evt.target.value))
                    }
                />
                <DrawerFooter className="w-full flex-row justify-center">
                    <DrawerClose
                        onClick={() => handleSubmit(name, stepNumber)}
                        className="bg-green-600 text-white w-36 h-10 rounded-lg"
                    >
                        Submit
                    </DrawerClose>
                    <DrawerClose className="bg-red-600 text-white w-36 h-10 rounded-lg">
                        Cancel
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default function GoalContainer({
    onClickDeleteGoal,
    onClickCreateGoal,
    onClickUpdateGoal,
}: {
    onClickDeleteGoal: (goalId: number) => void;
    onClickCreateGoal: (goalName: string, goalSteps: number) => void;
    onClickUpdateGoal: (goalId: number, how_much: number) => void;
}) {
    const goals = useContext(GoalContext);
    return (
        <div className="w-full my-2 border-2 p-2 rounded-xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Your goals</h1>
            <div className="justify-center lg:justify-start w-full flex flex-row flex-wrap my-2">
                {goals.map((goal) => (
                    <GoalComponent
                        goal={goal}
                        onClickDeleteGoal={onClickDeleteGoal}
                        onClickUpdateGoal={onClickUpdateGoal}
                        key={goal.id}
                    />
                ))}
            </div>
            <div className="w-full flex justify-center">
                <CreateGoalDrawer onClickCreateGoal={onClickCreateGoal} />
            </div>
        </div>
    );
}
