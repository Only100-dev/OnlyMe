import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { calculateRiskScore, getRiskLevel } from '../../utils/riskAssessment';

interface ResultsSummaryProps {
  assessment: Assessment;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ assessment }) => {
  const riskScore = calculateRiskScore(assessment.riskFactors);
  const riskLevel = getRiskLevel(riskScore);

  const getStatusIcon = () => {
    switch (assessment.status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'denied':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <p className="text-lg font-semibold capitalize">{assessment.status}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                riskLevel === 'low'
                  ? 'bg-green-500'
                  : riskLevel === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <span className="font-semibold">{riskScore}%</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Factors</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600">High</span>
              <span className="font-semibold">
                {assessment.riskFactors.filter(f => f.severity === 'high').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-600">Medium</span>
              <span className="font-semibold">
                {assessment.riskFactors.filter(f => f.severity === 'medium').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">Low</span>
              <span className="font-semibold">
                {assessment.riskFactors.filter(f => f.severity === 'low').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;