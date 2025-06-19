import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Users,
  Building,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import type {
  DashboardStat,
  Tenant,
  Activity as ActivityType,
} from "~/types/dashboard";

// Mock data for the dashboard
const stats: DashboardStat[] = [
  {
    title: "Total Tenants",
    value: "2,350",
    change: "+20.1%",
    trend: "up",
    icon: Building,
  },
  {
    title: "Active Users",
    value: "45,231",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Monthly Revenue",
    value: "$54,239",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "-0.1%",
    trend: "down",
    icon: Activity,
  },
];

const recentTenants: Tenant[] = [
  {
    name: "Acme Corp",
    email: "admin@acme.com",
    status: "active",
    users: 124,
    plan: "Enterprise",
  },
  {
    name: "TechStart Inc",
    email: "admin@techstart.com",
    status: "active",
    users: 45,
    plan: "Pro",
  },
  {
    name: "Design Studio",
    email: "admin@designstudio.com",
    status: "trial",
    users: 12,
    plan: "Trial",
  },
  {
    name: "Global Solutions",
    email: "admin@global.com",
    status: "active",
    users: 89,
    plan: "Enterprise",
  },
  {
    name: "StartupX",
    email: "admin@startupx.com",
    status: "inactive",
    users: 8,
    plan: "Basic",
  },
];

const recentActivity: ActivityType[] = [
  {
    action: "New tenant registered",
    tenant: "Acme Corp",
    time: "2 minutes ago",
  },
  {
    action: "User limit increased",
    tenant: "TechStart Inc",
    time: "1 hour ago",
  },
  {
    action: "Plan upgraded to Enterprise",
    tenant: "Global Solutions",
    time: "3 hours ago",
  },
  {
    action: "Trial started",
    tenant: "Design Studio",
    time: "1 day ago",
  },
];

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon;
  const isPositive = stat.trend === "up";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {stat.change}
          </span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Active
        </Badge>
      );
    case "trial":
      return <Badge variant="secondary">Trial</Badge>;
    case "inactive":
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getPlanBadge(plan: string) {
  switch (plan) {
    case "Enterprise":
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Enterprise
        </Badge>
      );
    case "Pro":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Pro
        </Badge>
      );
    case "Basic":
      return <Badge variant="outline">Basic</Badge>;
    case "Trial":
      return <Badge variant="secondary">Trial</Badge>;
    default:
      return <Badge variant="outline">{plan}</Badge>;
  }
}

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Tenants</CardTitle>
            <CardDescription>
              You have {recentTenants.length} tenants registered this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentTenants.map((tenant, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {tenant.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tenant.email}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    {getStatusBadge(tenant.status)}
                    {getPlanBadge(tenant.plan)}
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {tenant.users} users
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.tenant}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
            <div className="mt-4 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: "12.5%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Session
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m 32s</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Support Tickets
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              -12% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
