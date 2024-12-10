import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const AuthLinks: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  if (isAuthenticated) {
    return (
      <button
        onClick={logout}
        className="text-gray-600 hover:text-gray-900"
      >
        Sign Out
      </button>
    );
  }

  return (
    <div className="space-x-4">
      <Link
        to="/login"
        className="text-gray-600 hover:text-gray-900"
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Create Account
      </Link>
    </div>
  );
};

export default AuthLinks;