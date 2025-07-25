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
    <div className="space-y-2 pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
      <div className="flex items-center space-x-3 py-0.5">
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
        <div className="flex items-center space-x-2">
          <IconComponent className="h-4 w-4 text-muted-foreground" />
          <Label
            htmlFor={`group-${group.resource}`}
            className="text-sm font-medium"
          >
            {group.displayName}
          </Label>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          {selectedInGroup.length}/{groupPermissionNames.length}
        </Badge>
      </div>
      <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
        {group.permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-start space-x-2 py-1.5 hover:bg-muted/30 rounded px-2 transition-colors"
          >
            <Checkbox
              id={`permission-${permission.id}`}
              checked={selectedPermissions.includes(permission.name)}
              onCheckedChange={(checked) =>
                onPermissionChange(permission.name, checked as boolean)
              }
              className="mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={`permission-${permission.id}`}
                className="text-sm cursor-pointer block leading-tight"
              >
                {permission.action}
              </Label>
              {permission.description && (
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Permissions ({totalSelected}/{totalPermissions} selected)
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 w-48 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
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
          <div className="text-center py-6 text-muted-foreground">
            <Shield className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No permissions found</p>
            {searchTerm && (
              <p className="text-xs mt-1">Try adjusting your search terms</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
