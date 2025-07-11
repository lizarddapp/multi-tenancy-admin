import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, authUtils } from "../api/services/auth";
import { QUERY_KEYS } from "../api/endpoints";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // Store token
      authUtils.storeToken(response.data.accessToken);

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.AUTH_USER });

      // Redirect to dashboard
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      // Store token
      authUtils.storeToken(response.data.accessToken);

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.AUTH_USER });

      // Redirect to dashboard
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear token
      authUtils.clearToken();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      window.location.href = "/auth/login";
    },
    onError: () => {
      // Even if logout fails on server, clear client-side data
      authUtils.clearToken();
      queryClient.clear();
      window.location.href = "/auth/login";
    },
  });
};

// Get current user profile query
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.AUTH_USER,
    queryFn: authService.getProfile,
    enabled: !!authUtils.getToken(), // Enable when token exists
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      // Invalidate auth queries to refetch updated profile
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.AUTH_USER });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      // Handle success (show message, etc.)
    },
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};

// Verify token query
export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["auth", "verify"],
    queryFn: authService.verifyToken,
    enabled: authUtils.isAuthenticated(),
    retry: false,
  });
};

// Get available tenants query
export const useAvailableTenants = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.AUTH_AVAILABLE_TENANTS,
    queryFn: authService.getAvailableTenants,
    enabled: !!authUtils.getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user permissions query
export const useMyPermissions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.AUTH_MY_PERMISSIONS,
    queryFn: authService.getMyPermissions,
    enabled: !!authUtils.getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Auth utility hooks
export const useAuth = () => {
  const { data: profileResponse, isLoading, error } = useCurrentUser();
  const logout = useLogout();

  return {
    user: profileResponse?.data?.user,
    isLoading,
    isAuthenticated: authUtils.isAuthenticated() && !error,
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
  };
};
