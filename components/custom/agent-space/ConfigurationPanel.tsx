"use client";

import { useState } from "react";
import {
  Bot,
  CalendarClock,
  Check,
  MoreHorizontal,
  Settings2,
  Shuffle,
  WandSparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAgentConfig } from "@/context/AgentConfigContext";

import { AgentSettingsTab } from "@/components/custom/agent-space/AgentSettingsTab";
import { ScheduleTab } from "@/components/custom/agent-space/ScheduleTab";
import { SettingsTab } from "@/components/custom/agent-space/SettingsTab";
import { ToolsTab } from "@/components/custom/agent-space/ToolsTab";
import { toast } from "@/components/ui/toast";
import axios from "axios";

const tabs = [
  { id: "settings", label: "Settings", icon: Settings2 },
  { id: "tools", label: "Tools", icon: WandSparkles },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
  { id: "general", label: "Agent settings", icon: MoreHorizontal },
] as const;

export function ConfigurationPanel() {
  const { agentConfig, setAgentConfig } = useAgentConfig();

  const shuffleAvatar = () => {
    const randomSeed = crypto.randomUUID();

    const newAvatarUrl = `https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed=${randomSeed}`;

    setAgentConfig((prevConfig) => {
      if (!prevConfig) return prevConfig;

      return {
        ...prevConfig,
        agentImage: newAvatarUrl,
      };
    });
  };

  // const shuffleAvatar = () => {
  //   const randomSeed = crypto.randomUUID();
  //   const newAvatarUrl =
  //     `https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed=` +
  //     randomSeed;
  //   setAgentConfig((prevConfig: any) => ({
  //     ...prevConfig,
  //     agentImage: newAvatarUrl,
  //   }));
  // };


const SaveAgentConfig = async () => {
    toast.add({
      title: "Saving Agent Configuration",
      description: "Your agent configuration is being saved.",
      type: "info",
    })
    try {
      const result = await axios.put('/api/agent', agentConfig);
      console.log(result.data);

      toast.add({
        title: "Agent Configuration Saved",
        description: "Your agent configuration has been saved successfully.",
        type: "success",
      })
    } catch (error) {
      console.error("Failed to save agent configuration", error);
      toast.add({
        title: "Unable to Save Agent Configuration",
        description: "Please try again in a moment.",
        type: "error",
      })
    }
  }



  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("settings");

  if (!agentConfig) return null;

  const agentName = agentConfig.name;
  const avatar =
    agentConfig.agentImage ||
    `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(agentName)}`;

  return (
    <aside className="flex w-full min-w-0 flex-col border-l bg-white lg:h-full lg:overflow-hidden">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b px-5">
        <div>
          <h2 className="text-sm font-semibold">Agent configuration</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Personalize how {agentName} works
          </p>
        </div>

        <Button
          size="sm"
          className="h-8 gap-1.5 bg-indigo-600 px-3 text-xs hover:bg-indigo-700"
          title="Save functionality will be connected next"
          onClick={SaveAgentConfig}
        >
          <Check className="size-3.5" />
          Save
        </Button>
      </div>

      <div className="shrink-0 border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 rounded-xl border bg-indigo-50">
            <AvatarImage src={avatar} alt={agentName} />
            <AvatarFallback>
              <Bot className="size-5 text-indigo-600" />
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <Label
              htmlFor="agent-name"
              className="text-xs font-medium text-slate-600"
            >
              Agent name
            </Label>

            <Input
              id="agent-name"
              value={agentName}
              className="mt-1 h-8 w-full min-w-0 text-sm"
              defaultValue={agentConfig?.name}
              onChange={(event) => setAgentConfig((prevConfig: any) => ({
                ...prevConfig,
                name: event.target.value
              }))}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-4 h-8 shrink-0 gap-1.5 px-2.5 text-xs"
            title="Avatar customization will be connected later"
            onClick={shuffleAvatar}
          >
            <Shuffle className="size-3.5" />
            Shuffle Avatar
          </Button>
        </div>
      </div>

      <nav
        aria-label="Configuration sections"
        className="flex shrink-0 items-center gap-1 border-b px-5 py-2.5"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
            className={`group relative flex size-9 items-center justify-center rounded-lg transition-colors ${
              tab === id
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className="size-[17px]" />
            <span className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {tab === "settings" && <SettingsTab />}
        {tab === "tools" && <ToolsTab />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "general" && <AgentSettingsTab />}
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t px-5 py-3 text-[10px] text-muted-foreground">
        <span>Orbit · Agent workspace</span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Configuration loaded
        </span>
      </footer>
    </aside>
  );
}

// "use client";

// import { useState } from "react";
// import {
//   Bot,
//   CalendarClock,
//   Check,
//   MoreHorizontal,
//   Settings2,
//   Shuffle,
//   WandSparkles,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { AgentSettingsTab } from "@/components/custom/agent-space/AgentSettingsTab";
// import { ScheduleTab } from "@/components/custom/agent-space/ScheduleTab";
// import { SettingsTab } from "@/components/custom/agent-space/SettingsTab";
// import { ToolsTab } from "@/components/custom/agent-space/ToolsTab";

// const tabs = [
//   { id: "settings", label: "Settings", icon: Settings2 },
//   { id: "tools", label: "Tools", icon: WandSparkles },
//   { id: "schedule", label: "Schedule", icon: CalendarClock },
//   { id: "general", label: "Agent settings", icon: MoreHorizontal },
// ] as const;

// export function ConfigurationPanel() {
//   const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("settings");
//   const agentName = "Atlas";
//   const avatar = `https://api.dicebear.com/10.x/avataaars/svg?seed=${agentName}`;

//   return (
//     <aside className="flex w-[390px] max-w-[46vw] shrink-0 flex-col border-l bg-white xl:w-[430px]">
//       <div className="flex h-[72px] shrink-0 items-center justify-between border-b px-5">
//         <div>
//           <h2 className="text-sm font-semibold">Agent configuration</h2>
//           <p className="mt-0.5 text-xs text-muted-foreground">
//             Personalize how Atlas works
//           </p>
//         </div>
//         <Button
//           size="sm"
//           className="h-8 gap-1.5 bg-indigo-600 px-3 text-xs hover:bg-indigo-700"
//         >
//           <Check className="size-3.5" />
//           Save
//         </Button>
//       </div>
//       <div className="shrink-0 border-b px-5 py-4">
//         <div className="flex items-center gap-3">
//           <Avatar className="size-12 rounded-xl border bg-indigo-50">
//             <AvatarImage src={avatar} alt="Atlas" />
//             <AvatarFallback>
//               <Bot className="size-5 text-indigo-600" />
//             </AvatarFallback>
//           </Avatar>
//           <div className="min-w-0 flex-1">
//             <Label
//               htmlFor="agent-name"
//               className="text-xs font-medium text-slate-600"
//             >
//               Agent name
//             </Label>
//             <Input
//               id="agent-name"
//               defaultValue={agentName}
//               className="mt-1 h-8 text-sm"
//             />
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             className="mt-4 h-8 shrink-0 gap-1.5 px-2.5 text-xs"
//           >
//             <Shuffle className="size-3.5" />
//             Shuffle
//           </Button>
//         </div>
//       </div>
//       <nav
//         aria-label="Configuration sections"
//         className="flex shrink-0 items-center gap-1 border-b px-5 py-2.5"
//       >
//         {tabs.map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             type="button"
//             title={label}
//             aria-label={label}
//             aria-current={tab === id ? "page" : undefined}
//             onClick={() => setTab(id)}
//             className={`group relative flex size-9 items-center justify-center rounded-lg transition-colors ${tab === id ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
//           >
//             <Icon className="size-[17px]" />
//             <span className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
//               {label}
//             </span>
//           </button>
//         ))}
//       </nav>
//       <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
//         {tab === "settings" && <SettingsTab />}
//         {tab === "tools" && <ToolsTab />}
//         {tab === "schedule" && <ScheduleTab />}
//         {tab === "general" && <AgentSettingsTab />}
//       </div>
//       <footer className="flex shrink-0 items-center justify-between border-t px-5 py-3 text-[10px] text-muted-foreground">
//         <span>Orbit · Agent workspace</span>
//         <span className="flex items-center gap-1">
//           <span className="size-1.5 rounded-full bg-emerald-500" />
//           All changes are local
//         </span>
//       </footer>
//     </aside>
//   );
// }
