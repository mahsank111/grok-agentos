
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { authOptions } from "../auth/[...nextauth]/route";
import {
  AgentConfig,
  db
} from "@/db";

// --------------------------------------------------
// POST: Create a new agent
// --------------------------------------------------

export async function POST(req: NextRequest) {
  try {
const session = await getServerSession(authOptions);
const userEmail = session?.user?.email;

if (!userEmail) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

    const body = await req.json();
    const { agentId, name, description, agentImage } = body;

    if (
      typeof agentId !== "string" ||
      !agentId.trim() ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        { error: "Valid agent ID and name are required" },
        { status: 400 }
      );
    }

    // Prevent duplicate agent IDs for the same user.
    const existingAgent = await db
      .select({ id: AgentConfig.id })
      .from(AgentConfig)
      .where(
        and(
          eq(AgentConfig.userEmail, userEmail),
          eq(AgentConfig.agentId, agentId)
        )
      )
      .limit(1);

    if (existingAgent.length > 0) {
      return NextResponse.json(
        { error: "Agent already exists" },
        { status: 409 }
      );
    }

    const [newAgent] = await db
      .insert(AgentConfig)
      .values({
        agentId,
        name: name.trim(),
        description:
          typeof description === "string" ? description : null,
        agentImage:
          typeof agentImage === "string" ? agentImage : null,
        userEmail: userEmail,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Agent configuration saved successfully",
        agentConfig: newAgent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE AGENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save agent configuration" },
      { status: 500 }
    );
  }
}

