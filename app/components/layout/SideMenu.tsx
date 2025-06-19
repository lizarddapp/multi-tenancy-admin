import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Package,
  Building,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { NavigationItem } from "~/types/dashboard";

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tenants", href: "/tenants", icon: Building },
  { name: "Users", href: "/users", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Products", href: "/products", icon: Package },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SideMenuProps {
  className?: string;
}

export function SideMenu({ className }: SideMenuProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 py-2">
            <Building className="h-6 w-6" />
            <h2 className="text-lg font-semibold tracking-tight">
              Admin Panel
            </h2>
          </div>
          <div className="space-y-1 mt-4">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
