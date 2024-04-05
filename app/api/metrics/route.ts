import { BAD_REQUEST_RESPONSE, UNAUTHORIZED_RESPONSE } from "@/app/lib/dummy";
import { config } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";


export async function GET(request: Request) {
    const session = await getServerSession(config);
    if (session) {
        const { searchParams } = new URL(request.url);
        if (!searchParams.has("id")) {
            return BAD_REQUEST_RESPONSE;
        }
        const metricId = searchParams.get("id");
        const metric = await prisma.metric.findUnique({
            where: {
                id: parseInt(metricId!)
            }
        });

        if (metric === null) {
            return BAD_REQUEST_RESPONSE;
        }

        if (metric.ownerId === session.user.id) {
            return Response.json({
                status: 200,
                metric: metric
            });
        }
        else {
            return UNAUTHORIZED_RESPONSE;
        }
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(config);
    const body = await request.json();
    if (session) {
        if (body.name === undefined || body.name === "") {
            return BAD_REQUEST_RESPONSE;
        }
        const createdMetric = await prisma.metric.create({
            data: {
                name: body.name,
                //@ts-expect-error
                ownerId: session.user.id!,
            }
        })
        return Response.json({
            status: 200,
            createdMetricId: createdMetric.id
        })
    }
    else {
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

        const metric = await prisma.metric.findUnique({
            where: {
                id: body.id
            }
        });

        if (metric === null) {
            return BAD_REQUEST_RESPONSE;
        }

        if (metric.ownerId !== session.user.id) {
            return UNAUTHORIZED_RESPONSE;
        }
        const deletedMetric = await prisma.metric.delete({
            where: {
                id: body.id
            }
        });
        return Response.json({
            status: 200,
            deletedMetricId: deletedMetric.id
        })
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}