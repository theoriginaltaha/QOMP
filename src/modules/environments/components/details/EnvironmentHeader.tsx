import React from 'react';
import { Edit2 } from 'lucide-react';

interface EnvironmentHeaderProps {
  environment: any;
  onEdit: () => void;
  onManageAccess: () => void;
  onDelete: () => void;
}

export const EnvironmentHeader: React.FC<EnvironmentHeaderProps> = ({ environment, onEdit, onManageAccess, onDelete }) => {
  return (
    <div className="card profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {environment.name}
            <button 
              className="icon-btn" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
              title="Edit Environment"
              onClick={onEdit}
            >
              <Edit2 size={18} />
            </button>
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Customer: {environment.customer?.name} | {environment.type}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-secondary" onClick={onManageAccess}>Manage Access</button>
        <span className={`tag-pill ${environment.status === 'Running' ? 'tag-success' : 'tag-warning'}`}>
          {environment.status}
        </span>
        <button 
          className="btn-secondary" 
          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
