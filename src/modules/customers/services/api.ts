import type { Customer } from '../models/types';

const API_URL = '/api';

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${API_URL}/customers`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

export const createCustomer = async (data: Partial<Customer>): Promise<Customer> => {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create customer');
  return response.json();
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await fetch(`${API_URL}/customers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch customer details');
  return response.json();
};

export const deleteCustomer = async (id: string) => {
  const res = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete customer');
  return res.json();
};

export const updateAccountTeam = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/customers/${id}/team`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update account team');
  return res.json();
};

export const updatePortals = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/customers/${id}/portals`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update portals');
  return res.json();
};

export const createContact = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create contact');
  return response.json();
};

export const updateContact = async (contactId: string, data: any) => {
  const res = await fetch(`${API_URL}/contacts/${contactId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update contact');
  return res.json();
};

export const deleteContact = async (contactId: string) => {
  const res = await fetch(`${API_URL}/contacts/${contactId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete contact');
  return res.json();
};

export const createSchool = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/schools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create school');
  return response.json();
};

export const updateSchool = async (schoolId: string, data: any) => {
  const res = await fetch(`${API_URL}/schools/${schoolId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update school');
  return res.json();
};

export const deleteSchool = async (schoolId: string) => {
  const res = await fetch(`${API_URL}/schools/${schoolId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete school');
  return res.json();
};

export const createResource = async (customerId: string, data: any, file?: File) => {
  if (file) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('file', file);

    const res = await fetch(`${API_URL}/customers/${customerId}/resources/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  } else {
    const res = await fetch(`${API_URL}/customers/${customerId}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

export const deleteResource = async (resourceId: string) => {
  const res = await fetch(`${API_URL}/resources/${resourceId}`, { method: 'DELETE' });
  return res.json();
};
