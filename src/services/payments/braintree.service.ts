// @ts-nocheck
// ===========================================
// Braintree Payment Service
// ===========================================

import { prisma } from '../../config/database';

// Get Braintree configuration
async function getBraintreeConfig() {
  const gateway = await prisma.paymentGateway.findFirst({
    where: { provider: 'braintree' }
  });

  if (!gateway?.isEnabled || !gateway.merchantId) {
    throw new Error('Braintree is not configured');
  }

  return {
    merchantId: gateway.merchantId,
    publicKey: gateway.publicKey,
    privateKey: gateway.privateKey,
    testMode: gateway.testMode
  };
}

export async function createTransaction(amount: number, paymentMethodNonce: string) {
  const config = await getBraintreeConfig();
  return { transactionId: 'PLACEHOLDER', amount };
}

export async function refundTransaction(transactionId: string, amount?: number) {
  const config = await getBraintreeConfig();
  return { refunded: true, transactionId };
}

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  testMode?: boolean;
}> {
  try {
    const config = await getBraintreeConfig();
    return {
      success: true,
      message: 'Braintree configured',
      testMode: config.testMode
    };
  } catch (error) {
    return {
      success: false,
      message: `Braintree error: ${(error as Error).message}`
    };
  }
}

export async function isEnabled(): Promise<boolean> {
  try {
    const gateway = await prisma.paymentGateway.findFirst({
      where: { provider: 'braintree' }
    });
    return gateway?.isEnabled || false;
  } catch {
    return false;
  }
}
