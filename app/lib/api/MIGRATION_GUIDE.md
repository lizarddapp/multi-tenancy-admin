# API Endpoints Structure Guide

This guide documents the new organized endpoint structure for the admin application.

**⚠️ Important: Legacy endpoints have been removed. All code must use the new organized structure.**

## Overview

The API endpoints are organized into two main groups:

- **ADMIN** (`/api/v1/admin`) - Admin dashboard functionality
- **CONTROL** (`/api/v1/control`) - Super admin control functionality

## Endpoint Structure

### 1. Admin Authentication Endpoints

```typescript
import { ENDPOINTS } from "~/lib/api/endpoints";

// Admin authentication endpoints
ENDPOINTS.ADMIN.AUTH.REGISTER;
ENDPOINTS.ADMIN.AUTH.LOGIN;
ENDPOINTS.ADMIN.AUTH.PROFILE;
ENDPOINTS.ADMIN.AUTH.UPDATE_PROFILE;
ENDPOINTS.ADMIN.AUTH.CHANGE_PASSWORD;
ENDPOINTS.ADMIN.AUTH.LOGOUT;
ENDPOINTS.ADMIN.AUTH.VERIFY_TOKEN;
ENDPOINTS.ADMIN.AUTH.AVAILABLE_TENANTS;
ENDPOINTS.ADMIN.AUTH.SWITCH_TENANT;
```

### 2. Admin Role Management Endpoints

```typescript
// Role CRUD operations
ENDPOINTS.ADMIN.ROLES.LIST;
ENDPOINTS.ADMIN.ROLES.CREATE;
ENDPOINTS.ADMIN.ROLES.GET(id);
ENDPOINTS.ADMIN.ROLES.UPDATE(id);
ENDPOINTS.ADMIN.ROLES.DELETE(id);
ENDPOINTS.ADMIN.ROLES.PERMISSIONS;
ENDPOINTS.ADMIN.ROLES.ASSIGN_PERMISSIONS(id);
```

### 3. Admin User Role Management Endpoints

```typescript
// User role assignments
ENDPOINTS.ADMIN.USER_ROLES.LIST(userId);
ENDPOINTS.ADMIN.USER_ROLES.ASSIGN(userId);
ENDPOINTS.ADMIN.USER_ROLES.REMOVE(userId);
ENDPOINTS.ADMIN.USER_ROLES.PERMISSIONS(userId);
ENDPOINTS.ADMIN.USER_ROLES.CHECK_PERMISSION(userId);
ENDPOINTS.ADMIN.USER_ROLES.BULK_ASSIGN(userId);
```

### 4. Control Tenant Management Endpoints (Super Admin)

```typescript
// Tenant CRUD operations
ENDPOINTS.CONTROL.TENANTS.LIST;
ENDPOINTS.CONTROL.TENANTS.CREATE;
ENDPOINTS.CONTROL.TENANTS.GET(id);
ENDPOINTS.CONTROL.TENANTS.UPDATE(id);
ENDPOINTS.CONTROL.TENANTS.DELETE(id);
ENDPOINTS.CONTROL.TENANTS.UPDATE_STATUS(id);
ENDPOINTS.CONTROL.TENANTS.ANALYTICS(id);
```

### 5. Query Keys Structure

```typescript
import { QUERY_KEYS } from "~/lib/api/endpoints";

// Admin query keys
QUERY_KEYS.ADMIN.AUTH_USER;
QUERY_KEYS.ADMIN.AUTH_AVAILABLE_TENANTS;
QUERY_KEYS.ADMIN.ROLES;
QUERY_KEYS.ADMIN.ROLE(id);
QUERY_KEYS.ADMIN.PERMISSIONS;
QUERY_KEYS.ADMIN.USER_ROLES(userId);

// Control query keys (Super Admin)
QUERY_KEYS.CONTROL.TENANTS;
QUERY_KEYS.CONTROL.TENANT(id);
QUERY_KEYS.CONTROL.TENANT_ANALYTICS(id);
```

## Route Mapping

### Authentication Routes

| Old Endpoint     | New Endpoint           | Route Group |
| ---------------- | ---------------------- | ----------- |
| `/auth/login`    | `/admin/auth/login`    | ADMIN       |
| `/auth/register` | `/admin/auth/register` | ADMIN       |
| `/auth/profile`  | `/admin/auth/profile`  | ADMIN       |
| `/auth/tenants`  | `/admin/auth/tenants`  | ADMIN       |

### Role Management Routes

| Old Endpoint         | New Endpoint               | Route Group |
| -------------------- | -------------------------- | ----------- |
| `/roles`             | `/admin/roles`             | ADMIN       |
| `/roles/{id}`        | `/admin/roles/{id}`        | ADMIN       |
| `/roles/permissions` | `/admin/roles/permissions` | ADMIN       |

### Tenant Management Routes

| Old Endpoint           | New Endpoint                   | Route Group |
| ---------------------- | ------------------------------ | ----------- |
| `/tenants`             | `/control/tenants`             | CONTROL     |
| `/tenants/{id}`        | `/control/tenants/{id}`        | CONTROL     |
| `/tenants/{id}/status` | `/control/tenants/{id}/status` | CONTROL     |

## New Endpoints Available

### Client Routes (Customer-facing)

```typescript
// Product catalog
ENDPOINTS.CLIENT.PUBLIC.PRODUCTS.LIST;
ENDPOINTS.CLIENT.PUBLIC.PRODUCTS.GET(id);

// Customer authentication
ENDPOINTS.CLIENT.AUTH.LOGIN;
ENDPOINTS.CLIENT.AUTH.REGISTER;

// Customer orders
ENDPOINTS.CLIENT.ORDERS.LIST;
ENDPOINTS.CLIENT.ORDERS.CREATE;

// Shopping cart
ENDPOINTS.CLIENT.CART.GET;
ENDPOINTS.CLIENT.CART.ADD_ITEM;
```

### Control Routes (Super Admin)

```typescript
// System management
ENDPOINTS.CONTROL.SYSTEM.HEALTH;
ENDPOINTS.CONTROL.SYSTEM.METRICS;
ENDPOINTS.CONTROL.SYSTEM.BACKUP;

// Global user management
ENDPOINTS.CONTROL.USERS.LIST;
ENDPOINTS.CONTROL.USERS.ANALYTICS;

// Billing management
ENDPOINTS.CONTROL.BILLING.SUBSCRIPTIONS;
ENDPOINTS.CONTROL.BILLING.REVENUE_ANALYTICS;
```

## Backward Compatibility

All existing code will continue to work because:

1. **Legacy endpoints are maintained** - Old endpoint paths still exist and point to the new organized structure
2. **Legacy query keys are maintained** - Old query keys still work and point to the new organized keys
3. **Gradual migration** - You can migrate endpoints one by one without breaking existing functionality

## Recommended Migration Strategy

1. **Phase 1**: Update new features to use the new organized structure
2. **Phase 2**: Gradually update existing code during maintenance
3. **Phase 3**: Remove legacy endpoints after full migration (future)

## Benefits of New Structure

1. **Clear separation** - Client, Admin, and Control functionality are clearly separated
2. **Better organization** - Related endpoints are grouped together
3. **Scalability** - Easy to add new endpoints in the right place
4. **Type safety** - Better TypeScript support with organized structure
5. **Documentation** - Self-documenting API structure

## Next Steps

1. Start using new endpoint structure for new features
2. Update existing services gradually during maintenance
3. Update API documentation to reflect new structure
4. Consider creating separate API clients for different route groups
