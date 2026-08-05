import React from 'react';

interface AccountTeamSectionProps {
  customer: any;
  onEditAccountTeam: () => void;
}

export const AccountTeamSection: React.FC<AccountTeamSectionProps> = ({ customer, onEditAccountTeam }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Account Team</h3>
        <button className="btn-secondary" onClick={onEditAccountTeam}>Edit</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div><strong>Account Manager:</strong><br/>{customer.accountManager}</div>
        <div><strong>CSM:</strong><br/>{customer.customerSuccessManager}</div>
        <div><strong>Support Owner:</strong><br/>{customer.supportOwner}</div>
      </div>
    </div>
  );
};
