# Permissions System Documentation

## Overview

The permissions system has been updated to use a dedicated API endpoint (`/admin/auth/get-my-permissions`) instead of relying on session data. This provides more dynamic and context-aware permission checking.

## Key Changes

### 1. New API Endpoint

- **Endpoint**: `GET /admin/auth/get-my-permissions`
- **Headers**: Requires `X-Tenant-Id` header for tenant-specific permissions
- **Response**: `{ permissions: string[] }`

### 2. Updated usePermissions Hook

The `usePermissions` hook now:

- Fetches permissions from the API endpoint
- Automatically includes tenant context via `X-Tenant-Id` header
- Provides loading and error states
- Caches permissions for 5 minutes

### 3. Enhanced Permission Checking

- **Dynamic**: Permissions are fetched based on current tenant context
- **Cached**: Uses React Query for efficient caching
- **Error Handling**: Graceful fallbacks when permissions can't be loaded

## Usage

### Basic Permission Checking

```typescript
import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
} from "~/lib/hooks/usePermissions";

function MyComponent() {
  const { canAccess, hasPermission, isLoading, error } = usePermissions();

  if (isLoading) return <div>Loading permissions...</div>;
  if (error) return <div>Error loading permissions</div>;

  return (
    <div>
      {/* Check specific permission */}
      {hasPermission(PERMISSIONS.USERS_CREATE) && <button>Create User</button>}

      {/* Check resource access */}
      {canAccess(RESOURCES.TENANTS, "read") && <div>Tenant information</div>}

      {/* Check any permission for a resource */}
      {canAccess(RESOURCES.ANALYTICS) && <div>Analytics section</div>}
    </div>
  );
}
```

### Permission Guard Component

```typescript
import { PermissionGuard } from "~/components/permission-guard";

function MyComponent() {
  return (
    <PermissionGuard
      resource="users"
      action="create"
      fallback={<div>Access denied</div>}
    >
      <button>Create User</button>
    </PermissionGuard>
  );
}
```

### Sidebar Integration

The sidebar automatically uses the permissions system:

```typescript
// Sidebar sections are automatically shown/hidden based on permissions
const navData = getNavData(user, canAccess);
```

## Permission Constants

### PERMISSIONS

- `USERS_CREATE`, `USERS_READ`, `USERS_UPDATE`, `USERS_DELETE`, `USERS_MANAGE`
- `TENANTS_CREATE`, `TENANTS_READ`, `TENANTS_UPDATE`, `TENANTS_DELETE`, `TENANTS_MANAGE`
- `ANALYTICS_READ`, `ANALYTICS_MANAGE`
- `ROLES_CREATE`, `ROLES_READ`, `ROLES_UPDATE`, `ROLES_DELETE`, `ROLES_MANAGE`
- `SYSTEM_MANAGE`
- `PRODUCTS_CREATE`, `PRODUCTS_READ`, `PRODUCTS_UPDATE`, `PRODUCTS_DELETE`, `PRODUCTS_MANAGE`
- `BILLING_READ`, `BILLING_MANAGE`

### RESOURCES

- `USERS`, `TENANTS`, `ANALYTICS`, `ROLES`, `SYSTEM`, `PRODUCTS`, `BILLING`

## API Integration

### Headers

The system automatically includes the `X-Tenant-Id` header when a tenant is selected:

```typescript
// This is handled automatically by the useTenant hook
const { currentTenant } = useTenant();
// X-Tenant-Id header is set automatically
```

### Caching

- Permissions are cached for 5 minutes
- Cache is invalidated when tenant context changes
- Manual refresh available via React Query

### Error Handling

- Graceful fallbacks when API is unavailable
- Loading states during permission fetching
- Error states with appropriate messaging

## Migration Notes

### Before (Session-based)

```typescript
// Old way - relied on session data
const { user } = useSession();
const hasPermission = user?.permissions?.includes("users.create");
```

### After (API-based)

```typescript
// New way - uses API endpoint
const { hasPermission } = usePermissions();
const canCreate = hasPermission("users.create");
```

## Best Practices

1. **Use Constants**: Always use `PERMISSIONS` and `RESOURCES` constants
2. **Handle Loading**: Always handle loading states in UI
3. **Graceful Fallbacks**: Provide fallbacks for permission errors
4. **Resource-based**: Use `canAccess(resource, action)` for cleaner code
5. **Super Admin**: Super admin role automatically has all permissions

## Troubleshooting

### Permissions not loading

- Check if `X-Tenant-Id` header is being set correctly
- Verify user authentication
- Check network requests in browser dev tools

### Incorrect permissions

- Verify tenant context is correct
- Check if user has proper role assignments
- Ensure backend permissions are configured correctly

### Performance issues

- Permissions are cached for 5 minutes
- Use React Query devtools to monitor cache
- Consider preloading permissions on app initialization
