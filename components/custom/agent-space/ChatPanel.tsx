
"use client";

import type { ReactNode } from "react";
import {
  Bot,
  Check,
  Copy,
  MoreHorizontal,
  Send,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useAgentConfig } from "@/context/AgentConfigContext";

function ChatMessage({
  children,
  time,
  user = false,
  agentName,
  avatar,
}: {
  children: ReactNode;
  time: string;
  user?: boolean;
  agentName: string;
  avatar: string;
}) {
  return (
    <div className={`flex gap-3 ${user ? "justify-end" : ""}`}>
      {!user && (
        <Avatar className="mt-5 size-8 shrink-0 rounded-xl bg-indigo-50">
          <AvatarImage src={avatar} alt={agentName} />
          <AvatarFallback>
            <Bot className="size-4 text-indigo-600" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[82%] ${user ? "order-first" : ""}`}>
        <p
          className={`mb-1.5 text-[11px] font-medium text-muted-foreground ${
            user ? "text-right" : ""
          }`}
        >
          {user ? "You" : agentName} · {time}
        </p>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            user
              ? "rounded-tr-sm bg-indigo-600 text-white"
              : "rounded-tl-sm border bg-white text-slate-700 shadow-sm"
          }`}
        >
          {children}
        </div>
      </div>

      {user && (
        <Avatar className="mt-5 size-8 shrink-0">
          <AvatarFallback className="bg-slate-100 text-xs font-medium">
            JD
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export function ChatPanel() {
  const { agentConfig } = useAgentConfig();

  if (!agentConfig) return null;

  const agentName = agentConfig.name;
  const avatar =
    agentConfig.agentImage ||
    `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(agentName)}`;

  return (
    <section className="flex min-w-0 flex-1 flex-col">

      <header className="flex h-[72px] shrink-0 items-center justify-between border-b px-7">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-xl border bg-indigo-50">
            <AvatarImage src={avatar} alt={agentName} />
            <AvatarFallback>
              <Bot className="size-5 text-indigo-600" />
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-sm font-semibold">{agentName}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Ready to help
            </p>
          </div>
        </div>

        <span className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium text-slate-700">
          <span className="size-2 rounded-full bg-emerald-500" />
          Active
        </span>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">

          <div className="mb-8 text-center">
            <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Sparkles className="size-5" />
            </span>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Your workspace
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Welcome to {agentName}.
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {agentConfig.description || "Your agent is ready to be configured."}
            </p>
          </div>

          <div className="space-y-7">
            <ChatMessage
              user
              time="9:41 AM"
              agentName={agentName}
              avatar={avatar}
            >
              Can you help me get a clear picture of what needs my attention today?
            </ChatMessage>

            <ChatMessage
              time="9:41 AM"
              agentName={agentName}
              avatar={avatar}
            >
              <div className="space-y-3">
                <p>
                  Hello! I'm {agentName}. I'm ready to assist you.
                </p>
                <p>
                  You can configure my settings and tools using the panel on the right.
                </p>
              </div>

              <div className="mt-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy response"
                  className="size-7 text-muted-foreground"
                  disabled
                >
                  <Copy className="size-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="More response actions"
                  className="size-7 text-muted-foreground"
                  disabled
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </ChatMessage>
          </div>

          <div className="mt-auto min-h-8" />
        </div>
      </div>

      <div className="shrink-0 px-6 pb-5 pt-3 sm:px-10">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-2 shadow-sm">
          <Textarea
            aria-label="Message your agent"
            placeholder={`Ask ${agentName} anything ...`}
            className="min-h-[54px] resize-none border-0 px-3 py-2.5 text-sm shadow-none focus-visible:ring-0"
            disabled
          />

          <div className="flex items-center justify-between px-2 pb-1">
            <p className="text-[11px] text-muted-foreground">
              Chat execution will be connected next.
            </p>

            <Button
              size="icon"
              aria-label="Send message"
              className="size-8 rounded-lg bg-indigo-600 hover:bg-indigo-700"
              disabled
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
