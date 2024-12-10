import React from 'react';
import { Save } from 'lucide-react';
import Button from '../components/ui/Button';

const Settings = () => {
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    riskThresholds: {
      low: 70,
      medium: 40,
    },
    documentRetention: 90,
    autoArchive: true,
    complianceCheckInterval: 24,
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Configure system preferences and thresholds</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings((s) => ({ ...s, emailNotifications: e.target.checked }))
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Enable email notifications</span>
          </label>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Low Risk Threshold
              </label>
              <input
                type="number"
                value={settings.riskThresholds.low}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    riskThresholds: {
                      ...s.riskThresholds,
                      low: Number(e.target.value),
                    },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medium Risk Threshold
              </label>
              <input
                type="number"
                value={settings.riskThresholds.medium}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    riskThresholds: {
                      ...s.riskThresholds,
                      medium: Number(e.target.value),
                    },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Document Management</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Retention Period (days)
              </label>
              <input
                type="number"
                value={settings.documentRetention}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    documentRetention: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.autoArchive}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, autoArchive: e.target.checked }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Auto-archive old assessments</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Compliance</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Compliance Check Interval (hours)
            </label>
            <input
              type="number"
              value={settings.complianceCheckInterval}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  complianceCheckInterval: Number(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;