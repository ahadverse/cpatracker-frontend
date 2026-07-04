import type { EmailBlock, EmailTemplate, EmailTriggerEvent } from '@cpatracker/types';
import { faker } from '../faker';

function blocks(...blocks: EmailBlock[]): EmailBlock[] {
  return blocks;
}

const SEED: Record<EmailTriggerEvent, { subject: string; blocks: EmailBlock[] }> = {
  WELCOME: {
    subject: 'Welcome to CPATracker, {{companyName}}!',
    blocks: blocks(
      {
        id: 'welcome-image',
        type: 'image',
        src: 'https://placehold.co/560x160/4f46e5/ffffff?text=CPATracker',
        alt: 'CPATracker banner',
      },
      {
        id: 'welcome-header',
        type: 'header',
        text: 'Welcome aboard, {{companyName}}!',
        style: { align: 'center', fontSize: 'xl', fontWeight: 'bold' },
      },
      {
        id: 'welcome-text',
        type: 'text',
        html: '<p>Your network is live on the <strong>{{planName}}</strong> plan. We\'re excited to have you.</p>',
      },
      {
        id: 'welcome-button',
        type: 'button',
        label: 'Go to your dashboard',
        url: '{{ctaUrl}}',
        style: { align: 'center', backgroundColor: '#4f46e5', textColor: '#ffffff' },
      },
      { id: 'welcome-divider', type: 'divider' },
      { id: 'welcome-footer', type: 'footer', text: 'Questions? Reach us at {{supportEmail}}.' },
    ),
  },
  TRIAL_ENDING: {
    subject: 'Your trial ends soon, {{companyName}}',
    blocks: blocks(
      { id: 'trial-header', type: 'header', text: 'Your trial is ending soon' },
      {
        id: 'trial-text',
        type: 'text',
        html: '<p>Your trial for {{companyName}} ends in a few days. Add a plan to keep your network running.</p>',
      },
      { id: 'trial-button', type: 'button', label: 'Choose a plan', url: '{{ctaUrl}}' },
      { id: 'trial-footer', type: 'footer', text: 'Questions? Reach us at {{supportEmail}}.' },
    ),
  },
  SUSPENDED: {
    subject: 'Your network has been suspended',
    blocks: blocks(
      { id: 'suspended-header', type: 'header', text: 'Account suspended' },
      {
        id: 'suspended-text',
        type: 'text',
        html: '<p>{{companyName}}\'s network has been suspended. Contact us to reactivate it.</p>',
      },
      { id: 'suspended-button', type: 'button', label: 'Contact support', url: '{{ctaUrl}}' },
      { id: 'suspended-footer', type: 'footer', text: 'Questions? Reach us at {{supportEmail}}.' },
    ),
  },
  CANCELLED: {
    subject: 'Your subscription has been cancelled',
    blocks: blocks(
      { id: 'cancelled-header', type: 'header', text: 'Sorry to see you go' },
      {
        id: 'cancelled-text',
        type: 'text',
        html: '<p>{{companyName}}\'s subscription has been cancelled. You can resubscribe at any time.</p>',
      },
      { id: 'cancelled-footer', type: 'footer', text: 'Questions? Reach us at {{supportEmail}}.' },
    ),
  },
  INVOICE_REMINDER: {
    subject: 'Invoice reminder for {{companyName}}',
    blocks: blocks(
      { id: 'invoice-header', type: 'header', text: 'Invoice due soon' },
      {
        id: 'invoice-text',
        type: 'text',
        html: '<p>An invoice for {{companyName}} on the {{planName}} plan is due soon.</p>',
      },
      { id: 'invoice-button', type: 'button', label: 'View invoice', url: '{{ctaUrl}}' },
      { id: 'invoice-footer', type: 'footer', text: 'Questions? Reach us at {{supportEmail}}.' },
    ),
  },
};

export const emailTemplates: EmailTemplate[] = (Object.keys(SEED) as EmailTriggerEvent[]).map((trigger) => ({
  id: `email-template-${trigger.toLowerCase()}`,
  trigger,
  subject: SEED[trigger].subject,
  blocks: SEED[trigger].blocks,
  updatedAt: faker.date.past({ years: 1 }).toISOString(),
}));
