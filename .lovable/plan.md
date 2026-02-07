

# Payment Gateway Integration for Love Link

## Overview
This plan adds a one-time payment system using Stripe to unlock premium features. Free users can create **1 site without photo uploads**, while paid users get **unlimited sites with photo uploads**.

---

## What You Will Get

### Free Tier
- Create 1 Valentine site
- No photo upload feature
- All templates and themes available

### Premium Tier (One-time Payment)
- Unlimited Valentine sites
- Photo upload feature enabled
- Priority support badge (optional future addition)

---

## User Experience Flow

```text
+-------------------+
| User signs up     |
+-------------------+
         |
         v
+-------------------+
| Free tier active  |
| - 1 site allowed  |
| - No photos       |
+-------------------+
         |
         v
+---------------------------+
| Tries to:                 |
| - Create 2nd site    OR   |
| - Upload photos           |
+---------------------------+
         |
         v
+-------------------+
| Upgrade modal     |
| "Unlock Premium"  |
+-------------------+
         |
         v
+-------------------+
| Stripe Checkout   |
+-------------------+
         |
         v
+-------------------+
| Payment success   |
| Premium unlocked! |
+-------------------+
```

---

## Technical Implementation

### 1. Enable Stripe Integration
Use Lovable's built-in Stripe integration to handle payments securely. This will:
- Set up secure payment processing
- Handle webhooks automatically
- Store payment status in the database

### 2. Database Changes

**Add `is_premium` column to profiles table:**
```sql
ALTER TABLE public.profiles
ADD COLUMN is_premium boolean DEFAULT false NOT NULL;
```

**Add RLS policy for premium status:**
```sql
-- Users can read their own premium status
CREATE POLICY "Users can read own premium status"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);
```

### 3. Create Stripe Product & Price
Configure a one-time payment product in Stripe:
- Product: "Love Link Premium"
- Price: $X.XX (you can set the price)
- Type: One-time payment

### 4. Create Edge Functions

**`create-checkout-session` Edge Function:**
- Creates a Stripe Checkout session for premium upgrade
- Returns checkout URL to redirect user
- Includes user metadata for webhook processing

**`stripe-webhook` Edge Function:**
- Listens for `checkout.session.completed` events
- Updates `profiles.is_premium = true` for the user
- Handles payment confirmation securely

### 5. Frontend Changes

**Update AuthContext:**
- Add `isPremium` to the context
- Fetch premium status from profiles table
- Provide throughout the app

**Create Upgrade Modal Component:**
- Beautiful modal showing premium benefits
- One-click upgrade button
- Redirects to Stripe Checkout

**Update CreateSite.tsx:**
- Check site count before allowing creation
- If user has 1+ sites and is not premium, show upgrade modal
- Block "Create New" button with upgrade CTA

**Update PhotoUploadConfig.tsx:**
- Check premium status before allowing photo uploads
- Show upgrade prompt if not premium
- Disable upload functionality for free users

**Update Dashboard.tsx:**
- Show premium badge for paid users
- Add "Upgrade to Premium" button for free users
- Display current tier status

### 6. File Changes Summary

| File | Change |
|------|--------|
| Database migration | Add `is_premium` column to profiles |
| `supabase/functions/create-checkout-session/index.ts` | Create Stripe checkout session |
| `supabase/functions/stripe-webhook/index.ts` | Handle payment confirmation |
| `src/contexts/AuthContext.tsx` | Add `isPremium` state |
| `src/components/UpgradeModal.tsx` | New component for upgrade prompt |
| `src/components/PhotoUploadConfig.tsx` | Gate behind premium |
| `src/pages/CreateSite.tsx` | Limit to 1 site for free users |
| `src/pages/Dashboard.tsx` | Show premium status & upgrade CTA |

---

## Security Considerations

1. **Server-side validation**: Premium status is checked via database, not client-side
2. **Webhook signature verification**: Stripe webhooks are verified before processing
3. **RLS policies**: Only users can read their own premium status
4. **No exposed secrets**: All Stripe operations happen in edge functions

---

## Premium Feature Gates

| Feature | Free | Premium |
|---------|------|---------|
| Create sites | 1 | Unlimited |
| Photo uploads | No | Yes |
| All templates | Yes | Yes |
| All themes | Yes | Yes |
| Date planning | Yes | Yes |
| Password protection | Yes | Yes |

---

## Next Steps After Implementation

1. Set your preferred price for premium
2. Test the complete payment flow
3. Consider adding:
   - Email confirmation for purchases
   - Premium user analytics
   - Referral discounts

