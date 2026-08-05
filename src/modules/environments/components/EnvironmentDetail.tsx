import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockEnvironments, mockCertificates, mockJiraTickets } from '../services/mockData';
import { Tabs } from '../../../shared/components/Tabs';
import { Badge } from '../../../shared/components/Badge';
import { DataTable } from '../../../shared/components/DataTable';
import '../../customers/components/CustomerProfile.css'; // Reuse profile CSS

export const EnvironmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const environment = mockEnvironments.find(e => e.id === id);

  if (!environment) {
    return <div>Environment not found</div>;
  }

  const certificates = mockCertificates.filter(c => c.environmentId === id);
  const tickets = mockJiraTickets.filter(t => t.environmentId === id);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Updating': return 'warning';
      case 'Offline': return 'danger';
      case 'Provisioning': return 'info';
      default: return 'default';
    }
  };

  const OverviewTab = () => (
    <div className="profile-grid">
      <div className="card">
        <h3>Configuration</h3>
        <div className="info-grid">
          <div><label>Environment Type</label><p>{environment.type}</p></div>
          <div><label>Status</label><p><Badge variant={getStatusBadgeVariant(environment.status)}>{environment.status}</Badge></p></div>
          <div><label>Created At</label><p>{environment.createdAt}</p></div>
          <div><label>Last Deployment</label><p>{environment.lastDeployment}</p></div>
        </div>
      </div>
      
      <div className="card">
        <h3>Network & Access</h3>
        <div className="info-grid">
          <div><label>URL</label><p><a href={environment.url} target="_blank" rel="noreferrer" style={{color: 'var(--color-primary)'}}>{environment.url}</a></p></div>
          <div><label>IP Address</label><p>{environment.ipAddress}</p></div>
        </div>
      </div>

      <div className="card">
        <h3>Versions</h3>
        <div className="info-grid">
          <div><label>App Version</label><p>{environment.appVersion}</p></div>
          <div><label>Database</label><p>{environment.dbVersion}</p></div>
        </div>
      </div>
    </div>
  );

  const CertificatesTab = () => (
    <div className="card">
      <div className="card-header-flex">
        <h3>Certificates</h3>
        <button className="btn-secondary">Upload Certificate</button>
      </div>
      <DataTable 
        data={certificates} 
        columns={[
          { key: 'domain', header: 'Domain' },
          { key: 'issuer', header: 'Issuer' },
          { key: 'validTo', header: 'Expires On' },
          { key: 'status', header: 'Status', render: c => <Badge variant={c.status === 'Valid' ? 'success' : c.status === 'Expired' ? 'danger' : 'warning'}>{c.status}</Badge> }
        ]} 
      />
    </div>
  );

  const JiraTicketsTab = () => (
    <div className="card">
      <div className="card-header-flex">
        <h3>Jira Tickets</h3>
        <button className="btn-secondary">Link Ticket</button>
      </div>
      <DataTable 
        data={tickets} 
        columns={[
          { key: 'ticketId', header: 'Ticket ID' },
          { key: 'title', header: 'Title' },
          { key: 'type', header: 'Type', render: t => <Badge variant={t.type === 'Bug' ? 'danger' : 'default'}>{t.type}</Badge> },
          { key: 'status', header: 'Status', render: t => <Badge>{t.status}</Badge> },
          { key: 'assignee', header: 'Assignee' }
        ]} 
      />
    </div>
  );

  return (
    <div className="customer-profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate('/environments')}>
          <ArrowLeft size={20} /> Back to Environments
        </button>
        <div className="header-content">
          <div>
            <h1 className="customer-name">{environment.name}</h1>
            <span className="customer-code">{environment.type}</span>
          </div>
          <button className="btn-primary">Manage Environment</button>
        </div>
      </div>

      <Tabs 
        tabs={[
          { id: 'overview', label: 'Overview', content: <OverviewTab /> },
          { id: 'certificates', label: `Certificates (${certificates.length})`, content: <CertificatesTab /> },
          { id: 'tickets', label: `Jira Tickets (${tickets.length})`, content: <JiraTicketsTab /> }
        ]} 
      />
    </div>
  );
};
