import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/services/auth";
import { QUERY_KEYS } from "../api/endpoints";
import { useCurrentUser as useCurrentUserQuery } from "../hooks/useAuth";
import type { AuthUser } from "~/types/dashboard";

// Storage keys
const TOKEN_KEY = "auth_token";

// Token storage utilities
const tokenStorage = {
  // Store token in localStorage only
  setToken: (token: string, remember: boolean = false) => {
    // Check if localStorage is available (client-side only)
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    // Check if localStorage is available (client-side only)
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: () => {
    // Check if localStorage is available (client-side only)
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Check if user has a valid token
  hasToken: (): boolean => {
    return !!tokenStorage.getToken();
  },
};

// Session context type
interface SessionContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  loginWithGoogle: (authData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

// Create session context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Session provider props
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => tokenStorage.hasToken());

  // Use React Query for user data
  const { data: userData, isLoading, error } = useCurrentUserQuery();

  // Get user from query cache or query result
  const user = userData?.data?.user || null;
  const isAuthenticated = hasToken && !!user && !error;

  // Login function
  const login = async (
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<void> => {
    try {
      const response = await authService.login({ email, password, remember });

      // Extract accessToken from response
      // Backend returns: { accessToken, user, expiresIn }
      const { accessToken } = response.data;

      if (!accessToken) {
        throw new Error("No accessToken received from login response");
      }

      // Store token
      tokenStorage.setToken(accessToken, remember);

      // Update hasToken state to trigger re-render
      setHasToken(true);

      // Invalidate and refetch user query
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN.AUTH_USER,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Login with Google function
  const loginWithGoogle = async (authData: any): Promise<void> => {
    try {
      // Extract token from Google auth response
      const { token } = authData;

      if (!token) {
        throw new Error("No token received from Google authentication");
      }

      // Store token
      tokenStorage.setToken(token, false);

      // Update hasToken state to trigger re-render
      setHasToken(true);

      // Invalidate and refetch user query
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN.AUTH_USER,
      });
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear local state and storage
      tokenStorage.removeToken();

      // Update hasToken state
      setHasToken(false);

      // Clear all query cache
      queryClient.clear();
    }
  };

  // Refresh user data using React Query
  const refreshUser = (): void => {
    if (!tokenStorage.hasToken()) return;

    // Invalidate user query to trigger refetch
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.AUTH_USER });
  };

  // Context value
  const contextValue: SessionContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session context
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// Hook for current user (backward compatibility)
export function useCurrentUser() {
  const { user, isLoading, isAuthenticated, refreshUser } = useSession();

  return {
    data: user ? { data: user } : null,
    isLoading,
    isAuthenticated,
    refetch: refreshUser,
    error:
      !isAuthenticated && !isLoading ? new Error("Not authenticated") : null,
  };
}

// Export token storage for use in API client
export { tokenStorage };
