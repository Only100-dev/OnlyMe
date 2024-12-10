import React from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { syncRegulations } from '../../utils/regulationSync';
import Button from '../ui/Button';

const RegulationSync: React.FC = () => {
  const [syncing, setSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState<{
    timestamp: Date;
    updated: number;
    failed: number;
    logs: string[];
  } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncRegulations();
      setLastSync({
        timestamp: new Date(),
        ...result
      });
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Regulation Sync</h3>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
        </Button>
      </div>

      {lastSync && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  {lastSync.updated} updated
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">
                  {lastSync.failed} failed
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              Last sync: {lastSync.timestamp.toLocaleString()}
            </span>
          </div>

          <div className="bg-gray-50 rounded p-3 max-h-40 overflow-auto">
            {lastSync.logs.map((log, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulationSync;