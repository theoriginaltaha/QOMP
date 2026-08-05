import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EnvironmentsSectionProps {
  environments: any[];
  onAddEnvironment: () => void;
}

export const EnvironmentsSection: React.FC<EnvironmentsSectionProps> = ({ environments, onAddEnvironment }) => {
  const navigate = useNavigate();
  
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Provisioned Environments</h3>
        <button className="btn-secondary" onClick={onAddEnvironment}>Provision New</button>
      </div>
      {(!environments || environments.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No environments provisioned yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {environments.map((env: any) => (
            <div key={env.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{env.name}</strong>
                <span className={`tag-pill ${env.status === 'Running' ? 'tag-success' : 'tag-warning'}`}>{env.status}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{env.type} | App: {env.appVersion} | DB: {env.dbVersion}</div>
              <button className="btn-secondary" style={{ marginTop: '0.75rem', width: '100%' }} onClick={() => navigate(`/environments/${env.id}`)}>
                Manage Infrastructure
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
