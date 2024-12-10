import React from 'react';
import { FileText, Download, Mail } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { generateAssessmentPDF } from '../../utils/pdfExport';
import { calculateRiskScore, getRiskLevel, getRecommendation } from '../../utils/riskAssessment';
import Button from '../ui/Button';
import { formatDate } from '../../utils/formatters';

interface AssessmentReportProps {
  assessment: Assessment;
  onShare?: (format: 'pdf' | 'email') => void;
}

const AssessmentReport: React.FC<AssessmentReportProps> = ({ assessment, onShare }) => {
  const riskScore = calculateRiskScore(assessment.riskFactors);
  const riskLevel = getRiskLevel(riskScore);
  const recommendation = getRecommendation(assessment);

  const handleDownload = () => {
    generateAssessmentPDF(assessment);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Assessment Report</h3>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onShare?.('email')}
            className="flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Share via Email</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between pb-4 border-b">
          <div>
            <h4 className="font-semibold">Assessment ID: {assessment.id}</h4>
            <p className="text-sm text-gray-600">
              Generated on {formatDate(new Date())}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            assessment.status === 'approved'
              ? 'bg-green-100 text-green-800'
              : assessment.status === 'denied'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
          </div>
        </div>

        {/* Risk Assessment */}
        <div>
          <h5 className="font-medium mb-3">Risk Assessment</h5>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
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
              <span className="font-medium w-16 text-right">{riskScore}%</span>
            </div>
            <p className={`p-3 rounded-lg ${
              riskLevel === 'low'
                ? 'bg-green-50 text-green-700'
                : riskLevel === 'medium'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {recommendation}
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h5 className="font-medium mb-3">Risk Factors</h5>
          <div className="space-y-2">
            {assessment.riskFactors.map((factor) => (
              <div
                key={factor.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{factor.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    factor.severity === 'high'
                      ? 'bg-red-100 text-red-700'
                      : factor.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {factor.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div>
          <h5 className="font-medium mb-3">Submitted Documents</h5>
          <div className="space-y-2">
            {assessment.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{doc}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t text-sm text-gray-500">
          <p>This report is generated automatically by the Motor Risk Assessment System.</p>
          <p>For any queries, please contact the underwriting department.</p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReport;