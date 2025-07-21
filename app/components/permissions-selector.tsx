import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Search, Shield, Users, Building } from "lucide-react";
import { usePermissions } from "~/lib/hooks/useRoles";
import type { Permission, PermissionGroup } from "~/types";

// Permission grouping utility
const groupPermissionsByResource = (
  permissions: Permission[]
): PermissionGroup[] => {
  const grouped = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = {
        resource: permission.resource,
        displayName:
          permission.resource.charAt(0).toUpperCase() +
          permission.resource.slice(1),
        permissions: [],
      };
    }
    acc[permission.resource].permissions.push(permission);
    return acc;
  }, {} as Record<string, PermissionGroup>);

  return Object.values(grouped);
};

// Get resource icon based on resource type
const getResourceIcon = (resource: string) => {
  switch (resource.toLowerCase()) {
    case "users":
      return Users;
    case "tenants":
      return Building;
    case "roles":
    case "permissions":
      return Shield;
    default:
      return Shield;
  }
};

// Permission Group Component
interface PermissionGroupProps {
  group: PermissionGroup;
  selectedPermissions: string[];
  onGroupToggle: (groupPermissions: Permission[], checked: boolean) => void;
  onPermissionChange: (permissionName: string, checked: boolean) => void;
}

function PermissionGroupComponent({
  group,
  selectedPermissions,
  onGroupToggle,
  onPermissionChange,
}: PermissionGroupProps) {
  const groupPermissionNames = group.permissions.map((p) => p.name);
  const selectedInGroup = groupPermissionNames.filter((name) =>
    selectedPermissions.includes(name)
  );
  const allSelected = selectedInGroup.length === groupPermissionNames.length;
  const someSelected =
    selectedInGroup.length > 0 &&
    selectedInGroup.length < groupPermissionNames.length;

  const IconComponent = getResourceIcon(group.resource);

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-muted/30">
      <div className="flex items-center space-x-4">
        <Checkbox
          id={`group-${group.resource}`}
          checked={allSelected}
          ref={(el) => {
            if (el && "indeterminate" in el) {
              (el as any).indeterminate = someSelected;
            }
          }}
          onCheckedChange={(checked) =>
            onGroupToggle(group.permissions, checked as boolean)
          }
        />
        <div className="flex items-center space-x-3">
          <IconComponent className="h-5 w-5 text-muted-foreground" />
          <Label
            htmlFor={`group-${group.resource}`}
            className="text-base font-semibold"
          >
            {group.displayName}
          </Label>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {selectedInGroup.length}/{groupPermissionNames.length}
        </Badge>
      </div>
      <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {group.permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-start space-x-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              id={`permission-${permission.id}`}
              checked={selectedPermissions.includes(permission.name)}
              onCheckedChange={(checked) =>
                onPermissionChange(permission.name, checked as boolean)
              }
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={`permission-${permission.id}`}
                className="text-sm font-medium cursor-pointer block"
              >
                {permission.action}
              </Label>
              {permission.description && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {permission.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Permissions Selector Component
interface PermissionsSelectorProps {
  selectedPermissions: string[];
  onPermissionChange: (permissionName: string, checked: boolean) => void;
  onGroupToggle: (groupPermissions: Permission[], checked: boolean) => void;
  isLoading?: boolean;
}

export function PermissionsSelector({
  selectedPermissions,
  onPermissionChange,
  onGroupToggle,
  isLoading,
}: PermissionsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: permissionsResponse, isLoading: permissionsLoading } =
    usePermissions();
  const permissions = permissionsResponse?.data?.data || [];
  const permissionGroups = groupPermissionsByResource(permissions);

  // Filter groups based on search
  const filteredGroups = permissionGroups.filter(
    (group) =>
      group.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.permissions.some(
        (p) =>
          p.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalSelected = selectedPermissions.length;
  const totalPermissions = permissions.length;

  if (permissionsLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            Loading permissions...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Permissions ({totalSelected}/{totalPermissions} selected)
        </Label>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 w-64 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pr-2">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <PermissionGroupComponent
              key={group.resource}
              group={group}
              selectedPermissions={selectedPermissions}
              onGroupToggle={onGroupToggle}
              onPermissionChange={onPermissionChange}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-base font-medium">No permissions found</p>
            {searchTerm && (
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
