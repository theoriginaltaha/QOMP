import React from 'react';
import { Settings, Trash2 } from 'lucide-react';

interface CustomerSettingsSectionProps {
  customer: any;
  onArchive: () => void;
}

export const CustomerSettingsSection: React.FC<CustomerSettingsSectionProps> = ({ customer, onArchive }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
          <Settings size={20} />
          Profile Actions
        </h3>
      </div>
      
      <div style={{ padding: '1rem', background: 'var(--color-danger-light)', borderRadius: '8px', border: '1px solid var(--color-danger)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-danger)' }}>Danger Zone</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Archiving this customer will soft-delete them from the active list. They can be restored from the Recycle Bin.
        </p>
        <button 
          className="btn-secondary" 
          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={onArchive}
        >
          <Trash2 size={16} /> Archive Customer
        </button>
      </div>
    </div>
  );
};
