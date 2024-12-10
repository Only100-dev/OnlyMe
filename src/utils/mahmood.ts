```typescript
interface MahmoodConfig {
  name: string;
  role: string;
  permissions: string[];
}

const Mahmood: MahmoodConfig = {
  name: 'Mahmood',
  role: 'admin',
  permissions: [
    'create_assessment',
    'view_assessment',
    'approve_assessment',
    'deny_assessment',
    'manage_users',
    'manage_documents',
    'view_reports',
    'manage_settings',
    'manage_thresholds',
    'export_data',
    'view_audit_logs'
  ]
};

export default Mahmood;
```