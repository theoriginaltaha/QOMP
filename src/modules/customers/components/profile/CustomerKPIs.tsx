import React from 'react';
import { CardWidget } from '../../../../shared/components/CardWidget';

interface CustomerKPIsProps {
  customer: any;
}

export const CustomerKPIs: React.FC<CustomerKPIsProps> = ({ customer }) => {
  return (
    <div className="profile-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <CardWidget title="Health Score" value={customer.healthScore} />
      <CardWidget title="Active Environments" value={customer.environments?.length.toString() || '0'} />
      <CardWidget title="Total Schools" value={customer.schools?.length.toString() || '0'} />
      <CardWidget title="Pending Tasks" value={customer.tasks?.filter((t:any) => t.status !== 'Completed').length.toString() || '0'} />
    </div>
  );
};
