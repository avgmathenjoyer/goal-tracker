"use client";

// shadcn imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

// prisma and database handling imports
import { Goal, Metric, MetricComponent } from "@prisma/client";
import { EMPTY_METRIC, EMPTY_METRIC_COMPONENT } from "../../app/lib/dummy";

// react and state handling imports
import { useContext, useEffect, useMemo, useState } from "react";
import { GoalContext } from "./viewComponent";
import { produce } from "immer";

// component dependencies
import {
    CreateMetricComponentDrawer,
    MetricDependencies,
} from "./metricComponents";

// helpers
import { findGoalByID } from "../../app/lib/helpers";
import { useToast } from "@/components/ui/use-toast";
import {
    createMetric,
    createMetricComponent,
    deleteMetric,
    deleteMetricComponent,
    fetchMetricComponents,
    fetchMetricsById,
} from "@/app/lib/data";
import { Skeleton } from "../ui/skeleton";

function Loading() {
    return (
        <div className="flex flex-col justify-center">
            <Skeleton className="w-40 h-8 m-2 bg-blue-200"/>
            <Skeleton className="w-40 h-8 m-2 bg-blue-200"/>
            <Skeleton className="w-40 h-8 m-2 bg-blue-200"/>
        </div>
    )
}


function MetricDependencyUIComponent({
    metric,
    onClickDeleteMetric,
}: {
    metric: Metric;
    onClickDeleteMetric: (metricId: number) => void;
}) {
    const goals = useContext(GoalContext);
    const [metricComponents, setMetricComponents] = useState<MetricComponent[]>(
        []
    );
    const [metricValue, setMetricValue] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    // initial fetch
    useEffect(() => {
        const fetchMetricsData = async () => {
            const data = await fetchMetricComponents(metric.id);
            if (data.status === 200) {
                setMetricComponents(data.metricComponents!);
            }
            setLoading(false);
        };
        fetchMetricsData();
    }, [metric.id]);

    // calculation of metric value
    useMemo(() => {
        const value = metricComponents.reduce(
            (accumulator, current) =>
                accumulator +
                current.factor *
                    (findGoalByID(goals, current.goalId)
                        ? findGoalByID(goals, current.goalId)!.completed
                        : 0),
            0
        );
        setMetricValue(value);
    }, [metricComponents, goals]);

    useMemo(() => {
        setMetricComponents(
            produce((draft) => {
                return draft.filter(
                    (component) => findGoalByID(goals, component.goalId)!!
                );
            })
        );
    }, [goals]);

    // handling of creation and deletion of metric components
    const onClickCreateMetricComponent = async (goal: Goal, factor: number) => {
        // create a metric component from copying empty metric component and modifying factor, goal and metric
        const createdMetricComponent: MetricComponent = {
            ...EMPTY_METRIC_COMPONENT,
        };
        createdMetricComponent.factor = factor;
        createdMetricComponent.goalId = goal.id;
        createdMetricComponent.metricId = metric.id;

        // database returns id of newly created metric component
        const response = await createMetricComponent(createdMetricComponent);
        if (response.status === 200) {
            createdMetricComponent.id = response.createdMetricComponentId!;

            // we push new metric component to state
            setMetricComponents(
                produce((draft) => {
                    draft.push(createdMetricComponent);
                })
            );
        }
    };

    const onClickDeleteMetricComponent = async (metricComponentId: number) => {
        setMetricComponents(
            produce((draft) => {
                const index = draft.findIndex(
                    (component) => component.id === metricComponentId
                );
                if (index !== -1) {
                    draft.splice(index, 1);
                }
            })
        );
        const response = await deleteMetricComponent(metricComponentId);
        if (response.status !== 200) {
            console.error("Can't delete metric component!");
        }
    };

    return (
        <Card className="h-96 w-72 bg-slate-100 m-1">
            <CardHeader>
                <CardTitle>{metric.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-col px-6 w-full">
                <div className="w-full flex justify-center text-5xl font-bold text-green-600">
                    {metricValue}
                </div>
                <div className="w-full max-h-52 h-2/5 overflow-y-auto">
                    {loading ? <Loading/> : <MetricDependencies
                        metricComponents={metricComponents}
                        onClickDeleteMetricComponent={
                            onClickDeleteMetricComponent
                        }
                    />}
                </div>
                <div className="flex flex-row">
                    <CreateMetricComponentDrawer
                        goals={goals}
                        onClickCreateMetricComponent={
                            onClickCreateMetricComponent
                        }
                    />
                    <Button
                        className="text-sm ml-2 h-12 w-28 bg-red-600 hover:bg-red-800"
                        onClick={() => onClickDeleteMetric(metric.id)}
                    >
                        Delete Metric
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function CreateMetricDrawer({
    onClickCreateMetric,
}: {
    onClickCreateMetric: (name: string) => void;
}) {
    const [name, setName] = useState("");
    const { toast } = useToast();
    const handleSubmit = (name: string) => {
        if (name === "") {
            toast({
                title: "Error with input!",
                description: "Metric name shouldn't be empty.",
                variant: "destructive",
            });
            return;
        }
        onClickCreateMetric(name);
        setName("");
    };
    return (
        <Drawer>
            <DrawerTrigger className="bg-slate-900 text-white w-36 h-10 rounded-lg">
                Create Metric
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add a metric</DrawerTitle>
                </DrawerHeader>
                <Input
                    type="text"
                    className="max-w-96 my-2"
                    placeholder="Metric name"
                    value={name}
                    onChange={(evt) => setName(evt.target.value)}
                />
                <DrawerFooter className="flex flex-row justify-center">
                    <DrawerClose
                        onClick={() => handleSubmit(name)}
                        className="bg-green-600 hover:bg-green-800 text-white w-36 h-10 rounded-lg"
                    >
                        Submit
                    </DrawerClose>
                    <DrawerClose className="bg-red-600 hover:bg-red-800 text-white w-36 h-10 rounded-lg">
                        Cancel
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default function MetricContainer({ userId }: { userId: number }) {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    // initial metric fetch
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchMetricsById();
            if (data.status === 200) {
                setMetrics(data.metrics!);
            }
        };
        fetchData();
    }, []);

    // handling deletion and creation of metrics
    const onClickDeleteMetric = async (metricId: number) => {
        setMetrics(
            produce((draft) => {
                // find index of metric by metric id...
                const index = draft.findIndex(
                    (metric) => metric.id === metricId
                );
                if (index !== -1) {
                    // ... delete it from state ...
                    draft.splice(index, 1);
                }
            })
        );
        // ...and then delete it from database
        const response = await deleteMetric(metricId);
        if (response.status !== 200) {
            console.error("Can't delete metric!");
        }
    };

    const onClickCreateMetric = async (metricName: string) => {
        // create metric from copying EMPTY_METRIC and modifying name and owner
        const createdMetric: Metric = { ...EMPTY_METRIC };
        createdMetric.name = metricName;
        createdMetric.ownerId = userId;

        // database returns id of created metric
        const response = await createMetric(createdMetric);
        if (response.status === 200) {
            createdMetric.id = response.createdMetricId!;

            // we push the metric to the state
            setMetrics(
                produce((draft) => {
                    draft.push(createdMetric);
                })
            );
        }
    };

    return (
        <div className="w-full my-2 border-2 rounded-xl p-2">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                Your metrics
            </h1>
            <div className="justify-center lg:justify-start w-full flex flex-row flex-wrap">
                {metrics.map((metric) => (
                    <MetricDependencyUIComponent
                        metric={metric}
                        onClickDeleteMetric={onClickDeleteMetric}
                        key={metric.id}
                    />
                ))}
            </div>
            <div className="w-full flex justify-center">
                <CreateMetricDrawer onClickCreateMetric={onClickCreateMetric} />
            </div>
        </div>
    );
}
