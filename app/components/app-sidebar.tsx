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
  UserCheck,
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

// Multi-tenancy admin navigation structure
const getNavData = (user: any) => ({
  user: {
    name: user?.fullName || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: "/avatars/01.png",
  },
  teams: [
    {
      name: "Acme Corp",
      logo: Building,
      plan: "Enterprise",
    },
    {
      name: "TechStart Inc",
      logo: Building,
      plan: "Pro",
    },
    {
      name: "Design Studio",
      logo: Building,
      plan: "Trial",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
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
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  const data = getNavData(user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