// --------------------------------------------------
// GET: Fetch all agents or one specific agent
// --------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    // Fetch one specific agent.
    if (agentId) {
      const [agentConfig] = await db
        .select()
        .from(AgentConfig)
        .where(
          and(
            eq(AgentConfig.userEmail, userEmail),
            eq(AgentConfig.agentId, agentId)
          )
        )
        .limit(1);

      if (!agentConfig) {
        return NextResponse.json(
          { error: "Agent configuration not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(agentConfig);
    }

    // Fetch all agents belonging to the logged-in user.
    const agentConfigs = await db
      .select()
      .from(AgentConfig)
      .where(eq(AgentConfig.userEmail, userEmail))
      .orderBy(desc(AgentConfig.createdAt));

    return NextResponse.json(agentConfigs);
  } catch (error) {
    console.error("FETCH AGENTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

// --------------------------------------------------
// PUT: Update an existing agent
// --------------------------------------------------

export async function PUT(req: NextRequest) {
  try {
const session = await getServerSession(authOptions);
const userEmail = session?.user?.email;

if (!userEmail) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

    const agentConfig = await req.json();

    if (
      !agentConfig ||
      typeof agentConfig.agentId !== "string" ||
      !agentConfig.agentId.trim()
    ) {
      return NextResponse.json(
        { error: "Valid agent ID is required" },
        { status: 400 }
      );
    }

    const updateValues: Partial<typeof AgentConfig.$inferInsert> & {
      composioSessionId?: string | null;
      tools?: unknown;
      e2bSandboxId?: string | null;
      e2bSandboxStatus?: string | null;
      e2bLastActiveAt?: Date | null;
      e2bPausedAt?: Date | null;
    } = {};

    // Update only fields actually supplied in the request.
    if (Object.hasOwn(agentConfig, "name")) {
      if (
        typeof agentConfig.name !== "string" ||
        !agentConfig.name.trim()
      ) {
        return NextResponse.json(
          { error: "Agent name must be a non-empty string" },
          { status: 400 }
        );
      }

      updateValues.name = agentConfig.name.trim();
    }

    if (Object.hasOwn(agentConfig, "description")) {
      if (
        agentConfig.description !== null &&
        typeof agentConfig.description !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid description" },
          { status: 400 }
        );
      }

      updateValues.description = agentConfig.description;
    }

    if (Object.hasOwn(agentConfig, "agentImage")) {
      if (
        agentConfig.agentImage !== null &&
        typeof agentConfig.agentImage !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid agent image" },
          { status: 400 }
        );
      }

      updateValues.agentImage = agentConfig.agentImage;
    }

    if (Object.hasOwn(agentConfig, "tools")) {
      updateValues.tools = agentConfig.tools;
    }

    if (Object.hasOwn(agentConfig, "composioSessionId")) {
      updateValues.composioSessionId =
        agentConfig.composioSessionId;
    }

    if (Object.hasOwn(agentConfig, "e2bSandboxId")) {
      updateValues.e2bSandboxId = agentConfig.e2bSandboxId;
    }

    if (Object.hasOwn(agentConfig, "e2bSandboxStatus")) {
      updateValues.e2bSandboxStatus =
        agentConfig.e2bSandboxStatus;
    }

    // Validate future E2B timestamp fields.
    const timestampFields = [
      "e2bLastActiveAt",
      "e2bPausedAt",
    ] as const;

    for (const field of timestampFields) {
      if (!Object.hasOwn(agentConfig, field)) continue;

      const value = agentConfig[field];

      if (value === null) {
        updateValues[field] = null;
      } else if (typeof value === "string") {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return NextResponse.json(
            { error: `Invalid timestamp: ${field}` },
            { status: 400 }
          );
        }

        updateValues[field] = date;
      } else {
        return NextResponse.json(
          { error: `Invalid timestamp: ${field}` },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updateValues).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const [updatedAgent] = await db
      .update(AgentConfig)
      .set(updateValues)
      .where(
        and(
          eq(AgentConfig.userEmail, userEmail),
          eq(AgentConfig.agentId, agentConfig.agentId)
        )
      )
      .returning();

    if (!updatedAgent) {
      return NextResponse.json(
        { error: "Agent configuration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Agent configuration updated successfully",
      agentConfig: updatedAgent,
    });
  } catch (error) {
    console.error("UPDATE AGENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update agent configuration" },
      { status: 500 }
    );
  }
}

// --------------------------------------------------
// DELETE: Delete an agent and its related records
// --------------------------------------------------

export async function DELETE(req: NextRequest) {
  try {
const session = await getServerSession(authOptions);
const userEmail = session?.user?.email;

if (!userEmail) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    await db.transaction(async (tx) => {
      const [agent] = await tx
        .select({ agentId: AgentConfig.agentId })
        .from(AgentConfig)
        .where(
          and(
            eq(AgentConfig.userEmail, userEmail),
            eq(AgentConfig.agentId, agentId)
          )
        )
        .limit(1);

      if (!agent) {
        throw new Error("AGENT_NOT_FOUND");
      }

      await tx
        .delete(AgentConfig)
        .where(
          and(
            eq(AgentConfig.userEmail, userEmail),
            eq(AgentConfig.agentId, agentId)
          )
        );
    });

    return NextResponse.json({
      message: "Agent deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "AGENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Agent configuration not found" },
        { status: 404 }
      );
    }

    console.error("DELETE AGENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}























// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/route";
// import { AgentChatHistory, AgentConfig, AgentWorkflows, db, RoutineExecutions, Routines } from "@/db";
// import { and, desc, eq } from "drizzle-orm";

// export async function POST(req: NextRequest) {
//     const { agentId, name, description, agentImage } = await req.json();
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Insert the new agent configuration into the database
//     const newAgentConfig = await db.insert(AgentConfig).values({
//         agentId: agentId,
//         name,
//         description,
//         agentImage,
//         userEmail: session.user.email
//     }).returning();

//     return NextResponse.json({ message: "Agent configuration saved successfully", agentConfig: newAgentConfig });
// }

// export async function GET(req: NextRequest) {
//     const session = await getServerSession(authOptions);

//     const { searchParams } = new URL(req.url);
//     const agentId = searchParams.get("agentId");


//     if (!session?.user?.email) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (agentId) {

//         // Fetch the specific agent configuration for the logged-in user
//         const agentConfig = await db.select().from(AgentConfig)
//             .where(and(eq(AgentConfig.userEmail, session.user.email),
//                 eq(AgentConfig.agentId, agentId)));

//         return NextResponse.json(agentConfig[0]);
//     }

//     // Fetch all agent configurations for the logged-in user
//     const agentConfigs = await db.select().from(AgentConfig)
//         .where(eq(AgentConfig.userEmail, session.user.email))
//         .orderBy(desc(AgentConfig.createdAt))
//         ;

//     return NextResponse.json(agentConfigs);
// }

// export async function PUT(req: NextRequest) {
//     const agentConfig = await req.json();
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (!agentConfig?.agentId) {
//         return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
//     }

//     const parseTimestamp = (value: unknown) => {
//         if (value === null) return null;
//         if (value === undefined) return undefined;
//         if (value instanceof Date) return value;
//         if (typeof value !== "string") return undefined;

//         const date = new Date(value);
//         return Number.isNaN(date.getTime()) ? undefined : date;
//     }

//     const updateValues: Partial<typeof AgentConfig.$inferInsert> = {};
//     const setIfDefined = <K extends keyof typeof updateValues>(
//         key: K,
//         value: typeof updateValues[K] | undefined
//     ) => {
//         if (value !== undefined) updateValues[key] = value;
//     }

//     setIfDefined("name", typeof agentConfig.name === "string" ? agentConfig.name : undefined);
//     setIfDefined("description", typeof agentConfig.description === "string" ? agentConfig.description : null);
//     setIfDefined("agentImage", typeof agentConfig.agentImage === "string" ? agentConfig.agentImage : null);
//     setIfDefined("tools", agentConfig.tools ?? undefined);
//     setIfDefined("composioSessionId", typeof agentConfig.composioSessionId === "string" ? agentConfig.composioSessionId : null);
//     setIfDefined("e2bSandboxId", typeof agentConfig.e2bSandboxId === "string" ? agentConfig.e2bSandboxId : null);
//     setIfDefined("e2bSandboxStatus", typeof agentConfig.e2bSandboxStatus === "string" ? agentConfig.e2bSandboxStatus : null);
//     setIfDefined("e2bLastActiveAt", parseTimestamp(agentConfig.e2bLastActiveAt));
//     setIfDefined("e2bPausedAt", parseTimestamp(agentConfig.e2bPausedAt));

//     //Update the Agent Config record
//     const result = await db.update(AgentConfig)
//         .set(updateValues).where(and(eq(AgentConfig.userEmail, session.user.email),
//             eq(AgentConfig.agentId, agentConfig.agentId)))
//         .returning();

//     if (!result[0]) {
//         return NextResponse.json({ error: "Agent configuration not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Agent configuration updated successfully", agentConfig: result[0] });
// }

// export async function DELETE(req: NextRequest) {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const agentId = searchParams.get("agentId");

//     if (!agentId) {
//         return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
//     }

//     const [agent] = await db.select({ agentId: AgentConfig.agentId }).from(AgentConfig)
//         .where(and(eq(AgentConfig.userEmail, session.user.email), eq(AgentConfig.agentId, agentId)))
//         .limit(1);

//     if (!agent) {
//         return NextResponse.json({ error: "Agent configuration not found" }, { status: 404 });
//     }

//     const routines = await db.select({ id: Routines.id }).from(Routines)
//         .where(and(eq(Routines.userEmail, session.user.email), eq(Routines.agentId, agentId)));

//     await Promise.all([
//         ...routines.map((routine) => db.delete(RoutineExecutions).where(eq(RoutineExecutions.routineId, routine.id))),
//         db.delete(AgentChatHistory).where(and(eq(AgentChatHistory.userEmail, session.user.email), eq(AgentChatHistory.agentId, agentId))),
//         db.delete(AgentWorkflows).where(and(eq(AgentWorkflows.userEmail, session.user.email), eq(AgentWorkflows.agentId, agentId))),
//     ]);

//     await db.delete(Routines).where(and(eq(Routines.userEmail, session.user.email), eq(Routines.agentId, agentId)));
//     await db.delete(AgentConfig).where(and(eq(AgentConfig.userEmail, session.user.email), eq(AgentConfig.agentId, agentId)));

//     return NextResponse.json({ message: "Agent deleted successfully" });
// }