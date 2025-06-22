/**
 * Navigation utilities for multi-tenant admin application
 * Provides helper functions for tenant-aware routing and navigation
 */

/**
 * Route patterns for the admin application
 */
export const ADMIN_ROUTES = {
  // Tenant-specific routes (require tenant context)
  TENANT: {
    DASHBOARD: '',
    USERS: 'users',
    ROLES: 'roles',
    SETTINGS: 'settings',
    ANALYTICS: 'analytics',
    PROFILE: 'profile',
  },
  
  // Control routes (super admin only)
  CONTROL: {
    TENANTS: 'admin/tenants',
    SYSTEM: 'admin/system',
    USERS: 'admin/users',
    BILLING: 'admin/billing',
    AUDIT: 'admin/audit',
  },
  
  // Global routes (no tenant context)
  GLOBAL: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    TENANT_SELECT: '/select-tenant',
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
  },
} as const;

/**
 * Check if a route requires tenant context
 * @param path - The route path to check
 * @returns Whether the route requires tenant context
 */
export const requiresTenantContext = (path: string): boolean => {
  // Remove leading slash for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Global routes don't require tenant context
  const globalRoutes = Object.values(ADMIN_ROUTES.GLOBAL);
  if (globalRoutes.some(route => cleanPath === route.slice(1))) {
    return false;
  }
  
  // Control routes don't require tenant context (they're global admin routes)
  const controlRoutes = Object.values(ADMIN_ROUTES.CONTROL);
  if (controlRoutes.some(route => cleanPath.startsWith(route))) {
    return false;
  }
  
  // All other routes require tenant context
  return true;
};

/**
 * Validate tenant slug format
 * @param tenant - The tenant slug to validate
 * @returns Whether the tenant slug is valid
 */
export const isValidTenantSlug = (tenant: string): boolean => {
  // Tenant slug should be alphanumeric with hyphens, 3-50 characters
  const tenantRegex = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
  return tenantRegex.test(tenant);
};

/**
 * Get the default route for a tenant
 * @param tenant - The tenant slug
 * @returns The default tenant route
 */
export const getDefaultTenantRoute = (tenant: string): string => {
  return `/${tenant}`;
};

/**
 * Parse a tenant-aware URL
 * @param pathname - The pathname to parse
 * @returns Parsed URL information
 */
export const parseTenantUrl = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return {
      tenant: null,
      path: '/',
      isGlobal: true,
      isValid: false,
    };
  }
  
  const [firstSegment, ...restSegments] = segments;
  
  // Check if first segment is a valid tenant slug
  if (isValidTenantSlug(firstSegment)) {
    return {
      tenant: firstSegment,
      path: '/' + restSegments.join('/'),
      isGlobal: false,
      isValid: true,
    };
  }
  
  // Check if it's a global route
  const fullPath = '/' + segments.join('/');
  const isGlobalRoute = Object.values(ADMIN_ROUTES.GLOBAL).includes(fullPath) ||
                       Object.values(ADMIN_ROUTES.CONTROL).some(route => 
                         fullPath.startsWith('/' + route)
                       );
  
  return {
    tenant: null,
    path: fullPath,
    isGlobal: isGlobalRoute,
    isValid: isGlobalRoute,
  };
};

/**
 * Build a tenant-aware URL with query parameters
 * @param tenant - The tenant slug
 * @param path - The path
 * @param params - Query parameters
 * @returns The complete URL
 */
export const buildTenantUrl = (
  tenant: string, 
  path: string, 
  params?: Record<string, string | number | boolean>
): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  let url = `/${tenant}/${cleanPath}`;
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

/**
 * Navigation menu structure for tenant context
 */
export const getTenantNavigationMenu = () => [
  {
    label: 'Dashboard',
    path: ADMIN_ROUTES.TENANT.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    label: 'Users',
    path: ADMIN_ROUTES.TENANT.USERS,
    icon: 'Users',
  },
  {
    label: 'Roles',
    path: ADMIN_ROUTES.TENANT.ROLES,
    icon: 'Shield',
  },
  {
    label: 'Analytics',
    path: ADMIN_ROUTES.TENANT.ANALYTICS,
    icon: 'BarChart3',
  },
  {
    label: 'Settings',
    path: ADMIN_ROUTES.TENANT.SETTINGS,
    icon: 'Settings',
  },
];

/**
 * Navigation menu structure for super admin control
 */
export const getControlNavigationMenu = () => [
  {
    label: 'Tenants',
    path: ADMIN_ROUTES.CONTROL.TENANTS,
    icon: 'Building',
    global: true,
  },
  {
    label: 'System',
    path: ADMIN_ROUTES.CONTROL.SYSTEM,
    icon: 'Server',
    global: true,
  },
  {
    label: 'Global Users',
    path: ADMIN_ROUTES.CONTROL.USERS,
    icon: 'UserCog',
    global: true,
  },
  {
    label: 'Billing',
    path: ADMIN_ROUTES.CONTROL.BILLING,
    icon: 'CreditCard',
    global: true,
  },
  {
    label: 'Audit',
    path: ADMIN_ROUTES.CONTROL.AUDIT,
    icon: 'FileText',
    global: true,
  },
];

/**
 * Get breadcrumb items for a given path
 * @param tenant - Current tenant
 * @param path - Current path (without tenant prefix)
 * @returns Breadcrumb items
 */
export const getBreadcrumbItems = (tenant: string | null, path: string) => {
  const items = [];
  
  // Add tenant context if available
  if (tenant) {
    items.push({
      label: 'Dashboard',
      path: '',
    });
  }
  
  // Parse path segments
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Capitalize and format segment name
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    items.push({
      label,
      path: index === segments.length - 1 ? undefined : currentPath,
    });
  });
  
  return items;
};

/**
 * Check if user has permission to access a route
 * @param path - The route path
 * @param userPermissions - User's permissions
 * @returns Whether user can access the route
 */
export const canAccessRoute = (
  path: string, 
  userPermissions: string[]
): boolean => {
  // Define route permissions mapping
  const routePermissions: Record<string, string[]> = {
    [ADMIN_ROUTES.TENANT.USERS]: ['users.read'],
    [ADMIN_ROUTES.TENANT.ROLES]: ['roles.read'],
    [ADMIN_ROUTES.TENANT.ANALYTICS]: ['analytics.read'],
    [ADMIN_ROUTES.CONTROL.TENANTS]: ['tenants.read'],
    [ADMIN_ROUTES.CONTROL.SYSTEM]: ['system.manage'],
    [ADMIN_ROUTES.CONTROL.USERS]: ['users.manage'],
    [ADMIN_ROUTES.CONTROL.BILLING]: ['billing.manage'],
    [ADMIN_ROUTES.CONTROL.AUDIT]: ['audit.read'],
  };
  
  const requiredPermissions = routePermissions[path];
  if (!requiredPermissions) {
    // No specific permissions required
    return true;
  }
  
  // Check if user has any of the required permissions
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};
