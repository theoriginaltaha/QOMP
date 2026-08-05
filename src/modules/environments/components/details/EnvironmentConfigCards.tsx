import React from 'react';

interface EnvironmentConfigCardsProps {
  environment: any;
}

export const EnvironmentConfigCards: React.FC<EnvironmentConfigCardsProps> = ({ environment }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0' }}>Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Environment Type</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>{environment.type}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Last Deployment</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>{environment.lastDeployment}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>PED Date</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem', color: 'var(--color-warning)' }}>{environment.pedDate || 'N/A'}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0' }}>Network & Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>URL</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem', color: 'var(--primary-color)' }}>{environment.url}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>IP Address</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>{environment.ipAddress}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0' }}>Versions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>App Version</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>{environment.appVersion}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Database</div>
            <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>{environment.dbVersion}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
