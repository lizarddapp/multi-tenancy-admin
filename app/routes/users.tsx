import React, { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus, Shield, UserPlus } from "lucide-react";
import {
  useUsers,
  useDeleteUser,
  useUpdateUserStatus,
} from "~/lib/hooks/useUsers";
import type { User as UserType, UserStatus } from "~/types/dashboard";
import { UserStatus as UserStatusEnum } from "~/types/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { TableCells } from "~/components/ui/table-cells";
import {
  EmptyStates,
  createEmptyStateAction,
} from "~/components/ui/empty-state";
import type { ColumnDef } from "~/types/data-table";
import { TenantLink } from "~/components/tenant-link";

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

  // Define columns for the DataTable
  const columns: ColumnDef<UserType>[] = [
    {
      id: "user",
      header: "User",
      cell: (user) => (
        <div className="min-w-0">
          <TableCells.User name={user.fullName} />
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (user) => <TableCells.Text>{user.email}</TableCells.Text>,
    },
    {
      id: "phone",
      header: "Phone",
      cell: (user) => <TableCells.Text>{user.phone || "N/A"}</TableCells.Text>,
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => getUserStatusBadge(user.status),
    },
    {
      id: "roles",
      header: "Roles",
      cell: (user) => (
        <TableCells.Count count={user.roles?.length || 0} label="role" />
      ),
    },
    {
      id: "created",
      header: "Created",
      cell: (user) => <TableCells.Date date={user.createdAt} />,
    },
    {
      id: "actions",
      header: "Actions",
      className: "w-[100px]",
      cell: (user) => (
        <TableCells.Actions
          editHref={`/users/${user.id}`}
          onDelete={() => handleDeleteUser(user.id.toString())}
          deleteTitle="Delete User"
          deleteDescription={`Are you sure you want to delete "${user.fullName}"? This action cannot be undone and will remove all user data.`}
          additionalActions={[
            ...(user.status === UserStatusEnum.ACTIVE
              ? [
                  {
                    label: "Suspend",
                    icon: Shield,
                    onClick: () =>
                      handleUpdateUserStatus(
                        user.id.toString(),
                        UserStatusEnum.SUSPENDED
                      ),
                  },
                ]
              : []),
            ...(user.status === UserStatusEnum.SUSPENDED
              ? [
                  {
                    label: "Activate",
                    icon: Shield,
                    onClick: () =>
                      handleUpdateUserStatus(
                        user.id.toString(),
                        UserStatusEnum.ACTIVE
                      ),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <EmptyStates.Error
          title="Failed to load users"
          description="We encountered an error while loading the users. Please try again."
          action={createEmptyStateAction.retry(() => window.location.reload())}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      {/* Custom Header with Multiple Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Users
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage users and their access
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <TenantLink to="/users/invite">
            <Button variant="outline" className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </TenantLink>
          <TenantLink to="/users/create">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </TenantLink>
        </div>
      </div>

      {/* DataTable without title/description since we have custom header */}
      <DataTable
        data={users}
        isLoading={isLoading}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        emptyMessage="No users found"
        searchEmptyMessage="No users found matching your search"
        getRowKey={(user) => user.id}
        tableKey="users"
        defaultColumns={[
          "user",
          "email",
          "phone",
          "status",
          "roles",
          "created",
        ]}
      />
    </div>
  );
};

export default Users;
