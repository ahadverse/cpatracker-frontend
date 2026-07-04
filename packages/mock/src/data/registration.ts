import type { CompanySize, PaymentMethodPreference, RegistrationInfo } from '@cpatracker/types';
import { faker } from '../faker';

const PAYMENT_METHODS: PaymentMethodPreference[] = ['PAYPAL', 'WIRE', 'CRYPTO', 'CHECK'];
const COMPANY_SIZES: CompanySize[] = ['SOLO', 'SMALL', 'MEDIUM', 'LARGE'];

// Used when creating a new affiliate/advertiser through an admin-facing create
// form, which doesn't collect this yet — the record starts blank pending a
// real signup flow, rather than being backfilled with random fixture data.
export function emptyRegistrationInfo(): RegistrationInfo {
  return {
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    preferredPaymentMethod: 'WIRE',
    companySize: 'SOLO',
    timezone: 'UTC',
  };
}

export function makeRegistrationInfo(): RegistrationInfo {
  return {
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    region: faker.location.state(),
    postalCode: faker.location.zipCode(),
    taxId: faker.datatype.boolean(0.6) ? faker.string.alphanumeric(9).toUpperCase() : undefined,
    preferredPaymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
    website: faker.datatype.boolean(0.7) ? faker.internet.url() : undefined,
    companySize: faker.helpers.arrayElement(COMPANY_SIZES),
    timezone: faker.location.timeZone(),
    referralSource: faker.datatype.boolean(0.5) ? faker.helpers.arrayElement(['Google', 'Referral', 'Social Media', 'Conference', 'Affiliate Forum']) : undefined,
  };
}
