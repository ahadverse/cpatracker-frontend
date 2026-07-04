export type PaymentMethodPreference = 'PAYPAL' | 'WIRE' | 'CRYPTO' | 'CHECK';
export type CompanySize = 'SOLO' | 'SMALL' | 'MEDIUM' | 'LARGE';

export interface RegistrationInfo {
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  taxId?: string;
  preferredPaymentMethod: PaymentMethodPreference;
  website?: string;
  companySize: CompanySize;
  timezone: string;
  referralSource?: string;
}
