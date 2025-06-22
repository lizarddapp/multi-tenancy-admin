# Tenant-Aware Navigation Guide

This guide explains how to use the tenant-aware navigation utilities in the multi-tenant admin application.

## Overview

The navigation system automatically handles tenant context in URLs. When navigating within the admin app, the tenant slug is preserved in the URL path (e.g., `/{tenant}/dashboard`, `/{tenant}/users`).

## Core Utilities

### 1. `useTenantNavigation()` Hook

The main hook for tenant-aware navigation:

```typescript
import { useTenantNavigation } from "~/lib/hooks/useNavigation";

function MyComponent() {
  const { 
    navigate,           // Navigate with tenant context
    navigateGlobal,     // Navigate without tenant context
    currentTenant,      // Current tenant slug
    isInTenantContext,  // Whether in tenant context
    getCurrentPath      // Current path without tenant prefix
  } = useTenantNavigation();

  // Navigate within tenant context
  const goToDashboard = () => navigate("/dashboard");  // → /{tenant}/dashboard
  const goToUsers = () => navigate("/users");          // → /{tenant}/users

  // Navigate to global routes
  const goToLogin = () => navigateGlobal("/login");    // → /login
  const goToTenants = () => navigateGlobal("/admin/tenants"); // → /admin/tenants
}
```

### 2. `TenantLink` Component

Tenant-aware Link component:

```typescript
import { TenantLink } from "~/components/tenant-link";

function Navigation() {
  return (
    <nav>
      {/* Tenant-aware links (automatically prefixed with tenant) */}
      <TenantLink to="/dashboard">Dashboard</TenantLink>     {/* → /{tenant}/dashboard */}
      <TenantLink to="/users">Users</TenantLink>             {/* → /{tenant}/users */}
      <TenantLink to="/settings">Settings</TenantLink>       {/* → /{tenant}/settings */}
      
      {/* Global links (no tenant prefix) */}
      <TenantLink to="/login" global>Login</TenantLink>      {/* → /login */}
      <TenantLink to="/admin/tenants" global>Tenants</TenantLink> {/* → /admin/tenants */}
      
      {/* Switch to different tenant */}
      <TenantLink to="/dashboard" tenant="other-tenant">
        Switch to Other Tenant
      </TenantLink>                                          {/* → /other-tenant/dashboard */}
    </nav>
  );
}
```

### 3. `TenantNavLink` Component

Navigation link with active state support:

```typescript
import { TenantNavLink } from "~/components/tenant-link";

function Sidebar() {
  return (
    <nav>
      <TenantNavLink 
        to="/dashboard" 
        activeClassName="bg-blue-500 text-white"
        className="block p-2 hover:bg-gray-100"
      >
        Dashboard
      </TenantNavLink>
      
      <TenantNavLink 
        to="/users" 
        activeClassName="bg-blue-500 text-white"
        className="block p-2 hover:bg-gray-100"
        isActive={(currentPath, targetPath) => currentPath.startsWith(targetPath)}
      >
        Users
      </TenantNavLink>
    </nav>
  );
}
```

### 4. `TenantBreadcrumb` Component

Breadcrumb component with tenant context:

```typescript
import { TenantBreadcrumb } from "~/components/tenant-link";

function PageHeader() {
  const breadcrumbItems = [
    { label: "Users", path: "/users" },
    { label: "Edit User" }, // No path = current page
  ];

  return (
    <header>
      <TenantBreadcrumb 
        items={breadcrumbItems}
        separator="/"
        className="mb-4"
      />
      {/* Renders: {tenant} / Users / Edit User */}
    </header>
  );
}
```

## Route Patterns

### Tenant Routes (Require tenant context)
```typescript
import { ADMIN_ROUTES } from "~/lib/utils/navigation";

// These routes are automatically prefixed with tenant
ADMIN_ROUTES.TENANT.DASHBOARD    // "" → /{tenant}/
ADMIN_ROUTES.TENANT.USERS        // "users" → /{tenant}/users
ADMIN_ROUTES.TENANT.ROLES        // "roles" → /{tenant}/roles
ADMIN_ROUTES.TENANT.SETTINGS     // "settings" → /{tenant}/settings
```

