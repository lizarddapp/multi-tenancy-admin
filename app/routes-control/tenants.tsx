import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  MoreHorizontal,
  Users,
  Calendar,
} from "lucide-react";
import {
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
  useUpdateTenantStatus,
} from "~/lib/hooks/useTenants";
import { TenantForm } from "~/components/tenant-form";
import { PermissionGuard } from "~/components/permission-guard";
import { usePermissions, PERMISSIONS } from "~/lib/hooks/usePermissions";
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
} from "~/types/dashboard";
import { TenantStatus } from "~/types/dashboard";

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Queries
  const {
    data: tenantsResponse,
    isLoading,
    error,
  } = useTenants({
    search,
    status: statusFilter,
  });
  const tenants = tenantsResponse?.data?.data || [];

  // Mutations
  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();
  const updateStatusMutation = useUpdateTenantStatus();

  const handleCreateTenant = async (
    data: CreateTenantRequest | UpdateTenantRequest
  ) => {
    try {
      await createTenantMutation.mutateAsync(data as CreateTenantRequest);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleUpdateTenant = async (
    data: CreateTenantRequest | UpdateTenantRequest
  ) => {
    if (!editingTenant) return;
    try {
      await updateTenantMutation.mutateAsync({
        id: editingTenant.id,
        data: data as UpdateTenantRequest,
      });
      setEditingTenant(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteTenant = async (id: number) => {
    try {
      await deleteTenantMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleStatusChange = async (id: number, status: TenantStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status } });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getTenantStatusBadge = (status: TenantStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "trial":
        return <Badge variant="secondary">Trial</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Failed to load tenants</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Tenants</h2>
          <p className="text-muted-foreground">
            Manage tenant organizations and their settings
          </p>
        </div>
        <PermissionGuard permission={PERMISSIONS.TENANTS_CREATE}>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Tenant</DialogTitle>
                <DialogDescription>
                  Create a new tenant organization with its own isolated
                  environment.
                </DialogDescription>
              </DialogHeader>
              <TenantForm
                onSubmit={handleCreateTenant}
                onCancel={() => setIsCreateDialogOpen(false)}
                isSubmitting={createTenantMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Tenants</CardTitle>
              <CardDescription>
                {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trial Ends</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          {tenant.usersCount !== undefined && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {tenant.usersCount} user
                              {tenant.usersCount !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-1 py-0.5 rounded">
                        {tenant.slug}
                      </code>
                    </TableCell>
                    <TableCell>{getTenantStatusBadge(tenant.status)}</TableCell>
                    <TableCell>
                      {tenant.trialEndsAt ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(tenant.trialEndsAt)}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(tenant.createdAt)}
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
                          <PermissionGuard
                            permission={PERMISSIONS.TENANTS_UPDATE}
                          >
                            <DropdownMenuItem
                              onClick={() => setEditingTenant(tenant)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </PermissionGuard>
                          <PermissionGuard
                            permission={PERMISSIONS.TENANTS_UPDATE}
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(
                                  tenant.id,
                                  TenantStatus.ACTIVE
                                )
                              }
                              disabled={tenant.status === TenantStatus.ACTIVE}
                            >
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(
                                  tenant.id,
                                  TenantStatus.SUSPENDED
                                )
                              }
                              disabled={
                                tenant.status === TenantStatus.SUSPENDED
                              }
                            >
                              Suspend
                            </DropdownMenuItem>
                          </PermissionGuard>
                          <PermissionGuard
                            permission={PERMISSIONS.TENANTS_DELETE}
                          >
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
                                    Delete Tenant
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {tenant.name}
                                    "? This action cannot be undone and will
                                    permanently delete all tenant data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteTenant(tenant.id)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </PermissionGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {tenants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {search || statusFilter
                          ? "No tenants found matching your criteria"
                          : "No tenants found"}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Tenant Dialog */}
      <Dialog
        open={!!editingTenant}
        onOpenChange={() => setEditingTenant(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update tenant details and settings.
            </DialogDescription>
          </DialogHeader>
          {editingTenant && (
            <TenantForm
              tenant={editingTenant}
              onSubmit={handleUpdateTenant}
              onCancel={() => setEditingTenant(null)}
              isSubmitting={updateTenantMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
