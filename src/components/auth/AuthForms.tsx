import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button';

const AuthForms: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    try {
      await login();
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Motor Risk Assessment System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click below to access the dashboard
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleLogin}
            className="w-full flex justify-center py-2 px-4"
          >
            Enter Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;