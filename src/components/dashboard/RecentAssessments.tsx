import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Assessment } from '../../types/assessment';
import { ChevronRight } from 'lucide-react';

interface RecentAssessmentsProps {
  assessments: Assessment[];
}

const RecentAssessments: React.FC<RecentAssessmentsProps> = ({ assessments }) => {
  const navigate = useNavigate();
  const sortedAssessments = [...assessments].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  ).slice(0, 5);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Assessments</h2>
      <div className="space-y-4">
        {sortedAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => navigate(`/assessment/${assessment.id}`)}
          >
            <div>
              <h3 className="font-medium">{assessment.id}</h3>
              <p className="text-sm text-gray-600">
                {assessment.vehicleModel} ({assessment.vehicleYear})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(assessment.status)}`}>
                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAssessments;