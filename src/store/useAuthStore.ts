import { create } from 'zustand';
import { User, Permission, ROLE_PERMISSIONS } from '../types/auth';
import { generateToken, verifyToken, hasPermission } from '../utils/auth';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkPermission: (permission: Permission) => boolean;
  updateUser: (updates: Partial<User>) => void;
}

// Demo user for direct login
const DEMO_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'admin',
  permissions: ROLE_PERMISSIONS.admin,
  lastLogin: new Date(),
  status: 'active',
  emailVerified: true,
  twoFactorEnabled: false,
  loginAttempts: 0,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async () => {
    const token = await generateToken({
      id: DEMO_USER.id,
      role: DEMO_USER.role,
    });

    localStorage.setItem('auth_token', token);
    
    const updatedUser = {
      ...DEMO_USER,
      lastLogin: new Date(),
      loginAttempts: 0,
    };

    set({ user: updatedUser, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_id');
    set({ user: null, isAuthenticated: false });
  },

  checkPermission: (permission: Permission) => {
    const user = get().user;
    if (!user) return false;
    return hasPermission(user, permission);
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    set({ user: updatedUser });
  },
}));

// Initialize auth state from token
const token = localStorage.getItem('auth_token');
if (token && verifyToken(token)) {
  useAuthStore.setState({
    user: DEMO_USER,
    isAuthenticated: true,
  });
}