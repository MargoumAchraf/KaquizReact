import { jwtDecode } from 'jwt-decode';

// RFC-5322-ish, pragmatic email check: local@domain.tld, no spaces, one @.
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(trimmed);
}

// Username rules: 3-20 chars, letters/numbers/underscore/dot, must start
// with a letter or number (adjust to match your backend's actual rules).
export function isValidUsername(value: string): boolean {
  const trimmed = value.trim();
  const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._]{2,19}$/;
  return usernameRegex.test(trimmed);
}


interface JWTPayload {
  exp: number;
  [key: string]: any;
}


export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (!decoded.exp) return false;

    const currentTime = Date.now() / 1000; // exp is in seconds
    return decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
};