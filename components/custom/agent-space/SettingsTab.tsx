
"use client";

import { Sparkles } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAgentConfig } from "@/context/AgentConfigContext";

export function SettingsTab() {
  const { agentConfig, setAgentConfig } = useAgentConfig();

  if (!agentConfig) return null;

  const handleDescriptionChange = (
    value: string
  ) => {
    setAgentConfig((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        description: value,
      };
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">About your agent</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Describe your agent and how it should help.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="agent-guidance"
          className="text-xs font-medium"
        >
          Agent description &amp; instructions
        </Label>

        <Textarea
          id="agent-guidance"
          value={agentConfig.description ?? ""}
          onChange={(event) =>
            handleDescriptionChange(event.target.value)
          }
          placeholder="Describe your agent's role, goals, instructions, and behaviour..."
          className="min-h-[280px] resize-y text-sm leading-6"
        />

        <p className="text-[11px] text-muted-foreground">
          Describe your agent’s role, goals, and guidance in one place.
        </p>
      </div>

      <div className="rounded-xl border bg-slate-50/70 p-3.5">
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 size-4 text-indigo-600" />

          <div>
            <p className="text-xs font-medium">Tip</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Specific instructions help your agent give you more useful
              responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}









// import { Sparkles } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// export function SettingsTab() {
//   return (
//     <div className="space-y-5">
//       <div>
//         <h3 className="text-sm font-semibold">About your agent</h3>
//         <p className="mt-1 text-xs leading-5 text-muted-foreground">
//           Describe your agent and how it should help.
//         </p>
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="agent-guidance" className="text-xs font-medium">
//           Agent description &amp; instructions
//         </Label>
//         <Textarea
//           id="agent-guidance"
//           defaultValue={
//             "A thoughtful personal assistant that helps me stay organized and focused.\n\nBe clear, warm, and concise. Help me prioritize tasks, summarize useful context, and surface the next practical step. Ask a question if you need more information."
//           }
//           className="min-h-[280px] resize-y text-sm leading-6"
//         />
//         <p className="text-[11px] text-muted-foreground">
//           Describe your agent’s role, goals, and guidance in one place.
//         </p>
//       </div>
//       <div className="rounded-xl border bg-slate-50/70 p-3.5">
//         <div className="flex items-start gap-2.5">
//           <Sparkles className="mt-0.5 size-4 text-indigo-600" />
//           <div>
//             <p className="text-xs font-medium">Tip</p>
//             <p className="mt-1 text-xs leading-5 text-muted-foreground">
//               Specific instructions help your agent give you more useful
//               responses.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
