// @ts-nocheck
// ===========================================
// Square Payment Service
// ===========================================

import { prisma } from '../../config/database';

// Get Square configuration
async function getSquareConfig() {
  const gateway = await prisma.paymentGateway.findFirst({
    where: { provider: 'square' }
  });

  if (!gateway?.isEnabled || !gateway.accessToken) {
    throw new Error('Square is not configured');
  }

  return {
    applicationId: gateway.applicationId,
    accessToken: gateway.accessToken,
    locationId: gateway.locationId,
    webhookSignatureKey: gateway.webhookSignatureKey,
    testMode: gateway.testMode
  };
}

export async function createPayment(amount: number, sourceId: string, currency: string = 'USD') {
  const config = await getSquareConfig();
  return { paymentId: 'PLACEHOLDER', amount, currency };
}

export async function refundPayment(paymentId: string, amount?: number) {
  const config = await getSquareConfig();
  return { refunded: true, paymentId };
}

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  testMode?: boolean;
}> {
  try {
    const config = await getSquareConfig();
    return {
      success: true,
      message: 'Square configured',
      testMode: config.testMode
    };
  } catch (error) {
    return {
      success: false,
      message: `Square error: ${(error as Error).message}`
    };
  }
}

export async function isEnabled(): Promise<boolean> {
  try {
    const gateway = await prisma.paymentGateway.findFirst({
      where: { provider: 'square' }
    });
    return gateway?.isEnabled || false;
  } catch {
    return false;
  }
}
