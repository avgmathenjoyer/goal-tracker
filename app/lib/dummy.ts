import type { Goal, Metric, MetricComponent } from "@prisma/client"

export const EMPTY_GOAL: Goal = {
    id: -1,
    name: "",
    steps: 0,
    completed: 0,
    ownerId: -1
}

export const EMPTY_METRIC: Metric = {
    id: -1,
    name: "",
    ownerId: -1
}

export const EMPTY_METRIC_COMPONENT: MetricComponent = {
    id: -1,
    factor: 0,
    goalId: -1,
    metricId: -1
}

export const UNAUTHORIZED_RESPONSE: Response = new Response("Unauthorized",{
    status: 401
})

export const BAD_REQUEST_RESPONSE: Response = new Response("Unauthorized", {
    status: 400
})