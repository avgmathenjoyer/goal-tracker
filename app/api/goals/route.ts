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

        const goalId = searchParams.get("id");

        const goal = await prisma.goal.findUnique({
            where: {
                id: parseInt(goalId!)
            }
        });

        if (goal === null) {
            return BAD_REQUEST_RESPONSE;
        }

        if (goal.ownerId === session.user.id) {
            return Response.json({
                status: 200,
                goal: goal
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
        if (body.steps === undefined || body.name === undefined) {
            return BAD_REQUEST_RESPONSE;
        }

        if (body.steps <= 0 || body.name === "") {
            return BAD_REQUEST_RESPONSE;
        }
        const createdGoal = await prisma.goal.create({
            data: {
                name: body.name,
                //@ts-expect-error
                ownerId: session.user.id!,
                completed: 0,
                steps: body.steps,
            }
        })
        return Response.json({
            status: 200,
            createdGoalId: createdGoal.id
        })
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(config);
    const body = await request.json();
    if (session) {
        const goal = await prisma.goal.findUnique({
            where: {
                id: body.id
            }
        });
        //@ts-expect-error
        if (goal?.ownerId !== parseInt(session.user.id)) {
            return UNAUTHORIZED_RESPONSE;
        }
    
        const updatedGoal = await prisma.goal.update({
            where: {
                id: body.id
            },
            data: {
                completed: {increment: body.how_much}
            }
        });
        return Response.json({
            status: 200,
            updatedGoalId: updatedGoal.id
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

        const goal = await prisma.goal.findUnique({
            where: {
                id: body.id
            }
        });

        if (goal === null) {
            return BAD_REQUEST_RESPONSE;
        }

        if (goal.ownerId !== session.user.id) {
            return UNAUTHORIZED_RESPONSE;
        }
        const deletedGoal = await prisma.goal.delete({
            where: {
                id: body.id
            }
        });
        return Response.json({
            status: 200,
            deletedGoalId: deletedGoal.id
        })
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}