### Control Routes (Super admin, no tenant context)
```typescript
// These routes are global (no tenant prefix)
ADMIN_ROUTES.CONTROL.TENANTS     // "admin/tenants" → /admin/tenants
ADMIN_ROUTES.CONTROL.SYSTEM      // "admin/system" → /admin/system
ADMIN_ROUTES.CONTROL.USERS       // "admin/users" → /admin/users
```

### Global Routes (No tenant context)
```typescript
// These routes never have tenant prefix
ADMIN_ROUTES.GLOBAL.LOGIN        // "/login"
ADMIN_ROUTES.GLOBAL.LOGOUT       // "/logout"
ADMIN_ROUTES.GLOBAL.UNAUTHORIZED // "/unauthorized"
```

## Utility Functions

### Build Tenant URLs
```typescript
import { buildTenantPath, buildTenantUrl } from "~/lib/hooks/useNavigation";

// Simple path building
const dashboardPath = buildTenantPath("my-tenant", "/dashboard");
// Result: "/my-tenant/dashboard"

// URL with query parameters
const usersUrl = buildTenantUrl("my-tenant", "/users", { page: 1, limit: 10 });
// Result: "/my-tenant/users?page=1&limit=10"
```

### Parse URLs
```typescript
import { parseTenantUrl, extractTenantFromPath } from "~/lib/hooks/useNavigation";

// Parse a tenant URL
const parsed = parseTenantUrl("/my-tenant/users");
// Result: { tenant: "my-tenant", path: "/users", isGlobal: false, isValid: true }

// Extract tenant from path
const tenant = extractTenantFromPath("/my-tenant/dashboard");
// Result: "my-tenant"
```

## Best Practices

### 1. Use Tenant-Aware Components
```typescript
// ✅ Good - Uses tenant-aware navigation
import { TenantLink } from "~/components/tenant-link";
<TenantLink to="/users">Users</TenantLink>

// ❌ Bad - Manual tenant handling
import { Link } from "react-router";
<Link to={`/${currentTenant}/users`}>Users</Link>
```

### 2. Distinguish Global vs Tenant Routes
```typescript
// ✅ Good - Clear distinction
<TenantLink to="/dashboard">Dashboard</TenantLink>        {/* Tenant route */}
<TenantLink to="/login" global>Login</TenantLink>         {/* Global route */}

// ❌ Bad - Unclear intent
<TenantLink to="/dashboard">Dashboard</TenantLink>
<TenantLink to="/login">Login</TenantLink>
```

### 3. Use Route Constants
```typescript
// ✅ Good - Use predefined constants
import { ADMIN_ROUTES } from "~/lib/utils/navigation";
<TenantLink to={ADMIN_ROUTES.TENANT.USERS}>Users</TenantLink>

// ❌ Bad - Magic strings
<TenantLink to="/users">Users</TenantLink>
```

### 4. Handle Navigation Programmatically
```typescript
// ✅ Good - Use tenant-aware navigation
const { navigate, navigateGlobal } = useTenantNavigation();

const handleSave = async () => {
  await saveUser();
  navigate("/users"); // Stays in tenant context
};

const handleLogout = async () => {
  await logout();
  navigateGlobal("/login"); // Goes to global login
};
```

## Migration from Regular Navigation

### Before (Regular React Router)
```typescript
import { useNavigate, Link } from "react-router";

function Component() {
  const navigate = useNavigate();
  
  const goToUsers = () => navigate(`/${tenant}/users`);
  
  return <Link to={`/${tenant}/dashboard`}>Dashboard</Link>;
}
```

### After (Tenant-Aware Navigation)
```typescript
import { useTenantNavigation } from "~/lib/hooks/useNavigation";
import { TenantLink } from "~/components/tenant-link";

function Component() {
  const { navigate } = useTenantNavigation();
  
  const goToUsers = () => navigate("/users");
  
  return <TenantLink to="/dashboard">Dashboard</TenantLink>;
}
```

## Benefits

1. **Automatic Tenant Context**: No need to manually handle tenant slugs
2. **Type Safety**: Predefined route constants prevent typos
3. **Consistent Navigation**: All navigation follows the same pattern
4. **Easy Maintenance**: Centralized navigation logic
5. **Better UX**: Seamless tenant context preservation
