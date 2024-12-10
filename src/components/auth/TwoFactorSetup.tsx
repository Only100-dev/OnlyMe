import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { generateTwoFactorSecret, verifyTwoFactorToken } from '../../utils/authEnhanced';

interface TwoFactorSetupProps {
  onComplete: (secret: string) => void;
  onCancel: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const [secret] = useState(() => generateTwoFactorSecret());
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (verifyTwoFactorToken(token, secret)) {
      onComplete(secret);
    } else {
      setError('Invalid verification code');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <Lock className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Set Up Two-Factor Authentication</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-gray-600 mb-4">
            Scan this QR code with your authenticator app or enter the code manually:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <code className="text-lg font-mono">{secret}</code>
          </div>
        </div>

        <div>
          <Input
            label="Verification Code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            error={error}
            placeholder="Enter the 6-digit code"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleVerify}>
            Verify and Enable
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;