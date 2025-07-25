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
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ArrowLeft, Mail, Shield, UserPlus, Crown } from "lucide-react";
import { useInviteUser } from "~/lib/hooks/useUsers";
import { useRoles } from "~/lib/hooks/useRoles";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";
import { PermissionsSelector } from "~/components/permissions-selector";
import type { Permission, InviteUserRequest } from "~/types";

// Form validation schema based on the backend inviteUserValidator
const inviteUserSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    roleId: z.number().optional(),
    permissions: z.array(z.string()).optional(),
    isTenantOwner: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Either roleId or isTenantOwner must be selected
      return data.roleId || data.isTenantOwner;
    },
    {
      message: "Please select a role or tenant owner",
      path: ["roleId"],
    }
  );

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
      roleId: undefined,
      permissions: [],
      isTenantOwner: false,
    },
  });

  // Watch the roleId field
  const selectedRoleId = watch("roleId");

  // Queries
  const inviteUserMutation = useInviteUser();
  const { data: rolesResponse, isLoading: rolesLoading } = useRoles();

  const allRoles = rolesResponse?.data?.data || [];

  // Filter out tenant_owner from regular roles
  const roles = allRoles.filter((role) => role.name !== "tenant_owner");

  // Watch form values
  const watchedIsTenantOwner = watch("isTenantOwner");

  // Check if selected role is tenant_owner or tenant owner checkbox is checked
  const selectedRole = roles.find((role) => role.id === selectedRoleId);
  const isTenantOwnerRole =
    watchedIsTenantOwner || selectedRole?.name === "tenant_owner";

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      // Determine the role ID to use
      let roleId: number;

      if (data.isTenantOwner) {
        // Find tenant_owner role
        const tenantOwnerRole = allRoles.find(
          (role) => role.name === "tenant_owner"
        );
        if (!tenantOwnerRole) {
          throw new Error("Tenant owner role not found");
        }
        roleId = tenantOwnerRole.id;
      } else if (data.roleId) {
        roleId = data.roleId;
      } else {
        throw new Error("No role selected");
      }

      // Transform form data to match API expectations
      const inviteUserData: InviteUserRequest = {
        email: data.email,
        roleId: roleId,
        permissions: data.isTenantOwner ? [] : selectedPermissions,
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

            {/* Tenant Owner Checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTenantOwner"
                  {...register("isTenantOwner")}
                  checked={watchedIsTenantOwner}
                  onCheckedChange={(checked) => {
                    setValue("isTenantOwner", checked as boolean);
                    if (checked) {
                      setValue("roleId", undefined);
                    }
                  }}
                />
                <Label htmlFor="isTenantOwner" className="flex items-center">
                  <Crown className="inline h-4 w-4 mr-2 text-yellow-600" />
                  Tenant Owner
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Tenant owners have full access to all features and settings
              </p>
            </div>

            {/* Role Selection */}
            {!watchedIsTenantOwner && (
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
                  <Select
                    value={selectedRoleId?.toString() || ""}
                    onValueChange={(value) => {
                      setValue("roleId", parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.roleId && (
                  <p className="text-sm text-destructive">
                    {errors.roleId.message}
                  </p>
                )}
              </div>
            )}

            {/* Permissions Selection */}
            {!isTenantOwnerRole && (
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
            )}

            {/* Show message for tenant owner role */}
            {isTenantOwnerRole && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Permissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Tenant owners receive all permissions through their role. No
                    additional permissions need to be selected.
                  </p>
                </div>
              </div>
            )}

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
