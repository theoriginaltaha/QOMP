import * as customerRepository from '../repositories/customerRepository';

export const fetchCustomers = async () => {
  return await customerRepository.getAllActiveCustomers();
};

export const fetchCustomerById = async (id: string) => {
  const customer = await customerRepository.getCustomerById(id);
  if (!customer) throw new Error('Customer not found');
  return customer;
};

export const createNewCustomer = async (data: any) => {
  return await customerRepository.createCustomer({
    ...data,
    status: 'Active', contractStatus: 'Draft', accountManager: 'Unassigned',
    customerSuccessManager: 'Unassigned', supportOwner: 'Unassigned', healthScore: 'Neutral',
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    subscriptionType: 'Standard'
  });
};

export const updateAccountTeam = async (id: string, data: any) => {
  return await customerRepository.updateCustomer(id, data);
};

export const addResource = async (customerId: string, data: any) => {
  return await customerRepository.createResource({ customerId, ...data });
};

export const removeResource = async (id: string) => {
  return await customerRepository.deleteResource(id);
};

export const updatePortals = async (id: string, data: any) => {
  return await customerRepository.updateCustomer(id, data);
};

export const addContact = async (customerId: string, data: any) => {
  return await customerRepository.createContact({ customerId, ...data });
};

export const removeContact = async (id: string) => {
  return await customerRepository.deleteContact(id);
};

export const editContact = async (id: string, data: any) => {
  return await customerRepository.updateContact(id, data);
};

export const addSchool = async (customerId: string, data: any) => {
  const school = await customerRepository.createSchool({ customerId, ...data });
  
  if (data.coordinatorName) {
    await customerRepository.createContact({
      customerId,
      schoolId: school.id,
      name: data.coordinatorName,
      jobTitle: 'Coordinator',
      phone: data.coordinatorPhone || '',
      email: data.coordinatorEmail || '',
      isPrimary: true
    });
  }
  
  return school;
};

export const editSchool = async (id: string, data: any) => {
  return await customerRepository.updateSchool(id, data);
};

export const fetchMeetings = async () => {
  return await customerRepository.getMeetings();
};

export const addMeeting = async (customerId: string, data: any) => {
  return await customerRepository.createMeeting({ customerId, ...data });
};

export const fetchRenewals = async () => {
  return await customerRepository.getRenewals();
};

export const addRenewal = async (customerId: string, data: any) => {
  return await customerRepository.createRenewal({ customerId, ...data });
};

export const softDeleteCustomer = async (id: string) => {
  return await customerRepository.updateCustomer(id, { isDeleted: true, deletedAt: new Date() });
};

export const fetchRecycleBin = async () => {
  return await customerRepository.getDeletedCustomers();
};

export const restoreCustomer = async (id: string) => {
  return await customerRepository.updateCustomer(id, { isDeleted: false, deletedAt: null });
};

export const hardDeleteCustomer = async (id: string) => {
  return await customerRepository.deleteCustomer(id);
};
