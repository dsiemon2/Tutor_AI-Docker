// TutorAI Public Routes
// Landing page, features, pricing (no auth required)

import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8',
    logoUrl: '',
    headingFont: 'Inter',
    bodyFont: 'Inter'
  };
}

// Helper to get store info
async function getStoreInfo() {
  const storeInfo = await prisma.storeInfo.findFirst({ where: { id: 'default' } });
  return storeInfo || {
    businessName: 'TutorAI',
    tagline: 'AI-Powered Learning for Every Student',
    description: ''
  };
}

// Landing page
router.get('/', async (req, res) => {
  try {
    const [branding, storeInfo] = await Promise.all([
      getBranding(),
      getStoreInfo()
    ]);

    res.render('public/landing', {
      title: storeInfo.businessName,
      branding,
      storeInfo,
      user: (req.session as any)?.user || null
    });
  } catch (error) {
    console.error('Landing page error:', error);
    res.render('public/landing', {
      title: 'TutorAI',
      branding: {
        primaryColor: '#0ea5e9',
        secondaryColor: '#0284c7',
        accentColor: '#38bdf8'
      },
      storeInfo: {
        businessName: 'TutorAI',
        tagline: 'AI-Powered Learning for Every Student'
      },
      user: null
    });
  }
});

// Features page
router.get('/features', async (req, res) => {
  const [branding, storeInfo] = await Promise.all([
    getBranding(),
    getStoreInfo()
  ]);

  res.render('public/features', {
    title: 'Features - ' + storeInfo.businessName,
    branding,
    storeInfo,
    user: (req.session as any)?.user || null
  });
});

// Pricing page
router.get('/pricing', async (req, res) => {
  const [branding, storeInfo] = await Promise.all([
    getBranding(),
    getStoreInfo()
  ]);

  res.render('public/pricing', {
    title: 'Pricing - ' + storeInfo.businessName,
    branding,
    storeInfo,
    user: (req.session as any)?.user || null
  });
});

// About page
router.get('/about', async (req, res) => {
  const [branding, storeInfo] = await Promise.all([
    getBranding(),
    getStoreInfo()
  ]);

  res.render('public/about', {
    title: 'About - ' + storeInfo.businessName,
    branding,
    storeInfo,
    user: (req.session as any)?.user || null
  });
});

export default router;
