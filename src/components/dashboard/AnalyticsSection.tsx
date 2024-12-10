import React from 'react';
import { Assessment } from '../../types/assessment';
import AssessmentTrends from './AssessmentTrends';
import RiskDistributionChart from './RiskDistributionChart';

interface AnalyticsSectionProps {
  assessments: Assessment[];
}

export default function AnalyticsSection({ assessments }: AnalyticsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <AssessmentTrends assessments={assessments} />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <RiskDistributionChart assessments={assessments} />
      </div>
    </div>
  );
}