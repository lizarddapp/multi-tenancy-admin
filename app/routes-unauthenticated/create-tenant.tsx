import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import { useCreateTenantSimple } from "~/lib/hooks/useTenants";

// Form validation schema
const createTenantSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),
});

type CreateTenantFormData = z.infer<typeof createTenantSchema>;

const CreateTenant = () => {
  const navigate = useNavigate();

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
    },
  });

  // Mutations
  const createTenantMutation = useCreateTenantSimple();

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      const response = await createTenantMutation.mutateAsync({
        name: data.name,
      });

      // Redirect to the newly created tenant's dashboard
      const newTenant = response.data;
      console.log("New tenant created:", newTenant);
      navigate(`/${newTenant.slug}/dashboard`, { replace: true });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleBackToLogin = () => {
    navigate("/_auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create Your Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up your workspace to get started
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              Choose a name and identifier for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Organization Name */}
              <div>
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your organization name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  A unique identifier will be automatically generated for your
                  organization
                </p>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || createTenantMutation.isPending}
                >
                  {isSubmitting || createTenantMutation.isPending
                    ? "Creating Organization..."
                    : "Create Organization"}
                </Button>

                {/* Back to Login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an organization, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTenant;
