import type { LucideIcon } from "lucide-react";

// =================================================================
// CORE API TYPES
// =================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// =================================================================
// AUTHENTICATION & USER TYPES
// =================================================================

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum RoleType {
  SUPER_ADMIN = "super_admin",
  TENANT_OWNER = "tenant_owner",
  TENANT_ADMIN = "tenant_admin",
  TENANT_USER = "tenant_user",
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
  permissions?: string[];
  roles?: Role[];
  tenants?: Tenant[];
}

// =================================================================
// AUTHENTICATION REQUESTS
// =================================================================

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  tenantName?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

// =================================================================
// USER MANAGEMENT REQUESTS
// =================================================================

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roleId: number;
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

export interface AcceptInvitationRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface UsersListResponse {
  users: User[];
  pagination: PaginationMeta;
}

// =================================================================
// ROLE MANAGEMENT REQUESTS
// =================================================================

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

export interface PermissionGroup {
  resource: string;
  displayName: string;
  permissions: Permission[];
}

// =================================================================
// TENANT TYPES
// =================================================================

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
  users?: User[];
  usersCount?: number;
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

export interface TenantsListResponse {
  tenants: Tenant[];
  pagination: PaginationMeta;
}

// =================================================================
// BILLING TYPES
// =================================================================

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

export interface Billing {
  id: number;
  tenantId: number;
  plan: BillingPlan;
  status: BillingStatus;
  cycle: BillingCycle;
  amount: number;
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
  maxStorage?: number;
  features?: string | string[];
  needsUpgrade: boolean;
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

export interface UpgradePlanRequest {
  plan: BillingPlan;
  cycle: BillingCycle;
  paymentMethodId?: string;
}

// =================================================================
// PRICING PLAN TYPES
// =================================================================

export interface PricingPlan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  maxUsers?: number;
  maxStorage?: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingPlanRequest {
  name: string;
  slug: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  maxUsers?: number;
  maxStorage?: number;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdatePricingPlanRequest {
  name?: string;
  slug?: string;
  description?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  currency?: string;
  maxUsers?: number;
  maxStorage?: number;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

// =================================================================
// DASHBOARD & UI TYPES
// =================================================================

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
  churnRate: number;
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

// =================================================================
// ANALYTICS TYPES
// =================================================================

export interface TenantAnalytics {
  userCount: number;
  activeUserCount: number;
  storageUsed: number;
  apiCallsThisMonth: number;
  lastActivityAt?: string;
  createdAt: string;
}

export interface TenantAnalyticsResponse {
  analytics: TenantAnalytics;
}
