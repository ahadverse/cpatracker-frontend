export type EmailTriggerEvent = 'WELCOME' | 'TRIAL_ENDING' | 'SUSPENDED' | 'CANCELLED' | 'INVOICE_REMINDER';

export interface EmailBlockStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  fontWeight?: 'normal' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right';
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
}

export interface EmailHeaderBlock {
  id: string;
  type: 'header';
  text: string;
  style?: EmailBlockStyle;
}

export interface EmailTextBlock {
  id: string;
  type: 'text';
  html: string;
  style?: EmailBlockStyle;
}

export interface EmailButtonBlock {
  id: string;
  type: 'button';
  label: string;
  url: string;
  style?: EmailBlockStyle;
}

export interface EmailDividerBlock {
  id: string;
  type: 'divider';
  style?: EmailBlockStyle;
}

export interface EmailFooterBlock {
  id: string;
  type: 'footer';
  text: string;
  style?: EmailBlockStyle;
}

export interface EmailImageBlock {
  id: string;
  type: 'image';
  src: string;
  alt: string;
  style?: EmailBlockStyle;
}

export type EmailBlock =
  | EmailHeaderBlock
  | EmailTextBlock
  | EmailButtonBlock
  | EmailDividerBlock
  | EmailFooterBlock
  | EmailImageBlock;

export interface EmailTemplate {
  id: string;
  trigger: EmailTriggerEvent;
  subject: string;
  blocks: EmailBlock[];
  updatedAt: string;
}
