// ─── Form & Data Validators ───────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-().]{10,}$/.test(phone.trim());
}

export interface PasswordValidation {
  valid: boolean;
  strength: 'weak' | 'fair' | 'strong';
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');

  const strength =
    errors.length === 0 && password.length >= 12
      ? 'strong'
      : errors.length <= 1
        ? 'fair'
        : 'weak';

  return { valid: errors.length === 0, strength, errors };
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidZipCode(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

export function isValidCardNumber(card: string): boolean {
  const digits = card.replace(/\s/g, '');
  return /^\d{16}$/.test(digits);
}

export function isValidCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv.trim());
}

export function isValidExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1]!, 10);
  const year = parseInt(`20${match[2]}`, 10);
  const now = new Date();
  const exp = new Date(year, month - 1);
  return month >= 1 && month <= 12 && exp > now;
}

export function isValidPromoCode(code: string): boolean {
  return /^[A-Z0-9]{4,20}$/.test(code.toUpperCase().trim());
}
