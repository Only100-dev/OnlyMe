import React from 'react';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Assessment } from '../../types/assessment';

interface RecentActivityProps {
  assessments: Assessment[];
}

export default function RecentActivity({ assessments }: RecentActivityProps) {
  const navigate = useNavigate();
  const recentAssessments = [...assessments]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-600';
      case 'denied':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            onClick={() => navigate(`/assessment/${assessment.id}`)}
          >
            <div>
              <p className="font-medium">
                {assessment.vehicleModel} ({assessment.vehicleYear})
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{assessment.driverDetails.name}</span>
                <span>•</span>
                <span>
                  {formatDistance(assessment.createdAt, new Date(), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assessment.status)}`}>
                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
              </span>
              <span className="text-blue-600">View →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}