import { Outlet, useNavigate } from "react-router";
import type { Route } from "../+types/root";
import { useEffect } from "react";
import { useSession } from "~/lib/providers/SessionProvider";
import { TopNav, SideMenu } from "~/components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Multi-Tenancy Admin Dashboard" },
    {
      name: "description",
      content: "Admin dashboard for multi-tenant application management",
    },
  ];
}

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SideMenu />
        </div>
      </div>
      <div className="flex flex-col">
        <TopNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
