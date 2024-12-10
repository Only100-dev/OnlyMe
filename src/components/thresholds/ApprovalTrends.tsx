import React from 'react';
import { Line } from 'react-chartjs-2';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { subDays, format } from 'date-fns';

const ApprovalTrends: React.FC = () => {
  const assessments = useAssessmentStore((state) => state.assessments);
  const days = 30;

  const dates = Array.from({ length: days }, (_, i) => subDays(new Date(), i));
  const dailyData = dates.reduce((acc, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    acc[dateStr] = { escalated: 0, auto: 0, manual: 0 };
    return acc;
  }, {} as Record<string, { escalated: number; auto: number; manual: number }>);

  assessments.forEach((assessment) => {
    const dateStr = format(assessment.createdAt, 'yyyy-MM-dd');
    if (dailyData[dateStr]) {
      if (assessment.status === 'approved') {
        dailyData[dateStr].auto++;
      } else if (assessment.status === 'denied') {
        dailyData[dateStr].manual++;
      }
      // Add logic for escalated cases
    }
  });

  const data = {
    labels: Object.keys(dailyData).reverse(),
    datasets: [
      {
        label: 'Auto-Approved',
        data: Object.values(dailyData).map(d => d.auto).reverse(),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Manual Review',
        data: Object.values(dailyData).map(d => d.manual).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Escalated',
        data: Object.values(dailyData).map(d => d.escalated).reverse(),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Approval Trends</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default ApprovalTrends;