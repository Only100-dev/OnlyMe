import React, { useState } from 'react';
import { History, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import Button from '../ui/Button';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useAuditLogger } from '../../hooks/useAuditLogger';
import { compareAssessments } from '../../utils/assessmentComparison';
import { sendAssessmentNotification } from '../../utils/notifications';

interface ReassessmentManagerProps {
  assessment: Assessment;
  onClose: () => void;
}

const ReassessmentManager: React.FC<ReassessmentManagerProps> = ({ assessment, onClose }) => {
  const [reason, setReason] = useState('');
  const [changes, setChanges] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateAssessment = useAssessmentStore((state) => state.updateAssessment);
  const logAction = useAuditLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedAssessment: Partial<Assessment> = {
        status: 'pending',
        updatedAt: new Date(),
        comments: [
          ...assessment.comments,
          {
            id: `comment-${Date.now()}`,
            text: `Reassessment requested: ${reason}`,
            author: 'System',
            createdAt: new Date(),
            isInternal: true,
          }
        ],
      };

      // Update assessment
      updateAssessment(assessment.id, updatedAssessment);

      // Log the action
      logAction('assessment_reassessment_requested', {
        assessmentId: assessment.id,
        reason,
        changes,
        previousStatus: assessment.status,
      });

      // Send notification
      await sendAssessmentNotification(assessment, 'reassessment');

      onClose();
    } catch (error) {
      console.error('Reassessment request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeToggle = (change: string) => {
    setChanges((prev) =>
      prev.includes(change)
        ? prev.filter((c) => c !== change)
        : [...prev, change]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <History className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Request Reassessment</h3>
      </div>

      {assessment.status !== 'denied' && (
        <div className="flex items-start space-x-2 p-4 bg-yellow-50 rounded-lg mb-6">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Reassessment is only available for denied assessments.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Changes to be Made
          </label>
          <div className="space-y-2">
            {[
              'Updated Documentation',
              'Modified Coverage Details',
              'Additional Information',
              'Risk Mitigation Measures',
              'Policy Amendments',
            ].map((change) => (
              <label
                key={change}
                className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={changes.includes(change)}
                  onChange={() => handleChangeToggle(change)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{change}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Reassessment
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Explain why this assessment should be reconsidered..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !reason.trim() || changes.length === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Reassessment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReassessmentManager;