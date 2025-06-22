import { Outlet, Link } from "react-router";
import { usePermissions } from "~/lib/hooks/usePermissions";
import { useSession } from "~/lib/providers/SessionProvider";
import { ShieldX, Home, ArrowLeft, AlertTriangle } from "lucide-react";

const SuperLayout = () => {
  const { user, logout } = useSession();
  const { isSuperAdmin } = usePermissions();

  // Authentication is now handled at the root level, so we don't need to check here
  // Just check if user exists (should always be true if we reach this point)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is super admin
  if (!isSuperAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <ShieldX className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this area
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* Error Details */}
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Super Admin Access Required
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        This section is restricted to super administrators only.
                        Your current role:{" "}
                        <span className="font-semibold">
                          {user?.roles
                            ?.map((role: any) => role.displayName || role.name)
                            .join(", ") || "Unknown"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="rounded-md bg-blue-50 p-4">
                <div className="text-sm text-blue-700">
                  <p>
                    <span className="font-medium">Logged in as:</span>{" "}
                    {user.email}
                  </p>
                  <p>
                    <span className="font-medium">User ID:</span> {user.id}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>

                <Link
                  to="/"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>

                <button
                  onClick={() => logout()}
                  className="w-full flex justify-center items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  If you believe this is an error, please contact your system
                  administrator.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Error Code: 403 - Forbidden Access
          </p>
        </div>
      </div>
    );
  }

  // Render super admin layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default SuperLayout;

// Super Admin Layout - Only accessible to users with super_admin role
