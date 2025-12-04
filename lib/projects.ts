/**
 * Project utilities
 */

// Generate demo link token
export function generateDemoToken(): string {
  return `demo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`;
}
