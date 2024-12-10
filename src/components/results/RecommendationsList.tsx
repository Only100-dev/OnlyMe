import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { generateRecommendations } from '../../utils/riskModel';

interface RecommendationsListProps {
  assessment: Assessment;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ assessment }) => {
  const recommendations = generateRecommendations(assessment);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
          >
            {recommendation.includes('required') ? (
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            ) : recommendation.includes('recommended') ? (
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            )}
            <div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;