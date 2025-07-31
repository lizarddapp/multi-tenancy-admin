import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Loader2,
  Key,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";
import {
  useUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUpdateUserPermissions,
} from "~/lib/hooks/useUsers";
import { useTenants } from "~/lib/hooks/useTenants";
import { usePermissions } from "~/lib/hooks/useRoles";
import { useCurrentUser } from "~/lib/hooks/useAuth";
import type { UpdateUserRequest } from "~/types";
import { UserStatus } from "~/types";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";
import { PageHeader } from "~/components/page-header";
import { PermissionsSelector } from "~/components/permissions-selector";
import { toast } from "sonner";

// Form validation schema
const updateUserSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    status: z.nativeEnum(UserStatus),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only validate password confirmation if password is provided
      if (data.password && data.password.length > 0) {
        if (data.password.length < 8) {
          return false;
        }
        if (data.password !== data.confirmPassword) {
          return false;
        }
      }
      return true;
    },
    {
      message:
        "Password must be at least 8 characters and passwords must match",
      path: ["password"],
    }
  );

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

const EditUser = () => {
  const { navigate } = useTenantNavigation();
  const { id } = useParams();

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: UserStatus.ACTIVE,
      password: "",
      confirmPassword: "",
    },
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Queries and mutations
  const { data: userResponse, isLoading, error } = useUser(id!);
  const user = userResponse?.data?.user;
  const { data: permissionsResponse } = usePermissions();
  const updateUserMutation = useUpdateUser();
  const updateUserStatusMutation = useUpdateUserStatus();
  const updateUserPermissionsMutation = useUpdateUserPermissions();
  const { data: tenantsResponse } = useTenants();
  const tenants = tenantsResponse?.data?.data || [];
  const allPermissions = permissionsResponse?.data?.data || [];

  // Get current authenticated user
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.data?.user;

  // Check if the current user is viewing their own profile
  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        status: user.status,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  // Load user permissions from permissions array
  useEffect(() => {
    const permissionNames = user?.permissions || [];
    setSelectedPermissions(permissionNames);
  }, [user]);

  // Check if user is tenant owner
  const isTenantOwner = user?.roles?.some(
    (role) => role.name === "tenant_owner"
  );

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!id) return;

    // Only allow profile updates for own profile
    if (!isOwnProfile) {
      toast.error("You can only update your own profile");
      return;
    }

    try {
      // Prepare update data
      const updateData: UpdateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        status: data.status,
      };

      // Only include password if it's provided
      if (showPasswordFields && data.password) {
        updateData.password = data.password;
      }

      await updateUserMutation.mutateAsync({
        id,
        data: updateData,
      });

      toast.success("Profile updated successfully!");
      // Don't navigate away when updating own profile
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleStatusChange = async (newStatus: UserStatus) => {
    if (!id) return;

    try {
      await updateUserStatusMutation.mutateAsync({
        id,
        data: { status: newStatus },
      });
      setValue("status", newStatus);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionName]
        : prev.filter((name) => name !== permissionName)
    );
  };

  const handleGroupToggle = (groupPermissions: any[], checked: boolean) => {
    const groupNames = groupPermissions.map((p) => p.name);
    setSelectedPermissions((prev) =>
      checked
        ? [...new Set([...prev, ...groupNames])]
        : prev.filter((name) => !groupNames.includes(name))
    );
  };

  const handleUpdatePermissions = async () => {
    if (!id) return;

    try {
      // Convert permission names to IDs for the API call
      const permissionIds = allPermissions
        .filter((permission) => selectedPermissions.includes(permission.name))
        .map((permission) => permission.id);

      await updateUserPermissionsMutation.mutateAsync({
        id,
        permissionIds,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getUserStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return <Badge variant="default">Active</Badge>;
      case UserStatus.INACTIVE:
        return <Badge variant="secondary">Inactive</Badge>;
      case UserStatus.SUSPENDED:
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading user...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Failed to load user</p>
          <p className="text-sm text-muted-foreground">
            User not found or you don't have permission to view this user
          </p>
          <TenantLink to="/users">
            <Button variant="outline" className="mt-4">
              Back to Users
            </Button>
          </TenantLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <PageHeader
        title={isOwnProfile ? "My Profile" : "User Management"}
        description={
          isOwnProfile
            ? "Manage your personal information and settings"
            : "Manage user roles and permissions"
        }
        backTo={{
          path: "/users",
          label: "Back to Users",
        }}
        actions={getUserStatusBadge(user.status)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information Form */}
        <div className="lg:col-span-2">
          {isOwnProfile ? (
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        <User className="inline h-4 w-4 mr-2" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password Update Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        <Key className="inline h-4 w-4 mr-2" />
                        Password Update
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowPasswordFields(!showPasswordFields)
                        }
                      >
                        {showPasswordFields ? "Cancel" : "Change Password"}
                      </Button>
                    </div>

                    {showPasswordFields && (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              {...register("password")}
                              placeholder="Enter new password"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              {...register("confirmPassword")}
                              placeholder="Confirm new password"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>• Password must be at least 8 characters long</p>
                          <p>• Leave blank to keep current password</p>
                        </div>

                        {errors.password && (
                          <p className="text-sm text-destructive">
                            {errors.password.message}
                          </p>
                        )}
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateUserMutation.isPending}
                      className="min-w-[120px]"
                    >
                      {isSubmitting || updateUserMutation.isPending
                        ? "Updating..."
                        : "Update User"}
                    </Button>
                    <TenantLink to="/users">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </TenantLink>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>View user information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Profile Management
                        </p>
                        <p className="text-sm text-blue-700">
                          Users can only edit their own profile. You can manage
                          this user's roles and permissions below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        First Name
                      </Label>
                      <p className="text-sm">
                        {user?.firstName || "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Name
                      </Label>
                      <p className="text-sm">
                        {user?.lastName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </Label>
                    <p className="text-sm">{user?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </Label>
                    <p className="text-sm">{user?.phone || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Details & Actions */}
        <div className="space-y-6">
          {/* User Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                User roles and associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-2"
                    >
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {role.name === "tenant_owner" && (
                            <Crown className="h-4 w-4 text-yellow-600" />
                          )}
                          {role.displayName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                      <Badge
                        variant={
                          role.name === "tenant_owner" ? "default" : "outline"
                        }
                        className={
                          role.name === "tenant_owner"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : ""
                        }
                      >
                        {role.name}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No roles assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Tenants */}
          <Card>
            <CardHeader>
              <CardTitle>Tenant Access</CardTitle>
              <CardDescription>Tenants this user has access to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.tenants && user.tenants.length > 0 ? (
                  user.tenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tenant.slug}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{tenant.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tenant access
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Permissions - Only show for other users, not own profile */}
          {!isOwnProfile && (
            <>
              {!isTenantOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>
                      Manage direct permissions for this user
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <PermissionsSelector
                        selectedPermissions={selectedPermissions}
                        onPermissionChange={handlePermissionChange}
                        onGroupToggle={handleGroupToggle}
                        isLoading={updateUserPermissionsMutation.isPending}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleUpdatePermissions}
                          disabled={updateUserPermissionsMutation.isPending}
                          size="sm"
                        >
                          {updateUserPermissionsMutation.isPending
                            ? "Updating..."
                            : "Update Permissions"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Show message for tenant owner */}
              {isTenantOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>
                      Permissions for tenant owners
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Tenant Owner Permissions
                          </p>
                          <p className="text-sm text-blue-700">
                            This user has tenant owner role and receives all
                            permissions automatically. Direct permission
                            management is not available for tenant owners.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
