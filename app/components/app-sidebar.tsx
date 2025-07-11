import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Package,
  Building,
  CreditCard,
  Shield,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useSession } from "~/lib/providers/SessionProvider";
import { usePermissions, RESOURCES } from "~/lib/hooks/usePermissions";

// Multi-tenancy admin navigation structure
const getNavData = (
  user: any,
  canAccess: (resource: string, action?: string) => boolean
) => ({
  user: {
    name: user?.fullName || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: "", // Empty string - will fallback to initials
  },

  navMain: [
    // Dashboard is always visible
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    // Tenants section - visible if user can read tenants
    ...(canAccess(RESOURCES.TENANTS, "read")
      ? [
          {
            title: "Tenants",
            url: "/tenants",
            icon: Building,
            items: [
              {
                title: "All Tenants",
                url: "/tenants",
              },
              {
                title: "Active Tenants",
                url: "/tenants?status=active",
              },
              {
                title: "Trial Tenants",
                url: "/tenants?status=trial",
              },
              {
                title: "Inactive Tenants",
                url: "/tenants?status=inactive",
              },
            ],
          },
        ]
      : []),
    // Users section - visible if user can read users
    ...(canAccess(RESOURCES.USERS, "read")
      ? [
          {
            title: "Users",
            url: "/users",
            icon: Users,
            items: [
              {
                title: "All Users",
                url: "/users",
              },
              {
                title: "Admins",
                url: "/users?role=admin",
              },
              {
                title: "Managers",
                url: "/users?role=manager",
              },
              {
                title: "Staff",
                url: "/users?role=staff",
              },
            ],
          },
        ]
      : []),
    // Analytics section - visible if user can read analytics
    ...(canAccess(RESOURCES.ANALYTICS, "read")
      ? [
          {
            title: "Analytics",
            url: "/analytics",
            icon: BarChart3,
            items: [
              {
                title: "Overview",
                url: "/analytics",
              },
              {
                title: "Revenue",
                url: "/analytics/revenue",
              },
              {
                title: "Usage",
                url: "/analytics/usage",
              },
              {
                title: "Performance",
                url: "/analytics/performance",
              },
            ],
          },
        ]
      : []),
    // Products section - visible if user can read products
    ...(canAccess(RESOURCES.PRODUCTS, "read")
      ? [
          {
            title: "Products",
            url: "/products",
            icon: Package,
            items: [
              {
                title: "All Products",
                url: "/products",
              },
              {
                title: "Plans",
                url: "/products/plans",
              },
              {
                title: "Features",
                url: "/products/features",
              },
              {
                title: "Pricing",
                url: "/products/pricing",
              },
            ],
          },
        ]
      : []),
    // Billing section - visible if user can read billing
    ...(canAccess(RESOURCES.BILLING, "read")
      ? [
          {
            title: "Billing",
            url: "/billing",
            icon: CreditCard,
            items: [
              {
                title: "Overview",
                url: "/billing",
              },
              {
                title: "Invoices",
                url: "/billing/invoices",
              },
              {
                title: "Payments",
                url: "/billing/payments",
              },
              {
                title: "Subscriptions",
                url: "/billing/subscriptions",
              },
            ],
          },
        ]
      : []),
    // Security section - visible if user can read roles or has system access
    ...(canAccess(RESOURCES.ROLES, "read") ||
    canAccess(RESOURCES.SYSTEM, "manage")
      ? [
          {
            title: "Security",
            url: "/security",
            icon: Shield,
            items: [
              {
                title: "Roles & Permissions",
                url: "/security/roles",
              },
              {
                title: "Access Logs",
                url: "/security/logs",
              },
              {
                title: "API Keys",
                url: "/security/api-keys",
              },
              {
                title: "Audit Trail",
                url: "/security/audit",
              },
            ],
          },
        ]
      : []),
    // Settings section - visible if user has system management access
    ...(canAccess(RESOURCES.SYSTEM, "manage")
      ? [
          {
            title: "Settings",
            url: "/settings",
            icon: Settings,
            items: [
              {
                title: "General",
                url: "/settings",
              },
              {
                title: "Integrations",
                url: "/settings/integrations",
              },
              {
                title: "Notifications",
                url: "/settings/notifications",
              },
              {
                title: "System",
                url: "/settings/system",
              },
            ],
          },
        ]
      : []),
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  const { canAccess, isLoading, error } = usePermissions();

  // Show minimal sidebar while permissions are loading
  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Loading menu...
              </span>
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: user?.fullName || "Admin User",
              email: user?.email || "admin@example.com",
              avatar: "",
            }}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  // Show basic sidebar if there's an error loading permissions
  if (error) {
    const basicNavData = {
      user: {
        name: user?.fullName || "Admin User",
        email: user?.email || "admin@example.com",
        avatar: "",
      },
      navMain: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          isActive: true,
        },
      ],
    };

    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={basicNavData.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={basicNavData.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  const data = getNavData(user, canAccess);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
