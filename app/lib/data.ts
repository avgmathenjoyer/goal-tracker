import { Goal, Metric, MetricComponent } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const APPLICATION_JSON_HEADERS = {
    "Content-Type": "application/json"
}

// Goal related data functions

export const createGoal = async (goal: Goal) : Promise<{status: number, createdGoalId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/goals/`, {
        method: "POST",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            name: goal.name, 
            steps: goal.steps
        })
    })
    .then(response => response.json())
    return data;
}

export const readGoalById = async (goaldId: number) : Promise<{status: number, goal?: Goal}> => {
    const data = await fetch(`${BASE_URL}/api/goals?id=${goaldId}`, { method: "GET" })
                       .then(response => response.json());
    return data;
}

export const updateSteps = async (goalId: number, how_much: number) : Promise<{status: number, updatedGoalId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/goals`, {
        method: "PATCH",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            id: goalId,
            how_much: how_much
        })
    })
    .then(response => response.json());
    return data;
}

export const deleteGoal = async (goalId: number) : Promise<{status: number, deletedGoalId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/goals`, {
        method: "DELETE",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            id: goalId
        })
    })
    .then(response => response.json());
    return data;
}

export const fetchGoalsByOwnerId = async () : Promise<{status: number, goals?: Goal[]}> => {
    const data = await fetch(`${BASE_URL}/api/goals/user`, {method: "GET"})
                       .then(response => response.json());
    return data;
}

// Metric related data functions

export const createMetric = async (metric: Metric) : Promise<{status: number, createdMetricId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/metrics`, {
        method: "POST",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            name: metric.name
        }),

    })
    .then(response => response.json());
    return data;
}

export const fetchMetricsById = async () : Promise<{status: number, metrics?: Metric[]}> => {
    const data = await fetch(`${BASE_URL}/api/metrics/user`, {method: "GET"})
                       .then(response => response.json());
    return data;
}

export const deleteMetric = async (metricId: number) : Promise<{status: number, deletedMetricId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/metrics`, {
        method: "DELETE",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            id: metricId
        })
    })
    .then(response => response.json());
    return data;
}

export const createMetricComponent = async (metricComponent: MetricComponent) : Promise<{status: number, createdMetricComponentId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/metricComponents`, {
        method: "POST",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            factor: metricComponent.factor,
            goalId: metricComponent.goalId,
            metricId: metricComponent.metricId
        })
    })
    .then(response => response.json());
    return data;
}

export const deleteMetricComponent = async (metricComponentId: number) : Promise<{status: number, deletedMetricComponentId?: number}> => {
    const data = await fetch(`${BASE_URL}/api/metricComponents`, {
        method: "DELETE",
        headers: APPLICATION_JSON_HEADERS,
        body: JSON.stringify({
            id: metricComponentId
        })
    })
    .then(response => response.json());
    return data;
}

export const fetchMetricComponents = async (metricId: number) : Promise<{status: 200, metricComponents?: MetricComponent[]}> => {
    const data = await fetch(`${BASE_URL}/api/metricComponents/metric?id=${metricId}`, {method: "GET"})
    .then(response => response.json());
    return data;
}