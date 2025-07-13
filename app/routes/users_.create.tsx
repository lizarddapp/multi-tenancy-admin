import React from "react";
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
import { ArrowLeft, User, Mail, Phone, Shield } from "lucide-react";
import { useCreateUser } from "~/lib/hooks/useUsers";
import { useRoles } from "~/lib/hooks/useRoles";
import type { CreateUserRequest } from "~/types";
import { UserStatus } from "~/types";
import { TenantLink } from "~/components/tenant-link";
import { useTenantNavigation } from "~/lib/hooks/useNavigation";

// Form validation schema
const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  roleId: z.number().min(1, "Role is required"),
  status: z.nativeEnum(UserStatus),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

const CreateUser = () => {
  const { navigate } = useTenantNavigation();

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      roleId: 0,
      status: UserStatus.ACTIVE,
    },
  });

  // Watch the roleId field to conditionally show tenant selection
  const selectedRoleId = watch("roleId");

  // Queries
  const createUserMutation = useCreateUser();
  const { data: rolesResponse, isLoading: rolesLoading } = useRoles();

  const roles = rolesResponse?.data?.data || [];

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      // Transform form data to match API expectations
      const createUserData: CreateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        roleId: data.roleId,
        status: data.status,
      };

      await createUserMutation.mutateAsync(createUserData);
      navigate("/users");
    } catch (error) {
      // Error is handled by the mutation
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  <User className="inline h-4 w-4 mr-2" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
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
                {...register("email")}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter a secure password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-2" />
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleId">
                  <Shield className="inline h-4 w-4 mr-2" />
                  Role
                </Label>
                {rolesLoading ? (
                  <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm items-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                    Loading roles...
                  </div>
                ) : (
                  <select
                    id="roleId"
                    {...register("roleId", {
                      setValueAs: (value) => parseInt(value),
                    })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={UserStatus.ACTIVE}>Active</option>
                  <option value={UserStatus.INACTIVE}>Inactive</option>
                  <option value={UserStatus.SUSPENDED}>Suspended</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || createUserMutation.isPending}
                className="min-w-[120px]"
              >
                {isSubmitting || createUserMutation.isPending
                  ? "Creating..."
                  : "Create User"}
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
