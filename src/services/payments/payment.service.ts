// @ts-nocheck
// ===========================================
// Unified Payment Service Orchestrator
// ===========================================

import { prisma } from '../../config/database';
import * as stripe from './stripe.service';
import * as paypal from './paypal.service';
import * as braintree from './braintree.service';
import * as square from './square.service';
import * as authorize from './authorize.service';

export type PaymentGateway = 'stripe' | 'paypal' | 'braintree' | 'square' | 'authorize';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  gateway: PaymentGateway;
}

// Get all enabled gateways
export async function getEnabledGateways(): Promise<PaymentGateway[]> {
  const gateways = await prisma.paymentGateway.findMany({
    where: { isEnabled: true }
  });
  return gateways.map(g => g.provider as PaymentGateway);
}

// Get default gateway (first enabled)
export async function getDefaultGateway(): Promise<PaymentGateway | null> {
  const gateway = await prisma.paymentGateway.findFirst({
    where: { isEnabled: true },
    orderBy: { createdAt: 'asc' }
  });
  return gateway?.provider as PaymentGateway || null;
}

// Process payment through specified gateway
export async function processPayment(
  gateway: PaymentGateway,
  amount: number,
  currency: string = 'USD',
  metadata?: Record<string, any>
): Promise<PaymentResult> {
  try {
    switch (gateway) {
      case 'stripe':
        const stripeResult = await stripe.createPaymentIntent(amount * 100, currency);
        return {
          success: true,
          transactionId: stripeResult.id,
          gateway: 'stripe'
        };
      case 'paypal':
        const paypalResult = await paypal.createOrder(amount, currency);
        return {
          success: true,
          transactionId: paypalResult.orderId,
          gateway: 'paypal'
        };
      case 'braintree':
        const btResult = await braintree.createTransaction(amount, 'fake-nonce');
        return {
          success: true,
          transactionId: btResult.transactionId,
          gateway: 'braintree'
        };
      case 'square':
        const sqResult = await square.createPayment(amount, 'fake-source', currency);
        return {
          success: true,
          transactionId: sqResult.paymentId,
          gateway: 'square'
        };
      case 'authorize':
        const authResult = await authorize.chargeCard(amount, '4111111111111111', '12/25', '123');
        return {
          success: true,
          transactionId: authResult.transactionId,
          gateway: 'authorize'
        };
      default:
        throw new Error(`Unknown gateway: ${gateway}`);
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      gateway
    };
  }
}

// Process refund
export async function processRefund(
  gateway: PaymentGateway,
  transactionId: string,
  amount?: number
): Promise<PaymentResult> {
  try {
    switch (gateway) {
      case 'stripe':
        await stripe.createRefund(transactionId, amount ? amount * 100 : undefined);
        break;
      case 'paypal':
        await paypal.refundPayment(transactionId, amount);
        break;
      case 'braintree':
        await braintree.refundTransaction(transactionId, amount);
        break;
      case 'square':
        await square.refundPayment(transactionId, amount);
        break;
      case 'authorize':
        await authorize.refundTransaction(transactionId, amount);
        break;
      default:
        throw new Error(`Unknown gateway: ${gateway}`);
    }
    return { success: true, transactionId, gateway };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      gateway
    };
  }
}

// Test all gateway connections
export async function testAllConnections(): Promise<Record<PaymentGateway, {
  success: boolean;
  message: string;
  testMode?: boolean;
}>> {
  const results: Record<string, any> = {};

  const gateways = await prisma.paymentGateway.findMany();

  for (const gw of gateways) {
    switch (gw.provider) {
      case 'stripe':
        results.stripe = gw.isEnabled ? await stripe.testConnection() : { success: false, message: 'Not enabled' };
        break;
      case 'paypal':
        results.paypal = gw.isEnabled ? await paypal.testConnection() : { success: false, message: 'Not enabled' };
        break;
      case 'braintree':
        results.braintree = gw.isEnabled ? await braintree.testConnection() : { success: false, message: 'Not enabled' };
        break;
      case 'square':
        results.square = gw.isEnabled ? await square.testConnection() : { success: false, message: 'Not enabled' };
        break;
      case 'authorize':
        results.authorize = gw.isEnabled ? await authorize.testConnection() : { success: false, message: 'Not enabled' };
        break;
    }
  }

  return results as Record<PaymentGateway, any>;
}

// Handle webhook from any gateway
export async function handleWebhook(
  gateway: PaymentGateway,
  payload: any,
  signature?: string
): Promise<{ handled: boolean; type?: string }> {
  // Implementation would route to appropriate service
  return { handled: true, type: 'webhook.received' };
}

// Get transaction statistics
export async function getTransactionStats() {
  const payments = await prisma.payment.findMany();

  const total = payments.length;
  const completed = payments.filter(p => p.status === 'completed').length;
  const pending = payments.filter(p => p.status === 'pending').length;
  const failed = payments.filter(p => p.status === 'failed').length;
  const revenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    total,
    completed,
    pending,
    failed,
    revenue
  };
}
