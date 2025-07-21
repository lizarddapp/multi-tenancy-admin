import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  useCreateModal,
  useEditModal,
  useConfirmModal,
} from "~/lib/stores/useModalStore";
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "~/lib/hooks/useRoles";
import type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "~/types";
import { PermissionsSelector } from "~/components/permissions-selector";

// Role form component
interface RoleFormProps {
  role?: Role;
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function RoleForm({ role, onSubmit, onCancel, isSubmitting }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    displayName: role?.displayName || "",
    description: role?.description || "",
    permissionNames: role?.permissions?.map((p) => p.name) || [],
  });

  const { data: permissionsResponse } = usePermissions();
  const allPermissions = permissionsResponse?.data?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert permission names to IDs for the API call
    const permissionIds = allPermissions
      .filter((permission) =>
        formData.permissionNames.includes(permission.name)
      )
      .map((permission) => permission.id);

    await onSubmit({
      ...formData,
      permissionIds,
    });
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissionNames: checked
        ? [...prev.permissionNames, permissionName]
        : prev.permissionNames.filter((name) => name !== permissionName),
    }));
  };

  const handleGroupToggle = (
    groupPermissions: Permission[],
    checked: boolean
  ) => {
    const groupNames = groupPermissions.map((p) => p.name);
    setFormData((prev) => ({
      ...prev,
      permissionNames: checked
        ? [...new Set([...prev.permissionNames, ...groupNames])]
        : prev.permissionNames.filter((name) => !groupNames.includes(name)),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="contents">
      <ScrollArea className="flex max-h-full flex-col overflow-hidden">
        <div className="px-6 pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., admin, manager"
              required
              disabled={role?.isSystem}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              placeholder="e.g., Administrator, Manager"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Role description..."
              rows={3}
            />
          </div>

          <PermissionsSelector
            selectedPermissions={formData.permissionNames}
            onPermissionChange={handlePermissionChange}
            onGroupToggle={handleGroupToggle}
            isLoading={isSubmitting}
          />
        </div>
      </ScrollArea>

      <div className="flex justify-end space-x-2 px-6 py-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : role ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}

export default function RolesPage() {
  const [search, setSearch] = useState("");

  // Modal hooks
  const { openCreateModal, closeCreateModal } = useCreateModal();
  const { openEditModal, closeEditModal } = useEditModal();
  const { openConfirmModal, closeConfirmModal } = useConfirmModal();

  // Queries (tenant context is handled within the hooks)
  const { data: rolesResponse, isLoading, error } = useRoles({ search });
  const roles = rolesResponse?.data?.data || [];

  // Mutations
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const handleCreateRole = async (
    data: CreateRoleRequest | UpdateRoleRequest
  ) => {
    try {
      await createRoleMutation.mutateAsync(data as CreateRoleRequest);
      closeCreateModal();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Helper functions to open modals
  const openCreateRoleModal = () => {
    openCreateModal(
      <RoleForm
        onSubmit={handleCreateRole}
        onCancel={closeCreateModal}
        isSubmitting={createRoleMutation.isPending}
      />,
      {
        title: "Create New Role",
        size: "5xl",
        maxHeight: "85vh",
      }
    );
  };

  const openEditRoleModal = (role: Role) => {
    const handleUpdate = async (
      data: CreateRoleRequest | UpdateRoleRequest
    ) => {
      try {
        await updateRoleMutation.mutateAsync({
          id: role.id,
          data: data as UpdateRoleRequest,
        });
        closeEditModal();
      } catch (error) {
        // Error is handled by the mutation
      }
    };

    openEditModal(
      <RoleForm
        role={role}
        onSubmit={handleUpdate}
        onCancel={closeEditModal}
        isSubmitting={updateRoleMutation.isPending}
      />,
      {
        title: "Edit Role",
        size: "5xl",
        maxHeight: "85vh",
      }
    );
  };

  const openDeleteRoleModal = (role: Role) => {
    openConfirmModal(
      <div className="space-y-4">
        <p>Are you sure you want to delete the role "{role.displayName}"?</p>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Users with this role will lose their
          permissions.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDeleteRole(role.id);
              closeConfirmModal();
            }}
            disabled={deleteRoleMutation.isPending}
          >
            {deleteRoleMutation.isPending ? "Deleting..." : "Delete Role"}
          </Button>
        </div>
      </div>,
      {
        title: "Delete Role",
        description: "This action cannot be undone.",
        size: "sm",
      }
    );
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRoleMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getRoleBadge = (role: Role) => {
    if (role.isSystem) {
      return <Badge variant="secondary">System</Badge>;
    }
    return <Badge variant="outline">Custom</Badge>;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Failed to load roles</p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Roles & Permissions
          </h2>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
        <Button onClick={openCreateRoleModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Roles</CardTitle>
              <CardDescription>
                {roles.length} role{roles.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{role.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {role.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {role.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(role)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {role.permissions?.length || 0} permission
                        {(role.permissions?.length || 0) !== 1 ? "s" : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditRoleModal(role)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <DropdownMenuItem
                              onClick={() => openDeleteRoleModal(role)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {roles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {search
                          ? "No roles found matching your search"
                          : "No roles found"}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
