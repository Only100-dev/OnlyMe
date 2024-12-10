import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { analyzeRisk } from '../../utils/riskAssessmentEngine';
import { checkCompliance } from '../../utils/complianceChecker';

interface RiskAssessmentPreviewProps {
  assessment: Assessment;
}

const RiskAssessmentPreview: React.FC<RiskAssessmentPreviewProps> = ({ assessment }) => {
  const [riskAnalysis, setRiskAnalysis] = React.useState<any>(null);
  const [compliance, setCompliance] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const analyze = async () => {
      try {
        const riskScore = await analyzeRisk(assessment);
        const complianceResult = checkCompliance(assessment);
        
        setRiskAnalysis(riskScore);
        setCompliance(complianceResult);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [assessment]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Risk Score</span>
              <span className="font-semibold">{(riskAnalysis.overall * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  riskAnalysis.overall < 0.4 ? 'bg-green-500' :
                  riskAnalysis.overall < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${riskAnalysis.overall * 100}%` }}
              />
            </div>
          </div>

          {/* Risk Factors */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(riskAnalysis.factors).map(([factor, score]: [string, number]) => (
              <div key={factor} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium capitalize">{factor}</div>
                <div className={`text-lg font-semibold ${
                  score < 0.4 ? 'text-green-600' :
                  score < 0.7 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(score * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Compliance Check</h3>
        
        <div className={`p-4 rounded-lg ${
          compliance.isCompliant ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-start space-x-3">
            {compliance.isCompliant ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${
                compliance.isCompliant ? 'text-green-700' : 'text-red-700'
              }`}>
                {compliance.isCompliant ? 'Compliant' : 'Non-Compliant'}
              </p>
              {compliance.violations.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {compliance.violations.map((violation: string, index: number) => (
                    <li key={index} className="text-sm text-red-600">
                      • {violation}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Requirements</h3>
        <div className="space-y-2">
          {compliance.requirements.map((requirement: string, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <span className="text-sm">{requirement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPreview;