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
import { Label } from "~/components/ui/label";
import { ArrowLeft, User, Mail, Phone, Shield, Building } from "lucide-react";
import { useCreateUser } from "~/lib/hooks/useUsers";
import { useTenants } from "~/lib/hooks/useTenants";
import type { CreateUserRequest } from "~/types/dashboard";
import { UserRole, UserStatus } from "~/types/dashboard";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";

const CreateUser = () => {
  const { navigate } = useTenantNavigation();
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE,
  });

  // Mutations and queries
  const createUserMutation = useCreateUser();
  const { data: tenantsResponse } = useTenants();
  const tenants = tenantsResponse?.data?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUserMutation.mutateAsync(formData);
      navigate("/users");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleInputChange = (
    field: keyof CreateUserRequest,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
          <p className="text-muted-foreground">
            Create a new user account with role and permissions
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Fill in the details to create a new user account
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter a secure password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-2" />
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">
                  <Shield className="inline h-4 w-4 mr-2" />
                  Role
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.MANAGER}>Manager</option>
                  <option value={UserRole.VIEWER}>Viewer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value={UserStatus.ACTIVE}>Active</option>
                  <option value={UserStatus.INACTIVE}>Inactive</option>
                  <option value={UserStatus.SUSPENDED}>Suspended</option>
                </select>
              </div>
            </div>

            {formData.role !== UserRole.SUPER_ADMIN && (
              <div className="space-y-2">
                <Label htmlFor="tenantId">
                  <Building className="inline h-4 w-4 mr-2" />
                  Tenant (Optional)
                </Label>
                <select
                  id="tenantId"
                  value={formData.tenantId?.toString() || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "tenantId",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No specific tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id.toString()}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-4">
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="min-w-[120px]"
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
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

export default CreateUser;
