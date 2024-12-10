import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Assessment } from '../../types/assessment';
import { checkCompliance } from '../../utils/complianceChecker';

interface ComplianceChartProps {
  assessment: Assessment;
}

const ComplianceChart: React.FC<ComplianceChartProps> = ({ assessment }) => {
  const complianceResult = checkCompliance(assessment);

  const data = {
    labels: ['Compliant', 'Non-Compliant'],
    datasets: [
      {
        data: [
          complianceResult.requirements.length - complianceResult.violations.length,
          complianceResult.violations.length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Compliance Status'
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Doughnut data={data} options={options} />
      <div className="mt-4">
        <h4 className="font-medium mb-2">Compliance Details</h4>
        <ul className="space-y-1 text-sm">
          {complianceResult.violations.map((violation, index) => (
            <li key={index} className="text-red-600">• {violation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComplianceChart;