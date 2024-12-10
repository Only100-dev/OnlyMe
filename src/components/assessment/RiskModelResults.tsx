import React from 'react';
import { Assessment } from '../../types/assessment';
import { calculateRiskScore, getRiskFactors, makeUnderwritingDecision, generateRecommendations } from '../../utils/riskModel';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface RiskModelResultsProps {
  assessment: Assessment;
}

const RiskModelResults: React.FC<RiskModelResultsProps> = ({ assessment }) => {
  const riskScore = calculateRiskScore(assessment);
  const riskFactors = getRiskFactors(assessment);
  const decision = makeUnderwritingDecision(assessment);
  const recommendations = generateRecommendations(assessment);

  const getDecisionIcon = () => {
    switch (decision.decision) {
      case 'approve':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'deny':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'review':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getDecisionColor = () => {
    switch (decision.decision) {
      case 'approve':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'deny':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'review':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Risk Assessment Results</h3>

      <div className={`p-4 rounded-lg border ${getDecisionColor()}`}>
        <div className="flex items-center space-x-3">
          {getDecisionIcon()}
          <div>
            <h4 className="font-medium capitalize">
              {decision.decision === 'review' ? 'Manual Review Required' : `${decision.decision}ed`}
            </h4>
            <p className="text-sm mt-1">{decision.reason}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium mb-3">Risk Score</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                riskScore <= 0.3 
                  ? 'bg-green-500' 
                  : riskScore <= 0.6 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}
              style={{ width: `${riskScore * 100}%` }}
            />
          </div>
          <span className="font-medium">{Math.round(riskScore * 100)}%</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium mb-3">Risk Factors</h4>
        <div className="space-y-3">
          {riskFactors.map((factor) => (
            <div 
              key={factor.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <AlertTriangle className={`w-5 h-5 ${
                factor.severity === 'high' 
                  ? 'text-red-500' 
                  : factor.severity === 'medium'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`} />
              <div>
                <h5 className="font-medium">{factor.name}</h5>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li 
              key={index}
              className="flex items-start space-x-2 text-sm"
            >
              <span className="text-gray-400">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskModelResults;