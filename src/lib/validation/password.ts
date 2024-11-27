export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: number; // 0-4 scale
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength = 0;

  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strength += 1;
  }

  // Maximum length check
  if (password.length > 128) {
    errors.push('Password cannot be longer than 128 characters');
  }

  // Check for uppercase and lowercase letters
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  if (!hasUppercase || !hasLowercase) {
    errors.push('Password must contain both uppercase and lowercase letters');
  } else {
    strength += 1;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 1;
  }

  // Check for special characters
  const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialChars.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  } else {
    strength += 1;
  }

  // Check for common patterns
  const commonPatterns = [
    /password/i,
    /12345/,
    /qwerty/i,
    /admin/i,
    /user/i,
    /letmein/i,
    /welcome/i
  ];

  // Check for common patterns
  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns that are not allowed');
    strength = Math.max(0, strength - 1);
  }

  // Check for repeating characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain three or more repeating characters');
    strength = Math.max(0, strength - 1);
  }

  // Check for sequential characters
  const sequential = /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i;
  if (sequential.test(password)) {
    errors.push('Password cannot contain sequential characters');
    strength = Math.max(0, strength - 1);
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

export function isStrongPassword(password: string): boolean {
  const { isValid } = validatePassword(password);
  return isValid;
}

export function getPasswordStrength(password: string): number {
  const { strength } = validatePassword(password);
  return strength;
}
