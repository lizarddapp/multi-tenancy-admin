import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

// Tenant types matching backend model
export enum TenantStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  TRIAL = "trial",
}

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  status: TenantStatus;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
  users?: User[]; // Optional relation
  usersCount?: number; // For display purposes
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  status?: TenantStatus;
  trialEndsAt?: string | null;
}

export interface UpdateTenantRequest {
  name?: string;
  slug?: string;
  status?: TenantStatus;
  trialEndsAt?: string | null;
}

export interface UpdateTenantStatusRequest {
  status: TenantStatus;
}

export interface Activity {
  action: string;
  tenant: string;
  time: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface Outlet {
  id: string;
  name: string;
  users: number;
  plan: "Enterprise" | "Pro" | "Basic" | "Trial";
  status: "active" | "trial" | "inactive";
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  status: UserStatus;
  emailVerifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
  tenants?: Tenant[];
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  status: UserStatus;
  permissions?: string[]; // Array of permission names like 'tenants.read', 'users.manage'
  roles?: Role[]; // Array of user roles with their permissions
  tenants?: Tenant[]; // Array of tenants the user belongs to
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  VIEWER = "viewer",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

// User management request types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  tenantId?: number;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

// Role and Permission types
export interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  resource: string;
  action: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description?: string;
  permissionIds?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  displayName?: string;
  description?: string;
  permissionIds?: number[];
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}

// Permission grouping for UI
export interface PermissionGroup {
  resource: string;
  displayName: string;
  permissions: Permission[];
}
