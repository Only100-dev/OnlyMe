import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';
import { verifyToken } from '../../utils/auth';

const EmailVerification: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      const isValid = verifyToken(token);
      setStatus(isValid ? 'success' : 'error');
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          {status === 'verifying' ? (
            <Mail className="h-6 w-6 text-blue-600 animate-pulse" />
          ) : status === 'success' ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          {status === 'verifying'
            ? 'Verifying your email...'
            : status === 'success'
            ? 'Email Verified!'
            : 'Verification Failed'}
        </h2>

        <p className="text-gray-600">
          {status === 'verifying'
            ? 'Please wait while we verify your email address.'
            : status === 'success'
            ? 'Your email has been successfully verified. You can now sign in to your account.'
            : 'The verification link is invalid or has expired. Please request a new verification email.'}
        </p>

        <Button
          onClick={() => navigate('/login')}
          className="mx-auto"
        >
          Return to Sign In
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;