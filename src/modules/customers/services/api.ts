import type { Customer } from '../models/types';

const API_URL = 'http://localhost:3000/api';

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

export const createContact = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create contact');
  return response.json();
};

export const deleteSchool = async (schoolId: string) => {
  const res = await fetch(`${API_URL}/schools/${schoolId}`, { method: 'DELETE' });
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

export const createSchool = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/schools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create school');
  return response.json();
};
