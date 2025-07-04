import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useLocation,
} from "react-router";

import { useEffect, useState } from "react";
import type { Route } from "./+types/root";
import { QueryProvider } from "./lib/providers/QueryProvider";
import { SessionProvider, useSession } from "./lib/providers/SessionProvider";
import { useAvailableTenants } from "./lib/hooks/useAuth";
import { TenantSelectionDialog } from "./components/tenant-selection-dialog";
import { Toaster } from "sonner";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Component to handle authentication checks
function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [showTenantDialog, setShowTenantDialog] = useState(false);

  const { data: tenantsResponse } = useAvailableTenants();

  useEffect(() => {
    // Don't redirect if we're already on the login page
    if (
      !isLoading &&
      !isAuthenticated &&
      location.pathname !== "/_auth/login"
    ) {
      navigate("/_auth/login");
    }
    // if is authenticated and path still in / , navigate to the first tenant
    else if (!isLoading && isAuthenticated && location.pathname === "/") {
      // Check if user has a saved tenant slug in localStorage
      const savedTenantSlug = localStorage.getItem("selected_tenant_slug");

      if (savedTenantSlug) {
        // Navigate to the saved tenant dashboard
        navigate(`/${savedTenantSlug}`);
      } else {
        // Check if user has available tenants
        const tenants = tenantsResponse?.data?.tenants || [];

        if (tenants.length === 0) {
          // User has no tenants, show dialog to select one
          setShowTenantDialog(true);
        } else if (tenants.length === 1) {
          // User has only one tenant, automatically select it
          const tenant = tenants[0];
          localStorage.setItem("selected_tenant_slug", tenant.slug);
          navigate(`/${tenant.slug}`);
        } else {
          // User has multiple tenants, show dialog to select one
          setShowTenantDialog(true);
        }
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    location.pathname,
    tenantsResponse,
  ]);

  // Handle tenant selection from dialog
  const handleTenantSelected = (tenantSlug: string) => {
    navigate(`/${tenantSlug}`);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Allow login page to render even when not authenticated
  if (!isAuthenticated && location.pathname === "/_auth/login") {
    return <Outlet />;
  }

  // Don't render protected routes if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Outlet />
      <TenantSelectionDialog
        open={showTenantDialog}
        onOpenChange={setShowTenantDialog}
        onTenantSelected={handleTenantSelected}
      />
    </>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <SessionProvider>
        <AuthenticatedApp />
        <Toaster position="top-right" richColors />
      </SessionProvider>
    </QueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
