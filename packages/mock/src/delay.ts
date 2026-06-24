// Simulates network latency so loading states are exercised against mock data
// too, not just against a future real backend.
export function delay(ms = 300 + Math.random() * 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
