import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSession } from "~/lib/providers/SessionProvider";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Building, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Google Authentication - Multi-Tenancy Admin" },
    {
      name: "description",
      content: "Processing Google authentication",
    },
  ];
}

export default function GoogleAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle, isAuthenticated } = useSession();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    const processGoogleAuth = async () => {
      try {
        // Get parameters from backend redirect
        const token = searchParams.get("token");
        const error = searchParams.get("error");
        const success = searchParams.get("success");

        // Check for OAuth errors from backend
        if (error) {
          throw new Error(error);
        }

        if (!success || success !== "true") {
          throw new Error("Authentication failed");
        }

        if (!token) {
          throw new Error("No authentication token received");
        }

        setStatus("processing");

        // Store the authentication token
        localStorage.setItem("auth_token", token);

        setStatus("success");
        toast.success("Successfully logged in with Google!");

        // Update session context with the token
        await loginWithGoogle({ token });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } catch (error: any) {
        console.error("Google auth error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Authentication failed");
        toast.error(error.message || "Authentication failed");

        // Redirect to login page after error
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    processGoogleAuth();
  }, [searchParams, navigate, loginWithGoogle, isAuthenticated]);

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Processing Google authentication...";
      case "success":
        return "Authentication successful! Redirecting...";
      case "error":
        return errorMessage || "Authentication failed";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Building className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Google Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please wait while we process your authentication
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {getStatusIcon()}
              <p className={`text-center font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </p>

              {status === "processing" && (
                <p className="text-sm text-gray-500 text-center">
                  This may take a few moments...
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-gray-500 text-center">
                  You will be redirected to the login page shortly.
                </p>
              )}

              {status === "success" && (
                <p className="text-sm text-gray-500 text-center">
                  Redirecting to your dashboard...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
