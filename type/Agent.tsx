
export type AgentConfigType = {
  id: number;
  name: string;
  agentId: string;
  description: string | null;
  agentImage: string | null;
  createdAt: Date;
  userEmail: string;

  // Future integrations
  composioSessionId?: string | null;
  e2bSandboxId?: string | null;
  e2bSandboxStatus?: "active" | "inactive" | "paused" | "error" | null;
  e2bLastActiveAt?: Date | string | null;
  e2bPausedAt?: Date | string | null;

  // Agent tools configuration
  tools: unknown;
};









// import AppSidebar from "@/components/custom/workspace/AppSidebar"

// export type AgentConfigType = {
//     name: string,
//     agentId: string,
//     description: string,
//     agentImage: string,
//     createdAt: Date,
//     userEmail: string,
//     composioSessionId: string,
//     e2bSandboxId?: string | null,
//     e2bSandboxStatus?: "active" | "inactive" | "paused" | "error" | null,
//     e2bLastActiveAt?: Date | string | null,
//     e2bPausedAt?: Date | string | null,
//     tools: any
// }

