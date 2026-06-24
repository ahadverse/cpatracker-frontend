import { faker } from '@faker-js/faker';

// Seeded once at module load so fixtures are stable across reloads/tests.
// Import this instance everywhere in packages/mock instead of importing
// '@faker-js/faker' directly.
faker.seed(42);

export { faker };
