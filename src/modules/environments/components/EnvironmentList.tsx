import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Environment } from '../models/types';
import { mockEnvironments } from '../services/mockData';
import { mockCustomers } from '../../customers/services/mockData';
import { DataTable } from '../../../shared/components/DataTable';
import { Badge } from '../../../shared/components/Badge';

export const EnvironmentList: React.FC = () => {
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Updating': return 'warning';
      case 'Offline': return 'danger';
      case 'Provisioning': return 'info';
      default: return 'default';
    }
  };

  const getCustomerName = (id: string) => mockCustomers.find(c => c.id === id)?.name || 'Unknown';

  const columns = [
    { key: 'name', header: 'Environment Name', render: (e: Environment) => <strong>{e.name}</strong> },
    { key: 'customer', header: 'Customer', render: (e: Environment) => getCustomerName(e.customerId) },
    { key: 'type', header: 'Type' },
    { key: 'appVersion', header: 'Version' },
    { 
      key: 'status', 
      header: 'Status', 
      render: (e: Environment) => <Badge variant={getStatusBadgeVariant(e.status)}>{e.status}</Badge> 
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Environments</h1>
          <p className="page-subtitle">Manage technical instances, versions, and deployments.</p>
        </div>
        <button className="btn-primary">Provision Environment</button>
      </div>

      <DataTable 
        data={mockEnvironments} 
        columns={columns} 
        onRowClick={(env) => navigate(`/environments/${env.id}`)} 
      />
    </div>
  );
};
