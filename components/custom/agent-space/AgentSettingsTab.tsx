import { ChevronDown, Copy, Pause, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { title: "Duplicate agent", description: "Create a copy of Atlas and its settings", icon: Copy, tone: "bg-slate-100 text-slate-600" },
  { title: "Pause agent", description: "Temporarily stop scheduled activity", icon: Pause, tone: "bg-amber-50 text-amber-600" },
  { title: "Reset agent", description: "Restore default preferences", icon: RotateCcw, tone: "bg-slate-100 text-slate-600" },
];

export function AgentSettingsTab() {
  return <div className="space-y-5"><div><h3 className="text-sm font-semibold">Agent settings</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Manage this agent and its workspace.</p></div>
    <div className="space-y-2">{actions.map(({ title, description, icon: Icon, tone }) => <button key={title} type="button" className="flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-slate-50"><span className={`flex size-8 items-center justify-center rounded-lg ${tone}`}><Icon className="size-4" /></span><span className="flex-1"><span className="block text-xs font-medium">{title}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{description}</span></span><ChevronDown className="size-4 -rotate-90 text-muted-foreground" /></button>)}</div>
    <div className="border-t pt-5"><div className="rounded-xl border border-red-200 bg-red-50/40 p-4"><div className="mb-3 flex items-start gap-2.5"><Trash2 className="mt-0.5 size-4 text-red-600" /><div><h4 className="text-xs font-semibold text-red-900">Danger zone</h4><p className="mt-1 text-[11px] leading-5 text-red-800/70">Deleting this agent permanently removes its configuration.</p></div></div><Button variant="outline" size="sm" className="h-8 border-red-200 bg-white px-3 text-xs text-red-700 hover:bg-red-50"><Trash2 className="mr-1.5 size-3.5" />Delete agent</Button></div></div>
  </div>;
}
