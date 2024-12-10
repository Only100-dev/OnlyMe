import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { checkCompliance } from '../../utils/complianceChecker';
import { useAuditLogger } from '../../hooks/useAuditLogger';

interface ComplianceManagerProps {
  assessment: Assessment;
}

const ComplianceManager: React.FC<ComplianceManagerProps> = ({ assessment }) => {
  const [complianceResult, setComplianceResult] = useState<any>(null);
  const logAction = useAuditLogger();

  useEffect(() => {
    const checkAssessmentCompliance = async () => {
      try {
        const result = await checkCompliance(assessment);
        setComplianceResult(result);
        
        logAction('compliance_check_completed', {
          assessmentId: assessment.id,
          isCompliant: result.isCompliant,
          violations: result.violations.length,
        });
      } catch (error) {
        console.error('Compliance check failed:', error);
      }
    };

    checkAssessmentCompliance();
  }, [assessment, logAction]);

  if (!complianceResult) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Compliance Status</h3>
      </div>

      <div className={`p-4 rounded-lg ${
        complianceResult.isCompliant ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <div className="flex items-start space-x-3">
          {complianceResult.isCompliant ? (
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${
              complianceResult.isCompliant ? 'text-green-700' : 'text-red-700'
            }`}>
              {complianceResult.isCompliant ? 'Compliant' : 'Non-Compliant'}
            </p>
            {complianceResult.violations.length > 0 && (
              <ul className="mt-2 space-y-1">
                {complianceResult.violations.map((violation: string, index: number) => (
                  <li key={index} className="text-sm text-red-600">
                    • {violation}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Regulatory Requirements</h4>
        <ul className="space-y-2">
          {complianceResult.requirements.map((requirement: string, index: number) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <span className="text-gray-400">•</span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComplianceManager;