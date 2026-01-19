// @ts-nocheck
// ===========================================
// Authorize.net Payment Service
// ===========================================

import { prisma } from '../../config/database';

// Get Authorize.net configuration
async function getAuthorizeConfig() {
  const gateway = await prisma.paymentGateway.findFirst({
    where: { provider: 'authorize' }
  });

  if (!gateway?.isEnabled || !gateway.apiLoginId || !gateway.transactionKey) {
    throw new Error('Authorize.net is not configured');
  }

  return {
    apiLoginId: gateway.apiLoginId,
    transactionKey: gateway.transactionKey,
    signatureKey: gateway.signatureKey,
    testMode: gateway.testMode
  };
}

export async function chargeCard(amount: number, cardNumber: string, expDate: string, cvv: string) {
  const config = await getAuthorizeConfig();
  return { transactionId: 'PLACEHOLDER', amount };
}

export async function refundTransaction(transactionId: string, amount?: number) {
  const config = await getAuthorizeConfig();
  return { refunded: true, transactionId };
}

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  testMode?: boolean;
}> {
  try {
    const config = await getAuthorizeConfig();
    return {
      success: true,
      message: 'Authorize.net configured',
      testMode: config.testMode
    };
  } catch (error) {
    return {
      success: false,
      message: `Authorize.net error: ${(error as Error).message}`
    };
  }
}

export async function isEnabled(): Promise<boolean> {
  try {
    const gateway = await prisma.paymentGateway.findFirst({
      where: { provider: 'authorize' }
    });
    return gateway?.isEnabled || false;
  } catch {
    return false;
  }
}
