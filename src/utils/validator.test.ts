import { validateEmail } from './validators';

describe('validateEmail', () => {
  it('returns true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('returns false for invalid emails', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('user@com')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null as any)).toBe(false);
  });
});
