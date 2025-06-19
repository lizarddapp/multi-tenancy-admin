import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  CreditCard,
  Building,
  Plus,
  Check,
  Settings,
} from "lucide-react";
import { useSession } from "~/lib/providers/SessionProvider";
import { toast } from "sonner";
import type {
  Outlet as OutletType,
  UserRole,
  UserStatus,
} from "~/types/dashboard";
import { SideMenu } from "./SideMenu";

const availableOutlets: OutletType[] = [
  {
    id: "1",
    name: "Acme Corp",
    users: 124,
    plan: "Enterprise",
    status: "active",
  },
  { id: "2", name: "TechStart Inc", users: 45, plan: "Pro", status: "active" },
  { id: "3", name: "Design Studio", users: 12, plan: "Trial", status: "trial" },
  {
    id: "4",
    name: "Global Solutions",
    users: 89,
    plan: "Enterprise",
    status: "active",
  },
  { id: "5", name: "StartupX", users: 8, plan: "Basic", status: "inactive" },
];

export function TopNav() {
  const [selectedOutlet, setSelectedOutlet] = useState<OutletType>(
    availableOutlets[0]
  );
  const { user, logout, isLoading: sessionLoading } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <SideMenu />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-4">
            {/* Outlet/Tenant Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {selectedOutlet.name}
                  </span>
                  <span className="sr-only sm:not-sr-only">Switch Outlet</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>Switch Outlet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableOutlets.map((outlet) => (
                  <DropdownMenuItem
                    key={outlet.id}
                    onClick={() => setSelectedOutlet(outlet)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">{outlet.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {outlet.users} users • {outlet.plan}
                        </span>
                      </div>
                    </div>
                    {selectedOutlet.id === outlet.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add New Outlet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || "A"}
                      {user?.lastName?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName || "Admin User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={sessionLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
