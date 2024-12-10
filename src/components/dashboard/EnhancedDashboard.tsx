import React from 'react';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { StatCards } from './StatCards';
import AssessmentTrends from './AssessmentTrends';
import RecentAssessments from './RecentAssessments';
import RiskDistributionChart from './RiskDistributionChart';

const EnhancedDashboard: React.FC = () => {
  const assessments = useAssessmentStore((state) => state.assessments);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to Motor Risk Assessment System</p>
        </div>
      </div>

      <StatCards assessments={assessments} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AssessmentTrends assessments={assessments} />
        <RiskDistributionChart assessments={assessments} />
      </div>

      <RecentAssessments assessments={assessments} />
    </div>
  );
};

export default EnhancedDashboard;