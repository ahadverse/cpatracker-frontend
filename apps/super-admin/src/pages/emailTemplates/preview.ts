import type { EmailBlock, EmailBlockStyle } from '@cpatracker/types';

export const SAMPLE_VARIABLES: Record<string, string> = {
  companyName: 'Acme Inc',
  contactEmail: 'ops@acme.test',
  planName: 'Growth',
  ctaUrl: 'https://app.cpatracker.dev',
  supportEmail: 'support@cpatracker.dev',
};

const FONT_SIZE: Record<NonNullable<EmailBlockStyle['fontSize']>, string> = {
  sm: '12px',
  base: '14px',
  lg: '18px',
  xl: '24px',
};

const FONT_WEIGHT: Record<NonNullable<EmailBlockStyle['fontWeight']>, string> = {
  normal: '400',
  medium: '500',
  bold: '700',
};

const PADDING_Y: Record<NonNullable<EmailBlockStyle['paddingY']>, string> = {
  none: '0px',
  sm: '8px',
  md: '16px',
  lg: '32px',
};

export function substituteVariables(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => SAMPLE_VARIABLES[key] ?? match);
}

function wrapperStyle(style: EmailBlockStyle | undefined, defaults: Partial<EmailBlockStyle>): string {
  const merged = { ...defaults, ...style };
  const rules: string[] = [];
  const paddingY = PADDING_Y[merged.paddingY ?? 'none'];
  rules.push(`padding-top:${paddingY}`, `padding-bottom:${paddingY}`);
  if (merged.backgroundColor) rules.push(`background-color:${merged.backgroundColor}`);
  if (merged.align) rules.push(`text-align:${merged.align}`);
  return rules.join(';');
}

function textStyle(style: EmailBlockStyle | undefined, defaults: Partial<EmailBlockStyle>): string {
  const merged = { ...defaults, ...style };
  const rules: string[] = [];
  rules.push(`font-size:${FONT_SIZE[merged.fontSize ?? 'base']}`);
  rules.push(`font-weight:${FONT_WEIGHT[merged.fontWeight ?? 'normal']}`);
  if (merged.textColor) rules.push(`color:${merged.textColor}`);
  return rules.join(';');
}

export function renderPreviewHtml(subject: string, blocks: EmailBlock[]): string {
  const body = blocks
    .map((block) => {
      switch (block.type) {
        case 'header':
          return `<div style="${wrapperStyle(block.style, {})}"><h2 style="margin:0;${textStyle(block.style, { fontSize: 'xl', fontWeight: 'bold' })}">${substituteVariables(block.text)}</h2></div>`;
        case 'text':
          return `<div style="${wrapperStyle(block.style, {})}"><div style="${textStyle(block.style, {})};line-height:1.6;">${substituteVariables(block.html)}</div></div>`;
        case 'button':
          return `<div style="${wrapperStyle(block.style, { align: 'left' })}"><a href="${substituteVariables(block.url)}" style="display:inline-block;padding:10px 20px;border-radius:6px;text-decoration:none;${textStyle(block.style, { textColor: '#ffffff', fontWeight: 'medium' })};background-color:${block.style?.backgroundColor ?? '#4f46e5'};">${substituteVariables(block.label)}</a></div>`;
        case 'divider':
          return `<div style="${wrapperStyle(block.style, {})}"><hr style="margin:0;border:none;border-top:1px solid #e5e7eb;" /></div>`;
        case 'footer':
          return `<div style="${wrapperStyle(block.style, {})}"><p style="margin:0;${textStyle(block.style, { fontSize: 'sm', textColor: '#6b7280' })}">${substituteVariables(block.text)}</p></div>`;
        case 'image':
          return `<div style="${wrapperStyle(block.style, { align: 'center' })}"><img src="${block.src}" alt="${block.alt}" style="max-width:100%;border-radius:6px;" /></div>`;
        default:
          return '';
      }
    })
    .join('\n');

  return `<div style="font-family:sans-serif;color:#111827;"><p style="margin:0 0 16px;font-size:12px;color:#6b7280;">Subject: ${substituteVariables(subject)}</p>${body}</div>`;
}
