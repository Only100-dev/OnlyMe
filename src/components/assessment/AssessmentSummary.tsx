import React from 'react';
import { Assessment } from '../../types/assessment';
import { formatDate } from '../../utils/formatters';

interface AssessmentSummaryProps {
  assessment: Assessment;
}

const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({ assessment }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Assessment Summary</h3>
      
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Vehicle Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Model</span>
              <p className="font-medium">{assessment.vehicleModel}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Year</span>
              <p className="font-medium">{assessment.vehicleYear}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Driver Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <p className="font-medium">{assessment.driverDetails.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">License Number</span>
              <p className="font-medium">{assessment.driverDetails.licenseNumber}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Age</span>
              <p className="font-medium">{assessment.driverDetails.age} years</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Experience</span>
              <p className="font-medium">{assessment.driverDetails.experience} years</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Coverage Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Type</span>
              <p className="font-medium capitalize">{assessment.coverageDetails.type}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Amount</span>
              <p className="font-medium">{assessment.coverageDetails.amount.toLocaleString()} AED</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Deductible</span>
              <p className="font-medium">{assessment.coverageDetails.deductible.toLocaleString()} AED</p>
            </div>
          </div>
        </div>

        {assessment.coverageDetails.additionalCoverages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Coverage</h4>
            <div className="flex flex-wrap gap-2">
              {assessment.coverageDetails.additionalCoverages.map((coverage) => (
                <span
                  key={coverage}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {coverage}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Documents</h4>
          <div className="space-y-2">
            {assessment.documents.map((doc) => (
              <div
                key={doc}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm">{doc}</span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Created</span>
            <span>{formatDate(assessment.createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Last Updated</span>
            <span>{formatDate(assessment.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummary;