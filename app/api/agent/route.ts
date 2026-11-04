
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { authOptions } from "../auth/[...nextauth]/route";
import { AgentConfig, db } from "@/db";

// GET: Retrieve all agents belonging to the logged-in user.
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const agents = await db
            .select()
            .from(AgentConfig)
            .where(eq(AgentConfig.userEmail, session.user.email))
            .orderBy(desc(AgentConfig.createdAt))
            ;

        return NextResponse.json(agents);

    } catch (error) {
        console.error("GET AGENTS ERROR:", error);

        return NextResponse.json(
            { error: "Failed to fetch agents" },
            { status: 500 }
        );
    }
}


// POST: Create and save a new agent configuration.
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { agentId, name, description, agentImage } = await req.json();

        const newAgentConfig = await db
            .insert(AgentConfig)
            .values({
                agentId,
                name,
                description,
                agentImage,
                userEmail: session.user.email,
            })
            .returning();

        return NextResponse.json({
            message: "Agent configuration saved successfully",
            agentConfig: newAgentConfig,
        });

    } catch (error) {
        console.error("CREATE AGENT ERROR:", error);

        return NextResponse.json(
            { error: "Failed to save agent configuration" },
            { status: 500 }
        );
    }
}
