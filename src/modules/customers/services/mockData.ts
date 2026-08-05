import type { Customer, Contact, School } from '../models/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'GEMS Education',
    code: 'CUST-001',
    type: 'Enterprise',
    industry: 'Education',
    status: 'Active',
    contractStatus: 'Signed',
    accountManager: 'Ahmed Ali',
    customerSuccessManager: 'Sara Ahmed',
    supportOwner: 'Tech Support Team A',
    email: 'contact@gems.edu',
    phone: '+971 4 123 4567',
    address: 'Sheikh Zayed Road',
    country: 'UAE',
    city: 'Dubai',
    contractStartDate: '2025-01-01',
    contractEndDate: '2028-12-31',
    renewalDate: '2028-10-01',
    subscriptionType: 'Premium',
    tags: ['#VIP', '#Education'],
    healthScore: 'Healthy'
  },
  {
    id: '2',
    name: 'Ministry of Education',
    code: 'CUST-002',
    type: 'Government',
    industry: 'Education',
    status: 'Pending',
    contractStatus: 'Negotiation',
    accountManager: 'Mohamed Hassan',
    customerSuccessManager: 'Nour El Din',
    supportOwner: 'VIP Support',
    email: 'info@moe.gov',
    phone: '+20 2 2794 1234',
    address: 'Downtown',
    country: 'Egypt',
    city: 'Cairo',
    contractStartDate: '2026-09-01',
    contractEndDate: '2029-08-31',
    renewalDate: '2029-06-01',
    subscriptionType: 'Enterprise',
    tags: ['#Government', '#Priority'],
    healthScore: 'Attention Required'
  },
  {
    id: '3',
    name: 'Al-Noor International Schools',
    code: 'CUST-003',
    type: 'Private',
    industry: 'Education',
    status: 'Suspended',
    contractStatus: 'Expired',
    accountManager: 'Omar Farooq',
    customerSuccessManager: 'Layla Saad',
    supportOwner: 'Tech Support Team B',
    email: 'admin@alnoor.edu',
    phone: '+966 11 456 7890',
    address: 'Olaya Street',
    country: 'KSA',
    city: 'Riyadh',
    contractStartDate: '2022-01-01',
    contractEndDate: '2025-12-31',
    renewalDate: '2025-10-01',
    subscriptionType: 'Standard',
    tags: ['#Renewal2025'],
    healthScore: 'Critical'
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    customerId: '1',
    name: 'Dr. John Smith',
    jobTitle: 'IT Director',
    department: 'IT',
    email: 'john.smith@gems.edu',
    phone: '+971 50 123 4567',
    mobile: '+971 50 123 4567',
    preferredContactMethod: 'Email'
  },
  {
    id: '2',
    customerId: '1',
    name: 'Jane Doe',
    jobTitle: 'Operations Manager',
    department: 'Operations',
    email: 'jane.doe@gems.edu',
    phone: '+971 4 123 4568',
    mobile: '+971 55 987 6543',
    preferredContactMethod: 'Phone'
  }
];

export const mockSchools: School[] = [
  {
    id: '1',
    customerId: '1',
    name: 'GEMS Wellington Academy',
    code: 'SCH-001',
    educationalStage: 'K-12',
    city: 'Dubai',
    address: 'Silicon Oasis',
    principal: 'Mr. Robert Brown',
    status: 'Active'
  },
  {
    id: '2',
    customerId: '1',
    name: 'GEMS Modern Academy',
    code: 'SCH-002',
    educationalStage: 'K-12',
    city: 'Dubai',
    address: 'Nad Al Sheba',
    principal: 'Mrs. Nargish Khambatta',
    status: 'Active'
  }
];
