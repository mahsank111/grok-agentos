"use client";

import { useState } from "react";
import { ChevronDown, Clock3 } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ScheduleTab() {
  const [schedule, setSchedule] = useState("Recurring");
  return <div className="space-y-5"><div><h3 className="text-sm font-semibold">Execution schedule</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose when Atlas should run on its own.</p></div>
    <div className="space-y-2">{["Manual", "Recurring", "Specific time"].map((option) => <button key={option} type="button" onClick={() => setSchedule(option)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${schedule === option ? "border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-100" : "hover:bg-slate-50"}`}><span className={`size-4 rounded-full border ${schedule === option ? "border-[5px] border-indigo-600 bg-white" : "border-slate-300"}`} /><span className="flex-1"><span className="block text-xs font-medium">{option}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{option === "Manual" ? "Run only when you ask" : option === "Recurring" ? "Run on a regular cadence" : "Run once at a chosen time"}</span></span></button>)}</div>
    {schedule === "Recurring" && <div className="space-y-4 rounded-xl border p-4"><div className="space-y-2"><Label className="text-xs">Frequency</Label><button type="button" className="flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs">Every day<ChevronDown className="size-3.5 text-muted-foreground" /></button></div><div className="space-y-2"><Label className="text-xs">Time</Label><button type="button" className="flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs"><span className="flex items-center gap-2"><Clock3 className="size-3.5 text-muted-foreground" />8:00 AM</span><ChevronDown className="size-3.5 text-muted-foreground" /></button></div><div className="space-y-2"><Label className="text-xs">Days</Label><div className="flex justify-between">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <span key={`${day}-${i}`} className={`flex size-8 items-center justify-center rounded-full text-[10px] font-medium ${i < 5 ? "bg-indigo-600 text-white" : "border text-muted-foreground"}`}>{day}</span>)}</div></div><div className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">Every day at 8:00 AM</div></div>}
    <p className="text-[11px] leading-5 text-muted-foreground">Scheduled runs are shown as examples. Your settings are not saved.</p>
  </div>;
}
