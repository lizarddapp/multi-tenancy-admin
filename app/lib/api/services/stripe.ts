import { apiClient } from "../client";

/**
 * Request to create a subscription
 */
export interface CreateSubscriptionRequest {
  priceId: string;
  customerEmail: string;
  customerName?: string;
}

/**
 * Response from creating a subscription
 */
export interface CreateSubscriptionResponse {
  subscriptionId: string;
  clientSecret: string;
  customerId: string;
}

export interface CreateCheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface UpdateSubscriptionRequest {
  priceId: string;
}

export interface UpdateSubscriptionResponse {
  subscriptionId: string;
  status: string;
}

export interface GetPublishableKeyResponse {
  publishableKey: string;
}

export interface CreatePortalSessionResponse {
  url: string;
}

class StripeService {
  /**
   * Create subscription (primary method for SaaS billing)
   */
  async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> {
    const response = await apiClient.post(
      "/admin/stripe/create-subscription",
      data
    );
    return response.data.data;
  }

  /**
   * Create Stripe Checkout session for subscription
   */
  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await apiClient.post(
      "/admin/stripe/create-checkout-session",
      data
    );
    return response.data.data;
  }

  /**
   * Update existing subscription to new plan
   */
  async updateSubscription(
    data: UpdateSubscriptionRequest
  ): Promise<UpdateSubscriptionResponse> {
    const response = await apiClient.post(
      "/admin/stripe/update-subscription",
      data
    );
    return response.data.data;
  }

  /**
   * Create Stripe customer portal session
   */
  async createPortalSession(): Promise<CreatePortalSessionResponse> {
    const response = await apiClient.post(
      "/admin/stripe/create-portal-session"
    );
    return response.data.data;
  }

  /**
   * Get Stripe publishable key
   */
  async getPublishableKey(): Promise<GetPublishableKeyResponse> {
    const response = await apiClient.get("/admin/stripe/publishable-key");
    return response.data.data;
  }
}

export const stripeService = new StripeService();
