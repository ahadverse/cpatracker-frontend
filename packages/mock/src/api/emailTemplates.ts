import type { EmailBlock, EmailTemplate, EmailTriggerEvent } from '@cpatracker/types';
import { delay } from '../delay';
import { emailTemplates } from '../data/emailTemplates';
import { USE_MOCK } from '../config';

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return emailTemplates;
}

export async function getEmailTemplate(trigger: EmailTriggerEvent): Promise<EmailTemplate | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return emailTemplates.find((t) => t.trigger === trigger);
}

export interface UpdateEmailTemplateInput {
  subject: string;
  blocks: EmailBlock[];
}

export async function updateEmailTemplate(
  trigger: EmailTriggerEvent,
  input: UpdateEmailTemplateInput,
): Promise<EmailTemplate> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const template = emailTemplates.find((t) => t.trigger === trigger);
  if (!template) throw new Error(`Email template ${trigger} not found`);
  template.subject = input.subject;
  template.blocks = input.blocks;
  template.updatedAt = new Date().toISOString();
  return template;
}
