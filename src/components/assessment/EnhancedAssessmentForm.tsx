import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import FormSteps from './FormSteps';
import { Assessment } from '../../types/assessment';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useAuditLogger } from '../../hooks/useAuditLogger';
import { analyzeRisk, generateRiskReport } from '../../utils/riskAssessmentEngine';
import { checkCompliance } from '../../utils/complianceChecker';
import { processDocument } from '../../utils/documentProcessor';

const EnhancedAssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const addAssessment = useAssessmentStore((state) => state.addAssessment);
  const logAction = useAuditLogger();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Assessment) => {
    setProcessing(true);
    setError(null);

    try {
      // Process documents
      const processedDocs = await Promise.all(
        data.documents.map(doc => processDocument(doc))
      );

      // Risk analysis
      const riskScore = await analyzeRisk(data);
      const riskReport = generateRiskReport(data, riskScore);

      // Compliance check
      const complianceResult = checkCompliance(data);

      // Create assessment with enhanced data
      const enhancedAssessment: Assessment = {
        ...data,
        id: `RA-${Date.now()}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        trackingNumber: `TN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        riskFactors: riskReport.criticalFactors.map(factor => ({
          id: factor.toLowerCase().replace(/\s+/g, '-'),
          name: factor,
          severity: riskScore.overall > 0.7 ? 'high' : riskScore.overall > 0.4 ? 'medium' : 'low',
          description: factor,
        })),
        comments: [],
      };

      // Add to store
      addAssessment(enhancedAssessment);

      // Log actions
      logAction('assessment_created', {
        assessmentId: enhancedAssessment.id,
        riskScore: riskScore.overall,
        isCompliant: complianceResult.isCompliant,
      });

      // Navigate to details page
      navigate(`/assessment/${enhancedAssessment.id}`);
    } catch (err) {
      setError('Failed to process assessment. Please try again.');
      logAction('assessment_creation_failed', {
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">New Assessment</h1>
        <p className="text-gray-600">Create a new motor risk assessment</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {processing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
          <p className="text-blue-700">Processing assessment...</p>
        </div>
      )}

      <FormSteps onSubmit={handleSubmit} />

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Assessment Guidelines</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All required documents must be clear and valid</li>
              <li>• Vehicle details must match registration documents</li>
              <li>• Driver information must be accurate and verifiable</li>
              <li>• Coverage amounts must meet minimum requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAssessmentForm;