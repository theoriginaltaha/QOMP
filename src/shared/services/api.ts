const API_URL = '/api';

export const getStats = async () => {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const searchGlobal = async (query: string) => {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  if (!res.ok) throw new Error('Failed to search');
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const createUser = async (data: any) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
};

export const updateUserPermissions = async (userId: string, permissions: any[]) => {
  const res = await fetch(`${API_URL}/users/${userId}/permissions`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permissions })
  });
  if (!res.ok) throw new Error('Failed to update permissions');
  return res.json();
};

export const getRecycleBinCustomers = async () => {
  const res = await fetch(`${API_URL}/recycle-bin/customers`);
  if (!res.ok) throw new Error('Failed to fetch recycle bin');
  return res.json();
};

export const restoreCustomer = async (id: string) => {
  const res = await fetch(`${API_URL}/customers/${id}/restore`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to restore customer');
  return res.json();
};

export const hardDeleteCustomer = async (id: string) => {
  const res = await fetch(`${API_URL}/customers/${id}/hard`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to hard delete customer');
  return res.json();
};
