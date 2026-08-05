import type { Environment, Certificate, JiraTicket } from '../models/types';

export const mockEnvironments: Environment[] = [
  {
    id: '1',
    name: 'GEMS Production Main',
    customerId: '1', // GEMS
    type: 'Production',
    url: 'https://gems.qomp.com',
    ipAddress: '192.168.1.100',
    dbVersion: 'PostgreSQL 15.3',
    appVersion: 'v1.4.2',
    status: 'Active',
    createdAt: '2024-01-15',
    lastDeployment: '2026-07-10'
  },
  {
    id: '2',
    name: 'GEMS Staging',
    customerId: '1', // GEMS
    type: 'Staging',
    url: 'https://staging.gems.qomp.com',
    ipAddress: '192.168.1.101',
    dbVersion: 'PostgreSQL 15.3',
    appVersion: 'v1.5.0-rc1',
    status: 'Updating',
    createdAt: '2024-01-15',
    lastDeployment: '2026-07-18'
  },
  {
    id: '3',
    name: 'MOE Core Production',
    customerId: '2', // MOE
    type: 'Production',
    url: 'https://core.moe.gov.qomp.com',
    ipAddress: '10.0.0.5',
    dbVersion: 'Oracle 19c',
    appVersion: 'v1.4.0',
    status: 'Offline',
    createdAt: '2025-09-01',
    lastDeployment: '2026-06-20'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: '1',
    environmentId: '1',
    domain: 'gems.qomp.com',
    issuer: 'Let\'s Encrypt',
    validFrom: '2026-05-01',
    validTo: '2026-08-01',
    status: 'Valid'
  },
  {
    id: '2',
    environmentId: '3',
    domain: 'core.moe.gov.qomp.com',
    issuer: 'DigiCert',
    validFrom: '2025-07-20',
    validTo: '2026-07-25',
    status: 'Expiring Soon'
  }
];

export const mockJiraTickets: JiraTicket[] = [
  {
    id: '1',
    ticketId: 'QOMP-1042',
    environmentId: '3',
    title: 'Database connection timeout on MOE Prod',
    type: 'Bug',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Ahmed Ali',
    createdAt: '2026-07-19'
  },
  {
    id: '2',
    ticketId: 'QOMP-1030',
    environmentId: '1',
    title: 'Upgrade app version to v1.5.0',
    type: 'Task',
    status: 'Open',
    priority: 'Medium',
    assignee: 'DevOps Team',
    createdAt: '2026-07-18'
  }
];
