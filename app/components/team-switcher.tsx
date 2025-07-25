import * as React from "react";
import { ChevronsUpDown, Plus, Building } from "lucide-react";
import { useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

import { useTenant } from "~/lib/hooks/useTenant";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import {
  saveSelectedTenant,
  generateTenantPath,
  getTenantStatusColor,
  type SimpleTenant,
} from "~/lib/utils/tenant";
import { useQueryClient } from "@tanstack/react-query";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  // Use the custom tenant hook
  const {
    currentTenant: activeTenant,
    tenants,
    isLoading,
    hasTenants,
    hasCurrentTenant,
  } = useTenant();

  // Handle tenant switching
  const handleTenantSwitch = async (tenant: SimpleTenant) => {
    if (tenant.id === activeTenant?.id) return;

    try {
      // Save to localStorage first
      saveSelectedTenant(tenant.slug);

      // Generate the new path for the tenant
      const newPath = generateTenantPath(window.location.pathname, tenant.slug);

      // Navigate first - this will trigger TenantInitializer to set the proper context
      navigate(newPath, { replace: true });

      toast.success(`Switched to ${tenant.name}`);
    } catch (error: any) {
      console.error("Failed to switch tenant:", error);
      toast.error(error?.response?.data?.message || "Failed to switch tenant");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
              <span className="truncate text-xs">Please wait</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Show message if no tenants
  if (!hasTenants) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">No Tenants</span>
              <span className="truncate text-xs">Contact admin</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Show message if no active tenant found
  if (!hasCurrentTenant || !activeTenant) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Select Tenant</span>
              <span className="truncate text-xs">Choose a tenant</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeTenant.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs">{activeTenant.slug}</span>
                  <Badge
                    className={`text-xs px-1 py-0 h-4 ${getTenantStatusColor(
                      activeTenant.status
                    )}`}
                  >
                    {activeTenant.status}
                  </Badge>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Available Tenants
            </DropdownMenuLabel>
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() => handleTenantSwitch(tenant)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building className="size-3.5 shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tenant.slug}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs px-1 py-0 h-4 ${getTenantStatusColor(
                      tenant.status
                    )}`}
                  >
                    {tenant.status}
                  </Badge>
                  {tenant.id === activeTenant.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => navigate("/tenants")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Manage Tenants
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
