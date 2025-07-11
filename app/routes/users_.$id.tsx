import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
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
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Loader2,
} from "lucide-react";
import {
  useUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUpdateUserPermissions,
} from "~/lib/hooks/useUsers";
import { useTenants } from "~/lib/hooks/useTenants";
import { usePermissions } from "~/lib/hooks/useRoles";
import type { UpdateUserRequest } from "~/types/dashboard";
import { UserStatus } from "~/types/dashboard";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";
import { PermissionsSelector } from "~/components/permissions-selector";

const EditUser = () => {
  const { navigate } = useTenantNavigation();
  const { id } = useParams();
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: UserStatus.ACTIVE,
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

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

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        status: user.status,
      });
    }
  }, [user]);

  // Load user permissions from permissions array
  useEffect(() => {
    const permissionNames = user?.permissions || [];
    setSelectedPermissions(permissionNames);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updateUserMutation.mutateAsync({ id, data: formData });
      navigate("/users");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusChange = async (newStatus: UserStatus) => {
    if (!id) return;

    try {
      await updateUserStatusMutation.mutateAsync({
        id,
        data: { status: newStatus },
      });
      setFormData((prev) => ({ ...prev, status: newStatus }));
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
      <div className="flex items-center space-x-4">
        <TenantLink to="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TenantLink>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
          <p className="text-muted-foreground">
            Update user information and settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getUserStatusBadge(user.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Update the user's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      <User className="inline h-4 w-4 mr-2" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Doe"
                      required
                    />
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={updateUserMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {updateUserMutation.isPending
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
        </div>

        {/* User Details & Actions */}
        <div className="space-y-6">
          {/* User Status */}
          <Card>
            <CardHeader>
              <CardTitle>User Status</CardTitle>
              <CardDescription>Manage user account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status:</span>
                {getUserStatusBadge(user.status)}
              </div>

              <div className="space-y-2">
                {user.status === UserStatus.ACTIVE && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(UserStatus.SUSPENDED)}
                    disabled={updateUserStatusMutation.isPending}
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Suspend User
                  </Button>
                )}

                {user.status === UserStatus.SUSPENDED && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(UserStatus.ACTIVE)}
                    disabled={updateUserStatusMutation.isPending}
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Activate User
                  </Button>
                )}

                {user.status === UserStatus.INACTIVE && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(UserStatus.ACTIVE)}
                    disabled={updateUserStatusMutation.isPending}
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Activate User
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

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
                {user.userRoles && user.userRoles.length > 0 ? (
                  user.userRoles.map((userRole) => (
                    <div
                      key={userRole.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <div className="font-medium">
                          {userRole.role.displayName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {userRole.role.description}
                        </div>
                        {userRole.tenantId && (
                          <div className="text-xs text-muted-foreground">
                            Tenant ID: {userRole.tenantId}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline">{userRole.role.name}</Badge>
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

          {/* User Permissions */}
          {
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
          }
        </div>
      </div>
    </div>
  );
};

export default EditUser;
