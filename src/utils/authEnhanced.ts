import { generateToken } from './auth';
import { User } from '../types/auth';

const SMTP_CONFIG = {
  host: import.meta.env.VITE_SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(import.meta.env.VITE_SMTP_PORT || '2525'),
  auth: {
    user: import.meta.env.VITE_SMTP_USER || 'default_user',
    pass: import.meta.env.VITE_SMTP_PASS || 'default_pass',
  },
};

// Generate verification token
export async function generateVerificationToken(user: User): Promise<string> {
  return generateToken({
    userId: user.id,
    type: 'verification',
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  });
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
  
  // In a real app, implement email sending here
  console.log('Verification email sent:', {
    to: email,
    url: verificationUrl,
  });
}

// Generate 2FA secret
export function generateTwoFactorSecret(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

// Verify 2FA token
export function verifyTwoFactorToken(token: string, secret: string): boolean {
  // In a real app, implement proper TOTP verification
  return token === secret;
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${window.location.origin}/reset-password?token=${token}`;
  
  // In a real app, implement email sending here
  console.log('Password reset email sent:', {
    to: email,
    url: resetUrl,
  });
}