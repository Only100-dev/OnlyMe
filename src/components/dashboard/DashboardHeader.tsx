import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import Button from '../ui/Button';

export default function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to Motor Risk Assessment System</p>
      </div>
      <Button
        onClick={() => navigate('/new')}
        className="flex items-center space-x-2"
      >
        <FilePlus className="w-4 h-4" />
        <span>New Assessment</span>
      </Button>
    </div>
  );
}