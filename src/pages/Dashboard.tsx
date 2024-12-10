import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnhancedDashboard from '../components/dashboard/EnhancedDashboard';
import Button from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to Motor Risk Assessment System</p>
        </div>
        <Button
          onClick={() => navigate('/new')}
          className="flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment</span>
        </Button>
      </div>
      <EnhancedDashboard />
    </div>
  );
};

export default Dashboard;