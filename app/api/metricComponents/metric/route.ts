import { BAD_REQUEST_RESPONSE, UNAUTHORIZED_RESPONSE } from "@/app/lib/dummy";
import { config } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession(config);
    if (session) {
        const { searchParams } = new URL(request.url);
        // request doesn't have id parameter
        if (!searchParams.has("id")) {
            return BAD_REQUEST_RESPONSE;
        }

        const metricId = searchParams.get("id");
        const metric = await prisma.metric.findUnique({
            where: {
                id: parseInt(metricId!)
            }
        });
        // metric doesn't exist
        if (metric === null) {
            return BAD_REQUEST_RESPONSE;
        }


        if (metric.ownerId !== session.user.id!) {
            return UNAUTHORIZED_RESPONSE;
        }

        const metricComponents = await prisma.metricComponent.findMany({
            where: {
                metricId: parseInt(metricId!)
            }
        })
        return Response.json({
            metricComponents: metricComponents,
            status: 200
        })
    }
    else {
        return UNAUTHORIZED_RESPONSE;
    }
}