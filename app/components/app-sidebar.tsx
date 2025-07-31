import * as React from "react";
import { LayoutDashboard, Users, CreditCard } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import { UpgradeBanner } from "~/components/upgrade-banner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useSession } from "~/lib/providers/SessionProvider";
import { usePermissions, RESOURCES } from "~/lib/hooks/usePermissions";
import { UserRole } from "~/types";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { useTenant } from "~/lib/hooks/useTenant";

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
                url: `/users?role=${UserRole.ADMIN}`,
              },
              {
                title: "Managers",
                url: `/users?role=${UserRole.MANAGER}`,
              },
              {
                title: "Staff",
                url: `/users?role=${UserRole.VIEWER}`,
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
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  const { canAccess, isLoading, error } = usePermissions();
  const { currentTenant } = useTenant();
  const { data: billingData, isLoading: billingLoading } = useCurrentBilling();

  // Determine if tenant needs upgrade/billing attention
  const needsUpgrade = React.useMemo(() => {
    if (!currentTenant || billingLoading) return false;

    const billing = billingData?.data;

    // No billing record means needs setup
    if (!billing) return true;

    // Use the needsUpgrade field from the database
    return billing.needsUpgrade;
  }, [currentTenant, billingData]);

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
        {needsUpgrade && (
          <div className="px-3 py-2">
            <UpgradeBanner />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
