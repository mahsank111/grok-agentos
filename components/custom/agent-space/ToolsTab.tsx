import { CalendarClock, FileText, Github, Mail, Plus, Slack } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  { name: "Gmail", detail: "Read, draft and organize email", icon: Mail, color: "text-red-500 bg-red-50" },
  { name: "Slack", detail: "Search messages and post updates", icon: Slack, color: "text-violet-600 bg-violet-50" },
  { name: "Google Calendar", detail: "Manage events and availability", icon: CalendarClock, color: "text-blue-600 bg-blue-50" },
  { name: "Notion", detail: "Find and update your workspace", icon: FileText, color: "text-neutral-800 bg-neutral-100" },
  { name: "GitHub", detail: "Work with repositories and issues", icon: Github, color: "text-neutral-800 bg-neutral-100" },
];

export function ToolsTab() {
  return <div><div className="mb-4"><h3 className="text-sm font-semibold">Connected apps</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose the apps Atlas can use to help you.</p></div><div className="space-y-2">{tools.map(({ name, detail, icon: Icon, color }) => <div key={name} className="flex items-center gap-3 rounded-xl border p-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium">{name}</p><p className="mt-0.5 truncate text-[10px] text-muted-foreground">{detail}</p></div><Button variant="outline" size="sm" className="h-7 shrink-0 px-2.5 text-[11px]">Connect</Button></div>)}</div><Button variant="ghost" size="sm" className="mt-3 h-8 gap-1.5 px-2 text-xs text-indigo-600"><Plus className="size-3.5" />Browse all apps</Button></div>;
}
