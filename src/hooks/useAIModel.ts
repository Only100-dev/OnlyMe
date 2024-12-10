import { useState, useCallback } from 'react';
import { Assessment } from '../types/assessment';
import { predictRiskScore, generateRiskAnalysis } from '../utils/aiModel';
import { useAuditLogger } from './useAuditLogger';

export function useAIModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logAction = useAuditLogger();

  const analyzeAssessment = useCallback(async (assessment: Assessment) => {
    setLoading(true);
    setError(null);

    try {
      const riskScore = await predictRiskScore(assessment);
      const analysis = generateRiskAnalysis(assessment);

      logAction('risk_assessment_completed', {
        assessmentId: assessment.id,
        riskScore,
        riskFactors: analysis.riskFactors.length,
      });

      return {
        riskScore,
        ...analysis,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      logAction('risk_assessment_failed', {
        assessmentId: assessment.id,
        error: errorMessage,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, [logAction]);

  return {
    analyzeAssessment,
    loading,
    error,
  };
}