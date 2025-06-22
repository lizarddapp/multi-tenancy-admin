import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DialogFooter } from "~/components/ui/dialog";
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
} from "~/types/dashboard";
import { TenantStatus } from "~/types/dashboard";

interface TenantFormProps {
  tenant?: Tenant;
  onSubmit: (data: CreateTenantRequest | UpdateTenantRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TenantForm({
  tenant,
  onSubmit,
  onCancel,
  isSubmitting,
}: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: tenant?.name || "",
    slug: tenant?.slug || "",
    status: tenant?.status || TenantStatus.TRIAL,
    settings: tenant?.settings || {},
    trialEndsAt: tenant?.trialEndsAt || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      trialEndsAt: formData.trialEndsAt || null,
    };

    await onSubmit(submitData);
  };

  const handleSlugGeneration = () => {
    if (formData.name && !formData.slug) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            onBlur={handleSlugGeneration}
            placeholder="e.g., Acme Corporation"
            required
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, slug: e.target.value }));
              setErrors((prev) => ({ ...prev, slug: "" }));
            }}
            placeholder="e.g., acme-corp"
            required
            className={errors.slug ? "border-destructive" : ""}
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Used in URLs and must be unique. Only lowercase letters, numbers,
            and hyphens allowed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as TenantStatus,
              }))
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="trial">Trial</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trialEndsAt">Trial End Date</Label>
          <Input
            id="trialEndsAt"
            type="datetime-local"
            value={
              formData.trialEndsAt
                ? new Date(formData.trialEndsAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                trialEndsAt: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : null,
              }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for no trial expiration
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : tenant
            ? "Update Tenant"
            : "Create Tenant"}
        </Button>
      </DialogFooter>
    </form>
  );
}
