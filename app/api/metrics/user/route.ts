import { UNAUTHORIZED_RESPONSE } from "@/app/lib/dummy";
import { config } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession(config);
    if (session) {
        const metrics = await prisma.metric.findMany({
            where: {
                ownerId: session.user.id!
            }
        })
        return Response.json({
            metrics: metrics,
            status: 200
        })
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}