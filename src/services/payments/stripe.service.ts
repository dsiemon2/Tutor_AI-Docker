// @ts-nocheck
// ===========================================
// Stripe Payment Service
// ===========================================

import Stripe from 'stripe';
import { prisma } from '../../config/database';

// Get Stripe configuration from database
async function getStripeConfig() {
  const gateway = await prisma.paymentGateway.findFirst({
    where: { provider: 'stripe' }
  });

  if (!gateway?.isEnabled || !gateway.secretKey) {
    throw new Error('Stripe is not configured');
  }

  return {
    secretKey: gateway.secretKey,
    publishableKey: gateway.publishableKey,
    webhookSecret: gateway.webhookSecret,
    testMode: gateway.testMode
  };
}

// Get Stripe instance
async function getStripeInstance(): Promise<Stripe> {
  const config = await getStripeConfig();
  return new Stripe(config.secretKey, {
    apiVersion: '2025-02-24.acacia'
  });
}

// Create payment intent
export async function createPaymentIntent(
  amount: number,
  currency: string = 'USD',
  customerId?: string,
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = await getStripeInstance();

  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: metadata || {}
  };

  if (customerId) {
    params.customer = customerId;
  }

  return stripe.paymentIntents.create(params);
}

// Create refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
  const stripe = await getStripeInstance();

  const params: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId
  };

  if (amount) params.amount = amount;
  if (reason) params.reason = reason;

  return stripe.refunds.create(params);
}

// Create subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
): Promise<Stripe.Subscription> {
  const stripe = await getStripeInstance();

  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
    metadata
  });
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = await getStripeInstance();
  return stripe.subscriptions.cancel(subscriptionId);
}

// Test connection
export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  testMode?: boolean;
}> {
  try {
    const config = await getStripeConfig();
    const stripe = await getStripeInstance();
    await stripe.balance.retrieve();

    return {
      success: true,
      message: 'Successfully connected to Stripe',
      testMode: config.testMode
    };
  } catch (error) {
    return {
      success: false,
      message: `Stripe connection failed: ${(error as Error).message}`
    };
  }
}

// Check if enabled
export async function isEnabled(): Promise<boolean> {
  try {
    const gateway = await prisma.paymentGateway.findFirst({
      where: { provider: 'stripe' }
    });
    return gateway?.isEnabled || false;
  } catch {
    return false;
  }
}
