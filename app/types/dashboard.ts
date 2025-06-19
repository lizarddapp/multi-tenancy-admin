import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export interface Tenant {
  name: string;
  email: string;
  status: "active" | "trial" | "inactive";
  users: number;
  plan: "Enterprise" | "Pro" | "Basic" | "Trial";
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

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  tenantId?: number;
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
