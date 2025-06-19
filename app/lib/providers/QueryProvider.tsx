import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Standardized stale time configurations
export const STALE_TIME = {
  // Short-lived data that changes frequently
  SHORT: 1 * 60 * 1000, // 1 minute
  // Medium-lived data that changes occasionally
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  // Long-lived data that rarely changes
  LONG: 10 * 60 * 1000, // 10 minutes
  // Very long-lived data that almost never changes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time before data is considered stale
            staleTime: STALE_TIME.SHORT, // 1 minute
            // Time before inactive queries are garbage collected
            gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
            // Retry failed requests
            retry: (failureCount, error: any) => {
              // Don't retry on 401, 403, 404
              if (
                error?.response?.status === 401 ||
                error?.response?.status === 403 ||
                error?.response?.status === 404
              ) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            // Refetch on window focus
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations
            retry: (failureCount, error: any) => {
              // Don't retry on client errors (4xx)
              if (
                error?.response?.status >= 400 &&
                error?.response?.status < 500
              ) {
                return false;
              }
              // Retry up to 2 times for server errors
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
