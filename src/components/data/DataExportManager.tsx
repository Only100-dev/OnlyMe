import React from 'react';
import { FileText, Download, Table, BarChart2 } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import Button from '../ui/Button';
import { generateAssessmentPDF } from '../../utils/pdfExport';
import { useAuditLogger } from '../../hooks/useAuditLogger';
import { exportToExcel } from '../../utils/excelExport';
import { generateCSV } from '../../utils/csvExport';

interface DataExportManagerProps {
  data: Assessment[];
  selectedFormat?: 'pdf' | 'excel' | 'csv' | 'json';
}

const DataExportManager: React.FC<DataExportManagerProps> = ({ data, selectedFormat }) => {
  const logAction = useAuditLogger();

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    try {
      switch (format) {
        case 'pdf':
          await generateAssessmentPDF(data[0]); // For single assessment
          break;
        case 'excel':
          await exportToExcel(data);
          break;
        case 'csv':
          await generateCSV(data);
          break;
        case 'json':
          const jsonString = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'assessments.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
      }

      logAction('data_exported', { format, count: data.length });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex space-x-3">
      <Button
        variant="outline"
        onClick={() => handleExport('pdf')}
        className="flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>PDF</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleExport('excel')}
        className="flex items-center space-x-2"
      >
        <Table className="w-4 h-4" />
        <span>Excel</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleExport('csv')}
        className="flex items-center space-x-2"
      >
        <BarChart2 className="w-4 h-4" />
        <span>CSV</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleExport('json')}
        className="flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>JSON</span>
      </Button>
    </div>
  );
};

export default DataExportManager;