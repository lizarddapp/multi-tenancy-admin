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

export interface UserRoleAssignment {
  id: number;
  userId: number;
  roleId: number;
  tenantId: number | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
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
  userRoles?: UserRoleAssignment[];
  tenants?: Tenant[];
  permissions?: string[];
  directPermissions?: Permission[];
  permissionSource?: string;
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

// Billing enums
export enum BillingStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  CANCELLED = "cancelled",
  PAST_DUE = "past_due",
}

export enum BillingPlan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export enum BillingCycle {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

// User management request types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roleId: number; // Role ID is required
  status?: UserStatus;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface InviteUserRequest {
  email: string;
  roleId: number;
  permissions?: string[];
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

// Billing interfaces
export interface Billing {
  id: number;
  tenantId: number;
  plan: BillingPlan;
  status: BillingStatus;
  cycle: BillingCycle;
  amount: number; // Amount in cents
  currency: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  trialStart?: string;
  trialEnd?: string;
  cancelledAt?: string;
  cancelAtPeriodEnd: boolean;
  maxUsers?: number;
  maxStorage?: number; // Storage in GB
  features?: string | string[]; // JSON string from backend or parsed array
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant;
}

export interface CreateBillingRequest {
  tenantId: number;
  plan: BillingPlan;
  cycle: BillingCycle;
  amount?: number;
  currency?: string;
  maxUsers?: number;
  maxStorage?: number;
  features?: string[];
  trialDays?: number;
}

export interface UpdateBillingRequest {
  plan?: BillingPlan;
  cycle?: BillingCycle;
  amount?: number;
  currency?: string;
  maxUsers?: number;
  maxStorage?: number;
  features?: string[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
}

export interface CreateBillingRequest {
  tenantId: number;
  plan: BillingPlan;
  cycle: BillingCycle;
  amount?: number;
  currency?: string;
  maxUsers?: number;
  maxStorage?: number;
  features?: string[];
  trialDays?: number;
}

export interface UpdateBillingRequest {
  plan?: BillingPlan;
  cycle?: BillingCycle;
  amount?: number;
  currency?: string;
  maxUsers?: number;
  maxStorage?: number;
  features?: string[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
}

// Permission grouping for UI
export interface PermissionGroup {
  resource: string;
  displayName: string;
  permissions: Permission[];
}
