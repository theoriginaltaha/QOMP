export type CustomerStatus = 'Active' | 'Pending' | 'Suspended' | 'Closed';

export interface Customer {
  id: string;
  name: string;
  code: string;
  type: string;
  industry: string;
  status: CustomerStatus;
  contractStatus: string;
  accountManager: string;
  customerSuccessManager: string;
  supportOwner: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  contractStartDate: string;
  contractEndDate: string;
  renewalDate: string;
  subscriptionType: string;
  tags: string[];
  healthScore?: 'Healthy' | 'Attention Required' | 'Critical';
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  preferredContactMethod: string;
}

export interface School {
  id: string;
  customerId: string;
  name: string;
  code: string;
  educationalStage: string;
  city: string;
  address: string;
  principal: string;
  status: string;
}
