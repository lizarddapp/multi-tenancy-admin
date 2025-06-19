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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Users,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAssignPermissions,
} from "~/lib/hooks/useRoles";
import type {
  Role,
  Permission,
  PermissionGroup,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "~/types/dashboard";

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
    permissionIds: role?.permissions?.map((p) => p.id) || [],
  });

  const { data: permissionsResponse, isLoading: permissionsLoading } =
    usePermissions();
  const permissions = permissionsResponse?.data?.data || [];
  const permissionGroups = groupPermissionsByResource(permissions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: checked
        ? [...prev.permissionIds, permissionId]
        : prev.permissionIds.filter((id) => id !== permissionId),
    }));
  };

  const handleGroupToggle = (
    groupPermissions: Permission[],
    checked: boolean
  ) => {
    const groupIds = groupPermissions.map((p) => p.id);
    setFormData((prev) => ({
      ...prev,
      permissionIds: checked
        ? [...new Set([...prev.permissionIds, ...groupIds])]
        : prev.permissionIds.filter((id) => !groupIds.includes(id)),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
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
              setFormData((prev) => ({ ...prev, displayName: e.target.value }))
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
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Role description..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <Label>Permissions</Label>
          {permissionsLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading permissions...
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
              {permissionGroups.map((group) => {
                const groupPermissionIds = group.permissions.map((p) => p.id);
                const selectedInGroup = groupPermissionIds.filter((id) =>
                  formData.permissionIds.includes(id)
                );
                const allSelected =
                  selectedInGroup.length === groupPermissionIds.length;
                const someSelected =
                  selectedInGroup.length > 0 &&
                  selectedInGroup.length < groupPermissionIds.length;

                return (
                  <div key={group.resource} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${group.resource}`}
                        checked={allSelected}
                        ref={(el) => {
                          if (el && "indeterminate" in el) {
                            (el as any).indeterminate = someSelected;
                          }
                        }}
                        onCheckedChange={(checked) =>
                          handleGroupToggle(
                            group.permissions,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`group-${group.resource}`}
                        className="text-sm font-medium"
                      >
                        {group.displayName}
                      </Label>
                    </div>
                    <div className="ml-6 grid grid-cols-2 gap-2">
                      {group.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={formData.permissionIds.includes(
                              permission.id
                            )}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                permission.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="text-xs text-muted-foreground"
                          >
                            {permission.action}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : role ? "Update Role" : "Create Role"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Queries
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
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleUpdateRole = async (
    data: CreateRoleRequest | UpdateRoleRequest
  ) => {
    if (!editingRole) return;
    try {
      await updateRoleMutation.mutateAsync({
        id: editingRole.id,
        data: data as UpdateRoleRequest,
      });
      setEditingRole(null);
    } catch (error) {
      // Error is handled by the mutation
    }
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role and assign permissions to it.
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              onSubmit={handleCreateRole}
              onCancel={() => setIsCreateDialogOpen(false)}
              isSubmitting={createRoleMutation.isPending}
            />
          </DialogContent>
        </Dialog>
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
                            onClick={() => setEditingRole(role)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Role
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the role "
                                    {role.displayName}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role details and permissions.
            </DialogDescription>
          </DialogHeader>
          {editingRole && (
            <RoleForm
              role={editingRole}
              onSubmit={handleUpdateRole}
              onCancel={() => setEditingRole(null)}
              isSubmitting={updateRoleMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
