import React, { useState } from "react";
import { Outlet, useLocation } from "react-router";
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
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import {
  useUsers,
  useDeleteUser,
  useUpdateUserStatus,
} from "~/lib/hooks/useUsers";
import type { User as UserType, UserStatus } from "~/types/dashboard";
import { UserStatus as UserStatusEnum } from "~/types/dashboard";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";

const getUserStatusBadge = (status: UserStatus) => {
  switch (status) {
    case UserStatusEnum.ACTIVE:
      return <Badge variant="default">Active</Badge>;
    case UserStatusEnum.INACTIVE:
      return <Badge variant="secondary">Inactive</Badge>;
    case UserStatusEnum.SUSPENDED:
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Users = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const { getCurrentPath } = useTenantNavigation();

  // Check if we're on a sub-route (create or edit)
  const currentPath = getCurrentPath();
  const isSubRoute = currentPath !== "/users";

  // Queries
  const { data: usersResponse, isLoading, error } = useUsers({ search });
  const users = usersResponse?.data?.data || [];

  // Mutations
  const deleteUserMutation = useDeleteUser();
  const updateUserStatusMutation = useUpdateUserStatus();

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleUpdateUserStatus = async (id: string, status: UserStatus) => {
    try {
      await updateUserStatusMutation.mutateAsync({ id, data: { status } });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isSubRoute) {
    return <Outlet />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Failed to load users</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage users and their access</p>
        </div>
        <TenantLink to="/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </TenantLink>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {users.length} user{users.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: UserType) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {user.roles?.length || 0} role
                          {(user.roles?.length || 0) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem asChild>
                            <TenantLink to={`/users/${user.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </TenantLink>
                          </DropdownMenuItem>
                          {user.status === UserStatusEnum.ACTIVE && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUserStatus(
                                  user.id.toString(),
                                  UserStatusEnum.SUSPENDED
                                )
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {user.status === UserStatusEnum.SUSPENDED && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUserStatus(
                                  user.id.toString(),
                                  UserStatusEnum.ACTIVE
                                )
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
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
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {user.fullName}"? This action cannot be undone
                                  and will remove all user data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteUser(user.id.toString())
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {search
                          ? "No users found matching your search"
                          : "No users found"}
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
};

export default Users;
