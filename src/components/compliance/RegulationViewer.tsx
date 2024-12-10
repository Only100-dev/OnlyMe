import React from 'react';
import { useComplianceStore } from '../../store/useComplianceStore';
import { formatDate } from '../../utils/formatters';

const RegulationViewer: React.FC = () => {
  const regulations = useComplianceStore((state) => state.regulations);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Current Regulations</h3>

      <div className="space-y-4">
        {regulations.map((regulation) => (
          <div
            key={regulation.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{regulation.title}</h4>
              <span className="text-sm text-gray-500">
                Updated: {formatDate(regulation.lastUpdated)}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {regulation.description}
            </p>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Requirements:</h5>
              <ul className="list-disc list-inside space-y-1">
                {regulation.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
              <span>Category: {regulation.category}</span>
              <span>Source: {regulation.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulationViewer;