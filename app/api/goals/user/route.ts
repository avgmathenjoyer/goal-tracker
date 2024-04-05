import { UNAUTHORIZED_RESPONSE } from "@/app/lib/dummy";
import { config } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession(config);
    if (session) {
        const goals = await prisma.goal.findMany({
            where: {
                ownerId: session.user.id!
            }
        })
        return Response.json({
            status: 200,
            goals: goals
        })
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}