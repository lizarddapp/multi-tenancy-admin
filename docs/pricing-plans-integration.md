# Pricing Plans Integration in Billing Page

This document describes the integration of pricing plans into the billing page of the multi-tenant admin dashboard.

## Overview

The pricing plans system has been successfully integrated into the billing page, providing users with:

- Real-time pricing plan data from the backend API
- Interactive plan comparison and selection
- Seamless upgrade/downgrade functionality
- Detailed feature and limit information

## Backend Implementation

### 1. Database & Models

- **PricingPlan Model** (`app/models/pricing_plan.ts`)

  - Comprehensive model with features, limits, and pricing data
  - Helper methods for price calculations and feature checking
  - JSON fields for flexible feature and limit storage

- **Migration** (`database/migrations/1752325300000_create_pricing_plans_table.ts`)

  - Complete table structure with all necessary fields
  - Proper indexing for performance

- **Seeded Data** (`database/seeders/pricing_plan_seeder.ts`)
  - 4 comprehensive plans: Free, Basic, Pro, Enterprise
  - Rich feature descriptions and realistic pricing
  - Proper limits and trial periods

### 2. API Endpoints

All endpoints are public (no authentication required):

- `GET /api/v1/pricing-plans` - All active plans
- `GET /api/v1/pricing-plans/popular` - Popular plans only
- `GET /api/v1/pricing-plans/comparison` - Comparison data
- `GET /api/v1/pricing-plans/{slug}` - Specific plan details
- `GET /api/v1/pricing-plans/{slug}/price?cycle=monthly|yearly` - Plan pricing
- `GET /api/v1/pricing-plans/{slug}/features` - Plan features
- `GET /api/v1/pricing-plans/{slug}/upgrade-options` - Upgrade paths

### 3. Business Logic

- **PricingPlanService** (`app/services/pricing_plan_service.ts`)
  - Complete service with upgrade/downgrade logic
  - Feature checking and limit validation
  - Stripe integration helpers

## Frontend Implementation

### 1. API Integration

- **Service** (`app/lib/api/services/pricing-plans.ts`)

  - Complete API client for all pricing plan endpoints
  - TypeScript interfaces for type safety

- **Hooks** (`app/lib/hooks/usePricingPlans.ts`)
  - React Query hooks for data fetching
  - Proper caching and error handling

### 2. UI Components

#### PricingPlansSection (`app/components/billing/pricing-plans-section.tsx`)

- **Features:**

  - Interactive billing cycle toggle (Monthly/Yearly)
  - Real-time savings calculation
  - Plan comparison with features and limits
  - Upgrade/downgrade buttons with proper logic
  - Loading states and error handling

- **Plan Information Displayed:**
  - Plan name, description, and pricing
  - User limits, storage limits, API call limits
  - Feature list with included/excluded indicators
  - Trial period information
  - Yearly savings percentage

#### Updated UpgradePlanDialog (`app/components/billing/upgrade-plan-dialog.tsx`)

- **Improvements:**
  - Now uses real API data instead of hardcoded plans
  - Dynamic pricing from backend
  - Real feature lists and limits
  - Proper currency formatting

### 3. Integration with Billing Dashboard

- **BillingDashboard** (`app/components/billing/billing-dashboard.tsx`)
  - Added PricingPlansSection component
  - Seamless integration with existing billing flow
  - Maintains current plan context

## Key Features

### 1. Dynamic Pricing

- Prices stored in cents for precision
- Automatic currency formatting
- Yearly savings calculation (17% savings for paid plans)
- Support for different billing cycles

### 2. Rich Feature System

- Features stored as JSON with descriptions
- Support for feature limits (e.g., "10,000 API calls per month")
- Easy feature checking and validation
- Extensible for new features

### 3. Plan Hierarchy

- Sort order system for proper plan tiers
- Automatic upgrade/downgrade path calculation
- Popular plan highlighting
- Current plan indication

### 4. Flexible Limits

- Users, Storage, API Calls, Projects limits
- `null` values represent "unlimited"
- Easy to extend with new limit types
- Proper display formatting

## Data Structure Examples

### Plan Features

```json
{
  "name": "API Access",
  "description": "RESTful API access for integrations",
  "included": true,
  "limit": 10000
}
```

### Plan Limits

```json
{
  "maxCustomers": 1000,
  "maxLocations": 3,
  "maxCampaigns": 5,
  "maxRewards": 15
}
```

## Available Plans

1. **Free Plan** - $0/month

   - 100 customers, 1 location, 1 campaign, 5 rewards
   - Basic loyalty program and customer management
   - 14-day trial

2. **Basic Plan** - $29/month, $290/year

   - 1,000 customers, 3 locations, 5 campaigns, 15 rewards
   - Advanced rewards and basic marketing campaigns
   - Multi-location support

3. **Pro Plan** - $99/month, $990/year (Popular)

   - 10,000 customers, unlimited locations, 25 campaigns, 50 rewards
   - Advanced analytics, API access, custom branding
   - Priority support

4. **Enterprise Plan** - $299/month, $2,990/year
   - Unlimited customers, locations, campaigns, and rewards
   - All features including advanced security, custom integrations
   - Dedicated account manager
   - Dedicated support, 30-day trial

## Testing

### API Testing

- All endpoints tested and working
- Proper JSON responses with correct data structure
- Error handling for invalid requests

### Frontend Testing

- Test component created (`app/components/test/pricing-plans-test.tsx`)
- Test route available at `/test-pricing`
- Real-time API integration verification

## Usage

### In Billing Page

1. Navigate to the billing page
2. Scroll down to see "Available Plans" section
3. Toggle between Monthly/Yearly billing
4. Compare plans and features
5. Click upgrade/downgrade buttons
6. Confirm in the upgrade dialog

### API Usage

```typescript
// Get all plans
const { data: plans } = usePricingPlans();

// Get specific plan
const { data: proPlan } = usePricingPlan("pro");

// Get upgrade options
const { data: upgradeOptions } = useUpgradeOptions("basic");
```

## Future Enhancements

1. **Stripe Integration**

   - Connect with actual Stripe price IDs
   - Real payment processing

2. **Usage Tracking**

   - Monitor plan limits in real-time
   - Usage warnings and notifications

3. **Custom Plans**

   - Enterprise custom pricing
   - Add-on features and modules

4. **Plan Analytics**
   - Conversion tracking
   - Popular feature analysis

## Conclusion

The pricing plans integration provides a comprehensive, user-friendly way for customers to view, compare, and upgrade their plans directly from the billing page. The system is built with flexibility and scalability in mind, making it easy to add new plans, features, and pricing models in the future.
