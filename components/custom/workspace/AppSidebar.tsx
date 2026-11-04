
"use client";

import {
  ChevronUpIcon,
  LoaderCircleIcon,
  LogOutIcon,
  PlusIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// const agent = [
//   {
//     name : "Research Agent",
//     image : "https://images.unsplash.com/photo-1682685794700-1e7f3c5b8d4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//     initials : "RA"
//   }
// ]

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Image from "next/image";
import Link from "next/link"; // Simply can used as router link to navigate to other pages in the app. It is a wrapper around the anchor tag.
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

import type { AgentConfigType } from "@/type/Agent";

function AppSidebar() {
  const [agents, setAgents] = useState<AgentConfigType[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data, status } = useSession();
  const path = usePathname();

  const currentAgentId = getAgentIdFromPath(path);

  // Generate user initials for the avatar fallback.
  const userInitials =
    data?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // Fetch the logged-in user's agents.
  useEffect(() => {
    let isMounted = true;

    const getUserAgents = async () => {
      try {
        const result = await axios.get("/api/agent");

        if (isMounted) {
          setAgents(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch agents:", error);

        if (isMounted) {
          setAgents([]);
        }
      }
    };

    if (status === "authenticated") {
      getUserAgents();
    }

    return () => {
      isMounted = false;
    };
  }, [path, status]);

  // Sign out the current user.
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/sign-in" });
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <Sidebar collapsible="icon">

      {/* Sidebar Header */}
      <SidebarHeader className="gap-4 px-3 py-4">

        {/* Logo and Branding */}
        <div className="flex items-center gap-2.5 px-1">
          <Image
            src="/logo.png"
            alt="Orbit logo"
            width={45}
            height={45}
          />

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xl font-semibold leading-none">
              Orbit
            </p>
          </div>
        </div>

        {/* Create New Agent */}
        <Link href="/workspace/create-agent">
          <Button
            size="lg"
            className="h-10 w-full justify-start gap-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0"
          >
            <PlusIcon className="size-4" />

            <span className="group-data-[collapsible=icon]:hidden">
              Create New Agent
            </span>
          </Button>
        </Link>

      </SidebarHeader>

      {/* Sidebar Main Content */}
      <SidebarContent>

        <SidebarGroup className="px-2">
          <SidebarGroupLabel>
            Your Agents
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">

              {agents.map((agent) => (
                <SidebarMenuItem key={agent.agentId}>

                  <SidebarMenuButton
                    render={
                      <Link href={`/workspace/${agent.agentId}`} />
                    }
                    className="h-10 gap-2.5 rounded-lg"
                    isActive={agent.agentId === currentAgentId}
                    tooltip={agent.name}
                  >
                    <Avatar size="sm" className="size-6">
                      <AvatarImage
                        src={agent.agentImage}
                        alt={agent.name}
                      />

                      <AvatarFallback>
                        {agent.name?.charAt(0).toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>

                    <span>{agent.name}</span>

                  </SidebarMenuButton>

                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="gap-3 px-3 py-4">

        <SidebarSeparator className="mx-0" />

        {/* User Profile Menu */}
        <Popover>

          <PopoverTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                aria-label="Open user menu"
              />
            }
          >
            <Avatar className="size-8">

              <AvatarImage
                src={data?.user?.image ?? ""}
                alt={data?.user?.name ?? "User"}
              />

              <AvatarFallback>
                {userInitials}
              </AvatarFallback>

            </Avatar>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">

              <p className="truncate text-sm font-medium leading-none">
                {data?.user?.name ?? "User"}
              </p>

              <p className="mt-1 truncate text-xs text-sidebar-foreground/60">
                {data?.user?.email}
              </p>

            </div>

            <ChevronUpIcon className="size-4 shrink-0 text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden" />

          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-60 gap-2 p-2"
          >

            <div className="px-2 py-1.5">

              <p className="truncate text-sm font-medium">
                {data?.user?.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {data?.user?.email}
              </p>

            </div>

            <div className="h-px bg-border" />

            {/* Sign Out */}
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              {isSigningOut ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : (
                <LogOutIcon className="size-4" />
              )}

              {isSigningOut ? "Signing out..." : "Sign out"}

            </Button>

          </PopoverContent>

        </Popover>

      </SidebarFooter>

    </Sidebar>
  );
}


// Extract the active agent ID from the current URL.
function getAgentIdFromPath(path: string | null) {
  const match = path?.match(/^\/workspace\/([^/]+)/);
  const agentId = match?.[1];

  if (!agentId || agentId === "create" || agentId === "create-agent") {
    return null;
  }

  return decodeURIComponent(agentId);
}

export default AppSidebar;
