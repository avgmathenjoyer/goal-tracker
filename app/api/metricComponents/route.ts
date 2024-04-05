import { BAD_REQUEST_RESPONSE, UNAUTHORIZED_RESPONSE } from "@/app/lib/dummy";
import { config } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    const session = await getServerSession(config);
    const body = await request.json();
    if (session) {
        if (
            body.factor === undefined ||
            body.goalId === undefined ||
            body.metricId === undefined
        ) {
            return BAD_REQUEST_RESPONSE;
        }
        if (body.factor < 0) {
            return BAD_REQUEST_RESPONSE;
        }
        const goal = await prisma.goal.findUnique({
            where: {
                id: body.goalId,
            },
        });

        const metric = await prisma.metric.findUnique({
            where: {
                id: body.metricId,
            },
        });

        if (goal === null || metric === null) {
            return BAD_REQUEST_RESPONSE;
        }

        if (
            goal.ownerId !== session.user.id ||
            metric.ownerId !== session.user.id
        ) {
            return UNAUTHORIZED_RESPONSE;
        }

        const createdMetricComponent = await prisma.metricComponent.create({
            data: {
                factor: body.factor,
                goalId: body.goalId,
                metricId: body.metricId,
            },
        });
        return Response.json({
            createdMetricComponentId: createdMetricComponent.id,
            status: 200,
        });
    } else {
        return UNAUTHORIZED_RESPONSE;
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(config);
    const body = await request.json();
    if (session) {
        if (body.id === undefined) {
            return BAD_REQUEST_RESPONSE;
        }

        const metricComponent = await prisma.metricComponent.findUnique({
            where: {
                id: body.id,
            },
        });

        if (metricComponent === null) {
            return BAD_REQUEST_RESPONSE;
        }

        const metric = await prisma.metric.findUnique({
            where: {
                id: metricComponent?.metricId,
            },
        });

        if (metric === null) {
            return BAD_REQUEST_RESPONSE;
        }


        if (metric.ownerId !== session.user.id) {
            return UNAUTHORIZED_RESPONSE;
        }
        const deletedMetricComponent = await prisma.metricComponent.delete({
            where: {
                id: body.id,
            },
        });
        return Response.json({
            deletedMetricComponentId: deletedMetricComponent.id,
            status: 200,
        });
    } else {
        return UNAUTHORIZED_RESPONSE;
    }
}
