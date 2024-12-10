import { z } from 'zod';

export type UserRole = 'admin' | 'underwriter' | 'manager' | 'viewer';

export type Permission =
  | 'create_assessment'
  | 'view_assessment'
  | 'approve_assessment'
  | 'deny_assessment'
  | 'manage_users'
  | 'manage_documents'
  | 'view_reports'
  | 'manage_settings'
  | 'manage_thresholds'
  | 'export_data'
  | 'view_audit_logs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  loginAttempts: number;
  lastLoginAttempt?: Date;
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  twoFactorCode: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'create_assessment',
    'view_assessment',
    'approve_assessment',
    'deny_assessment',
    'manage_users',
    'manage_documents',
    'view_reports',
    'manage_settings',
    'manage_thresholds',
    'export_data',
    'view_audit_logs',
  ],
  manager: [
    'create_assessment',
    'view_assessment',
    'approve_assessment',
    'deny_assessment',
    'view_reports',
    'manage_thresholds',
    'export_data',
    'view_audit_logs',
  ],
  underwriter: [
    'create_assessment',
    'view_assessment',
    'approve_assessment',
    'deny_assessment',
    'view_reports',
    'export_data',
  ],
  viewer: [
    'view_assessment',
    'view_reports',
  ],
};