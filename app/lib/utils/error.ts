/**
 * Extract error message from various error response formats
 */
export function getErrorMessage(
  error: any,
  fallback: string = "An error occurred"
): string {
  // Try different possible error message locations
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.message ||
    error?.message ||
    fallback;

  return typeof message === "string" ? message : fallback;
}

/**
 * Extract validation errors from error response
 */
export function getValidationErrors(
  error: any
): Record<string, string[]> | null {
  const errors = error?.response?.data?.errors;
  return errors && typeof errors === "object" ? errors : null;
}

/**
 * Check if error is a validation error (422 status)
 */
export function isValidationError(error: any): boolean {
  return error?.response?.status === 422;
}

/**
 * Check if error is an authentication error (401 status)
 */
export function isAuthError(error: any): boolean {
  return error?.response?.status === 401;
}

/**
 * Check if error is a forbidden error (403 status)
 */
export function isForbiddenError(error: any): boolean {
  return error?.response?.status === 403;
}

/**
 * Check if error is a not found error (404 status)
 */
export function isNotFoundError(error: any): boolean {
  return error?.response?.status === 404;
}

/**
 * Get error status code
 */
export function getErrorStatus(error: any): number | null {
  return error?.response?.status || null;
}
