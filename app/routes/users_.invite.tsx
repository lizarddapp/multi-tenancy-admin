import React, { useState } from "react";
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
import { ArrowLeft, Mail, Shield, UserPlus } from "lucide-react";
import { useInviteUser } from "~/lib/hooks/useUsers";
import { useRoles } from "~/lib/hooks/useRoles";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";
import { PermissionsSelector } from "~/components/permissions-selector";
import type { Permission, InviteUserRequest } from "~/types";

// Form validation schema based on the backend inviteUserValidator
const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  roleId: z.number().min(1, "Role is required"),
  permissions: z.array(z.string()).optional(),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

const InviteUser = () => {
  const { navigate } = useTenantNavigation();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      roleId: 0,
      permissions: [],
    },
  });

  // Watch the roleId field
  const selectedRoleId = watch("roleId");

  // Queries
  const inviteUserMutation = useInviteUser();
  const { data: rolesResponse, isLoading: rolesLoading } = useRoles();

  const roles = rolesResponse?.data?.data || [];

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      // Transform form data to match API expectations
      const inviteUserData: InviteUserRequest = {
        email: data.email,
        roleId: data.roleId,
        permissions:
          selectedPermissions.length > 0 ? selectedPermissions : undefined,
      };

      await inviteUserMutation.mutateAsync(inviteUserData);
      navigate("/users");
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

  const handleGroupToggle = (
    groupPermissions: Permission[],
    checked: boolean
  ) => {
    const groupNames = groupPermissions.map((p) => p.name);
    setSelectedPermissions((prev) =>
      checked
        ? [...new Set([...prev, ...groupNames])]
        : prev.filter((name) => !groupNames.includes(name))
    );
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center space-x-4">
        <TenantLink to="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TenantLink>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invite User</h2>
          <p className="text-muted-foreground">
            Send an invitation to a new user with specific role and permissions
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            User Invitation
          </CardTitle>
          <CardDescription>
            Enter the email address and assign role and permissions for the new
            user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="user@example.com"
                className="max-w-md"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="roleId">
                <Shield className="inline h-4 w-4 mr-2" />
                Role
              </Label>
              {rolesLoading ? (
                <div className="flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 py-1 text-sm items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                  Loading roles...
                </div>
              ) : (
                <select
                  id="roleId"
                  {...register("roleId", {
                    setValueAs: (value) => parseInt(value),
                  })}
                  className="flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={0}>Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.displayName}
                    </option>
                  ))}
                </select>
              )}
              {errors.roleId && (
                <p className="text-sm text-destructive">
                  {errors.roleId.message}
                </p>
              )}
            </div>

            {/* Permissions Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Additional Permissions (Optional)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Select additional permissions beyond what the role provides
                </p>
              </div>

              <PermissionsSelector
                selectedPermissions={selectedPermissions}
                onPermissionChange={handlePermissionChange}
                onGroupToggle={handleGroupToggle}
                isLoading={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || inviteUserMutation.isPending}
                className="min-w-[140px]"
              >
                {isSubmitting || inviteUserMutation.isPending
                  ? "Sending Invite..."
                  : "Send Invitation"}
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
  );
};

export default InviteUser;
