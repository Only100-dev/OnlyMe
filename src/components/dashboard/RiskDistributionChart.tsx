import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Assessment } from '../../types/assessment';
import { calculateRiskScore, getRiskLevel } from '../../utils/riskAssessment';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskDistributionChartProps {
  assessments: Assessment[];
}

export default function RiskDistributionChart({ assessments }: RiskDistributionChartProps) {
  const riskDistribution = assessments.reduce(
    (acc, assessment) => {
      const riskScore = calculateRiskScore(assessment.riskFactors);
      const riskLevel = getRiskLevel(riskScore);
      acc[riskLevel]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const data = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [riskDistribution.low, riskDistribution.medium, riskDistribution.high],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        borderColor: ['#16a34a', '#ca8a04', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}