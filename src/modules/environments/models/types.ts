export interface Environment {
  id: string;
  name: string;
  customerId: string;
  type: 'Production' | 'Staging' | 'QA' | 'Development';
  url: string;
  ipAddress: string;
  dbVersion: string;
  appVersion: string;
  status: 'Active' | 'Updating' | 'Offline' | 'Provisioning';
  createdAt: string;
  lastDeployment: string;
}

export interface Certificate {
  id: string;
  environmentId: string;
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
}

export interface JiraTicket {
  id: string;
  ticketId: string;
  environmentId: string;
  title: string;
  type: 'Bug' | 'Support' | 'Task';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  createdAt: string;
}
