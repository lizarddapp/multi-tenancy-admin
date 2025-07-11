import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Building, Users, CheckCircle } from "lucide-react";
import { useAvailableTenants } from "~/lib/hooks/useAuth";
import { toast } from "sonner";

interface TenantSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantSelected: (tenantSlug: string) => void;
}

export function TenantSelectionDialog({
  open,
  onOpenChange,
  onTenantSelected,
}: TenantSelectionDialogProps) {
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  const { data: tenantsResponse, isLoading, error } = useAvailableTenants();

  const tenants = tenantsResponse?.data?.tenants || [];

  const handleTenantSelect = async () => {
    if (!selectedTenantId) {
      toast.error("Please select a tenant");
      return;
    }

    const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
    if (!selectedTenant) {
      toast.error("Selected tenant not found");
      return;
    }

    try {
      // Save tenant slug to localStorage
      localStorage.setItem("selected_tenant_slug", selectedTenant.slug);

      // Call the callback with tenant slug
      onTenantSelected(selectedTenant.slug);

      // Close dialog
      onOpenChange(false);

      toast.success(`Switched to ${selectedTenant.name}`);
    } catch (error: any) {
      console.error("Failed to switch tenant:", error);
      toast.error(error?.response?.data?.message || "Failed to switch tenant");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trial":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Select a Tenant
          </DialogTitle>
          <DialogDescription>
            Choose a tenant to access its dashboard and manage its resources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">
                Failed to load tenants. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !error && tenants.length === 0 && (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Tenants Available
              </h3>
              <p className="text-gray-600">
                You don't have access to any tenants. Please contact your
                administrator.
              </p>
            </div>
          )}

          {!isLoading && !error && tenants.length > 0 && (
            <>
              <div className="grid gap-3">
                {tenants.map((tenant) => (
                  <Card
                    key={tenant.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTenantId === tenant.id
                        ? "ring-2 ring-primary border-primary"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedTenantId(tenant.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {tenant.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {tenant.slug}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(tenant.status)}>
                            {tenant.status}
                          </Badge>
                          {selectedTenantId === tenant.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleTenantSelect}
                  disabled={!selectedTenantId}
                >
                  Select Tenant
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
