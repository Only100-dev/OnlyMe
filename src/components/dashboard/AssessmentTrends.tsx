import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Assessment } from '../../types/assessment';
import { subDays, format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AssessmentTrendsProps {
  assessments: Assessment[];
  days?: number;
}

export default function AssessmentTrends({ assessments, days = 30 }: AssessmentTrendsProps) {
  const dates = Array.from({ length: days }, (_, i) => subDays(new Date(), i));
  
  const dailyCounts = dates.reduce((acc, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    acc[dateStr] = {
      total: 0,
      approved: 0,
      denied: 0,
    };
    return acc;
  }, {} as Record<string, { total: number; approved: number; denied: number }>);

  assessments.forEach((assessment) => {
    const dateStr = format(assessment.createdAt, 'yyyy-MM-dd');
    if (dailyCounts[dateStr]) {
      dailyCounts[dateStr].total++;
      if (assessment.status === 'approved') {
        dailyCounts[dateStr].approved++;
      } else if (assessment.status === 'denied') {
        dailyCounts[dateStr].denied++;
      }
    }
  });

  const data = {
    labels: Object.keys(dailyCounts).reverse(),
    datasets: [
      {
        label: 'Total Assessments',
        data: Object.values(dailyCounts)
          .map((count) => count.total)
          .reverse(),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
      },
      {
        label: 'Approved',
        data: Object.values(dailyCounts)
          .map((count) => count.approved)
          .reverse(),
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        tension: 0.4,
      },
      {
        label: 'Denied',
        data: Object.values(dailyCounts)
          .map((count) => count.denied)
          .reverse(),
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
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
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxTicksLimit: 7,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Assessments',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Assessment Trends</h3>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}