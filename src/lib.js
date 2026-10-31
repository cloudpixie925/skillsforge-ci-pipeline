// Pure business logic, kept separate from HTTP so it is easy to unit-test.

export const DEFAULT_NAME = 'World';
export const MAX_NAME_LENGTH = 50;

/**
 * Build a greeting. Blank or non-string names fall back to DEFAULT_NAME,
 * and long names are truncated so the response size stays bounded.
 */
export function greet(name) {
  const clean = typeof name === 'string' ? name.trim() : '';
  if (clean === '') {
    return `Hello, ${DEFAULT_NAME}!`;
  }
  return `Hello, ${clean.slice(0, MAX_NAME_LENGTH)}!`;
}

/**
 * Add up a non-empty array of finite numbers.
 * Throws TypeError for anything else so the API can answer 400.
 */
export function sum(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new TypeError('numbers must be a non-empty array');
  }
  for (const n of numbers) {
    if (typeof n !== 'number' || !Number.isFinite(n)) {
      throw new TypeError('every item in numbers must be a finite number');
    }
  }
  return numbers.reduce((total, n) => total + n, 0);
}

// Deliberate lint error for the fail-fast demo: this constant is never used.
const unusedRetryLimit = 3;
