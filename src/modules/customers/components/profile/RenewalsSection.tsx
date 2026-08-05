import React from 'react';

interface RenewalsSectionProps {
  renewals: any[];
  onAddRenewal: () => void;
}

export const RenewalsSection: React.FC<RenewalsSectionProps> = ({ renewals, onAddRenewal }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Renewals</h3>
        <button className="btn-primary" onClick={onAddRenewal}>Add</button>
      </div>
      {(!renewals || renewals.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No renewals recorded.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {renewals.map((renewal: any) => (
            <div key={renewal.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Renewal</strong>
                <span className={`tag-pill tag-warning`}>{renewal.status}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Date: {renewal.renewalDate}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
