import React from 'react';
import { Line } from 'react-chartjs-2';
import { Assessment } from '../../types/assessment';
import { calculateRiskScore } from '../../utils/riskAssessment';

interface RiskVisualizationProps {
  assessment: Assessment;
}

const RiskVisualization: React.FC<RiskVisualizationProps> = ({ assessment }) => {
  const riskScore = calculateRiskScore(assessment.riskFactors);

  const data = {
    labels: ['Driver Risk', 'Vehicle Risk', 'Coverage Risk', 'Overall Risk'],
    datasets: [
      {
        label: 'Risk Scores',
        data: [
          assessment.driverDetails.previousAccidents * 20,
          (new Date().getFullYear() - assessment.vehicleYear) * 5,
          assessment.coverageDetails.amount < 250000 ? 80 : 20,
          riskScore
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Risk Assessment Breakdown'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Risk Score'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Line data={data} options={options} />
    </div>
  );
};

export default RiskVisualization;