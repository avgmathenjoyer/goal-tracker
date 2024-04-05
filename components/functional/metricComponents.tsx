import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Goal, MetricComponent } from "@prisma/client";
import { useContext, useState } from "react";
import { GoalContext } from "./viewComponent";
import { findGoalByID } from "../../app/lib/helpers";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ChevronsUpDown } from "lucide-react";

export function CreateMetricComponentDrawer({
    onClickCreateMetricComponent,
}: {
    onClickCreateMetricComponent: (goal: Goal, factor: number) => void;
    goals: Goal[];
}) {
    const goals = useContext(GoalContext);
    const [selectedGoal, setSelectedGoal] = useState<Goal>(goals[0]);
    const [factor, setFactor] = useState("");
    const { toast } = useToast();

    const handleSubmit = (selectedGoal: Goal, factor: number) => {
        if (selectedGoal === undefined) {
            toast({
                title: "Error with input",
                description: "You must select a goal",
                variant: "destructive",
            });
            return;
        }
        if (factor <= 0) {
            toast({
                title: "Error with input",
                description: "You must select a factor bigger than 0",
                variant: "destructive",
            });
            return;
        }
        onClickCreateMetricComponent(selectedGoal, Number(factor));
        setSelectedGoal(goals[0]);
        setFactor("");
    };

    return (
        <Drawer>
            <DrawerTrigger className="bg-green-600 hover:bg-green-800 text-white w-28 h-12 rounded-lg text-sm">
                Create Metric Component
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add a metric component</DrawerTitle>
                </DrawerHeader>
                <MetricComponentInput
                    selectedGoal={selectedGoal}
                    setSelectedGoal={setSelectedGoal}
                    factor={factor}
                    setFactor={setFactor}
                />
                <DrawerFooter className="flex-row justify-center">
                    <DrawerClose
                        className="bg-green-600 text-white w-36 h-10 rounded-lg"
                        onClick={() =>
                            handleSubmit(selectedGoal, Number(factor))
                        }
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

export function MetricComponentInput({
    selectedGoal,
    setSelectedGoal,
    factor,
    setFactor,
}: {
    selectedGoal: Goal;
    setSelectedGoal: (goal: Goal) => void;
    factor: string;
    setFactor: (factor: string) => void;
}) {
    const goals = useContext(GoalContext);
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {selectedGoal ? selectedGoal.name : "Select goal..."}
                    </Button>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search goal..." />
                        <CommandEmpty>
                            No goal with such name found.
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {goals.map((goal) => (
                                    <CommandItem
                                        key={goal.id}
                                        onSelect={(_currentValue) => {
                                            setSelectedGoal(goal);
                                            setOpen(false);
                                        }}
                                    >
                                        {goal.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <Input
                type="number"
                className="max-w-96 my-2"
                value={factor}
                onChange={(evt) => setFactor(evt.target.value)}
                placeholder="Type weight"
            />
        </div>
    );
}

export function MetricComponentUI({
    metricComponent,
    goalName,
    onClickDeleteMetricComponent,
}: {
    metricComponent: MetricComponent;
    goalName: string;
    onClickDeleteMetricComponent: (metricComponentId: number) => void;
}) {
    return (
        <TableRow>
            <TableCell>{goalName}</TableCell>
            <TableCell>{metricComponent.factor}</TableCell>
            <TableCell
                onClick={() => onClickDeleteMetricComponent(metricComponent.id)}
            >
                <div className="hover:cursor-pointer">Click</div>
            </TableCell>
        </TableRow>
    );
}

export function MetricDependencies({
    metricComponents,
    onClickDeleteMetricComponent,
}: {
    metricComponents: MetricComponent[];
    onClickDeleteMetricComponent: (id: number) => void;
}) {
    const goals = useContext(GoalContext);
    return (
        <Table className="max-h-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-xs">Goal</TableHead>
                    <TableHead className="text-xs">Factor</TableHead>
                    <TableHead className="text-xs">Remove dependency</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="max-h-8">
                {metricComponents.map((component) => (
                    <MetricComponentUI
                        key={component.id}
                        goalName={
                            findGoalByID(goals, component.goalId)
                                ? findGoalByID(goals, component.goalId)!.name
                                : "error"
                        }
                        metricComponent={component}
                        onClickDeleteMetricComponent={
                            onClickDeleteMetricComponent
                        }
                    />
                ))}
            </TableBody>
        </Table>
    );
}
