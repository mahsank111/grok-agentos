
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { AgentConfigType } from "@/type/Agent";

interface AgentConfigContextType {
  agentConfig: AgentConfigType | null;
  setAgentConfig: Dispatch<SetStateAction<AgentConfigType | null>>;
}

export const AgentConfigContext =
  createContext<AgentConfigContextType | null>(null);

export const useAgentConfig = () => {
  const context = useContext(AgentConfigContext);

  if (!context) {
    throw new Error(
      "useAgentConfig must be used within AgentConfigContext.Provider"
    );
  }

  return context;
};




// import { AgentConfigType } from "@/type/Agent";
// import { createContext } from "react";

// export const AgentConfigContext = createContext<AgentConfigType | null>(null);