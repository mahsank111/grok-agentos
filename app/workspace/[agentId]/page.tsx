
"use client";

import { ChatPanel } from "@/components/custom/agent-space/ChatPanel";
import { ConfigurationPanel } from "@/components/custom/agent-space/ConfigurationPanel";
import { AgentConfigContext } from "@/context/AgentConfigContext";
import type { AgentConfigType } from "@/type/Agent";

import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AgentSpace() {
  const params = useParams<{ agentId: string | string[] }>();

  // Normalize the dynamic route parameter.
  const agentId =
    typeof params.agentId === "string"
      ? params.agentId
      : params.agentId?.[0];

  const [agentConfig, setAgentConfig] =
    useState<AgentConfigType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the selected agent from the database.
  const GetAgentConfig = useCallback(async () => {
    if (!agentId) {
      setError("Agent ID is missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAgentConfig(null);

      const result = await axios.get<AgentConfigType>(
        `/api/agent?agentId=${encodeURIComponent(agentId)}`
      );

      setAgentConfig(result.data);
    } catch (error) {
      console.error("FETCH AGENT CONFIG ERROR:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
          "Unable to load agent configuration."
        );
      } else {
        setError("Something went wrong while loading the agent.");
      }
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    let active = true;

    const fetchAgent = async () => {
      if (!agentId) {
        setError("Agent ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setAgentConfig(null);

        const result = await axios.get<AgentConfigType>(
          `/api/agent?agentId=${encodeURIComponent(agentId)}`
        );

        if (active) {
          setAgentConfig(result.data);
        }
      } catch (error) {
        console.error("FETCH AGENT CONFIG ERROR:", error);

        if (active) {
          if (axios.isAxiosError(error)) {
            setError(
              error.response?.data?.error ||
              "Unable to load agent configuration."
            );
          } else {
            setError("Something went wrong while loading the agent.");
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAgent();

    return () => {
      active = false;
    };
  }, [agentId]);

  return (
    <AgentConfigContext.Provider
      value={{ agentConfig, setAgentConfig }}
    >
      <main className="grid min-h-svh min-w-0 grid-cols-1 bg-background lg:h-svh lg:grid-cols-[minmax(0,1fr)_390px] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_430px]">

        {loading ? (
          <div className="col-span-full flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading your agent...
            </p>
          </div>
        ) : error || !agentConfig ? (
          <div className="col-span-full flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-destructive">
              {error || "Agent configuration not found."}
            </p>

            <button
              onClick={GetAgentConfig}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <ChatPanel />
            <ConfigurationPanel />
          </>
        )}

      </main>
    </AgentConfigContext.Provider>
  );
}








// import { ChatPanel } from "@/components/custom/agent-space/ChatPanel";
// import { ConfigurationPanel } from "@/components/custom/agent-space/ConfigurationPanel";

// export default function AgentSpacePage() {
//   return (
//     <main className="flex h-svh min-h-[650px] min-w-0 overflow-hidden bg-white text-slate-900">
//       <ChatPanel />
//       <ConfigurationPanel />
//     </main>
//   );
// }
