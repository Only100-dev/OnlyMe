import React from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Assessment } from '../../types/assessment';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  className?: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  className,
  trend 
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${className}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      {trend !== undefined && (
        <div className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 && '+'}
          {trend}%
        </div>
      )}
    </div>
  </div>
);

export function StatCards({ assessments }: { assessments: Assessment[] }) {
  const stats = {
    pending: assessments.filter((a) => a.status === 'pending').length,
    approved: assessments.filter((a) => a.status === 'approved').length,
    denied: assessments.filter((a) => a.status === 'denied').length,
    total: assessments.length,
  };

  const trends = {
    pending: 5,
    approved: 12,
    denied: -3,
    total: 8,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        icon={Clock}
        label="Pending"
        value={stats.pending}
        className="bg-blue-50 text-blue-600"
        trend={trends.pending}
      />
      <StatCard
        icon={CheckCircle}
        label="Approved"
        value={stats.approved}
        className="bg-green-50 text-green-600"
        trend={trends.approved}
      />
      <StatCard
        icon={XCircle}
        label="Denied"
        value={stats.denied}
        className="bg-red-50 text-red-600"
        trend={trends.denied}
      />
      <StatCard
        icon={AlertTriangle}
        label="Total"
        value={stats.total}
        className="bg-purple-50 text-purple-600"
        trend={trends.total}
      />
    </div>
  );
}